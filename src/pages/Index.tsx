import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CoursesSection from "@/components/CoursesSection";
import TeachersSection from "@/components/TeachersSection";
import ReviewsSection from "@/components/ReviewsSection";
import InfoBanner from "@/components/InfoBanner";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <InfoBanner />
      <CoursesSection />
      <TeachersSection />
      <AboutSection />
      <ReviewsSection />
      <Footer />
    </div>
  );
};

export default Index;
