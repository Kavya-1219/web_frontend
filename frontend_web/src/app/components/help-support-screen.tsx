import { useState } from "react";
import { HelpCircle, MessageCircle, ChevronDown, ChevronUp, Send, Sparkles, ArrowLeft, Zap, Shield, Heart } from "lucide-react";
import { useNavigate } from "react-router";

const faqs = [
  {
    question: "How do I log my meals?",
    answer: "Go to the 'Log Food' screen from the home page. You can search for foods from our database, add manually by entering details, or scan/upload food images for automatic nutrition detection."
  },
  {
    question: "How accurate are the calorie calculations?",
    answer: "Our calorie calculations are based on scientifically validated formulas (Mifflin-St Jeor equation) and take into account your age, gender, weight, height, and activity level. For best results, update your profile regularly."
  },
  {
    question: "Can I customize my meal plan?",
    answer: "Yes! Go to the Meal Plan screen and tap the edit button on any meal. You can adjust portions, remove items, or generate a completely new plan by tapping the refresh button."
  },
  {
    question: "How do I track water intake?",
    answer: "Use the water tracking widget on the home screen. Tap the + button each time you drink a glass of water (250ml). Your daily goal is calculated based on your body weight."
  },
  {
    question: "What if I have food allergies?",
    answer: "Your food allergies are already saved from your profile setup. The meal plan automatically excludes all your allergic foods. You can update allergies anytime in Profile Settings."
  },
  {
    question: "How do I change my goal?",
    answer: "Go to Profile Settings and edit your goal. The app will recalculate your daily calorie target and adjust meal recommendations accordingly."
  },
  {
    question: "Can I use the app offline?",
    answer: "Yes! All your data is stored locally on your device. You can log meals and view your history offline. However, AI chat and food image scanning require internet connection."
  },
  {
    question: "How do I track my progress?",
    answer: "Check the 'Insights' screen for weekly statistics, macro distribution, and consistency tracking. The Home screen shows your daily progress and weight goals."
  },
  {
    question: "Is my data secure?",
    answer: "Yes! All your data is stored locally on your device and is not shared with third parties. We do not collect or sell your personal information."
  },
  {
    question: "How do I reset my password?",
    answer: "Go to Profile Settings, then scroll down to 'Change Password'. You'll need to enter your current password to set a new one."
  }
];

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function HelpSupportScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'faqs' | 'chat'>('faqs');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      text: "Hi! I'm your AI nutrition assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage: Message = {
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputMessage("");
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    const personalDetails = JSON.parse(localStorage.getItem('personalDetails') || '{}');
    const userName = personalDetails.name || 'there';
    
    if (input.match(/^(hi|hello|hey|good morning|good evening|good afternoon)$/)) {
      return `Hello ${userName}! 👋 How can I help you with your nutrition and health journey today?`;
    }
    if (input.includes('thank') || input.includes('thanks')) {
      return `You're welcome, ${userName}! I'm always here to help. Feel free to ask me anything about nutrition, fitness, or your health goals! 😊`;
    }
    if (input.includes('calorie') || input.includes('calories')) {
      return `Calories are the energy your body needs! I can calculate your specific needs if your profile is complete. Would you like me to check your target?`;
    }
    return `That's a great question, ${userName}. I'm here to help with nutrition, meal planning, and health tracking. Could you tell me more so I can give you a specific recommendation?`;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-950 flex flex-col pb-32">
      {/* Premium Header */}
      <div className="bg-help-gradient pt-12 pb-20 px-6 rounded-b-[2.5rem] relative overflow-hidden h-[240px]">
        <div className="flex items-center justify-between relative z-10 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl text-white font-black tracking-tight uppercase">Support Center</h1>
          </div>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        <p className="text-white/80 text-sm font-bold uppercase tracking-widest relative z-10">We're here to help you succeed</p>
        
        {/* Decorative elements */}
        <div className="absolute -right-10 top-0 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Premium Tab Switcher */}
      <div className="px-6 -mt-8 mb-8 relative z-20">
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-2 flex border border-white/50 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex-1 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'faqs'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            FAQ Guide
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Chat with AI
          </button>
        </div>
      </div>

      {/* FAQs Content */}
      {activeTab === 'faqs' && (
        <div className="px-6 space-y-4 flex-1 animate-in fade-in duration-500">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white dark:bg-gray-900 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50 dark:border-gray-800 overflow-hidden transition-all duration-300 ${
                expandedFaq === index ? 'ring-2 ring-orange-100 dark:ring-orange-900/20 shadow-xl' : ''
              }`}
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <span className={`font-black text-sm uppercase tracking-tight transition-colors ${
                  expandedFaq === index ? 'text-orange-600' : 'text-gray-800 dark:text-gray-200'
                }`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  expandedFaq === index ? 'bg-orange-500 text-white rotate-180' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>
              {expandedFaq === index && (
                <div className="px-8 pb-8 pt-0 animate-in slide-in-from-top-4 duration-300">
                  <div className="h-[1px] bg-gray-50 dark:bg-gray-800 mb-6"></div>
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-wider italic">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Premium Help CTA */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 mt-12 overflow-hidden relative shadow-2xl">
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Expert Assistance</h3>
              <p className="text-white/70 text-sm font-bold mb-8 uppercase tracking-widest">Can't find your answer?</p>
              <button
                onClick={() => setActiveTab('chat')}
                className="w-full py-5 bg-white text-indigo-600 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Sparkles className="w-5 h-5" />
                Unlock AI Concierge
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      )}

      {/* AI Chat Content */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col px-6 animate-in fade-in duration-500">
          <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2 custom-scrollbar">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}
              >
                <div className={`max-w-[85%] relative ${
                  message.isUser
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-[2rem] rounded-tr-none'
                    : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-[2rem] rounded-tl-none border border-gray-100 dark:border-gray-800'
                } px-6 py-4 shadow-xl`}>
                  {!message.isUser && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-orange-100 dark:bg-orange-950/40 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                      </div>
                      <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em]">NutriBot AI</span>
                    </div>
                  )}
                  <p className="text-sm font-bold tracking-tight leading-relaxed">{message.text}</p>
                  <p className={`text-[10px] mt-2 font-black uppercase tracking-widest ${
                    message.isUser ? 'text-white/50' : 'text-gray-300'
                  }`}>
                    {message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Premium Input Area */}
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-4 border border-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Message NutriBot..."
                className="flex-1 px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-orange-500 dark:text-white rounded-[1.75rem] focus:outline-none transition-all font-bold text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  inputMessage.trim()
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl hover:shadow-orange-200 dark:shadow-none active:scale-90'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-300 cursor-not-allowed'
                }`}
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}