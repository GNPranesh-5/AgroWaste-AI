import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { QueueItem, CompostBatch, MonitoringData } from '@/types/agrowaste';
import { generateDemoData } from '@/utils/compostLogic';
import { useAuth } from '@/contexts/AuthContext';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  queue: QueueItem[];
  addToQueue: (item: Omit<QueueItem, 'queueId' | 'status'>) => void;
  updateQueueStatus: (queueId: string, status: QueueItem['status']) => void;
  history: CompostBatch[];
  addToHistory: (batch: CompostBatch) => void;
  monitoringData: MonitoringData;
  setMonitoringData: (data: MonitoringData) => void;
  loadQueue: () => Promise<void>;
  loadHistory: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Live data will be loaded from backend

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('agrowaste-theme');
    return (saved as 'light' | 'dark') || 'light';
  });
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [history, setHistory] = useState<CompostBatch[]>([]);
  const [monitoringData, setMonitoringData] = useState<MonitoringData>(generateDemoData());

  const { user } = useAuth();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('agrowaste-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addToQueue = (item: Omit<QueueItem, 'queueId' | 'status'>) => {
    const newItem: QueueItem = {
      ...item,
      queueId: 'Q' + String(queue.length + 1).padStart(3, '0'),
      status: 'Waiting'
    };
    setQueue(prev => [...prev, newItem]);
  };

  const updateQueueStatus = (queueId: string, status: QueueItem['status']) => {
    setQueue(prev => {
      const updated = prev.map(item =>
        item.queueId === queueId ? { ...item, status } : item
      );
      if (status === 'Completed') {
        const finished = prev.find(i => i.queueId === queueId);
        if (finished) {
          addToHistory({
            batchId: finished.batchId,
            wasteType: finished.wasteType,
            quantity: finished.quantity,
            status: 'Healthy',
            readiness: 'Not Ready',
            daysPassed: 0,
            totalDays: 0,
            temperature: 0,
            moisture: 0,
            createdAt: finished.submittedAt,
            completedAt: new Date().toISOString(),
          });
        }
        return updated.filter(i => i.queueId !== queueId);
      }
      return updated;
    });
  };

  const addToHistory = (batch: CompostBatch) => {
    setHistory(prev => [batch, ...prev]);
  };

  // Removed Demo refresh

  // helpers to pull data from backend if endpoints exist
  const loadQueue = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/queue?user_id=${user.id}`);
      if (res.ok) {
        const list: any[] = await res.json();
        setQueue(
          list.map((q, idx) => ({
            queueId: q.queueId || `Q${String(idx + 1).padStart(3, '0')}`,
            userId: q.userId || user.id,
            batchId: q.batchId || `B${String(idx + 1).padStart(3, '0')}`,
            status: q.status || 'Waiting',
            wasteType: q.wasteType,
            quantity: q.quantity,
            submittedAt: q.submittedAt || q.createdAt || new Date().toISOString(),
          }))
        );
      }
    } catch (e) {
      console.debug('could not load queue', e);
    }
  };

  const loadHistory = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/history?user_id=${user.id}`);
      if (res.ok) {
        const list: any[] = await res.json();
        setHistory(
          list.map((h, idx) => ({
            batchId: h.batchId || `B${String(idx + 1).padStart(3, '0')}`,
            wasteType: h.wasteType,
            quantity: h.quantity,
            status: h.status as any || 'Healthy',
            readiness: h.readiness as any || 'Not Ready',
            daysPassed: h.daysPassed || 0,
            totalDays: h.totalDays || 0,
            temperature: h.temperature || 0,
            moisture: h.moisture || 0,
            createdAt: h.createdAt || new Date().toISOString(),
            completedAt: h.completedAt || new Date().toISOString(),
          }))
        );
      }
    } catch (e) {
      console.debug('could not load history', e);
    }
  };

  // when demo mode toggles or user logs in, refresh data
  useEffect(() => {
    if (user) {
      loadQueue();
      loadHistory();
    }
  }, [user]);

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      queue,
      addToQueue,
      updateQueueStatus,
      history,
      addToHistory,
      monitoringData,
      setMonitoringData,
      loadQueue,
      loadHistory,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
