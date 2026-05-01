import AccountProfileForm from "../../../components/AccountProfileForm";

const PatientSettingsSection = ({ refreshUser }) => (
  <AccountProfileForm
    refreshUser={refreshUser}
    title="Settings"
    description="Update your account details and password."
    idPrefix="patient-settings"
    sectionClassName="lg:col-span-2"
    loaderClassName="flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-200 bg-white lg:col-span-2"
  />
);

export default PatientSettingsSection;
