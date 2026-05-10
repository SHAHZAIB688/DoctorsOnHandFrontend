import { useTranslation } from "react-i18next";
import SearchInput from "../../../components/SearchInput";
import CategoryDropdown from "../../../components/CategoryDropdown";
import SearchButton from "../../../components/SearchButton";

const DoctorsFilterBar = ({
  search,
  setSearch,
  experience,
  setExperience,
  availability,
  setAvailability,
  resetFilters,
  handleSearch,
  searchLoading,
  experienceOptions,
  availabilityOptions,
}) => {
  const { t } = useTranslation();
  return (
    <section className="mb-6">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("doctors.searchPlaceholder")}
          className="min-w-[200px] flex-1"
        />

        <CategoryDropdown
          value={experience}
          onChange={setExperience}
          options={experienceOptions}
          placeholder={t("doctors.experiencePh")}
          className="w-32 rounded-lg bg-white transition-colors hover:border-brand-300"
        />

        <CategoryDropdown
          value={availability}
          onChange={setAvailability}
          options={availabilityOptions}
          placeholder={t("doctors.availabilityPh")}
          className="w-36 rounded-lg bg-white transition-colors hover:border-brand-300"
        />

        <button
          type="button"
          onClick={resetFilters}
          className="whitespace-nowrap rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
        >
          {t("doctors.reset")}
        </button>

        <SearchButton onClick={handleSearch} loading={searchLoading} className="px-4">
          {t("doctors.searchBtn")}
        </SearchButton>
      </div>
    </section>
  );
};

export default DoctorsFilterBar;
