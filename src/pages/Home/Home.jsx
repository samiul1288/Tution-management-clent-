import HeroSection from "../components/HeroSection";
import HowItWorksSection from "../components/HowItWorksSection";
import LatestTuitionsSection from "../components/LatestTuitionsSection";
import LatestTutorsSection from "../components/LatestTutorsSection";
import WhyChooseUsSection from "../components/WhyChooseUsSection";

const Home = () => {
  return (
    <div className="space-y-16">
      <HeroSection />
      <LatestTuitionsSection />
      <LatestTutorsSection />
      <HowItWorksSection/>
      <WhyChooseUsSection />
    </div>
  );
};

export default Home;
