import { useEffect, useState } from "react";
import { ArrowUpIcon } from "../icons";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 end-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-brand-200 bg-brand-600 text-white shadow-lg transition hover:bg-brand-700 hover:shadow-xl"
    >
      <ArrowUpIcon className="h-5 w-5" />
    </button>
  );
};

export default BackToTop;
