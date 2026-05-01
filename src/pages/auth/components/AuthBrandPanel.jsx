const AuthBrandPanel = ({ logoSrc }) => (
  <div className="relative flex w-full flex-col justify-between bg-[#2e324d] p-6 sm:p-8 text-white md:w-[40%] lg:p-10">
    <div className="relative z-10">
      <div className="flex items-center gap-3">
        <img src={logoSrc} alt="Logo" className="h-10 w-10 rounded-xl bg-white/10 p-1" />
        <div>
          <h2 className="text-xl font-bold tracking-tight">Perscripto</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Care First, On Time</p>
        </div>
      </div>
    </div>

    <div className="relative z-10 space-y-4 my-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
        Start your <br /> journey
      </h1>
      <p className="text-[10px] sm:text-xs leading-relaxed text-slate-400">
        Join thousands of doctors and patients who trust Perscripto for reliable appointment bookings.
      </p>
    </div>

    <div className="relative z-10">
      <div className="h-1 w-12 rounded-full bg-brand-500" />
    </div>

    <div className="absolute -right-20 top-1/4 h-64 w-64 rounded-full bg-brand-500/10 blur-[100px]" />
    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />
  </div>
);

export default AuthBrandPanel;
