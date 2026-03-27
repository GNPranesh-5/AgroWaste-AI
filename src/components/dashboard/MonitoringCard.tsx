import React, { ReactNode } from 'react';

interface MonitoringCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: ReactNode;
  status?: 'healthy' | 'attention' | 'critical';
  subtitle?: string;
}

export function MonitoringCard({ title, value, unit, icon, status, subtitle }: MonitoringCardProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'healthy':
        return 'border-l-4 border-l-success';
      case 'attention':
        return 'border-l-4 border-l-warning';
      case 'critical':
        return 'border-l-4 border-l-critical';
      default:
        return '';
    }
  };

  return (
    <div className={`card-eco ${getStatusStyles()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-secondary">
          {icon}
        </div>
        {status && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            status === 'healthy' ? 'bg-success/10 text-success' :
            status === 'attention' ? 'bg-warning/10 text-warning' :
            'bg-critical/10 text-critical'
          }`}>
            {status === 'healthy' ? 'Optimal' : status === 'attention' ? 'Warning' : 'Critical'}
          </span>
        )}
      </div>
      
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-display font-bold text-foreground">{value}</span>
        <span className="text-lg text-muted-foreground">{unit}</span>
      </div>
      
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
      )}
    </div>
  );
}
