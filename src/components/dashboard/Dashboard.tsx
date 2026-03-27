import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { DashboardView } from './DashboardView';
import { WasteSubmissionForm } from './WasteSubmissionForm';
import { QueueTable } from './QueueTable';
import { HistoryTable } from './HistoryTable';
import { ChatBot } from './ChatBot';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'submit':
        return <WasteSubmissionForm />;
      case 'queue':
        return <QueueTable />;
      case 'history':
        return <HistoryTable />;
      default:
        return <DashboardView />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Monitoring Dashboard', subtitle: 'Real-time compost health & insights' };
      case 'submit':
        return { title: 'Submit Waste', subtitle: 'Add new agricultural waste for processing' };
      case 'queue':
        return { title: 'Processing Queue', subtitle: 'Track your waste in the FCFS queue' };
      case 'history':
        return { title: 'Batch History', subtitle: 'View completed compost batches' };
      default:
        return { title: 'Dashboard', subtitle: '' };
    }
  };

  const pageInfo = getPageTitle();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-display font-bold text-foreground">{pageInfo.title}</h1>
            <p className="text-muted-foreground">{pageInfo.subtitle}</p>
          </div>
          {renderContent()}
        </main>
      </div>
      <ChatBot />
    </div>
  );
}
