import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { ThermometerIcon, DropletIcon, CalendarIcon, AlertTriangleIcon } from '@/components/icons/CompostIcons';

export function ManualInputCard() {
  const { user } = useAuth();
  const { monitoringData, setMonitoringData } = useApp();
  const [temperature, setTemperature] = useState(String(monitoringData.temperature));
  const [moisture, setMoisture] = useState(String(monitoringData.moisture));
  const [days, setDays] = useState(String(monitoringData.daysPassed));
  const [advice, setAdvice] = useState<string | null>(null);

  useEffect(() => {
    setTemperature(String(monitoringData.temperature));
    setMoisture(String(monitoringData.moisture));
    setDays(String(monitoringData.daysPassed));
  }, [monitoringData]);

  // TASK 5: Auto Compost Advice Logic
  useEffect(() => {
    const temp = Number(temperature);
    const moist = Number(moisture);

    if (temp > 60) {
      setAdvice("Temperature is too high. Turn the compost pile.");
    } else if (moist < 50) {
      setAdvice("Moisture is low. Add water.");
    } else {
      setAdvice(null);
    }
  }, [temperature, moisture]);

  const saveMonitoringToBackend = async (
    temperature: number,
    moisture: number,
    daysPassed: number
  ) => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please login again",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          waste_id: 1, // Using first waste item for demo purposes
          temperature,
          moisture,
          days: daysPassed,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Monitoring Saved ✅",
          description: `Status: ${data.status}, Prediction: ${data.prediction}`,
        });
      } else {
        toast({
          title: "Save failed",
          description: data.error || "Could not save monitoring",
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

  const handleUpdate = () => {
    const temp = Number(temperature);
    const moist = Number(moisture);
    const dayCount = Number(days);

    setMonitoringData({
      temperature: temp,
      moisture: moist,
      daysPassed: dayCount
    });
    saveMonitoringToBackend(temp, moist, dayCount);
  };

  return (
    <div className="card-eco">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-semibold text-foreground">Manual Input</h3>
        {advice && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 text-warning animate-pulse-slow">
            <AlertTriangleIcon className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{advice}</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            <ThermometerIcon className="w-3 h-3 inline mr-1" />
            Temperature (°C)
          </label>
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="input-eco text-sm"
            min="0"
            max="100"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            <DropletIcon className="w-3 h-3 inline mr-1" />
            Moisture (%)
          </label>
          <input
            type="number"
            value={moisture}
            onChange={(e) => setMoisture(e.target.value)}
            className="input-eco text-sm"
            min="0"
            max="100"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            <CalendarIcon className="w-3 h-3 inline mr-1" />
            Days Passed
          </label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="input-eco text-sm"
            min="0"
            max="60"
          />
        </div>
      </div>

      <Button onClick={handleUpdate} variant="secondary" className="w-full">
        Update Values
      </Button>
    </div>
  );
}
