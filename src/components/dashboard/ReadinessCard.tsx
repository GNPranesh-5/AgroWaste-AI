import React from 'react';
import { ReadinessLevel } from '@/types/agrowaste';
import { RecycleIcon, ClockIcon, CheckCircleIcon } from '@/components/icons/CompostIcons';

interface ReadinessCardProps {
  readiness: ReadinessLevel;
  progress: number;
  daysPassed: number;
  totalDays: number;
}

export function ReadinessCard({ readiness, progress, daysPassed, totalDays }: ReadinessCardProps) {
  const getConfig = () => {
    switch (readiness) {
      case 'Not Ready':
        return {
          icon: <ClockIcon className="w-6 h-6 text-muted-foreground" />,
          label: 'Not Ready',
          color: 'text-muted-foreground',
          progressColor: 'bg-muted-foreground'
        };
      case 'Almost Ready':
        return {
          icon: <RecycleIcon className="w-6 h-6 text-warning" />,
          label: 'Almost Ready',
          color: 'text-warning',
          progressColor: 'bg-warning'
        };
      case 'Ready':
        return {
          icon: <CheckCircleIcon className="w-6 h-6 text-success" />,
          label: 'Ready for Use',
          color: 'text-success',
          progressColor: 'bg-success'
        };
    }
  };

  const config = getConfig();

  return (
    <div className="card-eco">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-semibold text-foreground">Fertilizer Readiness</h3>
        {config.icon}
      </div>

      <div className={`text-2xl font-display font-bold ${config.color} mb-4`}>
        {config.label}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Day <strong className="text-foreground">{daysPassed}</strong> of <strong className="text-foreground">{totalDays}</strong>
      </div>
    </div>
  );
}
