import { useTranslation } from "react-i18next";
import AccountProfileForm from "../../../components/AccountProfileForm";

const PatientSettingsSection = ({ refreshUser }) => {
  const { t } = useTranslation();

  return (
    <AccountProfileForm
      refreshUser={refreshUser}
      title={t("dash.patient.settings.title")}
      description={t("dash.patient.settings.description")}
      idPrefix="patient-settings"
      sectionClassName="lg:col-span-2"
      loaderClassName="flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-200 bg-white lg:col-span-2"
    />
  );
};

export default PatientSettingsSection;
