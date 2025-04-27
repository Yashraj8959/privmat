import  HeroSection  from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
export default function Home() {
  return (
    <>
        <div className="relative overflow-hidden">
            <HeroSection />

            {/* Gradient divider between hero and how it works */}
            {/* <div className="bg-gradient-to-b from-transparent to-slate-950"></div> */}

            

            {/* Gradient divider between how it works and features */}
            <div className=" bg-gradient-to-b from-slate-950 to-slate-900"><HowItWorks /></div>

            <FeaturesSection />

            
        </div>
    </>
  );
}
