import { useTranslation } from "react-i18next";

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n, t } = useTranslation();
  const active = i18n.language === "ur" ? "ur" : "en";

  return (
    <div
      className={`inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5 shadow-sm ${className}`}
      role="group"
      aria-label={t("lang.switchLabel")}
    >
      <button
        type="button"
        onClick={() => i18n.changeLanguage("en")}
        className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide transition-all md:px-3 md:text-xs ${
          active === "en" ? "bg-white text-brand-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
        }`}
      >
        {t("lang.en")}
      </button>
      <button
        type="button"
        onClick={() => i18n.changeLanguage("ur")}
        className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-all md:px-3 md:text-xs ${
          active === "ur" ? "bg-white text-brand-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
        }`}
      >
        {t("lang.ur")}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
