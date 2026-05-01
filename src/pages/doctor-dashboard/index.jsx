import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import patient from "../../api/client";
import DashboardShell from "../../components/DashboardShell";
import VerificationModal from "../../components/VerificationModal";
import PrescriptionForm from "../../components/PrescriptionForm";
import AccountProfileForm from "../../components/AccountProfileForm";
import { DashboardIcon, AppointmentIcon, FileIcon, ProfileIcon, IconWrapper } from "../../components/icons";
import Loader from "../../components/Loader";
import { useAuth } from "../../state/AuthContext";
import DoctorReplyModal from "./components/DoctorReplyModal";

const WEEKDAY_OPTIONS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DEFAULT_SLOT = { start: "09:00", end: "17:00" };
const PLATFORM_COMMISSION_RATE = 0.2;

const convertTo12Hour = (time24) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
};

const formatConsultationFee = (fee) => {
  if (!fee || fee === 0) return "Free";
  return `PKR ${fee}`;
};

const normalizeSingleAvailability = (slots = []) => {
  const matched = slots.find((slot) => WEEKDAY_OPTIONS.includes((slot?.day || "").trim().toLowerCase()));
  const matchedRange = slots.find(
    (slot) =>
      WEEKDAY_OPTIONS.includes((slot?.startDay || "").trim().toLowerCase()) &&
      WEEKDAY_OPTIONS.includes((slot?.endDay || "").trim().toLowerCase())
  );
  return [
    {
      startDay: (matchedRange?.startDay || matched?.day || "monday").toLowerCase(),
      endDay: (matchedRange?.endDay || matched?.day || "friday").toLowerCase(),
      start: matched?.start || DEFAULT_SLOT.start,
      end: matched?.end || DEFAULT_SLOT.end,
    },
  ];
};

const DoctorDashboard = () => {
  const { refreshUser } = useAuth();
  const [availability, setAvailability] = useState(normalizeSingleAvailability());
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ consultationFee: 0, bio: "", experienceYears: 0 });
  const [reviews, setReviews] = useState([]);
  const [replyModal, setReplyModal] = useState({ isOpen: false, reviewId: null, response: "" });
  const [prescriptionModal, setPrescriptionModal] = useState({ isOpen: false, appointment: null });
  const navigate = useNavigate();

  const loadProfile = async () => {
    try {
      const { data } = await patient.get("/doctors/profile");
      setProfile(data);
      setEditForm({
        consultationFee: data.consultationFee || 0,
        bio: data.bio || "",
        experienceYears: data.experienceYears || 0,
      });
      setAvailability(normalizeSingleAvailability(data.availability || []));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile");
    }
  };

  const saveProfile = async () => {
    try {
      await patient.put("/doctors/profile", editForm);
      toast.success("Profile updated successfully");
      setEditMode(false);
      loadProfile();
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await patient.get("/doctors/appointments");
      setAppointments(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load bookings");
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await patient.get(`/reviews/doctor/${profile?.user?._id || "me"}`);
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews");
    }
  };

  const submitResponse = async (e) => {
    e.preventDefault();
    try {
      await patient.put(`/reviews/${replyModal.reviewId}/respond`, { response: replyModal.response });
      toast.success("Response sent!");
      setReplyModal({ isOpen: false, reviewId: null, response: "" });
      fetchReviews();
    } catch (error) {
      toast.error("Failed to send response");
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadProfile();
      await fetchAppointments();
      setLoading(false);
    };
    init();

    const interval = setInterval(fetchAppointments, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (profile) fetchReviews();
  }, [profile]);

  const stats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return {
      today: appointments.filter((a) => {
        const appDate = new Date(a.date);
        return (
          appDate.getFullYear() === now.getFullYear() &&
          appDate.getMonth() === now.getMonth() &&
          appDate.getDate() === now.getDate()
        );
      }).length,
      week: appointments.filter((a) => new Date(a.date) >= startOfWeek).length,
      cancelled: appointments.filter((a) => a.status === "cancelled" || a.status === "rejected").length,
      completed: appointments.filter((a) => a.status === "completed").length,
    };
  }, [appointments]);

  const revenueStats = useMemo(() => {
    const fee = Number(profile?.consultationFee ?? 0);
    const completedCount = appointments.filter((a) => a.status === "completed").length;
    const gross = completedCount * fee;
    const yourShare = Math.round(gross * (1 - PLATFORM_COMMISSION_RATE) * 100) / 100;
    return { totalRevenue: gross, yourEarnings: yourShare };
  }, [appointments, profile]);

  const statCards = [
    { label: "Total Revenue (completed)", value: `PKR ${revenueStats.totalRevenue}`, icon: FileIcon },
    { label: "Your earnings (after 20% platform fee)", value: `PKR ${revenueStats.yourEarnings}`, icon: FileIcon },
    { label: "Today Bookings", value: stats.today, icon: AppointmentIcon },
    { label: "This Week Bookings", value: stats.week, icon: AppointmentIcon },
    { label: "Cancelled", value: stats.cancelled, icon: AppointmentIcon },
    { label: "Completed", value: stats.completed, icon: AppointmentIcon },
  ];

  const notifications = useMemo(() => {
    const list = [];
    appointments.forEach((a) => {
      if (a.status === "pending") {
        list.push({
          id: `new-${a._id}`,
          title: "New Booking",
          message: `${a.patient?.name} requested a service.`,
          type: "alert",
          linkTab: "appointments",
        });
      }
    });
    reviews.forEach((r) => {
      if (!r.doctorResponse) {
        list.push({
          id: `rev-${r._id}`,
          title: "New Feedback",
          message: `${r.patient?.name} left a ${r.rating}-star rating.`,
          type: "info",
          linkTab: "reviews",
        });
      }
    });
    return list;
  }, [appointments, reviews]);

  const saveAvailability = async () => {
    try {
      await patient.put("/doctors/availability", { availability });
      toast.success("Availability updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update availability");
    }
  };

  const updateStatus = async (id, status) => {
    await patient.put(`/doctors/appointments/${id}/status`, { status });
    toast.success("Booking updated");
    fetchAppointments();
  };

  const handleVideoCall = async (appointment) => {
    const appointmentTime = new Date(`${appointment.date}T${appointment.timeSlot}:00`);
    const now = new Date();

    const diffMs = appointmentTime - now;
    const diffMins = diffMs / (1000 * 60);

    if (diffMins > 5) {
      toast.error("Please wait. Call can only be started 5 mins before scheduled time.");
      return;
    }

    if (appointment.status === "accepted") {
      await updateStatus(appointment._id, "in-progress");
    }

    window.open(`https://meet.jit.si/Perscripto-Booking-${appointment._id}`, "_blank");
  };

  const statusBadge = (status) => {
    if (status === "approved" || status === "accepted") return "bg-emerald-100 text-emerald-700";
    if (status === "in-progress") return "bg-indigo-100 text-indigo-700";
    if (status === "awaiting-payment") return "bg-orange-100 text-orange-700";
    if (status === "rejected") return "bg-rose-100 text-rose-700";
    if (status === "completed") return "bg-blue-100 text-blue-700";
    return "bg-amber-100 text-amber-700";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );
  }

  if (profile?.user?.status === "suspended") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-amber-900">Account temporarily suspended</h2>
          <p className="mt-2 text-sm text-amber-800">Your doctor account is temporarily suspended. Please contact admin to restore access.</p>
          {profile?.user?.suspendedUntil && (
            <p className="mt-3 text-xs text-amber-700">
              Suspension ends: <span className="font-semibold">{new Date(profile.user.suspendedUntil).toLocaleString()}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  if (profile?.user?.status === "blocked") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-rose-900">Account blocked</h2>
          <p className="mt-2 text-sm text-rose-800">Your doctor account has been blocked. Please contact admin.</p>
        </div>
      </div>
    );
  }

  if (profile?.status !== "approved") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <VerificationModal isOpen={true} onAction={() => navigate("/")} />
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-400">Access Restricted</h2>
          <p className="mt-2 text-sm text-slate-400">Please wait for admin approval.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardShell
        title="Doctor Dashboard"
        subtitle="Manage bookings, profile, and verification status."
        notifications={notifications}
        navItems={[
          { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
          { id: "appointments", label: "Bookings", icon: AppointmentIcon, hasNotification: appointments.some((a) => a.status === "pending") },
          { id: "reviews", label: "Patient Reviews", icon: FileIcon },
          { id: "profile", label: "Profile & account", icon: ProfileIcon },
        ]}
      >
        {(activeTab) => (
          <>
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {statCards.map((item) => (
                    <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-4">
                        <IconWrapper>
                          <item.icon />
                        </IconWrapper>
                        <div>
                          <p className="text-2xl font-bold text-cyan-700">{item.value}</p>
                          <p className="text-xs text-slate-600">{item.label}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Manage Availability</h3>
                    <div className="text-xs text-slate-500">Set your working hours</div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Working Days</label>
                      <div className="flex flex-wrap items-center gap-3">
                        <select
                          value={availability[0]?.startDay || "monday"}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm capitalize outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition-all"
                          onChange={(e) => setAvailability((p) => [{ ...(p[0] || DEFAULT_SLOT), startDay: e.target.value.toLowerCase() }])}
                        >
                          {WEEKDAY_OPTIONS.map((d) => (
                            <option key={d} value={d}>
                              {d.charAt(0).toUpperCase() + d.slice(1)}
                            </option>
                          ))}
                        </select>

                        <span className="text-slate-400 font-medium">to</span>

                        <select
                          value={availability[0]?.endDay || "friday"}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm capitalize outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition-all"
                          onChange={(e) => setAvailability((p) => [{ ...(p[0] || DEFAULT_SLOT), endDay: e.target.value.toLowerCase() }])}
                        >
                          {WEEKDAY_OPTIONS.map((d) => (
                            <option key={d} value={d}>
                              {d.charAt(0).toUpperCase() + d.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Working Hours</label>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={availability[0]?.start || DEFAULT_SLOT.start}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition-all"
                            onChange={(e) => setAvailability((p) => [{ ...(p[0] || { day: "monday" }), start: e.target.value }])}
                          />
                          <span className="text-slate-400 font-medium">to</span>
                          <input
                            type="time"
                            value={availability[0]?.end || DEFAULT_SLOT.end}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition-all"
                            onChange={(e) => setAvailability((p) => [{ ...(p[0] || { day: "monday" }), end: e.target.value }])}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="text-sm font-medium text-slate-700 mb-2">Current Schedule</div>
                      <div className="text-sm text-slate-600">
                        {availability[0]?.startDay?.charAt(0).toUpperCase() + availability[0]?.startDay?.slice(1)} to{" "}
                        {availability[0]?.endDay?.charAt(0).toUpperCase() + availability[0]?.endDay?.slice(1)},{" "}
                        {convertTo12Hour(availability[0]?.start)} - {convertTo12Hour(availability[0]?.end)}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-6 w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3 text-sm font-bold text-white hover:from-brand-700 hover:to-brand-600 transition-all shadow-lg shadow-brand-100 active:scale-95"
                    onClick={saveAvailability}
                  >
                    Save Availability Settings
                  </button>
                </section>
              </div>
            )}

            {activeTab === "appointments" && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Bookings</h3>
                {appointments.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">No bookings assigned.</p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-100 text-slate-700">
                        <tr>
                          <th className="px-4 py-3">Patient</th>
                          <th className="px-4 py-3">Date/Time</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((a) => (
                          <tr key={a._id} className="border-b hover:bg-slate-50">
                            <td className="px-4 py-3">{a.patient?.name}</td>
                            <td className="px-4 py-3">
                              {a.date} {a.timeSlot}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(a.status)}`}>{a.status}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-2">
                                {a.status === "pending" && (
                                  <>
                                    <button className="rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white" type="button" onClick={() => updateStatus(a._id, "accepted")}>
                                      Accept
                                    </button>
                                    <button className="rounded bg-amber-500 px-2 py-1 text-xs font-semibold text-white" type="button" onClick={() => updateStatus(a._id, "rejected")}>
                                      Reject
                                    </button>
                                  </>
                                )}
                                {(a.status === "accepted" || a.status === "in-progress") && (
                                  <>
                                    <button className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white" type="button" onClick={() => handleVideoCall(a)}>
                                      {a.status === "in-progress" ? "Rejoin Call" : "Video Call"}
                                    </button>
                                    <button
                                      className={`rounded px-2 py-1 text-xs font-semibold text-white ${a.status === "in-progress" ? "bg-rose-600" : "bg-brand-600"}`}
                                      type="button"
                                      onClick={() => updateStatus(a._id, "awaiting-payment")}
                                    >
                                      {a.status === "in-progress" ? "End Call" : "Complete"}
                                    </button>
                                    <button className="rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white" type="button" onClick={() => setPrescriptionModal({ isOpen: true, appointment: a })}>
                                      Add Service Note
                                    </button>
                                  </>
                                )}
                                {a.status === "completed" && (
                                  <>
                                    <button className="cursor-default rounded bg-emerald-100 border border-emerald-300 px-2 py-1 text-xs font-semibold text-emerald-700" type="button">
                                      ✓ Payment Received
                                    </button>
                                    <button className="rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white" type="button" onClick={() => setPrescriptionModal({ isOpen: true, appointment: a })}>
                                      Add Service Note
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {activeTab === "profile" && (
              <div className="space-y-6">
                <AccountProfileForm
                  refreshUser={refreshUser}
                  onSaved={loadProfile}
                  idPrefix="doctor-acct"
                  title="Account"
                  description="Update your sign-in name, email, phone, and password. Public listing fields are edited below."
                />
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Doctor listing</h3>
                    <p className="mt-1 text-sm text-slate-500">Service rate, experience, and bio shown to patients.</p>
                  </div>
                  {!editMode ? (
                    <button onClick={() => setEditMode(true)} className="rounded-lg bg-indigo-50 text-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-100 transition-colors shrink-0">
                      Edit listing
                    </button>
                  ) : (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setEditForm({
                            consultationFee: profile?.consultationFee || 0,
                            bio: profile?.bio || "",
                            experienceYears: profile?.experienceYears || 0,
                          });
                        }}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button onClick={saveProfile} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors">
                        Save listing
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Verification</h4>
                      <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                        <p className="text-sm">
                          <span className="font-semibold text-slate-700">Specialization:</span> {profile?.specialization}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="font-semibold text-slate-700 text-sm mr-2">Account status:</span>
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusBadge(profile?.status)}`}>{profile?.status}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Service Details</h4>
                      <div className="rounded-xl border border-slate-200 p-4">
                        {!editMode ? (
                          <>
                            <p className="text-sm">
                              <span className="font-semibold text-slate-700">Experience:</span> {profile?.experienceYears} years
                            </p>
                            <p className="text-sm mt-2">
                              <span className="font-semibold text-slate-700">Service Rate:</span> {formatConsultationFee(profile?.consultationFee)}
                            </p>
                          </>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">Experience (Years)</label>
                              <input
                                type="number"
                                className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                                value={editForm.experienceYears}
                                onChange={(e) => setEditForm({ ...editForm, experienceYears: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">Service Rate (PKR)</label>
                              <input
                                type="number"
                                className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                                value={editForm.consultationFee}
                                onChange={(e) => setEditForm({ ...editForm, consultationFee: e.target.value })}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Bio</h4>
                    <div className="h-[calc(100%-1.5rem)] rounded-xl border border-slate-200 p-4">
                      {!editMode ? (
                        <p className="whitespace-pre-wrap text-sm text-slate-600">{profile?.bio || "No bio added yet."}</p>
                      ) : (
                        <textarea
                          className="h-full min-h-[150px] w-full resize-none rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                          placeholder="Describe your services and experience for patients..."
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </section>
              </div>
            )}

            {activeTab === "reviews" && (
              <section className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900">Patient Feedback</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-amber-500">★ {profile?.averageRating?.toFixed(1) || "5.0"}</span>
                    <span className="text-sm text-slate-500">({profile?.numReviews || 0} total reviews)</span>
                  </div>
                </div>

                <div className="grid gap-4">
                  {reviews.length === 0 ? (
                    <div className="rounded-2xl bg-white p-12 text-center text-sm text-slate-500 shadow-sm border border-slate-200">No reviews received yet.</div>
                  ) : (
                    reviews.map((rev) => (
                      <article key={rev._id} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-slate-900">{rev.patient?.name}</h4>
                            <div className="flex text-amber-400 text-xs mt-0.5">
                              {[...Array(rev.rating)].map((_, i) => (
                                <span key={i}>★</span>
                              ))}
                              {[...Array(5 - rev.rating)].map((_, i) => (
                                <span key={i} className="text-slate-200">
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>

                        <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-xl">"{rev.patientComment || "No comment provided."}"</p>

                        {rev.doctorResponse ? (
                          <div className="mt-4 ml-6 border-l-2 border-brand-200 pl-4 py-1">
                            <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-1">Your Response</p>
                            <p className="text-sm text-slate-700">{rev.doctorResponse}</p>
                          </div>
                        ) : (
                          <button onClick={() => setReplyModal({ isOpen: true, reviewId: rev._id, response: "" })} className="mt-4 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors">
                            + Write a response
                          </button>
                        )}
                      </article>
                    ))
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </DashboardShell>

      <DoctorReplyModal replyModal={replyModal} setReplyModal={setReplyModal} onSubmit={submitResponse} />

      {prescriptionModal.isOpen && (
        <PrescriptionForm
          appointment={prescriptionModal.appointment}
          onClose={() => setPrescriptionModal({ isOpen: false, appointment: null })}
          onSubmitSuccess={() => {
            setPrescriptionModal({ isOpen: false, appointment: null });
          }}
        />
      )}
    </>
  );
};

export default DoctorDashboard;
