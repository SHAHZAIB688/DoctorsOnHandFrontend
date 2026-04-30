import { TERMS_SECTIONS } from "./components/termsData";

const TermsPage = () => {
  return (
    <div className="space-y-12 pb-16">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-20 text-white shadow-2xl lg:px-16">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-4 py-2 text-sm font-bold text-brand-400 backdrop-blur-md border border-brand-500/20">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
            Legal Documentation
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">Terms and Conditions</h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-300 md:text-xl">
            Please read these terms carefully before using our platform. By accessing Prescripto, you agree to be bound by these legal guidelines.
          </p>
        </div>
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-600/20 blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-cyan-600/10 blur-[100px]" />
      </section>

      <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          {TERMS_SECTIONS.map((section, index) => (
            <div
              key={index}
              id={`section-${index + 1}`}
              className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-brand-200 hover:shadow-xl"
            >
              <div className="flex items-start gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-lg font-bold text-slate-400 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  {index + 1}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {section.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-slate-600">{section.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm custom-scrollbar">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Quick Navigation</h3>
            <nav className="flex flex-col gap-2.5">
              {TERMS_SECTIONS.map((section, i) => (
                <a
                  key={i}
                  href={`#section-${i + 1}`}
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
                >
                  <span className="mr-2 text-[10px] text-slate-300">0{i + 1}</span>
                  {section.title}
                </a>
              ))}
            </nav>
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="rounded-2xl bg-brand-50 p-5 text-center">
                <p className="text-xs font-bold text-brand-600 mb-1">Need help?</p>
                <p className="text-[10px] text-brand-500 mb-3">Our support team is here for you 24/7.</p>
                <a href="mailto:mawaisacu@gmail.com" className="text-xs font-bold text-brand-700 underline">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="rounded-[2rem] bg-slate-50 p-12 text-center border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900">Acceptance of Terms</h2>
        <p className="mt-4 mx-auto max-w-2xl text-slate-600">
          By continuing to use Prescripto, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
        </p>
        <div className="mt-8 text-sm text-slate-400 font-medium">Last Updated: April 26, 2026</div>
      </section>
    </div>
  );
};

export default TermsPage;
