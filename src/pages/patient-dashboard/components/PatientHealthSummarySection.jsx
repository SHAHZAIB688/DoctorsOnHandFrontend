const PatientHealthSummarySection = ({
  healthSummary,
  setHealthSummary,
  saveHealthSummary,
  savingHealthSummary,
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
    <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Health Summary</h3>
    <p className="mt-1 text-sm text-slate-600">Update your health details for better care coordination.</p>

    <form onSubmit={saveHealthSummary} className="mt-5 grid gap-4 md:grid-cols-2">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Blood Group</label>
        <input
          type="text"
          value={healthSummary.bloodGroup}
          onChange={(e) => setHealthSummary((prev) => ({ ...prev, bloodGroup: e.target.value }))}
          placeholder="e.g. O+"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Last Checkup</label>
        <input
          type="date"
          value={healthSummary.lastCheckup}
          onChange={(e) => setHealthSummary((prev) => ({ ...prev, lastCheckup: e.target.value }))}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium text-slate-700">Allergies</label>
        <textarea
          rows="3"
          value={healthSummary.allergies}
          onChange={(e) => setHealthSummary((prev) => ({ ...prev, allergies: e.target.value }))}
          placeholder="e.g. Penicillin"
          className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium text-slate-700">Chronic Diseases</label>
        <textarea
          rows="3"
          value={healthSummary.chronicDiseases}
          onChange={(e) => setHealthSummary((prev) => ({ ...prev, chronicDiseases: e.target.value }))}
          placeholder="e.g. Diabetes"
          className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={savingHealthSummary}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {savingHealthSummary ? "Saving..." : "Save health summary"}
        </button>
      </div>
    </form>
  </section>
);

export default PatientHealthSummarySection;
