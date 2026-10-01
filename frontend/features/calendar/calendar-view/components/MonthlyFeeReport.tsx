import type { MonthlyFeeReportData } from '../utils/monthlyFeeReport';
import { forwardRef } from 'react';

interface Props {
  report: MonthlyFeeReportData;
}

const currency = new Intl.NumberFormat('vi-VN');
const scopeLabels = { trung_tam: 'Trung tâm', day_rieng: 'Dạy riêng', tat_ca: 'Tất cả' } as const;

export const MonthlyFeeReport = forwardRef<HTMLDivElement, Props>(function MonthlyFeeReport({ report }, ref) {
  return (
    <div ref={ref} className="w-[760px] bg-white p-8 text-slate-900" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="border-b-2 border-slate-900 pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Tutor Pro</p>
        <h1 className="mt-2 text-3xl font-black uppercase">Báo cáo học phí tháng</h1>
        <div className="mt-2 flex justify-between text-sm font-semibold text-slate-600">
          <span>Tháng {report.month}</span>
          <span>Phạm vi: {scopeLabels[report.scope]}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 py-5">
        <Summary label="Học sinh" value={String(report.students.length)} />
        <Summary label="Tổng giờ dạy" value={report.totalHours.toFixed(1)} />
        <Summary label="Tổng học phí" value={`${currency.format(report.totalAmount)} đ`} />
      </div>

      <div className="space-y-3">
        {report.students.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 px-5 py-8 text-center">
            <p className="text-base font-bold text-slate-700">Chưa có buổi học nào được dạy hoặc nghỉ trong tháng này</p>
            <p className="mt-1 text-sm text-slate-500">Các buổi đang chờ học hoặc đã xác nhận chưa được tính vào báo cáo.</p>
          </div>
        ) : report.students.map((student) => (
          <section key={student.studentId} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black">{student.name}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Đã dạy: {student.taughtSessions} buổi · Đã nghỉ: {student.cancelledSessions} buổi · Tổng giờ: {student.totalHours.toFixed(1)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-500">Đơn giá / giờ</p>
                <p className="font-bold">{currency.format(student.pricePerHour)} đ</p>
                <p className="mt-1 text-lg font-black">{currency.format(student.amount)} đ</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {student.dates.map((item, index) => (
                <span key={`${item.date}-${index}`} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'cancelled' ? 'text-slate-400 line-through bg-slate-100' : 'text-slate-700 bg-slate-100'}`}>
                  {item.date.slice(5).replace('-', '/')}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
});

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}
