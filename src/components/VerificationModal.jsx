import { useTranslation } from "react-i18next";
import { HourglassIcon } from "../icons";

const VerificationModal = ({ isOpen, onAction }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 rounded-[2.5rem] bg-white p-10 text-center shadow-2xl duration-300">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600 shadow-inner">
          <HourglassIcon className="h-10 w-10 animate-pulse" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">{t("auth.verificationTitle")}</h3>
        <p className="mt-4 leading-relaxed text-slate-600">
          {t("auth.verificationBody")}
          <br />
          <br />
          {t("auth.verificationWait")}
        </p>
        <div className="mt-8">
          <button
            type="button"
            onClick={onAction}
            className="w-full rounded-2xl bg-brand-600 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-brand-700 active:scale-[0.98]"
          >
            {t("auth.goToLogin")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
