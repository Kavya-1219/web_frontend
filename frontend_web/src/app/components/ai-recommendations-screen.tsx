import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Sparkles, Target, Heart, Brain, TrendingUp, Apple, Zap, ArrowLeft, Loader2, Star, ShieldCheck, Droplets, Lightbulb, CheckCircle2, History } from "lucide-react";
import api, { endpoints } from "../helpers/api";
import { CommonHeader } from "./common-header";

interface Recommendation {
  title: string;
  description: string;
  icon: any;
  iconBg: string;
  iconTint: string;
  cardBg: string;
  borderColor: string;
}

export function AIRecommendationsScreen() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userName, setUserName] = useState("");
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const profileRes = await api.get(endpoints.home);
      const profile = profileRes.data;
      setUserName(profile.display_name || profile.full_name || profile.name || 'User');
      setGoal(profile.goal ? profile.goal.replace('-', ' ') : profile.health_goal || 'General Health');

      const tipsRes = await api.get(endpoints.aiTips);
      let rawTips = [];
      if (tipsRes.data) {
        if (Array.isArray(tipsRes.data)) {
          rawTips = tipsRes.data;
        } else if (tipsRes.data.recommendations && Array.isArray(tipsRes.data.recommendations)) {
          rawTips = tipsRes.data.recommendations;
        } else if (tipsRes.data.tips && Array.isArray(tipsRes.data.tips)) {
          rawTips = tipsRes.data.tips;
        }
      }

      if (rawTips.length > 0) {
        const backendRecs = rawTips.map((tip: any) => ({
          title: tip.title || tip.name || "Health Tip",
          description: tip.description || tip.text || "",
          icon: getIconComponent(tip.icon || tip.icon_name),
          iconBg: tip.iconBg || tip.icon_bg || "#F3E8FF",
          iconTint: tip.iconTint || tip.icon_tint || "#8B5CF6",
          cardBg: tip.cardBg || tip.card_bg || "#FFFFFF",
          borderColor: tip.borderColor || tip.border_color || "#E5E7EB"
        }));
        setRecommendations(backendRecs);
      }
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    if (!iconName) return Sparkles;
    const name = iconName.toLowerCase();
    if (name.includes('star')) return Star;
    if (name.includes('heart') || name.includes('favorite')) return Heart;
    if (name.includes('shield') || name.includes('safety')) return ShieldCheck;
    if (name.includes('water') || name.includes('drop')) return Droplets;
    if (name.includes('trend') || name.includes('up')) return TrendingUp;
    if (name.includes('apple') || name.includes('food')) return Apple;
    if (name.includes('zap') || name.includes('bolt') || name.includes('energy')) return Zap;
    if (name.includes('light') || name.includes('bulb') || name.includes('idea')) return Lightbulb;
    if (name.includes('brain') || name.includes('mental')) return Brain;
    if (name.includes('check')) return CheckCircle2;
    if (name.includes('history') || name.includes('time')) return History;
    return Sparkles;
  };

  if (isLoading && recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <CommonHeader 
        title="AI Recommendations" 
        subtitle="Intelligent insights for your health"
        gradientClass="bg-ai-gradient"
        icon={<Sparkles className="w-8 h-8" />}
      />

      <div className="max-w-4xl mx-auto px-6">
        <div className="relative -mt-32 z-20 space-y-8">
          
          {/* Personalized Greeting */}
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl p-8 border border-gray-100 dark:border-gray-700">
             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">Personalized Insights For</p>
             <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{userName}</h2>
          </div>

          {/* Goal Card (Android Style) */}
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[1.5rem] bg-ai-gradient flex items-center justify-center text-white shadow-lg">
                <Target className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Your Current Goal</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white capitalize mb-1">{goal}</h3>
                <p className="text-xs font-bold text-gray-500 leading-tight">These recommendations are tailored to help you achieve your goal safely.</p>
              </div>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="space-y-6">
            <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight px-2">Your Personalized Plan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec, i) => {
                const Icon = rec.icon;
                return (
                  <div 
                    key={i} 
                    style={{ backgroundColor: rec.cardBg, borderColor: rec.borderColor }}
                    className="rounded-[2.5rem] border-2 p-8 shadow-xl flex flex-col items-start min-h-[220px] transition-transform hover:scale-[1.02]"
                  >
                    <div 
                      style={{ backgroundColor: rec.iconBg }}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
                    >
                      <Icon style={{ color: rec.iconTint }} className="w-7 h-7" />
                    </div>
                    <h5 className="text-lg font-black text-gray-900 dark:text-white mb-3 leading-tight">{rec.title}</h5>
                    <p className="text-sm font-bold text-gray-500 leading-relaxed line-clamp-4">{rec.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pro Tips Card */}
          <div className="bg-pink-50 dark:bg-pink-900/20 border-2 border-pink-100 dark:border-pink-800 rounded-[2.5rem] p-8 shadow-xl">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-ai-gradient flex items-center justify-center text-white">
                   <Star className="w-6 h-6 fill-current" />
                </div>
                <h4 className="text-xl font-black text-gray-900 dark:text-white">Pro Tips</h4>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Stay hydrated throughout the day",
                  "Focus on progress, not perfection",
                  "Get 7-9 hours of quality sleep",
                  "Manage stress through breathing"
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <CheckCircle2 className="w-5 h-5 text-pink-400" />
                     <p className="text-sm font-bold text-gray-600 dark:text-gray-300">{tip}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* Note/Disclaimer */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-800 rounded-[2rem] p-6 flex items-start gap-4">
             <Lightbulb className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
             <p className="text-xs font-bold text-blue-700 dark:text-blue-300 leading-relaxed">
                Note: These are AI-generated recommendations based on your profile. For medical conditions or specific health concerns, please consult a healthcare professional.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
