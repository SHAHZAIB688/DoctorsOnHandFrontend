import { DoctorIcon } from "../../../components/icons";
import { generatePDF } from "../../../utils/generatePDF";

const PatientHistorySection = ({
  appointments,
  openPaymentModal,
  handleVideoCall,
  reschedule,
  cancel,
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
    <h3 className="text-lg font-semibold text-slate-900">Appointment History</h3>
    <ul className="mt-3 space-y-3">
      {appointments.map((a) => (
        <li key={a._id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 text-sm bg-white shadow-sm transition-all hover:border-brand-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <DoctorIcon />
              </div>
              <div>
                <p className="font-bold text-slate-900">Dr. {a.doctor?.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{a.doctorProfile?.specialization} • {a.date} {a.timeSlot}</p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${a.status === "completed" ? "bg-emerald-100 text-emerald-700" : a.status === "accepted" || a.status === "in-progress" ? "bg-brand-100 text-brand-700 border border-brand-200" : "bg-slate-100 text-slate-600"}`}>{a.status}</span>
          </div>

          {a.status !== "cancelled" && a.status !== "completed" && a.status !== "rejected" && (
            <div className="flex flex-wrap gap-2 mt-1">
              {a.status === "awaiting-payment" && (
                <button type="button" className="animate-bounce rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200" onClick={() => openPaymentModal(a._id)}>Pay Now</button>
              )}
              {(a.status === "accepted" || a.status === "in-progress") && (
                <button type="button" className="animate-pulse rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200" onClick={() => handleVideoCall(a)}>
                  {a.status === "accepted" ? "Join Call Now" : "Join In-Progress Call"}
                </button>
              )}
              {a.status === "pending" && (
                <>
                  <button type="button" className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50" onClick={() => reschedule(a._id)}>Reschedule</button>
                  <button type="button" className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700" onClick={() => cancel(a._id)}>Cancel</button>
                </>
              )}
            </div>
          )}

          {a.prescription && (
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                type="button"
                onClick={() => generatePDF(a.prescription, a.doctor?.name, a.doctorProfile?.specialization)}
                className="flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download Prescription
              </button>
            </div>
          )}

          {a.review?.doctorResponse && (
            <div className="mt-2 rounded-xl bg-brand-50 border border-brand-100 p-3 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-brand-700 uppercase tracking-widest flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500"></span>
                  Doctor's Reply
                </span>
              </div>
              <p className="text-xs text-slate-700 italic">"{a.review.doctorResponse}"</p>
            </div>
          )}
        </li>
      ))}
    </ul>
  </section>
);

export default PatientHistorySection;
