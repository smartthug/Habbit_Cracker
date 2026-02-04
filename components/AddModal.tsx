"use client";

import { useState, useEffect } from "react";
import { X, Lightbulb, Target, FileText } from "lucide-react";
import { createIdea } from "@/app/actions/ideas";
import { createHabit } from "@/app/actions/habits";
import { createOrUpdateDailyLog } from "@/app/actions/dailyLog";
import { getTopics } from "@/app/actions/topics";
import { getHabits } from "@/app/actions/habits";
import { useRouter } from "next/navigation";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "idea" | "habit" | "note";
}

export default function AddModal({ isOpen, onClose, defaultTab = "idea" }: AddModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"idea" | "habit" | "note">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [topics, setTopics] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);

  useEffect(() => {
    setActiveTab(defaultTab);
    if (isOpen) {
      loadData();
    }
  }, [defaultTab, isOpen]);

  async function loadData() {
    const [topicsResult, habitsResult] = await Promise.all([
      getTopics(),
      getHabits(),
    ]);
    if (topicsResult.success) {
      setTopics(topicsResult.topics);
    }
    if (habitsResult.success) {
      setHabits(habitsResult.habits);
    }
  }

  if (!isOpen) return null;

  async function handleIdeaSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createIdea(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.refresh();
      onClose();
      setLoading(false);
    }
  }

  async function handleHabitSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createHabit(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.refresh();
      onClose();
      setLoading(false);
    }
  }

  async function handleNoteSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createOrUpdateDailyLog(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.refresh();
      onClose();
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-end sm:items-center sm:justify-center p-0" onClick={onClose}>
      <div
        className="w-full h-full sm:h-full sm:w-full md:h-full md:w-full lg:h-full lg:w-full relative overflow-hidden bg-slate-50 dark:bg-slate-900 backdrop-blur-none sm:backdrop-blur-sm dark:backdrop-blur-xl rounded-t-3xl sm:rounded-none md:rounded-none lg:rounded-none shadow-premium-xl border-t sm:border-0 md:border-0 lg:border-0 border-slate-200/30 dark:border-slate-700/50 animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/0 to-purple-400/0 dark:from-indigo-400/0 dark:to-purple-400/0 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex-shrink-0 bg-slate-50 dark:bg-slate-900 backdrop-blur-none sm:backdrop-blur-sm dark:backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-4 sm:py-5 md:py-6 lg:py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 md:gap-6 relative z-10">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 -mx-2 sm:mx-0 px-2 sm:px-0">
            <button
              onClick={() => setActiveTab("idea")}
              className={`tap-target flex items-center gap-1.5 sm:gap-2 md:gap-2.5 px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 whitespace-nowrap min-h-[44px] md:min-h-[48px] ${
                activeTab === "idea"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg scale-105"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
              }`}
            >
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
              <span>Idea</span>
            </button>
            <button
              onClick={() => setActiveTab("habit")}
              className={`tap-target flex items-center gap-1.5 sm:gap-2 md:gap-2.5 px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 whitespace-nowrap min-h-[44px] md:min-h-[48px] ${
                activeTab === "habit"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
              }`}
            >
              <Target className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
              <span>Habit</span>
            </button>
            <button
              onClick={() => setActiveTab("note")}
              className={`tap-target flex items-center gap-1.5 sm:gap-2 md:gap-2.5 px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 whitespace-nowrap min-h-[44px] md:min-h-[48px] ${
                activeTab === "note"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg scale-105"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
              }`}
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
              <span>Note</span>
            </button>
          </div>
          <button onClick={onClose} className="tap-target p-2 sm:p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 relative z-10">
          {error && (
            <div className="mb-4 sm:mb-5 md:mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 rounded-xl text-xs sm:text-sm md:text-base font-medium shadow-sm">
              {error}
            </div>
          )}

          {activeTab === "idea" && (
            <form onSubmit={handleIdeaSubmit} className="h-full flex flex-col space-y-4 sm:space-y-5 md:space-y-6">
              <div className="flex-1 flex flex-col">
                <label htmlFor="idea-text" className="block text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-slate-700 dark:text-slate-300">
                  Your Idea
                </label>
                <textarea
                  id="idea-text"
                  name="text"
                  required
                  autoFocus
                  className="flex-1 w-full px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all resize-none"
                  placeholder="Capture your thought..."
                />
              </div>
              <div>
                <label htmlFor="idea-tags" className="block text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-slate-700 dark:text-slate-300">
                  Tags (comma-separated)
                </label>
                <input
                  id="idea-tags"
                  name="tags"
                  type="text"
                  className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                  placeholder="work, personal, inspiration"
                />
              </div>
              <div>
                <label htmlFor="idea-priority" className="block text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-slate-700 dark:text-slate-300">
                  Priority
                </label>
                <select
                  id="idea-priority"
                  name="priority"
                  defaultValue="normal"
                  className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="tap-target w-full py-3 sm:py-4 md:py-5 px-4 md:px-6 bg-gradient-to-r from-indigo-500 to-purple-600 active:from-indigo-600 active:to-purple-700 text-white rounded-xl md:rounded-2xl font-bold text-sm sm:text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg active:shadow-xl active:scale-[0.98] touch-active no-select hover:scale-[1.02]"
              >
                {loading ? "Saving..." : "Save Idea"}
              </button>
            </form>
          )}

          {activeTab === "habit" && (
            <form onSubmit={handleHabitSubmit} className="h-full flex flex-col space-y-4 sm:space-y-5 md:space-y-6">
              <div>
                <label htmlFor="habit-name" className="block text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-slate-700 dark:text-slate-300">
                  Habit Name
                </label>
                <input
                  id="habit-name"
                  name="name"
                  required
                  autoFocus
                  type="text"
                  className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                  placeholder="e.g., Morning meditation"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div>
                  <label htmlFor="habit-category" className="block text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    id="habit-category"
                    name="category"
                    required
                    defaultValue="personal"
                    className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                  >
                    <option value="health">Health</option>
                    <option value="learning">Learning</option>
                    <option value="business">Business</option>
                    <option value="personal">Personal</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="habit-frequency" className="block text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-slate-700 dark:text-slate-300">
                    Frequency
                  </label>
                  <select
                    id="habit-frequency"
                    name="frequency"
                    required
                    defaultValue="daily"
                    className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="habit-priority" className="block text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-slate-700 dark:text-slate-300">
                  Priority
                </label>
                <select
                  id="habit-priority"
                  name="priority"
                  required
                  defaultValue="medium"
                  className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex items-start gap-3 md:gap-4">
                <input
                  id="idea-generating"
                  name="ideaGenerating"
                  type="checkbox"
                  value="true"
                  className="mt-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 flex-shrink-0"
                />
                <label htmlFor="idea-generating" className="text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">
                  Idea Generating (prompt for ideas when completed)
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="tap-target w-full py-3 sm:py-4 md:py-5 px-4 md:px-6 bg-gradient-to-r from-indigo-500 to-purple-600 active:from-indigo-600 active:to-purple-700 text-white rounded-xl md:rounded-2xl font-bold text-sm sm:text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg active:shadow-xl active:scale-[0.98] touch-active no-select hover:scale-[1.02] mt-auto"
              >
                {loading ? "Creating..." : "Create Habit"}
              </button>
            </form>
          )}

          {activeTab === "note" && (
            <form onSubmit={handleNoteSubmit} className="h-full flex flex-col space-y-4 sm:space-y-5 md:space-y-6">
              <div className="flex-1 flex flex-col">
                <label htmlFor="note-text" className="block text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-slate-700 dark:text-slate-300">
                  Daily Notes
                </label>
                <textarea
                  id="note-text"
                  name="notes"
                  required
                  autoFocus
                  className="flex-1 w-full px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all resize-none"
                  placeholder="How was your day?"
                />
              </div>
              <div>
                <label htmlFor="note-mood" className="block text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-slate-700 dark:text-slate-300">
                  Mood
                </label>
                <select
                  id="note-mood"
                  name="mood"
                  className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                >
                  <option value="">Select mood</option>
                  <option value="happy">😊 Happy</option>
                  <option value="neutral">😐 Neutral</option>
                  <option value="sad">😢 Sad</option>
                  <option value="anxious">😰 Anxious</option>
                  <option value="excited">🤩 Excited</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="tap-target w-full py-3 sm:py-4 md:py-5 px-4 md:px-6 bg-gradient-to-r from-indigo-500 to-purple-600 active:from-indigo-600 active:to-purple-700 text-white rounded-xl md:rounded-2xl font-bold text-sm sm:text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg active:shadow-xl active:scale-[0.98] touch-active no-select hover:scale-[1.02]"
              >
                {loading ? "Saving..." : "Save Note"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
