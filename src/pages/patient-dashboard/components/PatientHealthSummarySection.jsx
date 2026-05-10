import { useTranslation } from "react-i18next";

const PatientHealthSummarySection = ({ healthSummary, setHealthSummary, saveHealthSummary, savingHealthSummary }) => {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
      <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{t("dash.patient.health.title")}</h3>
      <p className="mt-1 text-sm text-slate-600">{t("dash.patient.health.subtitle")}</p>

      <form onSubmit={saveHealthSummary} className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{t("dash.patient.overview.bloodGroup")}</label>
          <input
            type="text"
            value={healthSummary.bloodGroup}
            onChange={(e) => setHealthSummary((prev) => ({ ...prev, bloodGroup: e.target.value }))}
            placeholder={t("dash.patient.health.bloodPh")}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{t("dash.patient.overview.lastCheckup")}</label>
          <input
            type="date"
            value={healthSummary.lastCheckup}
            onChange={(e) => setHealthSummary((prev) => ({ ...prev, lastCheckup: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">{t("dash.patient.overview.allergies")}</label>
          <textarea
            rows="3"
            value={healthSummary.allergies}
            onChange={(e) => setHealthSummary((prev) => ({ ...prev, allergies: e.target.value }))}
            placeholder={t("dash.patient.health.allergyPh")}
            className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">{t("dash.patient.overview.chronic")}</label>
          <textarea
            rows="3"
            value={healthSummary.chronicDiseases}
            onChange={(e) => setHealthSummary((prev) => ({ ...prev, chronicDiseases: e.target.value }))}
            placeholder={t("dash.patient.health.chronicPh")}
            className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={savingHealthSummary}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {savingHealthSummary ? t("dash.patient.health.saving") : t("dash.patient.health.save")}
          </button>
        </div>
      </form>
    </section>
  );
};

export default PatientHealthSummarySection;
