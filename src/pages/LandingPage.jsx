import HeroSec from "../components/Landing/HeroSec";
import TrendingSec from "../components/Landing/TrendingSec";
import SpotlightSec from "../components/Landing/SpotlightSec";
import TunnelSec from "../components/Landing/TunnelGrid"; // Make sure the path matches your filename
import FaqSec from "../components/Landing/FaqSec";
import VerticalMosaic from "../components/Landing/VerticalMosaic";
import Footer from "../components/Landing/Footer";

export function LandingPage() {
  return (
    // overflow-x-hidden is the "Shield" that prevents layout breaking from 3D animations
    <div className="bg-[#030303] min-h-screen relative overflow-x-hidden select-none">
      {/* 01. Hook: Video background & Branding */}
      <HeroSec />

      {/* 02. Movement: Horizontal scroll of trending titles */}
      {/* <TrendingSec /> */}

      {/* 03. Interaction: 3D Mouse-tracking detail of a top movie */}
      <SpotlightSec />

      {/* 04. Immersion: The 3D depth "Tunnel" effect */}
      <TunnelSec />

      {/* 05. Intel: Clean, scannable FAQ with text-scramble effect */}
      <FaqSec />

      {/* 06. Scale: The massive vertical parallax wall */}
      <VerticalMosaic />

      {/* 07. Action: Final command prompt footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
