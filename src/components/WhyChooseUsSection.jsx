import { useMemo, useState } from "react";
import { AppointmentIcon, DoctorIcon, FileIcon } from "./icons";

const SupportIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
    <path d="M4 12a8 8 0 1 1 16 0" />
    <path d="M4 12v4a2 2 0 0 0 2 2h2v-6H6a2 2 0 0 0-2 2Z" />
    <path d="M20 12v4a2 2 0 0 1-2 2h-2v-6h2a2 2 0 0 1 2 2Z" />
    <path d="M9 19h6" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
    <path d="M12 3 5 6v6c0 5 3.5 8.5 7 10 3.5-1.5 7-5 7-10V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const FeeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
    <circle cx="12" cy="12" r="9" />
    <path d="M9 10.5c0-1.1 1-2 2.5-2s2.5.8 2.5 2-1 1.8-2.5 2c-1.5.2-2.5.9-2.5 2s1 2 2.5 2 2.5-.9 2.5-2" />
  </svg>
);

const features = [
  {
    title: "Verified Doctors",
    description: "All specialists are verified so patients can book with confidence.",
    icon: DoctorIcon,
  },
  {
    title: "Easy Appointment Booking",
    description: "Book appointments in a few clicks with a smooth and simple flow.",
    icon: AppointmentIcon,
  },
  {
    title: "24/7 Support",
    description: "Get help anytime for booking, account, and consultation issues.",
    icon: SupportIcon,
  },
  {
    title: "Secure Medical Records",
    description: "Patient data and medical records are protected with secure handling.",
    icon: ShieldIcon,
  },
  {
    title: "Online Consultation",
    description: "Consult doctors remotely and manage care from your home.",
    icon: FileIcon,
  },
  {
    title: "Affordable Fees",
    description: "Transparent and reasonable consultation fees for quality care.",
    icon: FeeIcon,
  },
];

const WhyChooseUsSection = () => {
  const [activeTitle, setActiveTitle] = useState(features[0].title);
  const activeFeature = useMemo(
    () => features.find((feature) => feature.title === activeTitle) || features[0],
    [activeTitle]
  );

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Why Patients Choose Prescripto</h2>
        <p className="mt-2 text-sm text-slate-600 md:text-base">
          Trusted healthcare platform for fast and secure doctor appointments.
        </p>
      </div>

      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Highlighted Benefit</p>
        <div className="mt-2 flex items-center gap-2 text-brand-700">
          <activeFeature.icon />
          <h3 className="text-lg font-bold text-slate-900">{activeFeature.title}</h3>
        </div>
        <p className="mt-1 text-sm text-slate-700">{activeFeature.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => {
          const isActive = feature.title === activeTitle;
          return (
            <button
              key={feature.title}
              type="button"
              onClick={() => setActiveTitle(feature.title)}
              className={`group rounded-2xl border p-4 text-left transition-all duration-200 ${
                isActive
                  ? "border-brand-300 bg-brand-50 shadow-sm"
                  : "border-slate-200 bg-slate-50 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white hover:shadow-sm"
              }`}
            >
              <div className="text-brand-700">
                <feature.icon />
              </div>
              <h3 className="mt-2 text-base font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{feature.description}</p>
              <p className="mt-3 text-xs font-semibold text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                Click to highlight
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
