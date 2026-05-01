import { Link } from "react-router-dom";

const TopSpecialitiesSection = ({ specialities }) => (
  <section className="space-y-5">
    <div>
      <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Top Specialities</h2>
      <p className="mt-1 text-sm text-slate-600">Explore common medical specialities quickly.</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {specialities.map((speciality) => (
        <Link
          key={speciality}
          to={`/doctors?specialization=${encodeURIComponent(speciality)}`}
          className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 hover:shadow"
        >
          {speciality}
        </Link>
      ))}
    </div>
  </section>
);

export default TopSpecialitiesSection;
