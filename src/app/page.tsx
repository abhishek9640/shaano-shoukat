import HeroSection from "@/components/HeroSection";
import CategoryShowcase from "@/components/CategoryShowcase";
import FeaturedBanner from "@/components/FeaturedBanner";
import TrendingProducts from "@/components/TrendingProducts";
import ShopByRoom from "@/components/ShopByRoom";
import BestSellers from "@/components/BestSellers";
import LifestyleBanner from "@/components/LifestyleBanner";
import NewArrivals from "@/components/NewArrivals";
import BrandStory from "@/components/BrandStory";
import InstagramGallery from "@/components/InstagramGallery";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoryShowcase />
      <FeaturedBanner />
      <TrendingProducts />
      <ShopByRoom />
      <BestSellers />
      <LifestyleBanner />
      <NewArrivals />
      <BrandStory />
      <InstagramGallery />
      <NewsletterSignup />
    </>
  );
}
