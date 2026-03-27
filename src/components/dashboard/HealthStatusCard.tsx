import React from 'react';
import { HealthStatus } from '@/types/agrowaste';
import { CheckCircleIcon, AlertTriangleIcon, XCircleIcon } from '@/components/icons/CompostIcons';

interface HealthStatusCardProps {
  status: HealthStatus;
}

export function HealthStatusCard({ status }: HealthStatusCardProps) {
  const getConfig = () => {
    switch (status) {
      case 'Healthy':
        return {
          icon: <CheckCircleIcon className="w-8 h-8" />,
          bgClass: 'bg-success',
          textClass: 'text-success-foreground',
          label: 'Healthy',
          description: 'Composting conditions are optimal. Continue regular monitoring.'
        };
      case 'Needs Attention':
        return {
          icon: <AlertTriangleIcon className="w-8 h-8" />,
          bgClass: 'bg-warning',
          textClass: 'text-warning-foreground',
          label: 'Needs Attention',
          description: 'Some parameters are outside optimal range. Review suggestions below.'
        };
      case 'Critical':
        return {
          icon: <XCircleIcon className="w-8 h-8" />,
          bgClass: 'bg-critical',
          textClass: 'text-critical-foreground',
          label: 'Critical',
          description: 'Immediate action required. Parameters are significantly off-target.'
        };
    }
  };

  const config = getConfig();

  return (
    <div className={`card-eco ${config.bgClass} border-none`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-white/20 ${config.textClass}`}>
          {config.icon}
        </div>
        <div>
          <h3 className={`text-xl font-display font-bold ${config.textClass}`}>
            {config.label}
          </h3>
          <p className={`text-sm ${config.textClass} opacity-90`}>
            {config.description}
          </p>
        </div>
      </div>
    </div>
  );
}
