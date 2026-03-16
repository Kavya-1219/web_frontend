import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import { Home, TrendingUp, Settings, ChefHat, Brain } from "lucide-react";

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Apply dark mode on layout load
    const email = localStorage.getItem('currentUserEmail');
    if (email) {
      const savedDarkMode = localStorage.getItem(`darkMode_${email}`) === 'true';
      if (savedDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const navItems = [
    { path: "/app", icon: Home, label: "Home" },
    { path: "/app/stress-mind-care", icon: Brain, label: "Mind Care" },
    { path: "/app/recipes", icon: ChefHat, label: "Recipes" },
    { path: "/app/insights", icon: TrendingUp, label: "Insights" },
    { path: "/app/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/app") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 sticky top-0 h-screen flex-col">
        <div className="p-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-bold">N</span>
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white">NutriSoul</span>
        </div>

        <nav className="flex-1 px-6 py-8 space-y-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${
                  active
                    ? "bg-green-500 text-white shadow-xl shadow-green-200/50 dark:shadow-none"
                    : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className={`w-6 h-6 ${active ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
                <span className="text-lg font-bold">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:pb-8 pb-24">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-1 left-0 right-0 z-50 px-4 pb-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-2xl rounded-3xl">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center py-2 px-3 focus:outline-none transition-all"
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-1 transition-all ${
                      active
                        ? "bg-green-500 text-white shadow-lg shadow-green-200"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-medium transition-colors ${
                      active ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}