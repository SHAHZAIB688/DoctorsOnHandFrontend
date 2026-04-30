const DoctorReplyModal = ({ replyModal, setReplyModal, onSubmit }) => {
  if (!replyModal?.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-xl font-bold text-slate-800 mb-1">Reply to Feedback</h3>
        <p className="text-sm text-slate-500 mb-6">Your response will be visible to the patient.</p>

        <form onSubmit={onSubmit} className="space-y-5">
          <textarea
            rows="4"
            required
            placeholder="Type your response here..."
            className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 resize-none"
            value={replyModal.response}
            onChange={(e) => setReplyModal({ ...replyModal, response: e.target.value })}
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setReplyModal({ isOpen: false, reviewId: null, response: "" })}
              className="w-full rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 shadow-lg shadow-brand-200"
            >
              Send Response
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorReplyModal;
