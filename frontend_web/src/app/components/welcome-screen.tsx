import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, Heart, Apple, TrendingUp, Brain } from "lucide-react";

const introSlides = [
  {
    icon: Heart,
    color: "text-green-500",
    bgColor: "bg-green-50",
    title: "Your Personal Nutrition Assistant",
    description: "Get customized meal plans, diet guidance, and health recommendations tailored just for you",
    image: "🥗"
  },
  {
    icon: Apple,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    title: "More Than Just Calories",
    description: "Track nutrition quality, portion sizes, and build healthy habits that last",
    image: "🍎"
  },
  {
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    title: "Holistic Wellness Support",
    description: "Manage weight, build muscle, reduce stress, and improve your overall well-being",
    image: "🧘‍♀️"
  }
];

export function WelcomeScreen() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < introSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/signup");
    }
  };

  const handleSkip = () => {
    navigate("/login");
  };

  const slide = introSlides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col">
      {/* Skip Button */}
      <div className="pt-8 px-6 flex justify-end">
        <button
          onClick={handleSkip}
          className="text-gray-500 hover:text-gray-700 transition text-sm"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Icon/Image */}
        <div className={`w-32 h-32 rounded-full ${slide.bgColor} flex items-center justify-center mb-8 shadow-lg`}>
          <span className="text-6xl">{slide.image}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl text-center text-gray-800 mb-4 px-4">
          {slide.title}
        </h1>

        {/* Description */}
        <p className="text-center text-gray-600 leading-relaxed px-8 mb-12">
          {slide.description}
        </p>

        {/* Dots Indicator */}
        <div className="flex items-center space-x-2 mb-8">
          {introSlides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-8 bg-green-500"
                  : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Next Button */}
      <div className="p-6">
        <button
          onClick={handleNext}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2"
        >
          <span className="text-lg">
            {currentSlide < introSlides.length - 1 ? "Next" : "Get Started"}
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
        
        {currentSlide === introSlides.length - 1 && (
          <button
            onClick={handleSkip}
            className="w-full py-3 mt-3 text-gray-600 hover:text-gray-800 transition"
          >
            Already have an account? Login
          </button>
        )}
      </div>
    </div>
  );
}
