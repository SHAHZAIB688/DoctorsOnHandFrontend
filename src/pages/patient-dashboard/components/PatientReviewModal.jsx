const PatientReviewModal = ({ reviewModal, setReviewModal, onSubmit }) => {
  if (!reviewModal?.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-xl font-bold text-slate-800 mb-1">Rate Your Experience</h3>
        <p className="text-sm text-slate-500 mb-6">How was your consultation with Dr. {reviewModal.doctorName}?</p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="flex justify-center gap-2 text-3xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewModal({ ...reviewModal, rating: star })}
                className={`transition-transform hover:scale-110 ${reviewModal.rating >= star ? "text-amber-400" : "text-slate-200"}`}
              >
                ★
              </button>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Comments (Optional)</label>
            <textarea
              rows="3"
              placeholder="Share your feedback..."
              className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 resize-none"
              value={reviewModal.comment}
              onChange={(e) => setReviewModal({ ...reviewModal, comment: e.target.value })}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setReviewModal({ isOpen: false, appointmentId: null, doctorName: "", rating: 5, comment: "" })}
              className="w-full rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Skip
            </button>
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 shadow-md shadow-brand-200"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientReviewModal;
