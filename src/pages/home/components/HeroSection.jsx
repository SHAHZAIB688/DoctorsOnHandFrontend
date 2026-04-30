import { Link } from "react-router-dom";

const HeroSection = ({ heroImages, currentImage }) => (
  <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-cyan-600 px-6 py-12 text-white shadow-xl lg:px-12">
    <div className="grid items-center gap-8 lg:grid-cols-2">
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-100">Trusted Digital Care</p>
        <h1 className="text-3xl font-bold leading-tight md:text-5xl">Book Appointments with Trusted Doctors</h1>
        <p className="mt-4 max-w-xl text-base text-cyan-50 md:text-lg">
          Find specialists, book in seconds, and stay updated with secure healthcare reminders and notifications.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/doctors" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 shadow hover:bg-cyan-50">
            Find Doctors
          </Link>
          <Link to="/dashboard" className="rounded-xl border border-white/60 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
            Book Appointment
          </Link>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative h-72 w-full max-w-md">
          {heroImages.map((img, index) => (
            <img
              key={img}
              src={img}
              alt={`Doctor consultation ${index + 1}`}
              className={`absolute left-0 top-0 h-full w-full rounded-2xl object-cover shadow-2xl ring-4 ring-white/20 transition-opacity duration-1000 ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
