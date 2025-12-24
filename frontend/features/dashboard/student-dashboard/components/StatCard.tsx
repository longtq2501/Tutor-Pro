// ============================================================================
// FILE: student-dashboard/components/StatCard.tsx
// ============================================================================
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  hoverColor: string;
  progressPercent?: number;
  badge?: React.ReactNode;
}

export const StatCard = ({ 
  title, value, subtitle, icon, iconBgColor, iconColor, 
  hoverColor, progressPercent, badge 
}: StatCardProps) => (
  <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-border group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-muted-foreground text-xs font-bold mb-1 uppercase tracking-wider">
          {title}
        </p>
        <h3 className={`text-3xl font-extrabold text-card-foreground ${hoverColor} transition-colors`}>
          {value}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {subtitle}
        </p>
      </div>
      <div className={`${iconBgColor} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
    {progressPercent !== undefined && (
      <div className="mt-4 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full h-1.5">
        <div 
          className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    )}
    {badge && (
      <div className="mt-4">
        {badge}
      </div>
    )}
  </div>
);