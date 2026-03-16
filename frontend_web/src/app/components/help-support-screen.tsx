import { useState } from "react";
import { HelpCircle, MessageCircle, ChevronDown, ChevronUp, Send, Sparkles, ArrowLeft } from "lucide-react";
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

    // Add user message
    const userMessage: Message = {
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);

    // Generate AI response (simulated)
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

    // Get user profile for personalized responses
    const personalDetails = JSON.parse(localStorage.getItem('personalDetails') || '{}');
    const bodyDetails = JSON.parse(localStorage.getItem('bodyDetails') || '{}');
    const foodPrefs = JSON.parse(localStorage.getItem('foodPreferences') || '{}');
    const healthConditions = JSON.parse(localStorage.getItem('healthConditions') || '[]');
    const lifestyle = JSON.parse(localStorage.getItem('lifestyle') || '{}');
    const goals = JSON.parse(localStorage.getItem('userGoals') || '[]');
    const userName = personalDetails.name || 'there';
    const weight = parseFloat(bodyDetails.weight) || 70;
    const height = parseFloat(bodyDetails.height) || 170;
    const age = parseInt(personalDetails.age) || 25;
    
    // Calculate BMI
    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);

    // Greetings
    if (input.match(/^(hi|hello|hey|good morning|good evening|good afternoon)$/)) {
      return `Hello ${userName}! 👋 How can I help you with your nutrition and health journey today?`;
    }

    // Thank you
    if (input.includes('thank') || input.includes('thanks')) {
      return `You're welcome, ${userName}! I'm always here to help. Feel free to ask me anything about nutrition, fitness, or your health goals! 😊`;
    }

    // BMI/Health Status
    if (input.includes('bmi') || input.includes('health status') || input.includes('am i healthy')) {
      const bmiStatus = parseFloat(bmi) < 18.5 ? 'underweight' : parseFloat(bmi) < 25 ? 'normal' : parseFloat(bmi) < 30 ? 'overweight' : 'obese';
      return `Your BMI is ${bmi} (${bmiStatus}). ${parseFloat(bmi) < 18.5 ? 'Consider increasing calorie intake with nutrient-dense foods.' : parseFloat(bmi) > 25 ? 'Focus on a balanced diet and regular exercise to reach a healthy weight.' : 'Great! Keep maintaining your healthy lifestyle!'} ${healthConditions.length > 0 ? `Also managing your ${healthConditions.join(', ')} through diet is important.` : ''}`;
    }

    // Calorie questions
    if (input.includes('calorie') || input.includes('calories') || input.includes('how many calories')) {
      const bmr = personalDetails.gender === 'male' 
        ? 10 * weight + 6.25 * height - 5 * age + 5 
        : 10 * weight + 6.25 * height - 5 * age - 161;
      const activityMultiplier = lifestyle.activityLevel === 'sedentary' ? 1.2 : lifestyle.activityLevel === 'light' ? 1.375 : lifestyle.activityLevel === 'moderate' ? 1.55 : 1.725;
      const maintenanceCalories = Math.round(bmr * activityMultiplier);
      const targetCalories = goals.includes('lose-weight') ? maintenanceCalories - 500 : goals.includes('gain-weight') ? maintenanceCalories + 500 : maintenanceCalories;
      
      return `Hi ${userName}! Based on your ${age}yr old ${personalDetails.gender}, ${height}cm, ${weight}kg profile with ${lifestyle.activityLevel || 'moderate'} activity:\n\n🔹 Maintenance: ${maintenanceCalories} kcal/day\n🔹 Your Goal (${goals.map((g: string) => g.replace('-', ' ')).join(', ')}): ${targetCalories} kcal/day\n\nFocus on nutrient-dense whole foods! Need meal ideas?`;
    }

    // Protein questions
    if (input.includes('protein') || input.includes('how much protein')) {
      const proteinTarget = goals.includes('gain-muscle') ? weight * 2 : weight * 1.6;
      return `For your ${weight}kg bodyweight and ${goals.includes('gain-muscle') ? 'muscle building' : 'general health'} goal, aim for **${Math.round(proteinTarget)}g protein/day**.\n\n🥩 Good sources:\n• Chicken breast (31g/100g)\n• Eggs (13g/2 eggs)\n• Greek yogurt (10g/100g)\n• Paneer (18g/100g)\n• Lentils (9g/100g)\n${foodPrefs.dietType === 'vegetarian' ? '\n✅ As a vegetarian, focus on paneer, dal, tofu, and Greek yogurt!' : ''}`;
    }

    // Weight loss specific
    if (input.includes('lose weight') || input.includes('weight loss') || input.includes('fat loss')) {
      return `For healthy weight loss:\n\n1️⃣ **Calorie Deficit**: 500kcal below maintenance\n2️⃣ **High Protein**: ${Math.round(weight * 1.8)}g/day (preserves muscle)\n3️⃣ **Strength Training**: 3x/week minimum\n4️⃣ **Steps**: 8,000-10,000 daily\n5️⃣ **Sleep**: 7-9 hours\n6️⃣ **Water**: ${Math.round(weight * 35)}ml/day\n\n${healthConditions.includes('diabetes') ? '⚠️ Monitor blood sugar regularly and avoid simple carbs.' : ''}\nTrack everything in the app! Consistency > perfection.`;
    }

    // Meal/Food recommendations
    if (input.includes('meal') || input.includes('food') || input.includes('what should i eat') || input.includes('breakfast') || input.includes('lunch') || input.includes('dinner')) {
      const mealType = input.includes('breakfast') ? 'breakfast' : input.includes('lunch') ? 'lunch' : input.includes('dinner') ? 'dinner' : 'meal';
      const vegNote = foodPrefs.dietType === 'vegetarian' ? ' (vegetarian)' : '';
      
      return `Great question! Here are ${mealType}${vegNote} ideas for your ${goals.map((g: string) => g.replace('-', ' ')).join('/')} goal:\n\n${mealType === 'breakfast' ? '🌅 **Breakfast:**\n• Oatmeal + banana + almonds\n• Scrambled eggs + whole wheat toast\n• Greek yogurt + berries + honey' : mealType === 'lunch' ? '🍽️ **Lunch:**\n• Grilled chicken + brown rice + veggies\n• Quinoa salad with chickpeas\n• Paneer tikka + roti + dal' : '🌙 **Dinner:**\n• Baked salmon + sweet potato\n• Stir-fry tofu + vegetables\n• Grilled chicken + quinoa + salad'}\n\n${healthConditions.includes('diabetes') ? '⚠️ Control portions and pair carbs with protein!' : ''}Want portion sizes?`;
    }

    // Water/Hydration
    if (input.includes('water') || input.includes('hydration') || input.includes('drink')) {
      const waterTarget = Math.round(weight * 35);
      const glasses = Math.round(waterTarget / 250);
      return `💧 Hydration is KEY!\n\nYour target: **${waterTarget}ml** (${glasses} glasses/day)\n\nBenefits:\n✅ Boosts metabolism\n✅ Reduces hunger\n✅ Improves skin\n✅ Better workouts\n✅ Prevents constipation\n\nTip: Drink 500ml upon waking! Use the water tracker on your dashboard.`;
    }

    // Exercise/Workout
    if (input.includes('exercise') || input.includes('workout') || input.includes('gym') || input.includes('training')) {
      return `🏋️ Exercise plan for ${goals.map((g: string) => g.replace('-', ' ')).join('/')}:\n\n**Strength Training** (3-4x/week):\n• Push: Chest, shoulders, triceps\n• Pull: Back, biceps\n• Legs: Squads, lunges\n\n**Cardio** (3x/week):\n• Walking: 30-45 min\n• Or: Running, cycling, swimming\n\n**Daily Steps**: 8,000-10,000\n\nRest days are crucial! Track workouts + sleep for best results.`;
    }

    // Sleep
    if (input.includes('sleep') || input.includes('rest')) {
      return `😴 Sleep is ESSENTIAL!\n\n**Target: 7-9 hours/night**\n\nWhy it matters:\n• Regulates hunger hormones (ghrelin/leptin)\n• Muscle recovery & growth\n• Better insulin sensitivity\n• Improved mood & willpower\n\nTips:\n🌙 Same bedtime daily\n📱 No screens 1hr before\n🍽️ Light dinner 2-3hrs before bed\n☕ No caffeine after 3pm\n\nUse our sleep tracker to monitor patterns!`;
    }

    // Diabetes specific
    if (input.includes('diabetes') || input.includes('blood sugar')) {
      if (healthConditions.includes('diabetes')) {
        return `Managing diabetes through nutrition:\n\n**Do's:**\n✅ Low GI carbs (oats, quinoa)\n✅ High fiber foods\n✅ Protein with every meal\n✅ Monitor portions\n✅ Regular meal timing\n\n**Avoid:**\n❌ White rice, white bread\n❌ Sugary drinks\n❌ Processed foods\n❌ Large carb portions\n\nCheck blood sugar before/after meals. Need specific meal ideas?`;
      }
      return `For blood sugar management, focus on:\n• Low glycemic index foods\n• High fiber vegetables\n• Lean proteins\n• Healthy fats\n• Regular meal timing\n\nConsult your doctor for personalized advice.`;
    }

    // PCOS specific
    if (input.includes('pcos') || input.includes('pcod')) {
      return `PCOS nutrition tips:\n\n**Focus on:**\n✅ Low GI carbs (whole grains)\n✅ Anti-inflammatory foods\n✅ Omega-3 (fish, flaxseed)\n✅ Fiber (25-30g/day)\n✅ Protein with each meal\n\n**Limit:**\n❌ Refined carbs\n❌ Dairy (if sensitive)\n❌ Processed foods\n❌ Excess sugar\n\n**Exercise**: 150 min/week helps insulin sensitivity! Track your cycle and symptoms.`;
    }

    // Motivation/mental health
    if (input.includes('motivation') || input.includes('motivated') || input.includes('give up') || input.includes('hard')) {
      return `You've got this, ${userName}! 💪\n\n**Remember:**\n🌟 Progress > Perfection\n🌟 Small wins add up\n🌟 Bad day ≠ Bad week\n🌟 You're building lifelong habits\n\n**Tips:**\n✨ Track everything (awareness is key)\n✨ Celebrate non-scale victories\n✨ Join a community\n✨ Focus on how you FEEL\n\n${goals.length > 0 ? `Your goal of ${goals.map((g: string) => g.replace('-', ' ')).join(' & ')} is achievable! One day at a time.` : ''} I'm here for you!`;
    }

    // Vitamins/Minerals/Micronutrients
    if (input.includes('vitamin') || input.includes('mineral') || input.includes('micronutrient') || input.includes('deficiency')) {
      return `📊 Essential micronutrients:\n\n**Vitamins:**\n🥕 Vitamin A: Carrots, spinach\n🍊 Vitamin C: Citrus, bell peppers\n☀️ Vitamin D: Sunlight, fish, eggs\nanuts Vitamin E: Nuts, seeds\n🥦 Vitamin K: Leafy greens\n\n**Minerals:**\n🦴 Calcium: Dairy, leafy greens (${Math.round(weight * 15)}mg/day)\n⚡ Iron: Red meat, spinach, lentils\n🧠 Magnesium: Nuts, whole grains\n🦪 Zinc: Meat, legumes\n\nEat a colorful variety daily! Need supplement advice? Consult a doctor.`;
    }

    // Fiber
    if (input.includes('fiber') || input.includes('fibre') || input.includes('digestion')) {
      return `🌾 Fiber is crucial!\n\n**Target: 25-35g/day**\n\nBenefits:\n✅ Better digestion\n✅ Keeps you full longer\n✅ Blood sugar control\n✅ Heart health\n✅ Weight management\n\n**High-fiber foods:**\n• Oats (4g/cup)\n• Lentils (8g/cup)\n• Chickpeas (12g/cup)\n• Broccoli (5g/cup)\n• Apples with skin (4g/medium)\n• Chia seeds (10g/2 tbsp)\n\nIncrease gradually + drink plenty of water!`;
    }

    // Tracking/App usage
    if (input.includes('how to use') || input.includes('app') || input.includes('track')) {
      return `📱 **How to use the app:**\n\n1️⃣ **Home Dashboard**: Quick view of daily progress\n2️⃣ **Log Food**: Scan or manual entry\n3️⃣ **Meal Plans**: Personalized for your goals\n4️⃣ **Track Water/Steps/Sleep**: Daily widgets\n5️⃣ **Insights**: Analyze your patterns\n6️⃣ **AI Recommendations**: Personalized tips\n\n💡 **Pro tip**: Log meals immediately for accuracy. Consistency = Results!`;
    }

    // Cheat meals
    if (input.includes('cheat') || input.includes('pizza') || input.includes('cake') || input.includes('sweets')) {
      return `🍕 Cheat meals are OK!\n\n**Smart approach:**\n✅ Plan it (1x/week)\n✅ Enjoy mindfully\n✅ Don't binge\n✅ Get back on track next meal\n✅ Stay hydrated\n\n**Remember:**\n• One meal won't ruin progress\n• Life is about balance\n• Restriction leads to binging\n• Track it honestly\n\n${goals.includes('lose-weight') ? 'For weight loss, keep it to 10-20% of weekly calories.' : ''} Enjoy your favorite foods guilt-free!`;
    }

    // Supplements
    if (input.includes('supplement') || input.includes('protein powder') || input.includes('creatine')) {
      return `💊 **Supplements:**\n\n**Essential (if deficient):**\n• Vitamin D (if low sunlight)\n• B12 (vegetarians/vegans)\n• Omega-3 (if no fish intake)\n\n**Optional for fitness:**\n• Whey protein (convenient, not necessary)\n• Creatine (5g/day for muscle)\n• Multivitamin (insurance)\n\n⚠️ **Food first!** Supplements don't replace a balanced diet. Consult a doctor before starting any supplement.`;
    }

    // Specific health conditions
    if (input.includes('blood pressure') || input.includes('bp') || input.includes('hypertension')) {
      return `🩺 For blood pressure management:\n\n**Reduce:**\n❌ Sodium (< 2,300mg/day)\n❌ Processed foods\n❌ Caffeine excess\n❌ Alcohol\n\n**Increase:**\n✅ Potassium (bananas, sweet potato)\n✅ Magnesium (nuts, seeds)\n✅ Leafy greens\n✅ Berries\n✅ Beets\n\n**Lifestyle:**\n• Regular exercise\n• Stress management\n• Quality sleep\n• Maintain healthy weight\n\nMonitor regularly! Consult your doctor.`;
    }

    // Stress management
    if (input.includes('stress') || input.includes('anxiety') || input.includes('cortisol')) {
      return `🧘 Managing stress through nutrition:\n\n**Eat:**\n✅ Complex carbs (oats, quinoa)\n✅ Omega-3 (salmon, walnuts)\n✅ Magnesium (dark chocolate, nuts)\n✅ Vitamin C (oranges, peppers)\n✅ Chamomile tea\n\n**Avoid:**\n❌ Excess caffeine\n❌ Alcohol\n❌ High sugar foods\n\n**Lifestyle:**\n• 7-9 hours sleep\n• Regular exercise\n• Meditation/yoga\n• Deep breathing\n\nChronic stress increases cortisol → weight gain. Take care of mental health!`;
    }

    // Unknown/Conversational
    return `I'm here to help, ${userName}! I can answer questions about:\n\n💪 Nutrition & Calories\n🥗 Meal planning & recipes\n🏋️ Exercise & fitness\n💧 Hydration\n😴 Sleep optimization\n🩺 Managing health conditions\n📊 Vitamins & minerals\n\nWhat would you specifically like to know? Be as specific as possible!`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-700 dark:to-red-700 pt-8 pb-16 px-6 rounded-b-[2rem]">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 hover:bg-white/10 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center space-x-3 mb-3">
          <HelpCircle className="w-8 h-8 text-white" />
          <h1 className="text-2xl text-white font-semibold">Help & Support</h1>
        </div>
        <p className="text-orange-50">We're here to help you succeed</p>
      </div>

      {/* Tab Switcher */}
      <div className="px-6 -mt-8 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 flex">
          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              activeTab === 'faqs'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            FAQs
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 rounded-xl font-medium transition flex items-center justify-center space-x-2 ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span>AI Chat</span>
          </button>
        </div>
      </div>

      {/* FAQs Tab */}
      {activeTab === 'faqs' && (
        <div className="px-6 space-y-3 flex-1 overflow-y-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <span className="font-medium text-gray-800 dark:text-white pr-4">{faq.question}</span>
                {expandedFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {expandedFaq === index && (
                <div className="px-5 pb-4 pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-5 mt-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Still need help?</h3>
            <p className="text-sm text-blue-800 dark:text-blue-400 mb-3">
              Can't find what you're looking for? Try our AI chat or contact support.
            </p>
            <button
              onClick={() => setActiveTab('chat')}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat with AI</span>
            </button>
          </div>
        </div>
      )}

      {/* AI Chat Tab */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col px-6">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.isUser
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-700'
                } rounded-2xl px-4 py-3 shadow-md`}>
                  {!message.isUser && (
                    <div className="flex items-center space-x-2 mb-1">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">AI Assistant</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-3 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-orange-500 rounded-xl focus:outline-none text-gray-800 dark:text-white"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className={`p-3 rounded-xl transition ${
                  inputMessage.trim()
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}