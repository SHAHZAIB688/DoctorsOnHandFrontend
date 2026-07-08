import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en/translation.json";
import enDash from "../locales/en/dashboard.json";
import ur from "../locales/ur/translation.json";
import urDash from "../locales/ur/dashboard.json";

const enMerged = { ...en, ...enDash };
const urMerged = { ...ur, ...urDash };

export const LANG_STORAGE_KEY = "doctorsonhand-lang";

export function syncDocumentLang(lng) {
  const isUr = lng === "ur";
  document.documentElement.lang = isUr ? "ur" : "en";
  document.documentElement.dir = isUr ? "rtl" : "ltr";
}

const saved = typeof localStorage !== "undefined" ? localStorage.getItem(LANG_STORAGE_KEY) : null;
const initialLng = saved === "ur" ? "ur" : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enMerged },
    ur: { translation: urMerged },
  },
  lng: initialLng,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

syncDocumentLang(i18n.language);

i18n.on("languageChanged", (lng) => {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lng);
  } catch {
    /* ignore */
  }
  syncDocumentLang(lng);
});

export default i18n;
