import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import LogoImg from "../../assets/logo2.jpeg";
import { useAuth } from "../../state/AuthContext";
import AuthBrandPanel from "../auth/components/AuthBrandPanel";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      toast.success("Welcome back to Perscripto");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Sign In</h2>
            <div className="mt-2 h-1 w-10 rounded-full bg-brand-600" />
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="relative">
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={onChange}
                required
                className="w-full border-b border-slate-200 py-3 text-sm outline-none transition-colors focus:border-brand-600"
              />
            </div>

            <div className="relative">
              <input
                name="password"
                type="password"
                placeholder="Enter your Password"
                onChange={onChange}
                required
                className="w-full border-b border-slate-200 py-3 text-sm outline-none transition-colors focus:border-brand-600"
              />
            </div>

            <div className="pt-4">
              <button
                disabled={loading}
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 py-3 sm:py-4 text-sm font-bold text-white shadow-xl shadow-brand-100 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? "Processing..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="mt-6 sm:mt-8 text-center text-sm font-medium text-slate-500">
            <p>
              Not a member?{" "}
              <Link to="/signup" className="font-bold text-brand-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
