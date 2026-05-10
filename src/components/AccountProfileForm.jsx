import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import patient from "../api/client";
import Loader from "./Loader";

const AccountProfileForm = ({
  refreshUser,
  onSaved,
  title,
  description,
  idPrefix = "account",
  sectionClassName = "",
  loaderClassName = "flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-200 bg-white",
}) => {
  const { t } = useTranslation();
  const heading = title ?? t("dash.accountForm.sectionTitle");
  const sub = description ?? t("dash.accountForm.sectionDescription");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await patient.get("/auth/me");
        if (cancelled) return;
        setForm((prev) => ({
          ...prev,
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        }));
      } catch {
        toast.error(t("dash.accountForm.loadFail"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const save = async (e) => {
    e.preventDefault();
    if (form.newPassword || form.confirmPassword || form.currentPassword) {
      if (form.newPassword !== form.confirmPassword) {
        toast.error(t("dash.accountForm.passwordMismatch"));
        return;
      }
      if (!form.currentPassword) {
        toast.error(t("dash.accountForm.currentRequired"));
        return;
      }
      if (form.newPassword.length < 6) {
        toast.error(t("dash.accountForm.passwordShort"));
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      await patient.put("/auth/profile", payload);
      toast.success(t("dash.accountForm.updated"));
      await refreshUser();
      onSaved?.();
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || t("dash.accountForm.updateFail"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={loaderClassName}>
        <Loader />
      </div>
    );
  }

  const pid = (field) => `${idPrefix}-${field}`;

  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${sectionClassName}`.trim()}>
      <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{heading}</h3>
      <p className="mt-1 text-sm text-slate-600">{sub}</p>

      <form onSubmit={save} className="mt-6 grid max-w-xl gap-4">
        <div>
          <label htmlFor={pid("name")} className="mb-1 block text-sm font-medium text-slate-700">
            {t("dash.accountForm.fullName")}
          </label>
          <input
            id={pid("name")}
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div>
          <label htmlFor={pid("email")} className="mb-1 block text-sm font-medium text-slate-700">
            {t("dash.accountForm.email")}
          </label>
          <input
            id={pid("email")}
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div>
          <label htmlFor={pid("phone")} className="mb-1 block text-sm font-medium text-slate-700">
            {t("dash.accountForm.phone")}
          </label>
          <input
            id={pid("phone")}
            type="tel"
            required
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-sm font-semibold text-slate-800">{t("dash.accountForm.changePassword")}</p>
          <p className="mt-0.5 text-xs text-slate-500">{t("dash.accountForm.passwordHint")}</p>
        </div>
        <div>
          <label htmlFor={pid("current-password")} className="mb-1 block text-sm font-medium text-slate-700">
            {t("dash.accountForm.currentPassword")}
          </label>
          <input
            id={pid("current-password")}
            type="password"
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={(e) => setForm((p) => ({ ...p, currentPassword: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div>
          <label htmlFor={pid("new-password")} className="mb-1 block text-sm font-medium text-slate-700">
            {t("dash.accountForm.newPassword")}
          </label>
          <input
            id={pid("new-password")}
            type="password"
            autoComplete="new-password"
            value={form.newPassword}
            onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div>
          <label htmlFor={pid("confirm-password")} className="mb-1 block text-sm font-medium text-slate-700">
            {t("dash.accountForm.confirmPassword")}
          </label>
          <input
            id={pid("confirm-password")}
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {saving ? t("dash.accountForm.saving") : t("dash.accountForm.saveAccount")}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AccountProfileForm;
