export interface User {
  id: string;
  name: string;
  email: string;
}

export interface WasteSubmission {
  id: string;
  userId: string;
  wasteType: string;
  quantity: number;
  date: string;
  createdAt: string;
}

export interface QueueItem {
  queueId: string;
  userId: string;
  batchId: string;
  status: 'Waiting' | 'Processing' | 'Completed';
  wasteType: string;
  quantity: number;
  submittedAt: string;
}

export interface MonitoringData {
  temperature: number;
  moisture: number;
  daysPassed: number;
}

export type HealthStatus = 'Healthy' | 'Needs Attention' | 'Critical';
export type ReadinessLevel = 'Not Ready' | 'Almost Ready' | 'Ready';

export interface CompostBatch {
  batchId: string;
  wasteType: string;
  quantity: number;
  status: HealthStatus;
  readiness: ReadinessLevel;
  daysPassed: number;
  totalDays: number;
  temperature: number;
  moisture: number;
  createdAt: string;
  completedAt?: string;
}

export interface Suggestion {
  type: 'water' | 'turn' | 'reduce_moisture' | 'stable';
  message: string;
  priority: 'high' | 'medium' | 'low';
}
