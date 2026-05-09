import { useEffect, useState, useRef, useMemo } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import patient from "../../api/client";
import DashboardShell from "../../components/DashboardShell";
import { DashboardIcon, DoctorIcon, AppointmentIcon, FileIcon, PaymentIcon, SettingsIcon } from "../../components/icons";
import Loader from "../../components/Loader";
import { useAuth } from "../../state/AuthContext";
import PatientBookingModal from "./components/PatientBookingModal";
import PatientReviewModal from "./components/PatientReviewModal";
import PatientDashboardOverviewSection from "./components/PatientDashboardOverviewSection";
import PatientHealthSummarySection from "./components/PatientHealthSummarySection";
import PatientDoctorsSection from "./components/PatientDoctorsSection";
import PatientHistorySection from "./components/PatientHistorySection";
import PatientPaymentHistorySection from "./components/PatientPaymentHistorySection";
import PatientSettingsSection from "./components/PatientSettingsSection";
import VideoCall from "../../components/VideoCall";

const formatServiceFee = (fee) => {
  if (!fee || fee === 0) return "Free";
  return `PKR ${fee}`;
};

const doctorLabel = (appointment) => appointment?.doctor?.name || "Your doctor";

const normalizeTimeSlot = (timeSlot) => {
  if (!timeSlot) return "";
  const [hours, minutes] = String(timeSlot).split(":");
  if (hours === undefined || minutes === undefined) return "";
  return `${String(Number(hours)).padStart(2, "0")}:${String(Number(minutes)).padStart(2, "0")}`;
};

const DEFAULT_HEALTH_SUMMARY = {
  bloodGroup: "",
  allergies: "",
  chronicDiseases: "",
  lastCheckup: "",
};

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorFilter, setDoctorFilter] = useState({ search: "", specialization: "all" });
  const [form, setForm] = useState({ doctorProfileId: "", date: "", timeSlot: "", reason: "" });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, appointmentId: null, doctorName: "" });
  const [reviewModal, setReviewModal] = useState({ isOpen: false, appointmentId: null, doctorName: "", rating: 5, comment: "" });
  const [videoCall, setVideoCall] = useState({ open: false, roomId: null });
  const [healthSummary, setHealthSummary] = useState(DEFAULT_HEALTH_SUMMARY);
  const [savingHealthSummary, setSavingHealthSummary] = useState(false);
  const prevAppointmentsRef = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const fetchDoctors = async () => {
    const { data } = await patient.get("/doctors");
    setDoctors(data);
  };

  const fetchHealthSummary = async () => {
    try {
      const { data } = await patient.get("/auth/me");
      const summary = data?.healthSummary || {};
      setHealthSummary({
        bloodGroup: summary.bloodGroup || "",
        allergies: summary.allergies || "",
        chronicDiseases: summary.chronicDiseases || "",
        lastCheckup: summary.lastCheckup || "",
      });
    } catch (error) {
      toast.error("Failed to load profile summary");
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await patient.get("/appointments/my");

      if (prevAppointmentsRef.current.length > 0) {
        data.forEach((newAppt) => {
          const oldAppt = prevAppointmentsRef.current.find((a) => a._id === newAppt._id);
          if (oldAppt && oldAppt.status !== "in-progress" && newAppt.status === "in-progress") {
            toast.success(`${newAppt.doctor?.name || "Your doctor"} has marked your appointment as in progress.`, {
              duration: 8000,
            });
          }
        });
      }
      prevAppointmentsRef.current = data;
      setAppointments(data);
      return data;
    } catch (err) {
      console.error("Failed to fetch appointments");
      return [];
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
    fetchHealthSummary();

    // Refresh appointments every 10 seconds and doctors every 30 seconds
    const appointmentIntervalId = setInterval(fetchAppointments, 10000);
    const doctorIntervalId = setInterval(fetchDoctors, 30000);
    return () => {
      clearInterval(appointmentIntervalId);
      clearInterval(doctorIntervalId);
    };
  }, []);

  useEffect(() => {
    const verifyPaymentOnReturn = async () => {
      const params = new URLSearchParams(location.search);
      const paymentStatus = params.get("payment");
      const sessionId = params.get("session_id");
      const appointmentId = params.get("appointmentId");

      if (!paymentStatus) return;

      if (paymentStatus === "cancelled") {
        toast("Stripe payment was cancelled.");
        navigate("/dashboard", { replace: true });
        return;
      }

      if (paymentStatus !== "success" || !sessionId || !appointmentId) {
        navigate("/dashboard", { replace: true });
        return;
      }

      try {
        await patient.post("/appointments/verify-payment", { sessionId, appointmentId });
        toast.success("Stripe payment verified successfully.");
        const refreshedAppointments = await fetchAppointments();
        const paidAppointment = refreshedAppointments.find((appt) => appt._id === appointmentId);
        if (paidAppointment) {
          setReviewModal({
            isOpen: true,
            appointmentId: paidAppointment._id,
            doctorName: paidAppointment.doctor?.name || "Doctor",
            rating: 5,
            comment: "",
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Stripe payment verification failed");
      } finally {
        navigate("/dashboard", { replace: true });
      }
    };

    verifyPaymentOnReturn();
  }, [location.search, navigate]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!form.doctorProfileId || !form.date) {
        setAvailableSlots([]);
        return;
      }

      setLoadingSlots(true);
      try {
        // Format date to ensure YYYY-MM-DD format from input
        const dateStr = form.date;
        console.log(`Fetching slots for doctor ${form.doctorProfileId} on date ${dateStr}`);
        
        const { data } = await patient.get(`/doctors/available-slots/${form.doctorProfileId}`, {
          params: { date: dateStr },
        });
        
        console.log(`Received ${data.length} available slots:`, data);
        setAvailableSlots(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching slots:", error);
        setAvailableSlots([]);
        const errorMsg = error.response?.data?.message || "Failed to load available time slots";
        toast.error(errorMsg);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [form.doctorProfileId, form.date]);

  const book = async (e) => {
    e.preventDefault();
    const normalizedTimeSlot = normalizeTimeSlot(form.timeSlot);
    if (!normalizedTimeSlot) {
      toast.error("Please select a valid time slot");
      return;
    }

    const payload = {
      doctorProfileId: form.doctorProfileId,
      date: form.date,
      timeSlot: normalizedTimeSlot,
      reason: form.reason,
    };

    try {
      await patient.post("/appointments", payload);
      toast.success("Service booked and WhatsApp sent");
      setForm({ doctorProfileId: "", date: "", timeSlot: "", reason: "" });
      setAvailableSlots([]);
      setBookingModalOpen(false);
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  const cancel = async (id) => {
    await patient.put(`/appointments/${id}/cancel`);
    fetchAppointments();
  };

  const reschedule = async (id) => {
    const date = window.prompt("Enter new date (YYYY-MM-DD)");
    const timeSlot = window.prompt("Enter new time slot (HH:mm)");
    if (!date || !timeSlot) return;
    await patient.put(`/appointments/${id}/reschedule`, { date, timeSlot });
    fetchAppointments();
  };

  const handleVideoCall = (appointment) => {
    if (appointment.status !== "in-progress") {
      const appointmentTime = new Date(`${appointment.date}T${appointment.timeSlot}:00`);
      const diffMins = (appointmentTime - new Date()) / (1000 * 60);
      if (diffMins > 5) {
        toast.error("Please wait. You can only join up to 5 minutes before your scheduled time.");
        return;
      }
    }
    setVideoCall({ open: true, roomId: appointment._id });
  };

  const openPaymentModal = async (id) => {
    try {
      const { data } = await patient.post(`/appointments/${id}/create-checkout-session`);
      if (!data?.url) {
        toast.error("Unable to initialize Stripe checkout");
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed. Please try again.");
    }
  };

  const processPayment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await patient.post(`/appointments/${paymentModal.appointmentId}/create-checkout-session`);
      if (!data?.url) {
        toast.error("Unable to initialize Stripe checkout");
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed. Please try again.");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await patient.post("/reviews", {
        appointmentId: reviewModal.appointmentId,
        rating: reviewModal.rating,
        comment: reviewModal.comment,
      });
      toast.success("Thank you for your feedback!");
      setReviewModal({ isOpen: false, appointmentId: null, doctorName: "", rating: 5, comment: "" });
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  const saveHealthSummary = async (e) => {
    e.preventDefault();
    setSavingHealthSummary(true);
    try {
      const payload = {
        bloodGroup: healthSummary.bloodGroup,
        allergies: healthSummary.allergies,
        chronicDiseases: healthSummary.chronicDiseases,
        lastCheckup: healthSummary.lastCheckup,
      };
      await patient.put("/auth/health-summary", payload);
      toast.success("Profile summary updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile summary");
    } finally {
      setSavingHealthSummary(false);
    }
  };

  const notifications = useMemo(() => {
    const list = [];
    appointments.forEach((a) => {
      if (a.status === "accepted") {
        list.push({
          id: `accepted-${a._id}`,
          title: "Request Accepted!",
          message: `${doctorLabel(a)} accepted your service request. You can join the call now.`,
          type: "info",
          linkTab: "history",
        });
      }
      if (a.status === "in-progress") {
        list.push({
          id: `call-${a._id}`,
          title: "Call In-Progress",
          message: `${doctorLabel(a)} is waiting for you.`,
          type: "alert",
          linkTab: "history",
        });
      }
      if (a.status === "awaiting-payment") {
        list.push({
          id: `pay-${a._id}`,
          title: "Payment Pending",
          message: `Please pay ${formatServiceFee(a.doctorProfile?.consultationFee || 2000)} to complete your service.`,
          type: "info",
          linkTab: "payments",
        });
      }
      if (a.prescription) {
        list.push({
          id: `rx-${a._id}`,
          title: "New Prescription",
          message: `${doctorLabel(a)} has sent you a prescription.`,
          type: "info",
          linkTab: "history",
        });
      }
      if (a.review?.doctorResponse) {
        list.push({
          id: `rev-${a._id}`,
          title: "Doctor Replied",
          message: `${doctorLabel(a)} responded to your feedback.`,
          type: "info",
          linkTab: "history",
        });
      }
    });
    return list;
  }, [appointments]);

  const dashboardStats = useMemo(() => {
    const upcomingCount = appointments.filter((a) =>
      ["pending", "accepted", "in-progress", "awaiting-payment"].includes(a.status)
    ).length;
    const completedCount = appointments.filter((a) => a.status === "completed").length;
    const serviceNotesCount = appointments.filter((a) => a.status === "completed" || Boolean(a.prescription)).length;

    return [
      { id: "upcoming", label: "Upcoming Appointments", value: upcomingCount, icon: AppointmentIcon },
      { id: "completed", label: "Completed Appointments", value: completedCount, icon: DashboardIcon },
      { id: "reports", label: "Medical Reports", value: serviceNotesCount, icon: DoctorIcon },
    ];
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    const now = new Date();
    return appointments
      .filter((a) => ["pending", "accepted", "in-progress", "awaiting-payment"].includes(a.status))
      .sort((a, b) => new Date(`${a.date}T${a.timeSlot || "00:00"}:00`) - new Date(`${b.date}T${b.timeSlot || "00:00"}:00`))
      .find((a) => new Date(`${a.date}T${a.timeSlot || "00:00"}:00`) >= now);
  }, [appointments]);

  const doctorCategories = useMemo(() => {
    const categories = new Set(doctors.map((d) => d.specialization).filter(Boolean));
    return ["all", ...Array.from(categories)];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const searchText = doctorFilter.search.trim().toLowerCase();
    return doctors.filter((d) => {
      const matchesCategory = doctorFilter.specialization === "all" || d.specialization === doctorFilter.specialization;
      const matchesSearch =
        !searchText ||
        d.user?.name?.toLowerCase().includes(searchText) ||
        d.specialization?.toLowerCase().includes(searchText);
      return matchesCategory && matchesSearch;
    });
  }, [doctors, doctorFilter]);

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <DashboardShell
        title="Patient dashboard"
        subtitle="Book doctors, pay for services, and manage your profile."
        notifications={notifications}
        navItems={[
          { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
          { id: "doctors", label: "Find doctors", icon: DoctorIcon },
          { id: "health-summary", label: "Profile summary", icon: AppointmentIcon },
          {
            id: "payments",
            label: "Payment history",
            icon: PaymentIcon,
            hasNotification: appointments.some((a) => a.status === "awaiting-payment"),
          },
          {
            id: "history",
            label: "Booking history",
            icon: FileIcon,
            hasNotification: appointments.some((a) => a.status === "accepted" || a.status === "in-progress"),
          },
          { id: "settings", label: "Settings", icon: SettingsIcon },
        ]}
      >
        {(activeTab) => (
          <div className="grid gap-4 lg:grid-cols-2">
            {activeTab === "dashboard" && (
              <PatientDashboardOverviewSection
                dashboardStats={dashboardStats}
                nextAppointment={nextAppointment}
                openPaymentModal={openPaymentModal}
                healthSummary={healthSummary}
              />
            )}

            {activeTab === "health-summary" && (
              <PatientHealthSummarySection
                healthSummary={healthSummary}
                setHealthSummary={setHealthSummary}
                saveHealthSummary={saveHealthSummary}
                savingHealthSummary={savingHealthSummary}
              />
            )}

            {activeTab === "doctors" && (
              <PatientDoctorsSection
                doctorFilter={doctorFilter}
                setDoctorFilter={setDoctorFilter}
                doctorCategories={doctorCategories}
                filteredDoctors={filteredDoctors}
                formatServiceFee={formatServiceFee}
                setForm={setForm}
                setBookingModalOpen={setBookingModalOpen}
              />
            )}

            {activeTab === "payments" && (
              <PatientPaymentHistorySection appointments={appointments} openPaymentModal={openPaymentModal} />
            )}

            {activeTab === "history" && (
              <PatientHistorySection
                appointments={appointments}
                openPaymentModal={openPaymentModal}
                handleVideoCall={handleVideoCall}
                reschedule={reschedule}
                cancel={cancel}
              />
            )}

            {activeTab === "settings" && <PatientSettingsSection refreshUser={refreshUser} />}
          </div>
        )}
      </DashboardShell>

      <PatientBookingModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onSubmit={book}
        form={form}
        setForm={setForm}
        doctors={doctors}
        availableSlots={availableSlots}
        loadingSlots={loadingSlots}
        normalizeTimeSlot={normalizeTimeSlot}
        setAvailableSlots={setAvailableSlots}
      />

      {paymentModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Complete Stripe Payment</h3>
            <p className="text-sm text-slate-500 mb-6">
              Pay the service fee securely via Stripe for {paymentModal.doctorName}.
            </p>

            <form onSubmit={processPayment} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Payment Processor</label>
                <input
                  type="text"
                  value="Stripe"
                  disabled
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-sm font-semibold text-slate-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Card Information</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="w-full rounded-xl border border-slate-300 p-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="rounded-xl border border-slate-300 p-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  className="rounded-xl border border-slate-300 p-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentModal({ isOpen: false, appointmentId: null, doctorName: "" })}
                  className="w-full rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
                  Pay with Stripe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <PatientReviewModal reviewModal={reviewModal} setReviewModal={setReviewModal} onSubmit={submitReview} />

      <VideoCall
        open={videoCall.open}
        roomId={videoCall.roomId}
        role="patient"
        onClose={() => setVideoCall({ open: false, roomId: null })}
      />
    </>
  );
};

export default PatientDashboard;
