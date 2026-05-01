import { useMemo } from "react";
import { PaymentIcon } from "../../../components/icons";

const shortId = (id) => {
  if (!id) return "—";
  const s = String(id);
  return s.length > 8 ? `${s.slice(-8)}` : s;
};

const formatMoney = (currency, amount) => {
  const cur = currency || "PKR";
  const n = Number(amount);
  if (!Number.isFinite(n)) return `${cur} 0`;
  return `${cur} ${n.toLocaleString()}`;
};

const formatWhen = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
};

const paymentMethodLabel = (method, hasRecordedAmount) => {
  if (method === "stripe") return "Stripe";
  if (method === "manual") return "Manual (in-app)";
  if (method === "none") return "Free service";
  if (hasRecordedAmount) return "—";
  return "Not recorded (legacy)";
};

const refLabel = (sessionId) => {
  if (!sessionId) return "—";
  const s = String(sessionId);
  return s.length > 14 ? `…${s.slice(-12)}` : s;
};

const PatientPaymentHistorySection = ({ appointments, openPaymentModal }) => {
  const { pending, paid, totalPaid } = useMemo(() => {
    const pendingList = appointments.filter((a) => a.status === "awaiting-payment");
    const paidList = appointments
      .filter((a) => a.status === "completed")
      .map((a) => {
        const fee = Number(a.doctorProfile?.consultationFee ?? 0);
        const hasRecordedAmount = a.paymentAmount != null && Number.isFinite(Number(a.paymentAmount));
        const amount = hasRecordedAmount ? Number(a.paymentAmount) : fee;
        const sortTime = new Date(a.paidAt || a.updatedAt || a.createdAt || 0).getTime();
        return {
          ...a,
          _displayAmount: Number.isFinite(amount) ? amount : 0,
          _currency: a.paymentCurrency || "PKR",
          _methodLabel: paymentMethodLabel(a.paymentMethod, hasRecordedAmount),
          _sortTime: sortTime,
        };
      })
      .sort((x, y) => y._sortTime - x._sortTime);

    const total = paidList.reduce((sum, row) => sum + (row._displayAmount || 0), 0);
    return { pending: pendingList, paid: paidList, totalPaid: total };
  }, [appointments]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <PaymentIcon />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Payment history</h3>
            <p className="text-xs text-slate-500">Completed payments and amounts pending checkout.</p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Total paid (completed)</p>
          <p className="text-lg font-bold text-slate-900">{formatMoney("PKR", totalPaid)}</p>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-amber-700">Pending payment</h4>
          <ul className="mt-2 space-y-2">
            {pending.map((a) => {
              const amt = Number(a.doctorProfile?.consultationFee ?? 0);
              return (
                <li
                  key={a._id}
                  className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{a.doctor?.name || "Doctor"}</p>
                    <p className="text-xs text-slate-600">
                      {a.doctorProfile?.specialization || "Service"} · Service {a.date} {a.timeSlot}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-slate-500">Booking #{shortId(a._id)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                      Due {formatMoney("PKR", amt)}
                    </span>
                    <button
                      type="button"
                      onClick={() => openPaymentModal(a._id)}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      Pay now
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-6 overflow-x-auto">
        <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-600">Transactions</h4>
        {paid.length === 0 && pending.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-sm text-slate-500">
            No payments yet. Completed bookings will appear here with amount, method, and date.
          </p>
        ) : paid.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500">
            No completed payments yet.
          </p>
        ) : (
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 pr-3">Paid</th>
                <th className="py-3 pr-3">Doctor</th>
                <th className="py-3 pr-3">Service</th>
                <th className="py-3 pr-3">Amount</th>
                <th className="py-3 pr-3">Method</th>
                <th className="py-3 pr-3">Stripe ref</th>
                <th className="py-3">Booking</th>
              </tr>
            </thead>
            <tbody>
              {paid.map((a) => (
                <tr key={a._id} className="border-b border-slate-100 align-top text-slate-800">
                  <td className="py-3 pr-3 whitespace-nowrap text-slate-600">{formatWhen(a.paidAt || a.updatedAt)}</td>
                  <td className="py-3 pr-3">
                    <span className="font-medium text-slate-900">{a.doctor?.name || "Doctor"}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{a.doctorProfile?.specialization}</span>
                  </td>
                  <td className="py-3 pr-3 text-slate-600">
                    {a.date} <span className="text-slate-400">{a.timeSlot}</span>
                  </td>
                  <td className="py-3 pr-3 font-semibold text-slate-900">{formatMoney(a._currency, a._displayAmount)}</td>
                  <td className="py-3 pr-3 text-slate-600">{a._methodLabel}</td>
                  <td className="py-3 pr-3 font-mono text-[11px] text-slate-500" title={a.stripeCheckoutSessionId || undefined}>
                    {refLabel(a.stripeCheckoutSessionId)}
                  </td>
                  <td className="py-3 font-mono text-xs text-slate-500">{shortId(a._id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-4 text-[11px] text-slate-400">
        Amounts and methods are stored when you pay through Stripe or complete payment in the app. Older bookings may show legacy amounts from the doctor's listed fee.
      </p>
    </section>
  );
};

export default PatientPaymentHistorySection;
