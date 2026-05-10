import { useTranslation } from "react-i18next";
import { buildBackendAssetUrl } from "../../../api/client";

const PatientDoctorsSection = ({
  doctorFilter,
  setDoctorFilter,
  doctorCategories,
  filteredDoctors,
  formatServiceFee,
  setForm,
  setBookingModalOpen,
}) => {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
      <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{t("dash.patient.doctors.title")}</h3>
      <p className="mt-1 text-sm text-slate-600">{t("dash.patient.doctors.subtitle")}</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <select
          value={doctorFilter.specialization}
          onChange={(e) => setDoctorFilter((p) => ({ ...p, specialization: e.target.value }))}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 sm:w-52"
        >
          {doctorCategories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? t("dash.patient.doctors.allCategories") : category}
            </option>
          ))}
        </select>
        <input
          placeholder={t("dash.patient.doctors.searchPh")}
          value={doctorFilter.search}
          onChange={(e) => setDoctorFilter((p) => ({ ...p, search: e.target.value }))}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <article key={doctor._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <img
              src={
                doctor.image
                  ? buildBackendAssetUrl(doctor.image)
                  : `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(doctor.user?.name || t("dash.patient.unnamedDoctor"))}`
              }
              alt={doctor.user?.name || t("dash.patient.unnamedDoctor")}
              className="h-44 w-full rounded-xl bg-slate-100 object-cover"
            />
            <h3 className="mt-4 text-lg font-bold text-slate-900">{doctor.user?.name}</h3>
            <p className="text-sm text-brand-700">{doctor.specialization}</p>
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <p>
                {t("dash.patient.doctors.experience")}: {t("dash.patient.doctors.yearsPlus", { n: doctor.experienceYears || 5 })}
              </p>
              <p>
                {t("dash.patient.doctors.rating")}: 4.8 / 5.0
              </p>
              <p className="font-semibold text-brand-600">
                {t("dash.patient.doctors.serviceFee")}: {formatServiceFee(doctor.consultationFee)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setForm((p) => ({ ...p, doctorProfileId: doctor._id }));
                setBookingModalOpen(true);
              }}
              className="mt-4 inline-block w-full rounded-xl bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-brand-700"
            >
              {t("dash.patient.doctors.bookNow")}
            </button>
          </article>
        ))}
        {filteredDoctors.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 sm:col-span-2 xl:col-span-3">{t("dash.patient.doctors.empty")}</p>
        )}
      </div>
    </section>
  );
};

export default PatientDoctorsSection;
