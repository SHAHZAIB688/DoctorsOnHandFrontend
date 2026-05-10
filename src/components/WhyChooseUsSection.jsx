import { useMemo } from "react";
import { useTranslation } from "react-i18next";
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

const FEATURE_IDS = ["verified", "booking", "support", "secure", "coordination", "affordable"];

const ICONS = {
  verified: DoctorIcon,
  booking: AppointmentIcon,
  support: SupportIcon,
  secure: ShieldIcon,
  coordination: FileIcon,
  affordable: FeeIcon,
};

const WhyChooseUsSection = () => {
  const { t } = useTranslation();
  const features = useMemo(
    () =>
      FEATURE_IDS.map((id) => ({
        id,
        title: t(`why.features.${id}.title`),
        description: t(`why.features.${id}.description`),
        icon: ICONS[id],
      })),
    [t]
  );



  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{t("home.whyTitle")}</h2>
        <p className="mt-2 text-sm text-slate-600 md:text-base">{t("home.whySubtitle")}</p>
      </div>



      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 text-start transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white hover:shadow-sm"
            >
              <div className="text-brand-700">
                <Icon />
              </div>
              <h3 className="mt-2 text-base font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
