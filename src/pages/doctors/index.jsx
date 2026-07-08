import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import patient from "../../api/client";
import Loader from "../../components/Loader";
import BackToTop from "../../components/BackToTop";
import DoctorsFilterBar from "./components/DoctorsFilterBar";
import DoctorListCard from "./components/DoctorListCard";
import DoctorBookingModal from "../../components/DoctorBookingModal";
import { useBrowserLocation } from "../../state/BrowserLocationContext";
import { useAuth } from "../../state/AuthContext";
import { parseDoctorsResponse, haversineKm } from "../../utils/doctorsApi";

const DOCTORS_PER_PAGE = 10;

const DoctorsPage = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const geo = useBrowserLocation();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [doctorsTotal, setDoctorsTotal] = useState(0);
  const [matchMeta, setMatchMeta] = useState({ matchedSpecializations: [], autoMatched: false });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const [nearBy, setNearBy] = useState({ active: false, lat: null, lng: null });
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const doctorsInitialFetchDone = useRef(false);
  const conditionRef = useRef(condition);
  const nearByRef = useRef(nearBy);

  useEffect(() => {
    conditionRef.current = condition;
  }, [condition]);

  useEffect(() => {
    nearByRef.current = nearBy;
  }, [nearBy]);



  const specializationOptions = useMemo(() => {
    const unique = [...new Set(doctors.map((d) => d.specialization).filter(Boolean))].sort();
    return [
      { value: "All", label: t("doctors.spec.all") },
      ...unique.map((spec) => ({ value: spec, label: spec })),
    ];
  }, [doctors, t, i18n.language]);



  useEffect(() => {

    const spec = searchParams.get("specialization");

    const q = searchParams.get("condition") || searchParams.get("search");

    if (spec) {

      setSearch(spec);

      setSpecialization(spec);

    }

    if (q) setCondition(q);

  }, [searchParams]);

  useEffect(() => {
    if (specialization === "All" || loading || doctors.length === 0) return;
    const available = new Set(doctors.map((d) => d.specialization).filter(Boolean));
    if (!available.has(specialization)) {
      setSpecialization("All");
    }
  }, [doctors, specialization, loading]);

  const buildDoctorParams = useCallback(
    (skip = 0) => {
      const params = { limit: DOCTORS_PER_PAGE, skip };
      const conditionText = String(conditionRef.current || "").trim();
      const near = nearByRef.current;
      if (conditionText) params.condition = conditionText;
      if (near.active && near.lat != null && near.lng != null) {
        params.lat = near.lat;
        params.lng = near.lng;
        params.radiusKm = 100;
      } else if (conditionText && user?.locationLat != null && user?.locationLng != null) {
        params.lat = user.locationLat;
        params.lng = user.locationLng;
        params.radiusKm = 100;
      }
      return params;
    },
    [user?.locationLat, user?.locationLng]
  );

  const fetchDoctors = useCallback(
    async ({ skip = 0, append = false, withLoader = true } = {}) => {
      if (withLoader && !append) setLoading(true);
      if (append) setLoadingMore(true);
      try {
        const { data } = await patient.get("/doctors", { params: buildDoctorParams(skip) });
        const parsed = parseDoctorsResponse(data);
        setDoctors((prev) => (append ? [...prev, ...parsed.doctors] : parsed.doctors));
        setDoctorsTotal(parsed.total);
        setMatchMeta({
          matchedSpecializations: parsed.matchedSpecializations,
          autoMatched: parsed.autoMatched,
        });
      } catch {
        if (!append) toast.error(t("doctors.loadError"));
      } finally {
        if (withLoader && !append) setLoading(false);
        if (append) setLoadingMore(false);
      }
    },
    [buildDoctorParams, t]
  );

  useEffect(() => {
    if (doctorsInitialFetchDone.current) return;
    doctorsInitialFetchDone.current = true;
    void fetchDoctors({ skip: 0, append: false });
  }, [fetchDoctors]);



  const enableNearOnPage = async () => {

    let lat = nearBy.lat ?? user?.locationLat ?? geo.lat;

    let lng = nearBy.lng ?? user?.locationLng ?? geo.lng;

    if (lat == null || lng == null) {

      const loc = await geo.requestLocation();

      if (!loc) {

        toast.error(!navigator.geolocation ? t("auth.geoNotSupported") : t("auth.geoDenied"));

        return;

      }

      lat = loc.lat;

      lng = loc.lng;

    }

    const nextNear = { active: true, lat, lng };
    nearByRef.current = nextNear;
    setNearBy(nextNear);
    toast.success(t("doctors.nearMeOn"));
  };

  const clearNearOnPage = () => {
    const nextNear = { active: false, lat: null, lng: null };
    nearByRef.current = nextNear;
    setNearBy(nextNear);
  };



  const findBestSpecialist = async () => {
    if (!String(condition || "").trim()) {
      toast.error(t("doctors.conditionRequired"));
      return;
    }
    let lat = nearBy.lat ?? user?.locationLat ?? geo.lat;
    let lng = nearBy.lng ?? user?.locationLng ?? geo.lng;
    if (lat == null || lng == null) {
      const loc = await geo.requestLocation();
      if (!loc) {
        toast.error(!navigator.geolocation ? t("auth.geoNotSupported") : t("auth.geoDenied"));
        return;
      }
      lat = loc.lat;
      lng = loc.lng;
    }
    const nextNear = { active: true, lat, lng };
    nearByRef.current = nextNear;
    setNearBy(nextNear);
    toast.success(t("doctors.matchSearching"));
    await fetchDoctors({ skip: 0, append: false });
  };

  const filteredDoctors = useMemo(() => {
    let result = doctors;
    if (specialization !== "All") {
      result = result.filter((doc) => doc.specialization?.toLowerCase() === specialization.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (doc) =>
          doc.user?.name?.toLowerCase().includes(q) || doc.specialization?.toLowerCase().includes(q)
      );
    }
    if (nearBy.active && nearBy.lat != null && nearBy.lng != null) {
      result = result
        .map((d) => {
          const lat = d.locationLat;
          const lng = d.locationLng;
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return { ...d, distanceKm: null };
          return { ...d, distanceKm: haversineKm(nearBy.lat, nearBy.lng, lat, lng) };
        })
        .filter((d) => d.distanceKm == null || d.distanceKm <= 100)
        .sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
    }
    return result;
  }, [search, specialization, doctors, nearBy]);

  const hasMore = doctors.length < doctorsTotal;

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    void fetchDoctors({ skip: doctors.length, append: true, withLoader: false });
  };



  const resetFilters = () => {

    setSearch("");

    setCondition("");

    setSpecialization("All");

    clearNearOnPage();

  };



  const openBooking = (doctor) => {

    if (!user) {

      toast("Please login as patient to book a service.");

      navigate("/login");

      return;

    }

    if (user.role !== "patient") {

      toast.error("Only patient accounts can book services.");

      return;

    }

    setBookingDoctor(doctor);

  };



  const openVideoConsult = (doctor) => {
    toast.success("Video consultation booking — select a time slot on the next screen.");
    openBooking(doctor);
  };

  return (

    <div className="space-y-8 pb-12">

      <section className="mb-8 flex flex-col items-center justify-center gap-2">

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">{t("doctors.pageTitle")}</h1>

        <p className="mt-2 max-w-2xl text-center text-slate-600">{t("doctors.pageSubtitle")}</p>

      </section>



      <section className="rounded-2xl border border-brand-100 bg-brand-50/40 p-5">

        <label className="mb-1 block text-sm font-semibold text-slate-800">{t("doctors.conditionLabel")}</label>

        <p className="mb-2 text-xs text-slate-500">{t("doctors.conditionHint")}</p>

        <textarea

          rows={2}

          value={condition}

          onChange={(e) => setCondition(e.target.value)}

          placeholder={t("doctors.conditionPh")}

          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"

        />

        <button

          type="button"

          onClick={() => void findBestSpecialist()}

          className="mt-3 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"

        >

          {t("doctors.findBest")}

        </button>

        {matchMeta.autoMatched && matchMeta.matchedSpecializations?.length > 0 && (

          <p className="mt-2 text-xs font-medium text-brand-800">

            {t("doctors.matchedSpecs", { specs: matchMeta.matchedSpecializations.slice(0, 3).join(", ") })}

          </p>

        )}

      </section>



      <DoctorsFilterBar

        search={search}

        setSearch={setSearch}

        specialization={specialization}

        setSpecialization={setSpecialization}

        resetFilters={resetFilters}
        specializationOptions={specializationOptions}

        nearByActive={nearBy.active}

        onNearMe={enableNearOnPage}

        onClearNear={clearNearOnPage}

        nearBusy={geo.status === "loading"}

      />



      {loading ? (

        <div className="flex h-80 items-center justify-center rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col items-center gap-4">

            <Loader />

            <p className="text-sm font-medium text-slate-500">{t("doctors.fetching")}</p>

          </div>

        </div>

      ) : filteredDoctors.length === 0 ? (

        <div className="rounded-[2.5rem] border border-dashed border-slate-300 bg-white p-24 text-center shadow-sm">

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-4xl shadow-inner">

            👨‍⚕️

          </div>

          <h3 className="text-2xl font-bold text-slate-900">{t("doctors.emptyTitle")}</h3>

          <p className="mx-auto mt-3 max-w-md text-slate-500">{t("doctors.emptyText")}</p>

        </div>

      ) : (

        <>

          <div className="space-y-4">
            {filteredDoctors.map((doctor) => (
              <DoctorListCard
                key={doctor._id}
                doctor={doctor}
                onBook={openBooking}
                onVideoConsult={openVideoConsult}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="rounded-xl border border-brand-200 bg-white px-8 py-3 text-sm font-semibold text-brand-700 shadow-sm transition hover:border-brand-400 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingMore
                  ? t("doctors.loadingMore")
                  : t("doctors.loadMore", { count: doctorsTotal - doctors.length })}
              </button>
            </div>
          )}

          <p className="text-center text-xs text-slate-500">
            {t("doctors.showingCount", { shown: filteredDoctors.length, total: doctors.length })}
          </p>

        </>

      )}



      {bookingDoctor && (

        <DoctorBookingModal

          doctor={bookingDoctor}

          onClose={() => setBookingDoctor(null)}

          onBooked={() => {

            setBookingDoctor(null);

            navigate("/dashboard");

          }}

        />

      )}



      <BackToTop />

    </div>

  );

};



export default DoctorsPage;


