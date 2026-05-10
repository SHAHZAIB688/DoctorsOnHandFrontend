import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AboutOfferList from "./components/AboutOfferList";

const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-16 pb-12">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-cyan-600 px-6 py-16 text-white shadow-xl lg:px-12">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{t("about.heroTitle")}</h1>
          <p className="mt-6 text-lg leading-relaxed text-cyan-50 md:text-xl">{t("about.heroLead")}</p>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      </section>

      <div className="grid gap-12 lg:grid-cols-2">
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">{t("about.journeyTitle")}</h2>
          <div className="space-y-4 leading-relaxed text-slate-600">
            <p>{t("about.journeyP1")}</p>
            <p>{t("about.journeyP2")}</p>
            <p>{t("about.journeyP3")}</p>
          </div>
        </section>

        <AboutOfferList />
      </div>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl bg-slate-900 p-10 text-white shadow-xl">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-2xl">👁️</div>
          <h2 className="text-2xl font-bold">{t("about.visionTitle")}</h2>
          <p className="mt-4 leading-relaxed text-slate-300">{t("about.visionText")}</p>
        </div>
        <div className="rounded-3xl bg-brand-600 p-10 text-white shadow-xl">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl">🚀</div>
          <h2 className="text-2xl font-bold">{t("about.missionTitle")}</h2>
          <p className="mt-4 leading-relaxed text-brand-50">{t("about.missionText")}</p>
        </div>
      </section>

      <section className="py-10 text-center">
        <h2 className="text-2xl font-bold text-slate-900">{t("about.ctaTitle")}</h2>
        <div className="mt-6 flex justify-center gap-4">
          <Link to="/doctors" className="rounded-xl bg-brand-600 px-8 py-3 font-semibold text-white shadow-lg hover:bg-brand-700">
            {t("about.findDoctor")}
          </Link>
          <Link to="/signup" className="rounded-xl border border-slate-200 bg-white px-8 py-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            {t("about.joinNow")}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
