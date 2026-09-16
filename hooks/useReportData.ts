import { useMemo } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { formatDate } from '@/lib/rulesEngine';

interface ReportData {
  period: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  pointsEarned: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
}

export function useReportData(days: number) {
  const tasks = useTaskStore(state => state.tasks);
  const currentDate = useTaskStore(state => state.currentDate);

  return useMemo(() => {
    const today = new Date();
    const startDate = formatDate(new Date(today.getTime() - days * 86400000));
    const endDate = formatDate(today);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const pointsEarned = tasks.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.points, 0);

    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    tasks.forEach(t => {
      byType[t.type] = (byType[t.type] || 0) + 1;
      byStatus[t.status] = (byStatus[t.status] || 0) + 1;
    });

    return {
      period: `${days}d`,
      totalTasks,
      completedTasks,
      completionRate: Math.round(completionRate),
      pointsEarned,
      byType,
      byStatus,
    };
  }, [tasks, days, currentDate]);
}

export function getReportPeriodLabel(period: string): string {
  switch (period) {
    case 'today': return 'Today';
    case '7d': return '7 Days';
    case '21d': return '21 Days';
    case '30d': return 'Monthly';
    case '90d': return '90 Days';
    default: return period;
  }
}

export function generateReportData(period: string): ReportData {
  const daysMap: Record<string, number> = { 'today': 1, '7d': 7, '21d': 21, '30d': 30, '90d': 90 };
  const days = daysMap[period] || 1;
  return {
    period,
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    pointsEarned: 0,
    byType: {},
    byStatus: {},
  };
}
