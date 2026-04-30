const DoctorReviewsSection = ({ reviews }) => (
  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
    <h2 className="text-2xl font-bold text-slate-900">Patient Reviews</h2>
    <p className="mt-1 text-sm text-slate-600">Real feedback from patients.</p>

    {reviews.length === 0 ? (
      <p className="mt-6 rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
        No patient reviews yet.
      </p>
    ) : (
      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <article key={review._id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{review.patient?.name || "Patient"}</p>
                <p className="mt-1 text-xs text-amber-500">{"★".repeat(Math.max(1, Number(review.rating || 0)))}</p>
              </div>
              <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
            <p className="mt-3 text-sm text-slate-700">{review.patientComment || "No comment provided."}</p>
            {review.doctorResponse && (
              <div className="mt-3 rounded-xl border border-brand-100 bg-brand-50 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-700">Doctor Response</p>
                <p className="mt-1 text-sm text-slate-700">{review.doctorResponse}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    )}
  </section>
);

export default DoctorReviewsSection;
