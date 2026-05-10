import { useTranslation } from "react-i18next";

const FaqSection = ({ items, openIndex, setOpenIndex }) => {
  const { t } = useTranslation();
  return (
    <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{t("home.faqTitle")}</h2>
        <p className="mt-1 text-sm text-slate-600">{t("home.faqSubtitle")}</p>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <article key={item.q} className="overflow-hidden rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between bg-white px-4 py-3 text-start"
              >
                <span className="text-sm font-semibold text-slate-900">{item.q}</span>
                <span className="text-lg text-slate-400">{isOpen ? "-" : "+"}</span>
              </button>
              {isOpen && <p className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">{item.a}</p>}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default FaqSection;
