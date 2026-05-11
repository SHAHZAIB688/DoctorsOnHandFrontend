import { useTranslation } from "react-i18next";
import { MapPinIcon, XMarkIcon } from "../icons";
import { useBrowserLocation } from "../state/BrowserLocationContext";

/**
 * Map-pin control + optional coordinate label for site header and dashboard top bar.
 */
const LocationHeaderControls = ({ className = "" }) => {
  const { t } = useTranslation();
  const { status, lat, lng, placeLabel, requestLocation, clear } = useBrowserLocation();

  const onPin = () => {
    void requestLocation();
  };

  const coordsTitle =
    status === "ready" && lat != null && lng != null
      ? `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`
      : null;

  const pinActive = status === "ready";
  const pinBusy = status === "loading";
  const showLabel = pinActive && placeLabel;

  return (
    <div
      className={`flex items-center gap-1 rounded-xl border border-slate-200/90 bg-white/90 px-1 py-0.5 shadow-sm ${className}`.trim()}
      title={coordsTitle || placeLabel || t("header.locationHint")}
    >
      <button
        type="button"
        onClick={onPin}
        disabled={pinBusy}
        aria-label={t("header.locationPinAria")}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-50 ${
          pinActive ? "bg-emerald-600 text-white hover:bg-emerald-700" : "text-slate-600 hover:bg-slate-100 hover:text-brand-700"
        }`}
      >
        {pinBusy ? (
          <span
            className={`h-4 w-4 animate-spin rounded-full border-2 ${
              pinActive ? "border-white/30 border-t-white" : "border-slate-200 border-t-brand-600"
            }`}
          />
        ) : (
          <MapPinIcon className="h-5 w-5" />
        )}
      </button>
      {showLabel && (
        <span className="hidden max-w-[10rem] truncate px-0.5 text-[11px] font-semibold text-slate-600 sm:inline md:max-w-[16rem]">
          {placeLabel}
        </span>
      )}
      {pinActive && (
        <button
          type="button"
          onClick={clear}
          aria-label={t("header.locationClearAria")}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default LocationHeaderControls;
