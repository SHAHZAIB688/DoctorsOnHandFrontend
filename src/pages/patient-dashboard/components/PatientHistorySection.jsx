import { ProfileIcon } from "../../../components/icons";
import { generatePDF } from "../../../utils/generatePDF";

const PatientHistorySection = ({ appointments, openPaymentModal, handleVideoCall, reschedule, cancel }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
    <h3 className="text-lg font-semibold text-slate-900">Booking history</h3>
    <ul className="mt-3 space-y-3">
      {appointments.map((a) => (
        <li
          key={a._id}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm transition-all hover:border-brand-200"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <ProfileIcon />
              </div>
              <div>
                <p className="font-bold text-slate-900">{a.doctor?.name || "Doctor"}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">
                  {a.doctorProfile?.specialization} • {a.date} {a.timeSlot}
                </p>
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                a.status === "completed"
                  ? "bg-emerald-100 text-emerald-700"
                  : a.status === "accepted" || a.status === "in-progress"
                    ? "border border-brand-200 bg-brand-100 text-brand-700"
                    : "bg-slate-100 text-slate-600"
              }`}
            >
              {a.status}
            </span>
          </div>

          {a.status !== "cancelled" && a.status !== "completed" && a.status !== "rejected" && (
            <div className="mt-1 flex flex-wrap gap-2">
              {a.status === "awaiting-payment" && (
                <button
                  type="button"
                  className="animate-bounce rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700"
                  onClick={() => openPaymentModal(a._id)}
                >
                  Pay now
                </button>
              )}
              {(a.status === "accepted" || a.status === "in-progress") && (
                <button
                  type="button"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                  onClick={() => handleVideoCall(a)}
                >
                  {a.status === "accepted" ? "Join video" : "Rejoin video"}
                </button>
              )}
              {a.status === "pending" && (
                <>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => reschedule(a._id)}
                  >
                    Reschedule
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                    onClick={() => cancel(a._id)}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}

          {a.prescription && (
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => generatePDF(a.prescription, a.doctor?.name, a.doctorProfile?.specialization)}
                className="flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download service note
              </button>
            </div>
          )}

          {a.review?.doctorResponse && (
            <div className="mt-2 animate-in fade-in slide-in-from-top-2 rounded-xl border border-brand-100 bg-brand-50 p-3 duration-500">
              <div className="mb-1 flex items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-brand-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  Doctor reply
                </span>
              </div>
              <p className="text-xs italic text-slate-700">&quot;{a.review.doctorResponse}&quot;</p>
            </div>
          )}
        </li>
      ))}
    </ul>
  </section>
);

export default PatientHistorySection;
