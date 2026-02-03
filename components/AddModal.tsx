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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center md:justify-center" onClick={onClose}>
      <div
        className="w-full md:w-auto md:max-w-2xl lg:max-w-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl border-t md:border border-slate-200/50 dark:border-slate-800/50 md:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-5 py-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("idea")}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "idea"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg scale-105"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Lightbulb className="w-4 h-4 inline mr-1.5" />
              Idea
            </button>
            <button
              onClick={() => setActiveTab("habit")}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "habit"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Target className="w-4 h-4 inline mr-1.5" />
              Habit
            </button>
            <button
              onClick={() => setActiveTab("note")}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "note"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg scale-105"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <FileText className="w-4 h-4 inline mr-1.5" />
              Note
            </button>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-5">
          {error && (
            <div className="mb-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium shadow-sm">
              {error}
            </div>
          )}

          {activeTab === "idea" && (
            <form onSubmit={handleIdeaSubmit} className="space-y-4">
              <div>
                <label htmlFor="idea-text" className="block text-sm font-medium mb-2">
                  Your Idea
                </label>
                <textarea
                  id="idea-text"
                  name="text"
                  required
                  autoFocus
                  rows={4}
                  className="w-full px-4 py-4 text-base border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                  placeholder="Capture your thought..."
                />
              </div>
              <div>
                <label htmlFor="idea-tags" className="block text-sm font-medium mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  id="idea-tags"
                  name="tags"
                  type="text"
                  className="w-full px-4 py-4 text-base border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                  placeholder="work, personal, inspiration"
                />
              </div>
              <div>
                <label htmlFor="idea-priority" className="block text-sm font-medium mb-2">
                  Priority
                </label>
                <select
                  id="idea-priority"
                  name="priority"
                  defaultValue="normal"
                  className="w-full px-4 py-4 text-base border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="tap-target w-full py-4 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 active:from-indigo-600 active:to-purple-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg active:shadow-xl active:scale-[0.98] touch-active no-select min-h-[52px]"
              >
                {loading ? "Saving..." : "Save Idea"}
              </button>
            </form>
          )}

          {activeTab === "habit" && (
            <form onSubmit={handleHabitSubmit} className="space-y-4">
              <div>
                <label htmlFor="habit-name" className="block text-sm font-medium mb-2">
                  Habit Name
                </label>
                <input
                  id="habit-name"
                  name="name"
                  required
                  autoFocus
                  type="text"
                  className="w-full px-4 py-4 text-base border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                  placeholder="e.g., Morning meditation"
                />
              </div>
              <div>
                <label htmlFor="habit-category" className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  id="habit-category"
                  name="category"
                  required
                  defaultValue="personal"
                  className="w-full px-4 py-4 text-base border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                >
                  <option value="health">Health</option>
                  <option value="learning">Learning</option>
                  <option value="business">Business</option>
                  <option value="personal">Personal</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label htmlFor="habit-frequency" className="block text-sm font-medium mb-2">
                  Frequency
                </label>
                <select
                  id="habit-frequency"
                  name="frequency"
                  required
                  defaultValue="daily"
                  className="w-full px-4 py-4 text-base border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label htmlFor="habit-priority" className="block text-sm font-medium mb-2">
                  Priority
                </label>
                <select
                  id="habit-priority"
                  name="priority"
                  required
                  defaultValue="medium"
                  className="w-full px-4 py-4 text-base border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  id="idea-generating"
                  name="ideaGenerating"
                  type="checkbox"
                  value="true"
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="idea-generating" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Idea Generating (prompt for ideas when completed)
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="tap-target w-full py-4 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 active:from-indigo-600 active:to-purple-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg active:shadow-xl active:scale-[0.98] touch-active no-select min-h-[52px]"
              >
                {loading ? "Creating..." : "Create Habit"}
              </button>
            </form>
          )}

          {activeTab === "note" && (
            <form onSubmit={handleNoteSubmit} className="space-y-4">
              <div>
                <label htmlFor="note-text" className="block text-sm font-medium mb-2">
                  Daily Notes
                </label>
                <textarea
                  id="note-text"
                  name="notes"
                  required
                  autoFocus
                  rows={6}
                  className="w-full px-4 py-4 text-base border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                  placeholder="How was your day?"
                />
              </div>
              <div>
                <label htmlFor="note-mood" className="block text-sm font-medium mb-2">
                  Mood
                </label>
                <select
                  id="note-mood"
                  name="mood"
                  className="w-full px-4 py-4 text-base border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
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
                className="tap-target w-full py-4 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 active:from-indigo-600 active:to-purple-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg active:shadow-xl active:scale-[0.98] touch-active no-select min-h-[52px]"
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
