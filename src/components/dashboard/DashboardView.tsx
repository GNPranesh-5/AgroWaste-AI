import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { MonitoringCard } from './MonitoringCard';
import { HealthStatusCard } from './HealthStatusCard';
import { ReadinessCard } from './ReadinessCard';
import { SuggestionsCard } from './SuggestionsCard';
import { ManualInputCard } from './ManualInputCard';
import { ThermometerIcon, DropletIcon, CalendarIcon } from '@/components/icons/CompostIcons';
import { 
  determineHealthStatus, 
  predictReadiness, 
  generateSuggestions, 
  calculateProgress 
} from '@/utils/compostLogic';

export function DashboardView() {
  const { monitoringData, queue, history } = useApp();
  
  const healthStatus = determineHealthStatus(monitoringData);
  const readiness = predictReadiness(monitoringData);
  const suggestions = generateSuggestions(monitoringData);
  const progress = calculateProgress(monitoringData.daysPassed, 30);

  // Determine status for cards
  const getTempStatus = () => {
    if (monitoringData.temperature > 65 || monitoringData.temperature < 30) return 'critical';
    if (monitoringData.temperature > 55 || monitoringData.temperature < 40) return 'attention';
    return 'healthy';
  };

  const getMoistureStatus = () => {
    if (monitoringData.moisture > 70 || monitoringData.moisture < 30) return 'critical';
    if (monitoringData.moisture > 60 || monitoringData.moisture < 40) return 'attention';
    return 'healthy';
  };

  const processingBatch = queue.find(q => q.status === 'Processing');

  const totalWaste = [...history, ...queue].reduce((acc, item) => acc + item.quantity, 0);
  const activeBatches = queue.length;
  const fertilizerProduced = history.filter(h => h.readiness === 'Ready').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Waste Submitted', value: `${totalWaste} kg`, color: 'text-primary' },
          { label: 'Active Compost Batches', value: activeBatches, color: 'text-accent' },
          { label: 'Queue Items', value: queue.length, color: 'text-warning' },
          { label: 'Fertilizer Produced', value: fertilizerProduced, color: 'text-success' },
        ].map((stat, i) => (
          <div key={i} className="card-eco p-5 flex flex-col justify-center animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
            <p className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Current batch info */}
      {processingBatch && (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 animate-fade-in shadow-sm">
          <p className="text-sm text-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse mr-2" />
            <strong>Currently Processing:</strong> Batch {processingBatch.batchId} — {processingBatch.wasteType} ({processingBatch.quantity}kg)
          </p>
        </div>
      )}

      {/* Health Status */}
      <HealthStatusCard status={healthStatus} />

      {/* Monitoring Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MonitoringCard
          title="Temperature"
          value={monitoringData.temperature}
          unit="°C"
          icon={<ThermometerIcon className="w-5 h-5 text-primary" />}
          status={getTempStatus()}
          subtitle="Optimal: 40-55°C"
        />
        <MonitoringCard
          title="Moisture Level"
          value={monitoringData.moisture}
          unit="%"
          icon={<DropletIcon className="w-5 h-5 text-accent" />}
          status={getMoistureStatus()}
          subtitle="Optimal: 40-60%"
        />
        <MonitoringCard
          title="Days Elapsed"
          value={monitoringData.daysPassed}
          unit="days"
          icon={<CalendarIcon className="w-5 h-5 text-muted-foreground" />}
          subtitle="Target: 25-30 days"
        />
      </div>

      {/* Manual Input */}
      <ManualInputCard />

      {/* Readiness & Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReadinessCard
          readiness={readiness}
          progress={progress}
          daysPassed={monitoringData.daysPassed}
          totalDays={30}
        />
        <SuggestionsCard suggestions={suggestions} />
      </div>
    </div>
  );
}
