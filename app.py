from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime

app = Flask(__name__)
CORS(app)

DB_PATH = r"C:\Users\prane\OneDrive\Desktop\IP\greencycle-insights-main\agrowaste.db"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/")
def home():
    return "AgroWaste Backend Running Successfully"

@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        name = data["name"]
        email = data["email"]
        password = data["password"]

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (name, email, password)
        )
        conn.commit()
        conn.close()

        return jsonify({"message": "User registered successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data["email"]
        password = data["password"]

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT * FROM users WHERE email = ? AND password = ?",
            (email, password)
        )

        user = cursor.fetchone()
        conn.close()

        if user:
            return jsonify({
                "message": "Login successful",
                "user_id": user["id"],
                "name": user["name"]
            })
        else:
            return jsonify({"error": "Invalid email or password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/add_waste", methods=["POST"])
def add_waste():
    try:
        data = request.get_json()

        user_id = data["user_id"]
        waste_type = data["waste_type"]
        quantity = data["quantity"]
        date = data[ "date"]

        conn = get_db_connection()
        cursor = conn.cursor()

        # 1️⃣ Insert into waste table
        cursor.execute(
            "INSERT INTO waste (user_id, waste_type, quantity, date) VALUES (?, ?, ?, ?)",
            (user_id, waste_type, quantity, date)
        )

        waste_id = cursor.lastrowid

        # 2️⃣ Add to queue table
        # We assign a batch_id like B001, B002 etc.
        cursor.execute("SELECT COUNT(*) FROM queue")
        count = cursor.fetchone()[0]
        batch_id = f"B{(count + 1):03}"
        queue_id = f"Q{(count + 1):03}"

        cursor.execute(
            "INSERT INTO queue (waste_id, queue_id, batch_id, status) VALUES (?, ?, ?, ?)",
            (waste_id, queue_id, batch_id, "Waiting")
        )

        conn.commit()
        conn.close()

        return jsonify({
            "message": "Waste added and queued successfully",
            "waste_id": waste_id,
            "queue_id": queue_id,
            "batch_id": batch_id
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/queue", methods=["GET"])
def get_queue():
    try:
        user_id = request.args.get("user_id")
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT q.*, w.waste_type, w.quantity, w.date as submitted_at, w.user_id
            FROM queue q
            JOIN waste w ON q.waste_id = w.id
            WHERE w.user_id = ? AND q.status != 'Completed'
            ORDER BY q.id ASC
        """, (user_id,))
        
        rows = cursor.fetchall()
        queue = []
        for row in rows:
            queue.append({
                "id": row["id"],
                "queueId": row["queue_id"],
                "batchId": row["batch_id"],
                "wasteType": row["waste_type"],
                "quantity": row["quantity"],
                "submittedAt": row["submitted_at"],
                "status": row["status"]
            })
        
        conn.close()
        return jsonify(queue)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/history", methods=["GET"])
def get_history():
    try:
        user_id = request.args.get("user_id")
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT q.*, w.waste_type, w.quantity, w.date as submitted_at, m.status as health_status, m.prediction as readiness
            FROM queue q
            JOIN waste w ON q.waste_id = w.id
            LEFT JOIN monitoring m ON q.waste_id = m.waste_id
            WHERE w.user_id = ? AND q.status = 'Completed'
            ORDER BY q.id DESC
        """, (user_id,))
        
        rows = cursor.fetchall()
        history = []
        for row in rows:
            history.append({
                "batchId": row["batch_id"],
                "wasteType": row["waste_type"],
                "quantity": row["quantity"],
                "status": row["health_status"] or "Healthy",
                "readiness": row["readiness"] or "Ready",
                "completedAt": row["submitted_at"] # For demo simplification
            })
        
        conn.close()
        return jsonify(history)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/queue/<int:id>", methods=["PATCH"])
def update_queue_status(id):
    try:
        data = request.get_json()
        status = data.get("status")
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE queue SET status = ? WHERE id = ?", (status, id))
        conn.commit()
        conn.close()
        
        return jsonify({"message": f"Status updated to {status}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/monitor", methods=["POST"])
def monitor():
    try:
        data = request.get_json()

        waste_id = data["waste_id"]
        temperature = data["temperature"]
        moisture = data["moisture"]
        days = data["days"]

        # 🔹 Health Status Logic
        if 40 <= temperature <= 60 and 40 <= moisture <= 60:
            status = "Healthy"
            suggestion = "Compost process is stable"
        elif temperature < 40 or moisture < 40:
            status = "Needs Attention"
            suggestion = "Add water or improve aeration"
        else:
            status = "Critical"
            suggestion = "Reduce moisture or turn compost"

        # 🔹 Fertilizer Readiness Prediction
        if days >= 30 and status == "Healthy":
            prediction = "Ready"
        elif days >= 20:
            prediction = "Almost Ready"
        else:
            prediction = "Not Ready"

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO monitoring
            (waste_id, temperature, moisture, days, status, suggestion, prediction)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (waste_id, temperature, moisture, days, status, suggestion, prediction))

        conn.commit()
        conn.close()

        return jsonify({
            "status": status,
            "suggestion": suggestion,
            "prediction": prediction
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message", "").lower()

    if "temperature" in message:
        reply = "Ideal compost temperature is between 50°C and 70°C."
    elif "moisture" in message:
        reply = "Compost moisture should stay between 50% and 60%."
    elif "turn compost" in message:
        reply = "Compost should be turned every 3–4 days for proper aeration."
    elif "fertilizer ready" in message:
        reply = "Compost is usually ready after around 30 days."
    elif "waste type" in message:
        reply = "You can compost crop residue, food waste, leaves, and vegetable scraps."
    else:
        reply = "I can help with compost temperature, moisture, waste management, and fertilizer production."

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True)
