import { AlertCircle, Info } from "lucide-react";

interface MedicalDisclaimerProps {
  type?: 'info' | 'warning' | 'compact';
  message?: string;
  className?: string;
}

export function MedicalDisclaimer({ 
  type = 'info', 
  message,
  className = '' 
}: MedicalDisclaimerProps) {
  
  const defaultMessage = "These are estimates based on average results. Individual results vary due to genetics, hormones, medical conditions, and lifestyle factors. This app is not medical advice. Consult a healthcare provider before starting any weight loss program.";
  
  const compactMessage = "Individual results may vary. Consult your healthcare provider.";
  
  const displayMessage = message || (type === 'compact' ? compactMessage : defaultMessage);
  
  const styles = {
    info: {
      container: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
      text: "text-blue-800 dark:text-blue-300",
      IconComponent: Info
    },
    warning: {
      container: "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800",
      icon: "text-amber-600 dark:text-amber-400",
      text: "text-amber-800 dark:text-amber-300",
      IconComponent: AlertCircle
    },
    compact: {
      container: "bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700",
      icon: "text-gray-500 dark:text-gray-400",
      text: "text-gray-600 dark:text-gray-400",
      IconComponent: Info
    }
  };
  
  const style = styles[type];
  const Icon = style.IconComponent;
  
  return (
    <div className={`${style.container} rounded-xl p-4 ${className}`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 ${style.icon} flex-shrink-0 mt-0.5`} />
        <p className={`text-sm ${style.text} leading-relaxed`}>
          {displayMessage}
        </p>
      </div>
    </div>
  );
}

interface WeightLossTimelineProps {
  minWeeks: number;
  maxWeeks: number;
  targetWeight: number;
  className?: string;
}

export function WeightLossTimeline({ 
  minWeeks, 
  maxWeeks, 
  targetWeight,
  className = '' 
}: WeightLossTimelineProps) {
  return (
    <div className={`bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xl">🎯</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800 dark:text-white mb-1">
            Estimated Timeline
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            {minWeeks}-{maxWeeks} weeks
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            to reach your goal of <span className="font-semibold">{targetWeight}kg</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">
            Timeframe varies based on consistency and individual factors
          </p>
        </div>
      </div>
    </div>
  );
}

interface HealthBehaviorCardProps {
  icon: string;
  title: string;
  description: string;
  benefit: string;
  isAchieved?: boolean;
  className?: string;
}

export function HealthBehaviorCard({
  icon,
  title,
  description,
  benefit,
  isAchieved = false,
  className = ''
}: HealthBehaviorCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 border-2 ${
      isAchieved 
        ? 'border-green-200 dark:border-green-800' 
        : 'border-gray-200 dark:border-gray-700'
    } ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
          isAchieved 
            ? 'bg-green-100 dark:bg-green-900/30' 
            : 'bg-gray-100 dark:bg-gray-700'
        }`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-800 dark:text-white">{title}</h4>
            {isAchieved && (
              <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {description}
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <span className="font-semibold">Benefit:</span> {benefit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
