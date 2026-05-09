import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import patient from "../../api/client";
import WhyChooseUsSection from "../../components/WhyChooseUsSection";
import HeroSection from "./components/HeroSection";
import SearchBarSection from "./components/SearchBarSection";
import TopSpecialitiesSection from "./components/TopSpecialitiesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import FeaturedDoctorsSection from "./components/FeaturedDoctorsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FaqSection from "./components/FaqSection";
import CtaSection from "./components/CtaSection";
import { HERO_IMAGES, TOP_SPECIALITIES, HOW_IT_WORKS_STEPS, FAQ_ITEMS, TESTIMONIALS } from "./components/HomeConstants";

const formatConsultationFee = (fee) => (!fee || fee === 0 ? "Free" : `PKR ${fee}`);

const HomePage = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await patient.get("/doctors");
        setDoctors(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Unable to load featured doctors");
      } finally {
        setLoadingDoctors(false);
      }
    };
    
    fetchDoctors();
    // Refresh doctors list every 30 seconds to reflect specialization changes
    const intervalId = setInterval(fetchDoctors, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const featuredDoctors = useMemo(() => doctors.slice(0, 3), [doctors]);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/doctors?search=${encodeURIComponent(q)}` : "/doctors");
  };

  return (
    <div className="space-y-16 pb-8">
      <HeroSection heroImages={HERO_IMAGES} currentImage={currentImage} />
      <SearchBarSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSubmit={submitSearch} />
      <TopSpecialitiesSection specialities={TOP_SPECIALITIES} />
      <WhyChooseUsSection />
      <HowItWorksSection steps={HOW_IT_WORKS_STEPS} />
      <FeaturedDoctorsSection
        loadingDoctors={loadingDoctors}
        featuredDoctors={featuredDoctors}
        formatConsultationFee={formatConsultationFee}
      />
      <TestimonialsSection testimonials={TESTIMONIALS} />
      <FaqSection items={FAQ_ITEMS} openIndex={openFaqIndex} setOpenIndex={setOpenFaqIndex} />
      <CtaSection />
    </div>
  );
};

export default HomePage;
