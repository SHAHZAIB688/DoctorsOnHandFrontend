import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import client, { buildBackendAssetUrl } from "../../api/client";
import Loader from "../../components/Loader";
import SearchInput from "../../components/SearchInput";
import CategoryDropdown from "../../components/CategoryDropdown";
import SearchButton from "../../components/SearchButton";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [experience, setExperience] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await client.get("/doctors");
        setDoctors(data || []);
        setFilteredDoctors(data || []);
      } catch (error) {
        toast.error("Unable to load doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    let result = doctors;
    if (category !== "All") {
      result = result.filter(doc => doc.specialization === category);
    }
    if (experience !== "All") {
      result = result.filter(doc => {
        const years = doc.experienceYears || 5;
        if (experience === "0-5") return years <= 5;
        if (experience === "6-10") return years > 5 && years <= 10;
        if (experience === "10+") return years > 10;
        return true;
      });
    }
    if (availability !== "All") {
      result = result.filter(doc => {
        // This would need to be implemented based on actual availability data
        return true; // Placeholder for now
      });
    }
    if (search) {
      result = result.filter(doc =>
        doc.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredDoctors(result);
  }, [search, category, experience, availability, doctors]);

  const ALL_SPECIALIZATIONS = [
  "All",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "General Physician",
  "Gynecologist",
  "Ophthalmologist",
  "ENT Specialist",
  "Psychiatrist",
  "Oncologist",
  "Endocrinologist",
  "Gastroenterologist",
  "Pulmonologist",
  "Rheumatologist",
  "Nephrologist",
  "Urologist",
  "Anesthesiologist",
  "Radiologist",
  "Pathologist"
];

const categories = ["All", ...new Set(doctors.map(doc => doc.specialization))];
  
  const EXPERIENCE_OPTIONS = ["All", "0-5", "6-10", "10+"];
  const AVAILABILITY_OPTIONS = [
    "All",
    "Monday",
    "Tuesday", 
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
    "Available Today",
    "Available This Week",
    "Weekend Only"
  ];

  
  const handleSearch = () => {
    setSearchLoading(true);
    // Simulate search delay
    setTimeout(() => {
      setSearchLoading(false);
    }, 500);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setExperience("All");
    setAvailability("All");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <section className="mb-8 flex flex-col gap-2 justify-center items-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Find Your Specialist</h1>
        <p className="mt-2 text-slate-600">Search through our verified network of expert doctors.</p>
      </section>

      {/* Search and Filter Section - Single Row */}
      <section className="mb-6">
        <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, specialty or clinic..."
            className="flex-1 min-w-[200px]"
          />
          
          <CategoryDropdown
            value={experience}
            onChange={setExperience}
            options={EXPERIENCE_OPTIONS}
            placeholder="Experience"
            className="w-32 rounded-lg bg-white hover:border-brand-300 transition-colors"
          />
          
          <CategoryDropdown
            value={availability}
            onChange={setAvailability}
            options={AVAILABILITY_OPTIONS}
            placeholder="Availability"
            className="w-36 rounded-lg bg-white hover:border-brand-300 transition-colors"
          />

          <button
            onClick={resetFilters}
            className="px-3 py-2.5 text-sm font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors whitespace-nowrap border border-slate-200"
          >
            Reset
          </button>

          <SearchButton
            onClick={handleSearch}
            loading={searchLoading}
            className="px-4"
          />
        </div>
      </section>

      {loading ? (
        <div className="flex h-80 items-center justify-center rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader />
            <p className="text-sm font-medium text-slate-500">Fetching verified doctors...</p>
          </div>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="rounded-[2.5rem] border border-dashed border-slate-300 bg-white p-24 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-4xl shadow-inner mb-6">
            👨‍⚕️
          </div>
          <h3 className="text-2xl font-bold text-slate-900">No doctors match your criteria</h3>
          <p className="mt-3 text-slate-500 max-w-md mx-auto">We couldn't find any specialists matching your search. Try changing the category or clearing your search.</p>
          
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <article key={doctor._id} className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-60 overflow-hidden rounded-[1.5rem] bg-slate-50 border border-slate-100">
                <img
                  src={doctor.image ? buildBackendAssetUrl(doctor.image) : `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(doctor.user?.name || "Doctor")}`}
                  alt={doctor.user?.name || "Doctor"}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-emerald-600 backdrop-blur shadow-sm flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Verified Professional
                </div>
              </div>
              <div className="mt-8 flex flex-col flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">Dr. {doctor.user?.name}</h3>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-brand-500">{doctor.specialization}</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-600 border border-amber-100">
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
                    <p className="text-sm font-bold text-slate-700 text-emerald-600">Mon - Fri</p>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <Link to={`/doctors/${doctor._id}`} className="flex items-center justify-center gap-2 w-full rounded-2xl bg-brand-600 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-brand-700 active:scale-[0.98] group-hover:shadow-brand-200">
                    View Details
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;

