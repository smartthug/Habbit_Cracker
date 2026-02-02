import { getCurrentUser } from "@/lib/auth";
import { getTodayHabits } from "@/app/actions/habits";
import { getIdeas } from "@/app/actions/ideas";
import { format } from "date-fns";
import Link from "next/link";
import { Plus, Target, Lightbulb, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import AddModal from "@/components/AddModal";
import { debugAuth } from "@/lib/auth-debug";

export default async function DashboardPage() {
  // Debug in development only
  await debugAuth("/dashboard");

  // Middleware already handles auth, but we still need user for display
  const user = await getCurrentUser();
  if (!user) {
    // This shouldn't happen if middleware works correctly
    return null;
  }

  let todayHabitsResult;
  let recentIdeasResult;
  
  try {
    todayHabitsResult = await getTodayHabits();
    recentIdeasResult = await getIdeas({});
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    // Return empty results if there's an error
    todayHabitsResult = { success: false, habits: [] };
    recentIdeasResult = { success: false, ideas: [] };
  }

  const todayHabits = todayHabitsResult.success ? todayHabitsResult.habits : [];
  const recentIdeas = recentIdeasResult.success ? recentIdeasResult.ideas.slice(0, 5) : [];

  const completedCount = todayHabits.filter((h: any) => h.todayStatus === "done").length;
  const totalCount = todayHabits.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-purple-950/20 dark:to-indigo-950/30 pb-24 sm:pb-20 safe-bottom">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
            {greeting()}, {user.email.split("@")[0]}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm font-medium">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        {/* Today's Summary */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 mb-6 shadow-lg border border-white/20 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Today&apos;s Progress</h2>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Completion Rate</span>
              <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{completionRate}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out shadow-glow-sm"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          {totalCount === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              No habits for today. Create one to get started! 🚀
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          <Link
            href="/habits"
            className="tap-target group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-lg active:shadow-xl border border-white/20 dark:border-slate-700/50 transition-all duration-200 touch-active active:-translate-y-0.5"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-3 group-active:scale-110 transition-transform">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1 text-base sm:text-lg">Habits</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {totalCount} active {totalCount === 1 ? "habit" : "habits"}
            </p>
          </Link>
          <Link
            href="/ideas"
            className="tap-target group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-lg active:shadow-xl border border-white/20 dark:border-slate-700/50 transition-all duration-200 touch-active active:-translate-y-0.5"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3 group-active:scale-110 transition-transform">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1 text-base sm:text-lg">Ideas</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {recentIdeas.length} recent {recentIdeas.length === 1 ? "idea" : "ideas"}
            </p>
          </Link>
        </div>

        {/* Recent Ideas */}
        {recentIdeas.length > 0 && (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg mb-6 border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Ideas</h2>
              <Link
                href="/ideas"
                className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {recentIdeas.map((idea: any) => (
                <div
                  key={idea._id}
                  className="p-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border-l-4 border-indigo-500 hover:shadow-md transition-shadow"
                >
                  <p className="text-sm text-slate-900 dark:text-slate-100 line-clamp-2 font-medium">{idea.text}</p>
                  {idea.tags && idea.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {idea.tags.map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-xs px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Streak Indicator */}
        {totalCount > 0 && (
          <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-90"></div>
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-2 font-medium">Current Streak</p>
                <p className="text-4xl font-bold">🔥 {completionRate > 0 ? "1" : "0"} days</p>
                <p className="text-xs opacity-80 mt-1">Keep it going!</p>
              </div>
              <TrendingUp className="w-16 h-16 opacity-80" />
            </div>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
