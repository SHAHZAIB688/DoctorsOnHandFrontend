const PatientBookingModal = ({
  open,
  onClose,
  onSubmit,
  form,
  setForm,
  doctors,
  availableSlots,
  loadingSlots,
  normalizeTimeSlot,
  setAvailableSlots,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close booking modal"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">Book Appointment</h3>
        <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
          <select
            required
            value={form.doctorProfileId}
            onChange={(e) => {
              setForm((p) => ({ ...p, doctorProfileId: e.target.value, timeSlot: "" }));
              setAvailableSlots([]);
            }}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base text-slate-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">Select doctor</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.user?.name} - {d.specialization}
              </option>
            ))}
          </select>

          <input
            type="date"
            required
            value={form.date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value, timeSlot: "" }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base text-slate-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />

          <select
            required
            value={form.timeSlot}
            onChange={(e) => setForm((p) => ({ ...p, timeSlot: e.target.value }))}
            disabled={!form.date || !form.doctorProfileId || loadingSlots}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base text-slate-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50"
          >
            <option value="">
              {loadingSlots ? "Loading slots..." : availableSlots.length > 0 ? "Select time slot" : "No slots available"}
            </option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>

          {form.timeSlot && (
            <p className="text-xs font-medium text-slate-600">
              Selected time: <span className="text-slate-900">{normalizeTimeSlot(form.timeSlot)}</span>
            </p>
          )}

          <textarea
            placeholder="Reason"
            value={form.reason}
            onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
            className="min-h-24 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base text-slate-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-300 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.doctorProfileId || !form.date || !form.timeSlot}
              className="w-full rounded-2xl bg-brand-600 py-3 text-base font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientBookingModal;
