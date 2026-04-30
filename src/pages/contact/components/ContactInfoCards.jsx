import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon } from "../../../icons";

const CONTACT_ITEMS = [
  { icon: MailIcon, label: "Email Us", val: "mawaisacu@gmail.com" },
  { icon: PhoneIcon, label: "Call Us", val: "+92 308 1830956" },
  { icon: MapPinIcon, label: "Visit Us", val: "Tufail Road Saddar Lahore Cantt." },
  { icon: ClockIcon, label: "Office Hours", val: "Mon - Fri, 9am - 6pm" },
];

const ContactInfoCards = () => (
  <div className="grid gap-6 sm:grid-cols-2">
    {CONTACT_ITEMS.map((item) => (
      <div key={item.label} className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-brand-200 hover:shadow-xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-brand-600 group-hover:text-white group-hover:scale-110 duration-300">
          <item.icon className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.label}</h4>
        <p className="mt-2 font-bold text-slate-900">{item.val}</p>
      </div>
    ))}
  </div>
);

export default ContactInfoCards;
