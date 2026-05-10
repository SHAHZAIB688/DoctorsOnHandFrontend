/** Translate backend appointment/user status for dashboard UI */
export function appointmentStatusLabel(status, t) {
  const key = String(status ?? "")
    .toLowerCase()
    .replace(/\s+/g, "_");
  if (!key) return "";
  const translated = t(`dash.status.${key}`, { defaultValue: "" });
  return translated || String(status ?? "");
}
