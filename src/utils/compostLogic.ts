import { HealthStatus, ReadinessLevel, Suggestion, MonitoringData } from '@/types/agrowaste';

// Rule-based health status determination
export function determineHealthStatus(data: MonitoringData): HealthStatus {
  const { temperature, moisture, daysPassed } = data;
  
  // Critical conditions
  if (temperature > 70 || temperature < 20) return 'Critical';
  if (moisture > 70 || moisture < 30) return 'Critical';
  
  // Needs attention conditions
  if (temperature > 60 || temperature < 35) return 'Needs Attention';
  if (moisture > 60 || moisture < 40) return 'Needs Attention';
  
  // Healthy conditions
  return 'Healthy';
}

// Rule-based readiness prediction (AI-Lite)
export function predictReadiness(data: MonitoringData): ReadinessLevel {
  const { temperature, moisture, daysPassed } = data;
  
  // Not ready if less than 15 days
  if (daysPassed < 15) return 'Not Ready';
  
  // Check conditions for readiness
  const tempOptimal = temperature >= 35 && temperature <= 55;
  const moistureOptimal = moisture >= 40 && moisture <= 60;
  
  // Ready conditions: 25+ days with optimal conditions
  if (daysPassed >= 25 && tempOptimal && moistureOptimal) {
    return 'Ready';
  }
  
  // Almost ready: 20+ days or approaching optimal conditions
  if (daysPassed >= 20 || (daysPassed >= 15 && tempOptimal && moistureOptimal)) {
    return 'Almost Ready';
  }
  
  return 'Not Ready';
}

// Generate suggestions based on monitoring data
export function generateSuggestions(data: MonitoringData): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const { temperature, moisture, daysPassed } = data;
  
  // Temperature-based suggestions
  if (temperature > 65) {
    suggestions.push({
      type: 'turn',
      message: 'Temperature is high. Turn the compost pile to release heat and improve aeration.',
      priority: 'high'
    });
  } else if (temperature < 35) {
    suggestions.push({
      type: 'turn',
      message: 'Temperature is low. Add nitrogen-rich materials and turn the pile to increase activity.',
      priority: 'medium'
    });
  }
  
  // Moisture-based suggestions
  if (moisture > 65) {
    suggestions.push({
      type: 'reduce_moisture',
      message: 'Moisture is too high. Add dry materials like straw or turn the pile to improve drainage.',
      priority: 'high'
    });
  } else if (moisture < 40) {
    suggestions.push({
      type: 'water',
      message: 'Moisture is low. Add water while turning the pile to ensure even distribution.',
      priority: 'medium'
    });
  }
  
  // If everything is stable
  if (suggestions.length === 0) {
    suggestions.push({
      type: 'stable',
      message: 'Composting conditions are optimal. Continue monitoring regularly.',
      priority: 'low'
    });
  }
  
  return suggestions;
}

// Calculate progress percentage
export function calculateProgress(daysPassed: number, totalDays: number = 30): number {
  return Math.min(Math.round((daysPassed / totalDays) * 100), 100);
}

// Generate demo data
export function generateDemoData(): MonitoringData {
  return {
    temperature: Math.round(40 + Math.random() * 20), // 40-60°C
    moisture: Math.round(45 + Math.random() * 15), // 45-60%
    daysPassed: Math.round(10 + Math.random() * 15), // 10-25 days
  };
}

// Waste types
export const wasteTypes = [
  'Crop Residue',
  'Food Waste',
  'Fruit Peels',
  'Vegetable Scraps',
  'Grass Clippings',
  'Leaves',
  'Straw',
  'Wood Chips',
  'Coffee Grounds',
  'Eggshells'
];
