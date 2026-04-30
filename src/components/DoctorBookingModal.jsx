import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import client from "../api/client";

const DoctorBookingModal = ({ doctor, onClose, onBooked }) => {
  const [form, setForm] = useState({ date: "", timeSlot: "", reason: "" });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!doctor?._id || !form.date) {
        setAvailableSlots([]);
        return;
      }

      setLoadingSlots(true);
      try {
        const { data } = await client.get(`/doctors/available-slots/${doctor._id}`, {
          params: { date: form.date },
        });
        setAvailableSlots(Array.isArray(data) ? data : []);
      } catch (error) {
        setAvailableSlots([]);
        toast.error("Failed to load available time slots");
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [doctor?._id, form.date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await client.post("/appointments", {
        doctorProfileId: doctor._id,
        date: form.date,
        timeSlot: form.timeSlot,
        reason: form.reason,
      });
      toast.success("Appointment booked successfully");
      onBooked?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
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
        <p className="mt-1 text-sm text-slate-600">Dr. {doctor?.user?.name} - {doctor?.specialization}</p>

        <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
          <input
            type="date"
            required
            value={form.date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value, timeSlot: "" }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base text-slate-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />

          <select
            required
            value={form.timeSlot}
            onChange={(e) => setForm((prev) => ({ ...prev, timeSlot: e.target.value }))}
            disabled={!form.date || loadingSlots}
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

          <textarea
            placeholder="Reason"
            value={form.reason}
            onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
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
              disabled={submitting || !form.date || !form.timeSlot}
              className="w-full rounded-2xl bg-brand-600 py-3 text-base font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorBookingModal;
