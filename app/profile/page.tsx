"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth";
import { LogOut, Moon, Sun } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check dark mode preference from localStorage or system
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    
    if (isDark) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  async function handleLogout() {
    await logout();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-purple-950/20 dark:to-indigo-950/30 pb-24 sm:pb-20 safe-bottom">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400 mb-6 sm:mb-8">
          Profile
        </h1>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-lg border border-white/20 dark:border-slate-700/50 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">Appearance</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Toggle dark mode</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="tap-target p-3 sm:p-4 bg-slate-100 dark:bg-slate-700 rounded-xl active:bg-slate-200 dark:active:bg-slate-600 transition-colors touch-active no-select"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700 dark:text-slate-300" />
              ) : (
                <Moon className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700 dark:text-slate-300" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-lg border border-white/20 dark:border-slate-700/50">
          <button
            onClick={handleLogout}
            className="tap-target w-full flex items-center justify-center gap-2 py-4 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-semibold active:bg-red-100 dark:active:bg-red-900/30 transition-colors touch-active no-select min-h-[52px]"
          >
            <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-lg">Sign Out</span>
          </button>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
