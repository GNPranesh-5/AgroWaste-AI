import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { ClockIcon, RecycleIcon, CheckCircleIcon } from '@/components/icons/CompostIcons';

export function QueueTable() {
  const { queue } = useApp();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Waiting':
        return <ClockIcon className="w-4 h-4" />;
      case 'Processing':
        return <RecycleIcon className="w-4 h-4" />;
      case 'Completed':
        return <CheckCircleIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Waiting':
        return 'bg-muted text-muted-foreground';
      case 'Processing':
        return 'bg-warning/10 text-warning';
      case 'Completed':
        return 'bg-success/10 text-success';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="card-eco animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-display font-semibold text-foreground">Processing Queue</h2>
          <p className="text-sm text-muted-foreground">FCFS (First-Come-First-Serve) order</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          {queue.length} items
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Queue ID</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Batch ID</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Waste Type</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Quantity</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Submitted</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((item, index) => (
              <tr 
                key={item.queueId}
                className={`border-b border-border last:border-0 transition-colors hover:bg-secondary/50 ${
                  index === 0 ? 'bg-primary/5 animate-pulse-slow' : ''
                }`}
              >
                <td className="py-4 px-4">
                  <span className="font-mono text-sm text-foreground">{item.queueId}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="font-mono text-sm text-foreground">{item.batchId}</span>
                </td>
                <td className="py-4 px-4 text-foreground">{item.wasteType}</td>
                <td className="py-4 px-4 text-foreground">{item.quantity} kg</td>
                <td className="py-4 px-4 text-muted-foreground">{formatDate(item.submittedAt)}</td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(item.status)}`}>
                    {getStatusIcon(item.status)}
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {queue.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <RecycleIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No items in queue. Submit waste to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
