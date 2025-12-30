export const SummaryCard = ({ totalHours, month }: { totalHours: number; month: string }) => (
  <div className="relative group overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-[2rem] -z-10 transition-transform duration-500 group-hover:scale-[1.02]" />

    <div className="p-6 space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Tổng thời lượng</p>
          <p className="text-4xl font-black tracking-tighter text-primary">
            {totalHours.toFixed(1)} <span className="text-sm font-bold text-muted-foreground tracking-normal uppercase ml-1">giờ</span>
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Ghi nhận</p>
          <p className="text-sm font-black bg-background border border-border/60 rounded-xl px-4 py-2 shadow-sm">
            {month || '--/--'}
          </p>
        </div>
      </div>

      <div className="h-0.5 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent w-full rounded-full" />
    </div>
  </div>
);