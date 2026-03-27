import sqlite3

conn = sqlite3.connect(r"C:\Users\prane\OneDrive\Desktop\IP\greencycle-insights-main\agrowaste.db")

cursor = conn.cursor()

# Drop tables if they exist to allow schema updates
cursor.execute("DROP TABLE IF EXISTS monitoring")
cursor.execute("DROP TABLE IF EXISTS queue")
cursor.execute("DROP TABLE IF EXISTS waste")
cursor.execute("DROP TABLE IF EXISTS users")

cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS waste (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    waste_type TEXT,
    quantity REAL,
    date TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    waste_id INTEGER,
    queue_id TEXT,
    batch_id TEXT,
    status TEXT DEFAULT 'Waiting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (waste_id) REFERENCES waste(id)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS monitoring (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    waste_id INTEGER,
    temperature REAL,
    moisture REAL,
    days INTEGER,
    status TEXT,
    suggestion TEXT,
    prediction TEXT,
    FOREIGN KEY (waste_id) REFERENCES waste(id)
)
""")

conn.commit()
conn.close()

print("Database tables created successfully.")  
