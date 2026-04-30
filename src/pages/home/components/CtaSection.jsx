import { Link } from "react-router-dom";

const CtaSection = () => (
  <section className="rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-cyan-600 px-6 py-10 text-center text-white shadow-xl md:px-10">
    <h2 className="text-2xl font-bold md:text-3xl">Ready to Book Your Next Consultation?</h2>
    <p className="mt-2 text-sm text-cyan-50 md:text-base">
      Join Prescripto and connect with trusted doctors in minutes.
    </p>
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      <Link to="/doctors" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 hover:bg-cyan-50">
        Browse Doctors
      </Link>
      <Link to="/signup" className="rounded-xl border border-white/70 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
        Create Account
      </Link>
    </div>
  </section>
);

export default CtaSection;
