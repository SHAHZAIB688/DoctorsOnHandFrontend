import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LogoImg from "../assets/logo2.jpeg";
import { useAuth } from "../state/AuthContext";
import { DashboardIcon, LogoutIcon, ChevronDownIcon } from "../icons";
import LanguageSwitcher from "./LanguageSwitcher";
import LocationHeaderControls from "./LocationHeaderControls";

const Header = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHideRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  if (isHideRoute) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <img src={LogoImg} alt={t("header.logoAlt")} className="h-10 w-10 shrink-0 rounded-lg" />
          <Link to="/" className="truncate text-xl font-extrabold tracking-tight text-brand-700">
            Perscripto
          </Link>
        </div>
        <nav className="hidden items-center gap-7 md:flex">
          <NavLink className="text-sm font-medium text-slate-600 hover:text-brand-700" to="/" end>
            {t("nav.home")}
          </NavLink>
          <NavLink className="text-sm font-medium text-slate-600 hover:text-brand-700" to="/doctors">
            {t("nav.findDoctors")}
          </NavLink>
          <NavLink className="text-sm font-medium text-slate-600 hover:text-brand-700" to="/about">
            {t("nav.about")}
          </NavLink>
          <NavLink className="text-sm font-medium text-slate-600 hover:text-brand-700" to="/contact">
            {t("nav.contact")}
          </NavLink>
          {user && (
            <NavLink className="text-sm font-medium text-slate-600 hover:text-brand-700" to="/dashboard">
              {t("nav.dashboard")}
            </NavLink>
          )}
        </nav>
        <div className="flex shrink-0 items-center gap-2 md:gap-4">
          <LocationHeaderControls />
          <LanguageSwitcher />
          {!user ? (
            <>
              <Link
                to="/login"
                className="hidden text-sm font-bold text-slate-600 transition-colors hover:text-brand-600 md:block"
              >
                {t("nav.login")}
              </Link>
              <Link
                to="/signup"
                className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-brand-100 transition-all hover:bg-brand-700 hover:-translate-y-0.5 active:translate-y-0 sm:px-6 sm:py-2.5"
              >
                {t("nav.joinNow")}
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-brand-600 hover:shadow-md active:scale-95"
                onClick={() => setOpen((prev) => !prev)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-xs font-bold uppercase text-white">
                  {user.name?.[0]}
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
                <ChevronDownIcon className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
              </button>
              {open && (
                <div className="absolute end-0 mt-3 w-64 animate-in fade-in zoom-in-95 slide-in-from-top-2 overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-2 shadow-2xl duration-200">
                  <div className="mb-1 border-b border-slate-50 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t("header.account")}</p>
                    <p className="truncate text-sm font-bold text-slate-900">{user.email || t("header.userAccount")}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-brand-600"
                    onClick={() => setOpen(false)}
                  >
                    <DashboardIcon className="h-5 w-5 text-slate-400 group-hover:text-brand-600" />
                    {t("nav.dashboard")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="group mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-start text-sm font-bold text-rose-600 transition-all hover:bg-rose-50"
                  >
                    <LogoutIcon className="h-5 w-5 text-rose-400 group-hover:text-rose-600" />
                    {t("header.logout")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
