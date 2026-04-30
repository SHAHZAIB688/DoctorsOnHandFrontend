import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import client from "../../api/client";
import Loader from "../../components/Loader";
import DoctorsFilterBar from "./components/DoctorsFilterBar";
import DoctorListCard from "./components/DoctorListCard";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
    if (experience !== "All") {
      result = result.filter((doc) => {
        const years = doc.experienceYears || 5;
        if (experience === "0-5") return years <= 5;
        if (experience === "6-10") return years > 5 && years <= 10;
        if (experience === "10+") return years > 10;
        return true;
      });
    }
    if (availability !== "All") {
      result = result.filter(() => true);
    }
    if (search) {
      result = result.filter(
        (doc) =>
          doc.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          doc.specialization?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredDoctors(result);
  }, [search, experience, availability, doctors]);

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
    "Weekend Only",
  ];

  const handleSearch = () => {
    setSearchLoading(true);
    setTimeout(() => setSearchLoading(false), 500);
  };

  const resetFilters = () => {
    setSearch("");
    setExperience("All");
    setAvailability("All");
  };

  return (
    <div className="space-y-8 pb-12">
      <section className="mb-8 flex flex-col items-center justify-center gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Find Your Specialist</h1>
        <p className="mt-2 text-slate-600">Search through our verified network of expert doctors.</p>
      </section>

      <DoctorsFilterBar
        search={search}
        setSearch={setSearch}
        experience={experience}
        setExperience={setExperience}
        availability={availability}
        setAvailability={setAvailability}
        resetFilters={resetFilters}
        handleSearch={handleSearch}
        searchLoading={searchLoading}
        experienceOptions={EXPERIENCE_OPTIONS}
        availabilityOptions={AVAILABILITY_OPTIONS}
      />

      {loading ? (
        <div className="flex h-80 items-center justify-center rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader />
            <p className="text-sm font-medium text-slate-500">Fetching verified doctors...</p>
          </div>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="rounded-[2.5rem] border border-dashed border-slate-300 bg-white p-24 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-4xl shadow-inner">
            👨‍⚕️
          </div>
          <h3 className="text-2xl font-bold text-slate-900">No doctors match your criteria</h3>
          <p className="mx-auto mt-3 max-w-md text-slate-500">
            We couldn't find any specialists matching your search. Try changing the category or clearing your search.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <DoctorListCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
