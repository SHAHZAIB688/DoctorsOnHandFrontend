import { useTranslation } from "react-i18next";

const SearchBarSection = ({ searchQuery, setSearchQuery, onSubmit }) => {
  const { t } = useTranslation();
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("home.searchPlaceholder")}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
        <button
          type="submit"
          className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {t("home.searchDoctors")}
        </button>
      </form>
    </section>
  );
};

export default SearchBarSection;
