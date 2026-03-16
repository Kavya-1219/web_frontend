import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  useEffect(() => {
    // Initialize dark mode on app load
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

  return <RouterProvider router={router} />;
}