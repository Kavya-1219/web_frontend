import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Camera, 
  ChevronRight,
  User,
  HelpCircle,
  Info,
  LogOut
} from "lucide-react";
import api, { endpoints, dispatchRefresh } from "../helpers/api";

function SettingsItem({ icon: Icon, label, sublabel, color, onClick, trailing }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-left">
          <p className="font-black text-gray-800 dark:text-white text-sm uppercase tracking-tight">{label}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{sublabel}</p>
        </div>
      </div>
      {trailing || <ChevronRight className="w-5 h-5 text-gray-300" />}
    </button>
  );
}

export function SettingsScreen() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const email = user.email || user.username || 'guest';
    const savedDarkMode = localStorage.getItem(`darkMode_${email}`) === 'true';
    setDarkMode(savedDarkMode);

    // Apply dark mode to body
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }

    try {
      const response = await api.get(endpoints.profile);
      if (response.data) {
        setUserName(response.data.name || 'User');
        setProfilePicture(response.data.profilePictureUrl);
      }
    } catch (error) {
      console.error("Failed to load profile settings:", error);
      // Fallback
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const email = user.email || user.username || 'guest';
      const personalDetails = JSON.parse(localStorage.getItem(`personalDetails_${email}`) || '{}');
      setUserName(personalDetails.name || 'User');
      const savedPicture = localStorage.getItem(`profilePicture_${email}`);
      setProfilePicture(savedPicture);
    }
  };

  const toggleDarkMode = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const email = user.email || user.username || 'guest';
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem(`darkMode_${email}`, String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    dispatchRefresh();
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/welcome");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-700 dark:to-indigo-800 pt-8 pb-20 px-6 rounded-b-[2rem]">
        <div className="flex items-center space-x-3 mb-3">
          <SettingsIcon className="w-8 h-8 text-white" />
          <h1 className="text-2xl text-white font-semibold">Settings</h1>
        </div>
        <p className="text-purple-50">Customize your experience</p>
      </div>

      {/* Profile Picture Section */}
      <div className="px-6 -mt-12 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Profile Reference</h2>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover border-4 border-purple-500"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">{userName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage via profile settings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Options */}
      <div className="px-6 space-y-4">
        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-5 pt-4 pb-2">
            Appearance
          </h3>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition border-t border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              {darkMode ? (
                <Moon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <Sun className="w-6 h-6 text-yellow-600" />
              )}
              <div className="text-left">
                <p className="font-medium text-gray-800 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {darkMode ? 'On' : 'Off'}
                </p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full p-1 transition ${
              darkMode ? 'bg-indigo-600' : 'bg-gray-300'
            }`}>
              <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </div>
          </button>
        </div>

        {/* Account */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-5 pt-4 pb-2">
            Account
          </h3>
          
          <button
            onClick={() => navigate('/app/profile')}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition border-t border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <User className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div className="text-left">
                <p className="font-medium text-gray-800 dark:text-white">Profile Settings</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your profile</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Help & Support */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-5 pt-4 pb-2">
            Help & Support
          </h3>
          
          <button
            onClick={() => navigate('/app/help')}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition border-t border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <div className="text-left">
                <p className="font-medium text-gray-800 dark:text-white">Help & Support</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">FAQs, Chat with AI</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => navigate('/app/about')}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition border-t border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <Info className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <div className="text-left">
                <p className="font-medium text-gray-800 dark:text-white">About</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Version 2.0.4 Premium</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Logout */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-5 pt-4 pb-2">
            Logout
          </h3>
          
          <button
            onClick={handleLogout}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition border-t border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
              <div className="text-left">
                <p className="font-medium text-gray-800 dark:text-white">Logout</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sign out of your account</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
