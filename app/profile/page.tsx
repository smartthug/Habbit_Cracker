"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { LogOut, Moon, Sun } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useTheme } from "@/components/ThemeProvider";

export default function ProfilePage() {
  const router = useRouter();
  const { darkMode, toggleTheme, mounted } = useTheme();

  async function handleLogout() {
    await logout();
    router.push("/auth/login");
    router.refresh();
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-purple-950/20 dark:to-indigo-950/30 pb-24 sm:pb-20 safe-bottom">
        <div className="max-w-md mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-32 mb-6"></div>
            <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 sm:pb-20 md:pb-6 md:pl-20 lg:pl-64 safe-bottom animate-fade-in">
      <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400 mb-6 md:mb-8 tracking-tight">
          Profile
        </h1>

        <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-800 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-premium-lg border border-slate-200/50 dark:border-slate-700/50 mb-4 animate-scale-in">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/0 to-purple-400/0 dark:from-indigo-400/0 dark:to-purple-400/0 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-1 tracking-tight">Appearance</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Toggle dark mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="tap-target p-3 sm:p-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl active:scale-95 transition-all duration-200 touch-active no-select shadow-premium hover:shadow-premium-lg"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500 dark:text-amber-400 transition-transform duration-200" />
              ) : (
                <Moon className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 dark:text-indigo-400 transition-transform duration-200" />
              )}
            </button>
          </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-800 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-premium-lg border border-slate-200/50 dark:border-slate-700/50 animate-scale-in">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/0 to-orange-400/0 dark:from-red-400/0 dark:to-orange-400/0 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
          <button
            onClick={handleLogout}
            className="tap-target w-full flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-semibold active:scale-95 transition-all duration-200 touch-active no-select min-h-[52px] shadow-premium hover:shadow-premium-lg"
          >
            <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-lg tracking-tight">Sign Out</span>
          </button>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
