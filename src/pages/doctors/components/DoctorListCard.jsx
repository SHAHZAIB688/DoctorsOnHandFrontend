import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { buildBackendAssetUrl } from "../../../api/client";
import { formatDoctorRating } from "../../../utils/doctorsApi";

const formatWhenAvailable = (when) => {
  const value = String(when || "").trim().toLowerCase();
  if (!value) return "Check availability";
  if (value === "today") return "Available today";
  if (value === "tomorrow") return "Available tomorrow";
  return value.replace(/_/g, " ");
};

const formatFee = (fee) => {
  const amount = Number(fee);
  if (!Number.isFinite(amount) || amount <= 0) return "—";
  return `Rs. ${amount.toLocaleString()}`;
};

const DoctorAvatar = ({ doctor }) => {
  const src = doctor.image
    ? buildBackendAssetUrl(doctor.image)
    : `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(doctor.user?.name || "Doctor")}`;

  return (
    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-slate-100 bg-slate-50 sm:h-28 sm:w-28">
      <img
        src={src}
        alt={doctor.user?.name || "Doctor"}
        className="h-full w-full scale-[1.22] object-cover object-[center_12%]"
      />
    </div>
  );
};

const DoctorListCard = ({ doctor, onBook, onVideoConsult }) => {
  const { t } = useTranslation();
  const years = doctor.experienceYears || 0;
  const ratingLabel = formatDoctorRating(doctor);
  const reviewCount = doctor.numReviews || 0;
  const hospitals = Array.isArray(doctor.hospitals) ? doctor.hospitals : [];
  const displayHospitals =
    hospitals.length > 0
      ? hospitals
      : [
          {
            name: doctor.locationAddress || doctor.locationCity || "Clinic visit",
            locality: doctor.locationCity || "",
            fee: doctor.consultationFee,
            whenAvailable: "today",
            videoConsultation: false,
          },
        ];
  const hasVideo = doctor.videoConsultationAvailable || hospitals.some((h) => h.videoConsultation);

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
        doctor.recommended ? "border-brand-400 ring-1 ring-brand-100" : "border-slate-200"
      }`}
    >
      {doctor.recommended && (
        <div className="border-b border-brand-100 bg-brand-50 px-4 py-2">
          <span className="text-xs font-bold uppercase tracking-wide text-brand-700">{t("doctors.bestMatch")}</span>
        </div>
      )}

      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-5 sm:p-5">
        <DoctorAvatar doctor={doctor} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-slate-900 sm:text-xl">{doctor.user?.name}</h3>

              {doctor.pmdcVerified && (
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                    ✓
                  </span>
                  PMDC Verified
                </p>
              )}

              <p className="mt-1 text-sm font-medium text-slate-700">{doctor.specialization}</p>
              {doctor.qualification && (
                <p className="mt-0.5 text-sm text-slate-500">{doctor.qualification}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-6 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-base font-bold text-slate-900">
                    {years} {years === 1 ? "Year" : "Years"}
                  </p>
                  <p className="text-xs text-slate-500">{t("doctors.card.experience")}</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <p className="flex items-center gap-1 text-base font-bold text-slate-900">
                    <span className="text-amber-500">★</span>
                    {ratingLabel}
                  </p>
                  <p className="text-xs text-slate-500">
                    {reviewCount > 0 ? `${reviewCount} Reviews` : "No reviews yet"}
                  </p>
                </div>
                {doctor.distanceKm != null && (
                  <>
                    <div className="h-8 w-px bg-slate-200" />
                    <div>
                      <p className="text-base font-bold text-slate-900">{doctor.distanceKm} km</p>
                      <p className="text-xs text-slate-500">Away</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-2 sm:w-48">
              {hasVideo && (
                <button
                  type="button"
                  onClick={() => onVideoConsult?.(doctor)}
                  className="flex items-center justify-center gap-2 rounded-lg border-2 border-brand-700 px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                >
                  <span aria-hidden>📹</span>
                  Video Consultation
                </button>
              )}
              <button
                type="button"
                onClick={() => (onBook ? onBook(doctor) : null)}
                className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
              >
                Book Appointment
              </button>
              <Link
                to={`/doctors/${doctor._id}`}
                className="rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                {t("doctors.card.viewDetails")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5">
        {displayHospitals.slice(0, 3).map((hospital, index) => (
          <div
            key={`${hospital.hospitalId || hospital.name}-${index}`}
            className="flex flex-col gap-2 rounded-xl border border-brand-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-bold text-brand-800">
                <span aria-hidden>{hospital.videoConsultation ? "📹" : "🏥"}</span>
                <span className="truncate">{hospital.name}</span>
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {formatWhenAvailable(hospital.whenAvailable)}
                {hospital.locality ? ` · ${hospital.locality}` : ""}
              </p>
            </div>
            <p className="shrink-0 text-base font-bold text-slate-900">{formatFee(hospital.fee || doctor.consultationFee)}</p>
          </div>
        ))}
      </div>
    </article>
  );
};

export default DoctorListCard;
