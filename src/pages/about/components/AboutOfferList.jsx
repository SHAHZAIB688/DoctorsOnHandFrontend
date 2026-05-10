import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const AboutOfferList = () => {
  const { t, i18n } = useTranslation();
  const offers = useMemo(() => t("about.offers", { returnObjects: true }), [t, i18n.language]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">{t("about.offerTitle")}</h2>
      <ul className="space-y-4">
        {Array.isArray(offers) &&
          offers.map((offer) => (
            <li key={offer} className="flex items-start gap-3 text-slate-600">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600">
                ✓
              </span>
              {offer}
            </li>
          ))}
      </ul>
    </section>
  );
};

export default AboutOfferList;
