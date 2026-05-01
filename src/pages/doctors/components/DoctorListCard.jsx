import { Link } from "react-router-dom";
import { buildBackendAssetUrl } from "../../../api/client";

const DoctorListCard = ({ doctor }) => (
  <article className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
    <div className="relative h-60 overflow-hidden rounded-[1.5rem] border border-slate-100 bg-slate-50">
      <img
        src={doctor.image ? buildBackendAssetUrl(doctor.image) : `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(doctor.user?.name || "Doctor")}`}
        alt={doctor.user?.name || "Doctor"}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-emerald-600 shadow-sm backdrop-blur">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        Verified Professional
      </div>
    </div>
    <div className="mt-8 flex flex-1 flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-brand-600">{doctor.user?.name}</h3>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-brand-500">{doctor.specialization}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-amber-100 bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-600">
          ★ 4.8
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-y border-slate-100 py-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Experience</p>
          <p className="text-sm font-bold text-slate-700">{doctor.experienceYears || 5}+ Years</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Availability</p>
          <p className="text-sm font-bold text-emerald-600">Mon - Fri</p>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Link to={`/doctors/${doctor._id}`} className="group-hover:shadow-brand-200 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-brand-700 active:scale-[0.98]">
          View Details
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  </article>
);

export default DoctorListCard;
