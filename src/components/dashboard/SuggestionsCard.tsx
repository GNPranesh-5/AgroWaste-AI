import React from 'react';
import { Suggestion } from '@/types/agrowaste';
import { LightbulbIcon, DropletIcon, RefreshIcon, AlertTriangleIcon, CheckCircleIcon } from '@/components/icons/CompostIcons';

interface SuggestionsCardProps {
  suggestions: Suggestion[];
}

export function SuggestionsCard({ suggestions }: SuggestionsCardProps) {
  const getIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'water':
        return <DropletIcon className="w-5 h-5" />;
      case 'turn':
        return <RefreshIcon className="w-5 h-5" />;
      case 'reduce_moisture':
        return <AlertTriangleIcon className="w-5 h-5" />;
      case 'stable':
        return <CheckCircleIcon className="w-5 h-5" />;
    }
  };

  const getPriorityStyles = (priority: Suggestion['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-critical/10 border-critical/20 text-critical';
      case 'medium':
        return 'bg-warning/10 border-warning/20 text-warning';
      case 'low':
        return 'bg-success/10 border-success/20 text-success';
    }
  };

  return (
    <div className="card-eco">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-accent/10">
          <LightbulbIcon className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-lg font-display font-semibold text-foreground">Suggestions</h3>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border ${getPriorityStyles(suggestion.priority)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {getIcon(suggestion.type)}
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wide opacity-75">
                  {suggestion.priority} priority
                </span>
                <p className="text-sm mt-1 text-foreground">
                  {suggestion.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
