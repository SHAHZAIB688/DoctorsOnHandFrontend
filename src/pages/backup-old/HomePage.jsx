import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import patient, { buildBackendAssetUrl } from "../../api/client";
import Loader from "../../components/Loader";
import WhyChooseUsSection from "../../components/WhyChooseUsSection";

const TOP_SPECIALITIES = [
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Pediatrician",
  "General Physician",
  "Gynecologist",
];

const HOW_IT_WORKS_STEPS = [
  { title: "Search Doctors", text: "Browse specialists by category, reviews, and availability." },
  { title: "View Profile", text: "Open detailed doctor profile with fees, bio, and patient feedback." },
  { title: "Book Appointment", text: "Select a date and available slot in seconds." },
  { title: "Consult & Follow Up", text: "Complete consultation and manage reports with reminders." },
];

const FAQ_ITEMS = [
  {
    q: "How do I book an appointment?",
    a: "Go to Doctors, open a doctor's detail page, choose date/time slot, and confirm booking.",
  },
  {
    q: "Are doctors verified on DoctorsOnHand?",
    a: "Yes, listed doctors are verified before they become available for patient booking.",
  },
  {
    q: "Can I pay online for consultations?",
    a: "Yes, Stripe checkout is integrated for secure online consultation payments.",
  },
  {
    q: "Can I update my health summary anytime?",
    a: "Yes, patient dashboard includes a Health Summary tab where you can edit details anytime.",
  },
];

const formatConsultationFee = (fee) => {
  if (!fee || fee === 0) return "Free";
  return `PKR ${fee}`;
};

const HomePage = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await patient.get("/doctors");
        setDoctors(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Unable to load featured doctors");
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const featuredDoctors = useMemo(() => doctors.slice(0, 3), [doctors]);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/doctors?search=${encodeURIComponent(q)}` : "/doctors");
  };

  return (
    <div className="space-y-16 pb-8">
      {/* Hero Section */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-cyan-600 px-6 py-12 text-white shadow-xl lg:px-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-100">Trusted Digital Care</p>
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">Book Appointments with Trusted Doctors</h1>
            <p className="mt-4 max-w-xl text-base text-cyan-50 md:text-lg">
              Find specialists, book in seconds, and stay updated with secure healthcare reminders and notifications.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/doctors" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 shadow hover:bg-cyan-50">Find Doctors</Link>
              <Link to="/dashboard" className="rounded-xl border border-white/60 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Book Appointment</Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative h-72 w-full max-w-md">
              {heroImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Doctor consultation ${index + 1}`}
                  className={`absolute left-0 top-0 h-full w-full rounded-2xl object-cover shadow-2xl ring-4 ring-white/20 transition-opacity duration-1000 ${index === currentImage ? "opacity-100" : "opacity-0"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <form onSubmit={submitSearch} className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctors by name or speciality..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
          <button
            type="submit"
            className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Search Doctors
          </button>
        </form>
      </section>

      {/* Top Specialities */}
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Top Specialities</h2>
          <p className="mt-1 text-sm text-slate-600">Explore common healthcare specialities quickly.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOP_SPECIALITIES.map((speciality) => (
            <Link
              key={speciality}
              to="/doctors"
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 hover:shadow"
            >
              {speciality}
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUsSection />

      {/* How It Works */}
      <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">How It Works</h2>
          <p className="mt-1 text-sm text-slate-600">Get appointment-ready in four simple steps.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <article key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Step {index + 1}</p>
              <h3 className="mt-1 text-base font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Featured Doctors</h2>
          <p className="mt-1 text-sm text-slate-600">Meet our most trusted specialists.</p>
        </div>
        {loadingDoctors ? (
          <div className="flex h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <Loader />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredDoctors.map((doctor) => (
              <article key={doctor._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <img
                  src={doctor.image ? buildBackendAssetUrl(doctor.image) : `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(doctor.user?.name || "Doctor")}`}
                  alt={doctor.user?.name || "Doctor"}
                  className="h-44 w-full rounded-xl bg-slate-100 object-cover"
                />
                <h3 className="mt-4 text-lg font-bold text-slate-900">Dr. {doctor.user?.name}</h3>
                <p className="text-sm text-brand-700">{doctor.specialization}</p>
                <div className="mt-3 space-y-1 text-sm text-slate-600">
                  <p>Experience: {doctor.experienceYears || 0} years</p>
                  <p>Rating: {Number(doctor.averageRating || 0).toFixed(1)} / 5.0</p>
                  <p className="font-semibold text-brand-600">Fee: {formatConsultationFee(doctor.consultationFee)}</p>
                </div>
                <Link to={`/doctors/${doctor._id}`} className="mt-4 inline-block w-full rounded-xl bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-brand-700">
                  View Details
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="space-y-12 py-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">What Our Patients Say</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Real stories from people who have experienced a better way to manage their healthcare with DoctorsOnHand.
          </p>
        </div>
        <div className="relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 before:bg-gradient-to-r before:from-slate-50 before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 after:bg-gradient-to-l after:from-slate-50 after:to-transparent">
          <div className="animate-marquee flex gap-8 py-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-8">
                {[
                  {
                    "name": "Ali Raza",
                    "role": "Patient",
                    "image": "https://randomuser.me/api/portraits/men/32.jpg",
                    "content": "DoctorsOnHand ne meri appointments manage karna bohat easy bana diya hai. Ab line mein wait nahi karna parta aur doctors bhi bohat professional hain.",
                    "rating": 5
                  },
                  {
                    "name": "Fatima Ahmed",
                    "role": "Patient",
                    "image": "https://randomuser.me/api/portraits/women/44.jpg",
                    "content": "Mujhe WhatsApp notifications ka feature bohat pasand aaya. Har appointment ka reminder mil jata hai, jo bohat helpful hai.",
                    "rating": 5
                  },
                  {
                    "name": "Usman Khan",
                    "role": "Patient",
                    "image": "https://randomuser.me/api/portraits/men/76.jpg",
                    "content": "Interface simple aur user-friendly hai. Main easily apni family ke liye appointments book kar leta hoon. Bohat acha system hai.",
                    "rating": 4
                  },
                  {
                    "name": "Ayesha Malik",
                    "role": "Patient",
                    "image": "https://randomuser.me/api/portraits/women/68.jpg",
                    "content": "Security features dekh kar mujhe confidence mila ke meri personal information safe hai. Yeh ek modern aur reliable healthcare platform hai.",
                    "rating": 5
                  },
                  {
                    "name": "Hassan Ali",
                    "role": "Patient",
                    "image": "https://randomuser.me/api/portraits/men/51.jpg",
                    "content": "Online booking system bohat fast hai aur doctors ka selection bhi wide hai. Time aur effort dono bach jate hain.",
                    "rating": 4
                  }
                ].map((item, index) => (
                  <div key={index} className="group relative flex w-[350px] flex-shrink-0 flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-2xl text-white opacity-0 transition-opacity group-hover:opacity-100">
                      "
                    </div>
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-2xl object-cover ring-4 ring-brand-50 transition-transform group-hover:scale-105"
                      />
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{item.name}</h4>
                        <p className="text-sm font-medium text-brand-600">{item.role}</p>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-1 text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <span key={i} className="text-xl">★</span>
                      ))}
                    </div>
                    <p className="mt-4 text-slate-600 leading-relaxed italic">
                      "{item.content}"
                    </p>
                    <div className="mt-6 h-1 w-12 rounded-full bg-brand-100 transition-all group-hover:w-full group-hover:bg-brand-600"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">FAQ</h2>
          <p className="mt-1 text-sm text-slate-600">Answers to common patient questions.</p>
        </div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <article key={item.q} className="overflow-hidden rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between bg-white px-4 py-3 text-left"
                >
                  <span className="text-sm font-semibold text-slate-900">{item.q}</span>
                  <span className="text-lg text-slate-400">{isOpen ? "-" : "+"}</span>
                </button>
                {isOpen && <p className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">{item.a}</p>}
              </article>
            );
          })}
        </div>
      </section>

      {/* Call To Action */}
      <section className="rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-cyan-600 px-6 py-10 text-center text-white shadow-xl md:px-10">
        <h2 className="text-2xl font-bold md:text-3xl">Ready to Book Your Next Consultation?</h2>
        <p className="mt-2 text-sm text-cyan-50 md:text-base">
          Join DoctorsOnHand and connect with trusted doctors in minutes.
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
    </div>
  );
};

export default HomePage;

