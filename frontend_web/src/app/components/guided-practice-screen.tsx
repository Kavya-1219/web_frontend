import { useState, useEffect } from "react";
import { ArrowLeft, Play, Pause, CheckCircle, X, Volume2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PracticeData {
  id: string;
  title: string;
  type: "yoga" | "breathing" | "mudra";
  duration: number; // in seconds
  steps: string[];
  scienceNote: string;
  instructions: string[];
  benefits: string[];
}

export function GuidedPracticeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const practice = location.state?.practice as PracticeData;

  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(practice?.duration || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [audioGuidedMode, setAudioGuidedMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("English");

  // Step progression for audio-guided mode
  useEffect(() => {
    if (!isRunning || !audioGuidedMode || !practice) return;

    const stepDuration = practice.duration / practice.instructions.length;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < practice.instructions.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration * 1000);

    return () => clearInterval(interval);
  }, [isRunning, audioGuidedMode, practice]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setAudioGuidedMode(true); // Auto-enable audio-guided mode
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleComplete = () => {
    // Save completion
    const email = localStorage.getItem('currentUserEmail');
    const completions = JSON.parse(localStorage.getItem(`practiceCompletions_${email}`) || '[]');
    completions.push({
      practiceId: practice.id,
      practiceTitle: practice.title,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(`practiceCompletions_${email}`, JSON.stringify(completions));
    
    navigate(-1);
  };

  if (!practice) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Practice data not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 text-center">{practice.title}</h1>
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
        >
          <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      <div className="px-6 py-8 max-w-2xl mx-auto">
        {!isCompleted ? (
          <>
            {/* Visual Element */}
            <div className="mb-8">
              {practice.type === "breathing" ? (
                <BreathingAnimation isRunning={isRunning} />
              ) : practice.type === "yoga" ? (
                <YogaPoseIllustration pose={practice.id} />
              ) : (
                <MudraIllustration mudra={practice.id} />
              )}
            </div>

            {/* Timer */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-6 text-center">
              <div className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                {formatTime(timeRemaining)}
              </div>
              <div className="flex flex-col items-center gap-3">
                {!isRunning ? (
                  <button
                    onClick={handleStart}
                    className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center gap-2 text-lg font-medium shadow-lg transition"
                  >
                    <Play className="w-6 h-6" />
                    Start Session
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center gap-2 text-lg font-medium shadow-lg transition"
                  >
                    <Pause className="w-6 h-6" />
                    Pause
                  </button>
                )}
                
                {/* Audio Guide Indicator (when running) */}
                {isRunning && (
                  <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span>Audio Guide Active</span>
                  </div>
                )}
              </div>
            </div>

            {/* Current Step Display (Audio-Guided Mode) */}
            {isRunning && (
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 border-2 border-purple-300 dark:border-purple-700 rounded-3xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {currentStep + 1}
                  </div>
                  <div>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">Current Step</p>
                    <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                      {practice.instructions[currentStep]}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions (Hidden during active session) */}
            {!isRunning && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Brief Guide
                </h3>
                <div className="space-y-2">
                  {practice.instructions.map((instruction, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 pt-0.5">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits (Hidden during active session) */}
            {!isRunning && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Benefits
                </h3>
                <ul className="space-y-2">
                  {practice.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Science Note (Hidden during active session) */}
            {!isRunning && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-3xl p-5">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">Science:</span>{" "}
                  {practice.scienceNote}
                </p>
              </div>
            )}
          </>
        ) : (
          /* Completion Screen */
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Great Work!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You've completed {practice.title}
            </p>
            <button
              onClick={handleComplete}
              className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full text-lg font-medium shadow-lg transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Breathing Animation Component
function BreathingAnimation({ isRunning }: { isRunning: boolean }) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isRunning) return;

    const animationCycle = () => {
      // Box Breathing: 4-4-4-4 pattern
      const timeline = [
        { phase: "inhale", scale: 1.5, duration: 4000 },
        { phase: "hold", scale: 1.5, duration: 4000 },
        { phase: "exhale", scale: 1, duration: 4000 },
        { phase: "rest", scale: 1, duration: 4000 },
      ];

      let currentIndex = 0;

      const cycleInterval = setInterval(() => {
        const current = timeline[currentIndex];
        setPhase(current.phase as any);
        setScale(current.scale);

        currentIndex = (currentIndex + 1) % timeline.length;
      }, 4000);

      return cycleInterval;
    };

    const interval = animationCycle();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-2xl transition-transform duration-[4000ms] ease-in-out"
        style={{ transform: `scale(${scale})` }}
      />
      <p className="mt-8 text-2xl font-semibold text-gray-700 dark:text-gray-300 capitalize">
        {phase === "rest" ? "hold" : phase}
      </p>
    </div>
  );
}

// Yoga Pose Illustration Component
function YogaPoseIllustration({ pose }: { pose: string }) {
  const poseImages: Record<string, string> = {
    "stress-relief": "https://images.unsplash.com/photo-1658279366959-d4c3982be26d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHlvZ2ElMjBjaGlsZCUyMHBvc2UlMjBzdHJlc3MlMjByZWxpZWZ8ZW58MXx8fHwxNzcwMjY5MzgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "digestion": "https://images.unsplash.com/photo-1758599880425-7862af0a4b50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwc3BpbmFsJTIwdHdpc3QlMjBkaWdlc3Rpb24lMjBwb3NlfGVufDF8fHx8MTc3MDI2OTM4NHww&ixlib=rb-4.1.0&q=80&w=1080",
    "sleep": "https://images.unsplash.com/photo-1767611104976-86ce57776dc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwY29ycHNlJTIwcG9zZSUyMHNhdmFzYW5hJTIwc2xlZXB8ZW58MXx8fHwxNzcwMjY5Mzg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl">
        <ImageWithFallback
          src={poseImages[pose] || poseImages["stress-relief"]}
          alt={`Yoga pose for ${pose}`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

// Mudra Illustration Component
function MudraIllustration({ mudra }: { mudra: string }) {
  const mudraImages: Record<string, string> = {
    "gyan": "https://images.unsplash.com/photo-1607824972522-2821fba071f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwaGFuZCUyMG11ZHJhJTIwZmluZ2Vyc3xlbnwxfHx8fDE3NzAyNjkzODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "prana": "https://images.unsplash.com/photo-1737289673854-b07162d8e93c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmFuYSUyMG11ZHJhJTIwaGFuZCUyMHlvZ2ElMjBnZXN0dXJlfGVufDF8fHx8MTc3MDI2OTM4NXww&ixlib=rb-4.1.0&q=80&w=1080",
    "apana": "https://images.unsplash.com/photo-1737289673854-b07162d8e93c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFuYSUyMG11ZHJhJTIwaGFuZCUyMGdlc3R1cmUlMjB5b2dhfGVufDF8fHx8MTc3MDI2OTM4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl">
        <ImageWithFallback
          src={mudraImages[mudra] || mudraImages["gyan"]}
          alt={`${mudra} mudra hand gesture`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}