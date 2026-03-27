import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { wasteTypes } from '@/utils/compostLogic';
import { PlusIcon, RecycleIcon } from '@/components/icons/CompostIcons';
import { toast } from '@/hooks/use-toast';

export function WasteSubmissionForm() {
  const { user } = useAuth();
  const { loadQueue, loadHistory } = useApp();
  const [wasteType, setWasteType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!wasteType || !quantity || !date) {
    toast({
      title: "Missing fields",
      description: "Please fill in all required fields.",
      variant: "destructive",
    });
    return;
  }

  if (!user) {
    toast({
      title: "Not logged in",
      description: "Please login again.",
      variant: "destructive",
    });
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:5000/add_waste", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        waste_type: wasteType,
        quantity: Number(quantity),
        date: date,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast({
        title: "Waste Submitted!",
        description: `${quantity}kg of ${wasteType} added to processing queue.`,
      });

      setWasteType("");
      setQuantity("");
      setDate(new Date().toISOString().split("T")[0]);
      
      // Refresh dynamic data
      await Promise.all([loadQueue(), loadHistory()]);
    } else {
      toast({
        title: "Submission failed",
        description: data.error || "Something went wrong",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Server error",
      description: "Backend not reachable",
      variant: "destructive",
    });
  }
};


  return (
    <div className="card-eco max-w-2xl animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg gradient-primary">
          <RecycleIcon className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-display font-semibold text-foreground">Submit Waste</h2>
          <p className="text-sm text-muted-foreground">Add agricultural waste for composting</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Waste Type */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Waste Type
          </label>
          <select
            value={wasteType}
            onChange={(e) => setWasteType(e.target.value)}
            className="input-eco"
            required
          >
            <option value="">Select waste type...</option>
            {wasteTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Quantity (kg)
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input-eco"
            placeholder="e.g., 50"
            min="1"
            max="1000"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Collection Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-eco"
            required
          />
        </div>

        <Button type="submit" variant="eco" className="w-full">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add to Processing Queue
        </Button>
      </form>
    </div>
  );
}
