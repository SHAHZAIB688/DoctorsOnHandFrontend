import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Dropdown from "../../../components/Dropdown";
import Loader from "../../../components/Loader";
import { MapPinIcon, XMarkIcon } from "../../../icons";
import { useBrowserLocation } from "../../../state/BrowserLocationContext";
import DoctorListCard from "../../doctors/components/DoctorListCard";

const PatientDoctorsSection = ({
  doctorFilter,
  setDoctorFilter,
  doctorCategories,
  filteredDoctors,
  doctorsLoading,
  loadingMoreDoctors,
  hasMoreDoctors,
  doctorsLoadedCount,
  doctorsTotal,
  onLoadMoreDoctors,
  onSearchDoctors,
  matchMeta,
  setForm,
  setBookingModalOpen,
  onFindBestDoctor,
}) => {
  const { t } = useTranslation();
  const geo = useBrowserLocation();

  const enableNearMe = async () => {
    let lat = geo.lat;
    let lng = geo.lng;
    if (geo.status !== "ready" || lat == null || lng == null) {
      const loc = await geo.requestLocation();
      if (!loc) {
        toast.error(!navigator.geolocation ? t("auth.geoNotSupported") : t("auth.geoDenied"));
        return;
      }
      lat = loc.lat;
      lng = loc.lng;
    }
    setDoctorFilter((p) => ({
      ...p,
      nearMe: true,
      nearLat: lat,
      nearLng: lng,
    }));
    toast.success(t("dash.patient.doctors.nearMeOn"));
  };

  const clearNearMe = () => {
    setDoctorFilter((p) => ({ ...p, nearMe: false, nearLat: null, nearLng: null }));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
      <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{t("dash.patient.doctors.title")}</h3>
      <p className="mt-1 text-sm text-slate-600">{t("dash.patient.doctors.subtitle")}</p>

      <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50/50 p-4">
        <label className="mb-1 block text-sm font-semibold text-slate-800">{t("dash.patient.doctors.conditionLabel")}</label>
        <p className="mb-2 text-xs text-slate-500">{t("dash.patient.doctors.conditionHint")}</p>
        <textarea
          rows={2}
          value={doctorFilter.condition}
          onChange={(e) => setDoctorFilter((p) => ({ ...p, condition: e.target.value }))}
          placeholder={t("dash.patient.doctors.conditionPh")}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void onFindBestDoctor?.()}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {t("dash.patient.doctors.findBest")}
          </button>
          {matchMeta?.autoMatched && matchMeta.matchedSpecializations?.length > 0 && (
            <p className="self-center text-xs text-brand-800">
              {t("dash.patient.doctors.matchedSpecs", {
                specs: matchMeta.matchedSpecializations.slice(0, 3).join(", "),
              })}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-nowrap sm:items-center">
        <Dropdown
          options={doctorCategories.map((category) => ({
            value: category,
            label: category === "all" ? t("dash.patient.doctors.allCategories") : category,
          }))}
          value={doctorFilter.specialization}
          onChange={(val) => setDoctorFilter((p) => ({ ...p, specialization: val }))}
          className="h-10 w-auto min-w-[12.5rem] shrink-0 sm:w-52"
        />
        <input
          placeholder={t("dash.patient.doctors.searchPh")}
          value={doctorFilter.search}
          onChange={(e) => setDoctorFilter((p) => ({ ...p, search: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void onSearchDoctors?.();
            }
          }}
          className="h-10 min-w-0 w-full flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 sm:min-w-[8rem]"
        />
        <button
          type="button"
          onClick={() => void onSearchDoctors?.()}
          className="h-10 shrink-0 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          {t("dash.patient.doctors.searchBtn")}
        </button>
        <div className="flex shrink-0 flex-row flex-nowrap items-center gap-1.5 sm:ms-auto">
          <button
            type="button"
            onClick={() => void enableNearMe()}
            title={t("dash.patient.doctors.nearMe")}
            aria-label={t("dash.patient.doctors.nearMe")}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
              doctorFilter.nearMe
                ? "border-brand-600 bg-brand-600 text-white shadow-sm hover:bg-brand-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
            }`}
          >
            <MapPinIcon className="h-5 w-5" />
          </button>
          {doctorFilter.nearMe && (
            <button
              type="button"
              onClick={clearNearMe}
              title={t("dash.patient.doctors.clearNearMe")}
              aria-label={t("dash.patient.doctors.clearNearMe")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {doctorsLoading ? (
          <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50">
            <Loader />
            <p className="text-sm font-medium text-slate-500">{t("dash.patient.doctors.fetching")}</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
            {t("dash.patient.doctors.empty")}
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <DoctorListCard
                  key={doctor._id}
                  doctor={doctor}
                  onBook={() => {
                    setForm((p) => ({ ...p, doctorProfileId: doctor._id }));
                    setBookingModalOpen(true);
                  }}
                  onVideoConsult={() => {
                    setForm((p) => ({ ...p, doctorProfileId: doctor._id }));
                    setBookingModalOpen(true);
                  }}
                />
              ))}
            </div>

            {hasMoreDoctors && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={onLoadMoreDoctors}
                  disabled={loadingMoreDoctors}
                  className="flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-8 py-3 text-sm font-semibold text-brand-700 shadow-sm transition hover:border-brand-400 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingMoreDoctors
                    ? t("dash.patient.doctors.loadingMore")
                    : t("dash.patient.doctors.loadMore", {
                        count: Math.max(0, doctorsTotal - doctorsLoadedCount),
                      })}
                </button>
              </div>
            )}

            <p className="mt-3 text-center text-xs text-slate-500">
              {t("dash.patient.doctors.showingCount", {
                shown: filteredDoctors.length,
                total: doctorsLoadedCount,
              })}
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default PatientDoctorsSection;
