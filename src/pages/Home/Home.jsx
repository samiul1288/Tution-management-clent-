import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import CategoriesSection from "../components/CategoriesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import LatestTuitionsSection from "../components/LatestTuitionsSection";
import LatestTutorsSection from "../components/LatestTutorsSection";
import WhyChooseUsSection from "../components/WhyChooseUsSection";
import FAQSection from "../components/FAQSection";
import NewsletterSection from "../components/NewsletterSection";
import CTASection from "../components/CTASection";

const Home = () => {
  return (
    <div className="space-y-16">
      <HeroSection />

      <StatsSection />
      <CategoriesSection />

      <HowItWorksSection />

      <LatestTuitionsSection />
      <LatestTutorsSection />

      <WhyChooseUsSection />

      <FAQSection />
      <NewsletterSection />
      <CTASection />
    </div>
  );
};

export default Home;
