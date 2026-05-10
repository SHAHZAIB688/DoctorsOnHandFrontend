import { useTranslation } from "react-i18next";
import Dropdown from "../../../components/Dropdown";

const PatientReviewModal = ({ reviewModal, setReviewModal, onSubmit }) => {
  const { t } = useTranslation();

  if (!reviewModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{t("dash.patient.reviewModal.title")}</h3>
        <p className="text-sm text-slate-500 mb-6">{t("dash.patient.reviewModal.subtitle", { name: reviewModal.doctorName })}</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t("dash.patient.reviewModal.rating")}</label>
            <Dropdown
              options={[5, 4, 3, 2, 1].map((r) => ({
                value: r,
                label: r === 1 ? t("dash.patient.reviewModal.stars", { n: r }) : t("dash.patient.reviewModal.starsPlural", { n: r }),
              }))}
              value={reviewModal.rating}
              onChange={(val) => setReviewModal((prev) => ({ ...prev, rating: Number(val) }))}
              className="w-full h-10"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t("dash.patient.reviewModal.comment")}</label>
            <textarea
              value={reviewModal.comment}
              onChange={(e) => setReviewModal((prev) => ({ ...prev, comment: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 p-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              rows="4"
              placeholder={t("dash.patient.reviewModal.commentPh")}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setReviewModal({ isOpen: false, appointmentId: null, doctorName: "", rating: 5, comment: "" })}
              className="w-full rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {t("dash.patient.reviewModal.cancel")}
            </button>
            <button type="submit" className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
              {t("dash.patient.reviewModal.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientReviewModal;
