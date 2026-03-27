import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { HistoryIcon } from '@/components/icons/CompostIcons';

export function HistoryTable() {
  const { history } = useApp();

  const getStatusBadge = (status: string) => {
    const styles = {
      'Healthy': 'bg-success/10 text-success',
      'Needs Attention': 'bg-warning/10 text-warning',
      'Critical': 'bg-critical/10 text-critical'
    };
    return styles[status as keyof typeof styles] || '';
  };

  const getReadinessBadge = (readiness: string) => {
    const styles = {
      'Ready': 'bg-success/10 text-success',
      'Almost Ready': 'bg-warning/10 text-warning',
      'Not Ready': 'bg-muted text-muted-foreground'
    };
    return styles[readiness as keyof typeof styles] || '';
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
          <h2 className="text-xl font-display font-semibold text-foreground">Compost History</h2>
          <p className="text-sm text-muted-foreground">Previous completed batches</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
          {history.length} batches
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Batch ID</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Waste Type</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Quantity</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Final Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Readiness</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Completed</th>
            </tr>
          </thead>
          <tbody>
            {history.map((batch) => (
              <tr 
                key={batch.batchId}
                className="border-b border-border last:border-0 transition-colors hover:bg-secondary/50"
              >
                <td className="py-4 px-4">
                  <span className="font-mono text-sm text-foreground">{batch.batchId}</span>
                </td>
                <td className="py-4 px-4 text-foreground">{batch.wasteType}</td>
                <td className="py-4 px-4 text-foreground">{batch.quantity} kg</td>
                <td className="py-4 px-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(batch.status)}`}>
                    {batch.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getReadinessBadge(batch.readiness)}`}>
                    {batch.readiness}
                  </span>
                </td>
                <td className="py-4 px-4 text-muted-foreground">
                  {batch.completedAt ? formatDate(batch.completedAt) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {history.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <HistoryIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No history yet. Complete a batch to see it here!</p>
          </div>
        )}
      </div>
    </div>
  );
}
