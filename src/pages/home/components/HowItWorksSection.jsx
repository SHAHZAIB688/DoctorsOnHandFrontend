const HowItWorksSection = ({ steps }) => (
  <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
    <div>
      <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">How It Works</h2>
      <p className="mt-1 text-sm text-slate-600">Get appointment-ready in four simple steps.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <article key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Step {index + 1}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-900">{step.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{step.text}</p>
        </article>
      ))}
    </div>
  </section>
);

export default HowItWorksSection;
