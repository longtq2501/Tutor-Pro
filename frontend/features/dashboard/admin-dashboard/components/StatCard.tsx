// ============================================================================
// FILE: admin-dashboard/components/StatCard.tsx
// ============================================================================
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor: string;
  valueColorClass: string;
  badge?: React.ReactNode;
  progressBar?: {
    percentage: number;
    color: string;
  };
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor,
  valueColorClass,
  badge,
  progressBar,
}: StatCardProps) => (
  <div className="bg-card rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-border group">
    <div className="flex justify-between items-start gap-3">
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="text-muted-foreground text-xs font-bold mb-1.5 uppercase tracking-wider">
          {title}
        </p>
        <h3 className={`text-xl xl:text-2xl font-extrabold text-card-foreground ${valueColorClass} transition-colors leading-tight break-all`}>
          {value}
        </h3>
      </div>
      <div className={`${iconBgColor} p-2.5 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0`}>
        {icon}
      </div>
    </div>
    
    {badge && (
      <div className="mt-3">
        {badge}
      </div>
    )}
    
    {subtitle && !progressBar && (
      <div className="mt-3 text-xs text-muted-foreground font-medium truncate">
        {subtitle}
      </div>
    )}
    
    {progressBar && (
      <div className="mt-3 w-full bg-muted/30 rounded-full h-1.5">
        <div 
          className={`${progressBar.color} h-1.5 rounded-full transition-all duration-500`}
          style={{ width: `${progressBar.percentage}%` }}
        />
      </div>
    )}
  </div>
);