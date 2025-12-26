export const SummaryCard = ({ totalHours, month }: { totalHours: number; month: string }) => (
  <div className="bg-muted/50 rounded-lg p-4 border border-border">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-semibold text-muted-foreground">Tổng thời lượng</span>
      <span className="text-2xl font-black text-foreground tracking-tight">
        {totalHours.toFixed(1)} <span className="text-sm font-medium text-muted-foreground">giờ</span>
      </span>
    </div>
    <div className="h-px bg-border w-full mb-3" />
    <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
      <span>Ghi nhận cho tháng</span>
      <span className="bg-background px-2 py-1 rounded border border-border text-foreground">
        {month || '--/--'}
      </span>
    </div>
  </div>
);