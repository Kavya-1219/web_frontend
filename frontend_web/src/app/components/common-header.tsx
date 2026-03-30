import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

interface CommonHeaderProps {
  title: string;
  subtitle?: string;
  gradientClass: string;
  icon?: React.ReactNode;
  onBack?: () => void;
}

export function CommonHeader({ title, subtitle, gradientClass, icon, onBack }: CommonHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className={`relative w-full h-[260px] ${gradientClass} rounded-b-[40px] px-6 pt-12 pb-8 shadow-lg overflow-hidden`}>
      {/* Background Decorative Circles (matching Android feel) */}
      <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-black/5 rounded-full blur-2xl"></div>

      <div className="relative z-10 max-w-6xl mx-auto h-full flex flex-col justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack || (() => navigate(-1))}
            className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl text-white transition-all transform active:scale-95 shadow-sm border border-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-auto pb-4">
          <div className="flex items-center gap-3 mb-1">
            {icon && <div className="text-white">{icon}</div>}
            <h1 className="text-3xl font-black text-white tracking-tight">{title}</h1>
          </div>
          {subtitle && (
            <p className="text-white/80 text-lg font-medium tracking-wide ml-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
