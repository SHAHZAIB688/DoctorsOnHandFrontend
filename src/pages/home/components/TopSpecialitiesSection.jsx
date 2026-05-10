import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TopSpecialitiesSection = ({ specialities }) => {
  const { t } = useTranslation();
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{t("home.topSpecsTitle")}</h2>
        <p className="mt-1 text-sm text-slate-600">{t("home.topSpecsSubtitle")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {specialities.map((item) => (
          <Link
            key={item.queryValue}
            to={`/doctors?specialization=${encodeURIComponent(item.queryValue)}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 hover:shadow"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TopSpecialitiesSection;
