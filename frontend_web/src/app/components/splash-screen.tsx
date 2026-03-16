import { useEffect } from "react";
import { useNavigate } from "react-router";
import logo from "figma:asset/92b2cb3a86bea6d7f9af7d0e725e0f2b7664fe56.png";

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/welcome");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-[#5CB85C] flex flex-col items-center justify-center p-6">
      {/* Logo with white circular background */}
      <div className="mb-6">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
          <img 
            src={logo} 
            alt="NutriSoul Logo" 
            className="w-20 h-20 object-contain"
          />
        </div>
      </div>
      
      {/* App Name */}
      <h1 className="text-4xl text-white mb-2 text-center font-bold">
        NutriSoul
      </h1>
      
      {/* Tagline 1 */}
      <p className="text-xl text-white text-center mb-1">
        Nutrition for your soul
      </p>
      
      {/* Tagline 2 */}
      <p className="text-lg text-white/90 text-center">
        Eat Smart. Live Healthy.
      </p>
      
      {/* Loading indicator - removed as it's not in the design */}
    </div>
  );
}