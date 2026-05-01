import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import LogoImg from "../../assets/logo2.jpeg";
import { useAuth } from "../../state/AuthContext";
import VerificationModal from "../../components/VerificationModal";
import Dropdown from "../../components/Dropdown";
import AuthBrandPanel from "../auth/components/AuthBrandPanel";

const SPECIALIZATIONS = [
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "HVAC Technician",
  "General Technician",
];

const ROLES = [
  { value: "patient", label: "Join as Patient" },
  { value: "doctor", label: "Join as Skilled Doctor" },
];

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "patient",
    specialization: "General Technician",
    experience: "",
    degreeFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => {
    const name = e.target.name;
    const file = e.target.files ? e.target.files[0] : null;

    if (name === "image" && file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const ratio = img.width / img.height;
        if (img.width < 400 || img.height < 400) {
          toast.error("Image must be at least 400x400 pixels");
          e.target.value = "";
          return;
        }
        if (ratio < 0.7 || ratio > 1.3) {
          toast.error("Please upload a square or portrait image (Aspect Ratio 1:1 or 4:5)");
          e.target.value = "";
          return;
        }
        setForm((p) => ({ ...p, [name]: file }));
      };
      return;
    }

    const value = e.target.type === "file" ? e.target.files[0] : e.target.value;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onDropdownChange = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      if (form.role === "doctor") {
        setShowVerificationModal(true);
      } else {
        toast.success("Welcome to Perscripto");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6 md:p-12">
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] bg-white shadow-2xl md:flex-row min-h-fit">
        <AuthBrandPanel logoSrc={LogoImg} />

        <div className="flex w-full flex-col justify-center px-6 sm:px-8 md:px-12 py-6 sm:py-8 md:w-[60%]">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Sign Up</h2>
            <div className="mt-2 h-1 w-10 rounded-full bg-brand-600" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="name"
                placeholder="Full Name"
                onChange={onChange}
                required
                className="w-full border-b border-slate-200 py-2 sm:py-3 text-sm outline-none transition-colors focus:border-brand-600"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                onChange={onChange}
                required
                className="w-full border-b border-slate-200 py-2 sm:py-3 text-sm outline-none transition-colors focus:border-brand-600"
              />
            </div>

            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={onChange}
              required
              className="w-full border-b border-slate-200 py-2 sm:py-3 text-sm outline-none transition-colors focus:border-brand-600"
            />

            <input
              name="password"
              type="password"
              placeholder="Choose Password"
              onChange={onChange}
              required
              className="w-full border-b border-slate-200 py-2 sm:py-3 text-sm outline-none transition-colors focus:border-brand-600"
            />

            <Dropdown
              options={ROLES}
              value={form.role}
              onChange={(val) => onDropdownChange("role", val)}
              placeholder="Select Role"
            />

            {form.role === "doctor" && (
              <div className="grid gap-4 animate-in slide-in-from-left-2">
                <Dropdown
                  options={SPECIALIZATIONS}
                  value={form.specialization}
                  onChange={(val) => onDropdownChange("specialization", val)}
                  placeholder="Select Service Category"
                />
                <input
                  name="experience"
                  type="number"
                  placeholder="Years of Experience"
                  onChange={onChange}
                  required
                  className="w-full border-b border-slate-200 py-2 sm:py-3 text-sm outline-none transition-colors focus:border-brand-600"
                />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Professional Photo (Headshot)</p>
                  <input name="image" type="file" accept="image/*" onChange={onChange} required className="text-xs text-slate-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Certification (PDF/Image)</p>
                  <input name="degreeFile" type="file" accept=".pdf,image/*" onChange={onChange} required className="text-xs text-slate-500" />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" required id="terms" className="h-4 w-4 rounded border-slate-300 text-brand-600" />
              <label htmlFor="terms" className="text-xs text-slate-500">
                Agreed to{" "}
                <Link to="/terms" className="font-bold text-brand-600 hover:underline">
                  Terms and Conditions
                </Link>
              </label>
            </div>

            <div className="pt-4">
              <button
                disabled={loading}
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 py-3 sm:py-4 text-sm font-bold text-white shadow-xl shadow-brand-100 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? "Processing..." : "Register"}
              </button>
            </div>
          </form>

          <div className="mt-6 sm:mt-8 text-center text-sm font-medium text-slate-500">
            <p>
              Already a member?{" "}
              <Link to="/login" className="font-bold text-brand-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <VerificationModal isOpen={showVerificationModal} onAction={() => navigate("/login")} />
    </div>
  );
};

export default SignupPage;
