// ============================================================================
// FILE: admin-dashboard/components/StatCard.tsx (PREMIUM VERSION)
// ============================================================================
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { memo } from 'react';

interface StatCardProps {
  title: React.ReactNode;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant: 'blue' | 'green' | 'red' | 'purple';
  badge?: React.ReactNode;
  progressBar?: {
    percentage: number;
    color: 'green' | 'red';
  };
  trend?: {
    direction: 'up' | 'down';
    value: number; // percentage change
  };
  isLoading?: boolean;
}

const gradients = {
  blue: 'from-blue-500 to-cyan-500',
  green: 'from-green-500 to-emerald-500',
  red: 'from-red-500 to-rose-500',
  purple: 'from-purple-500 to-pink-500'
};

const bgColors = {
  blue: 'bg-blue-50 dark:bg-blue-950/20',
  green: 'bg-green-50 dark:bg-green-950/20',
  red: 'bg-red-50 dark:bg-red-950/20',
  purple: 'bg-purple-50 dark:bg-purple-950/20'
};

export const StatCard = memo(({
  title,
  value,
  subtitle,
  icon,
  variant,
  badge,
  progressBar,
  trend,
  isLoading = false,
}: StatCardProps) => {
  if (isLoading) {
    return (
      <div className={cn(
        "h-full rounded-2xl border p-[10px] px-3 sm:p-4 lg:p-5",
        "animate-pulse",
        bgColors[variant]
      )}>
        <div className="flex h-full items-center gap-3">
          <div className="h-8 w-8 shrink-0 rounded-xl bg-muted/50 sm:h-10 sm:w-10" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-24 rounded bg-muted/50" />
            <div className="h-5 w-32 rounded bg-muted/50" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        "group relative h-full min-w-0 overflow-hidden rounded-2xl border",
        "p-[10px] px-3 sm:p-4 lg:p-5",
        "transition-all duration-300",
        bgColors[variant],
        "hover:shadow-2xl hover:shadow-black/10 hover:border-transparent",
        "dark:border-white/10",
        "will-change-transform contain-layout" // GPU Acceleration
      )}
    >
      {/* Animated Gradient Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0",
        "group-hover:opacity-5 transition-opacity duration-500",
        gradients[variant]
      )} />

      {/* Decorative Orb */}
      <div className={cn(
        "absolute -right-12 -bottom-12 w-40 h-40 rounded-full blur-3xl",
        "bg-gradient-to-br opacity-5 transition-all duration-700",
        "group-hover:opacity-10 group-hover:scale-150",
        gradients[variant]
      )} />

      {/* Content */}
      <div className="relative flex h-full min-w-0 items-center gap-3">
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 5, scale: 1.1 }}
          className={cn(
            "flex shrink-0 items-center justify-center",
            "h-8 w-8 rounded-xl shadow-lg sm:h-10 sm:w-10 lg:h-12 lg:w-12",
            "bg-gradient-to-br",
            gradients[variant],
            "transition-transform duration-300"
          )}
        >
          <div className="text-white [&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5 lg:[&>svg]:h-6 lg:[&>svg]:w-6">
            {icon}
          </div>
        </motion.div>

        <div className="min-w-0 flex-1">
          {/* Header Row */}
          <div className="flex min-w-0 items-center gap-1.5">
            <div className="min-w-0 flex-1 truncate whitespace-nowrap text-[10px] font-medium tracking-normal text-muted-foreground sm:text-xs lg:text-sm">
              {title}
            </div>

            {badge && (
              <motion.div
                initial={{ x: -6, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="min-w-0 shrink truncate"
              >
                {badge}
              </motion.div>
            )}

            {/* Trend Badge */}
            {trend && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className={cn(
                  "flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5",
                  "text-[10px] font-medium sm:text-xs",
                  trend.direction === 'up'
                    ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                )}
              >
                {trend.direction === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </motion.div>
            )}
          </div>

          {/* Value */}
          <h3 className="mt-1 truncate whitespace-nowrap text-lg font-bold tabular-nums sm:text-xl lg:text-2xl">
            {value}
          </h3>

          {subtitle && !progressBar && !badge && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-1 truncate text-[10px] font-medium text-muted-foreground sm:text-xs"
            >
              {subtitle}
            </motion.div>
          )}

          {/* Progress Bar */}
          {progressBar && (
            <div className="mt-2 space-y-1">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressBar.percentage}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full",
                    progressBar.color === 'green' && "bg-gradient-to-r from-green-500 to-emerald-500",
                    progressBar.color === 'red' && "bg-gradient-to-r from-red-500 to-rose-500"
                  )}
                />
              </div>
              {subtitle && <p className="truncate text-[10px] text-muted-foreground sm:text-xs">{subtitle}</p>}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});
StatCard.displayName = 'StatCard';