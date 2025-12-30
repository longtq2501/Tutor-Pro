import { DollarSign, Calendar, Users } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { EnhancedStatsCard } from './EnhancedStatsCard';

interface SummaryCardsProps {
  totalUnpaid: number;
  totalSessions: number;
  totalStudents: number;
}

export function SummaryCards({ totalUnpaid, totalSessions, totalStudents }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-8">
      <EnhancedStatsCard
        label="Tổng chưa thanh toán"
        value={formatCurrency(totalUnpaid)}
        icon={<DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />}
        variant="orange"
        trend={{
          value: 12, // Mocked for design
          direction: 'up',
          label: 'vs tháng trước'
        }}
        sparklineData={[100, 120, 110, 140, 130, 150, 145]} // Mocked for design
      />

      <EnhancedStatsCard
        label="Số buổi học"
        value={`${totalSessions} buổi`}
        icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6" />}
        variant="blue"
        trend={{
          value: -5, // Mocked for design
          direction: 'down',
          label: 'vs tháng trước'
        }}
        sparklineData={[15, 14, 16, 12, 14, 13, 15]} // Mocked for design
      />

      <EnhancedStatsCard
        label="Số học sinh"
        value={`${totalStudents} HS`}
        icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
        variant="purple"
        className="sm:col-span-2 lg:col-span-1"
      />
    </div>
  );
}