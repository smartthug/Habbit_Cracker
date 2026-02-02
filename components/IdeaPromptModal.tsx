"use client";

import { useState } from "react";
import { X, Lightbulb } from "lucide-react";
import { createIdea } from "@/app/actions/ideas";
import { useRouter } from "next/navigation";

interface IdeaPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitId: string;
  habitName: string;
}

export default function IdeaPromptModal({
  isOpen,
  onClose,
  habitId,
  habitName,
}: IdeaPromptModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ideaText, setIdeaText] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("text", ideaText);
    formData.append("habitId", habitId);
    formData.append("priority", "normal");

    const result = await createIdea(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.refresh();
      onClose();
      setIdeaText("");
      setLoading(false);
    }
  }

  function handleSkip() {
    onClose();
    setIdeaText("");
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Capture an Idea</h2>
            </div>
            <button
              onClick={handleSkip}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            You completed <span className="font-semibold">{habitName}</span>. Any thoughts or ideas?
          </p>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              autoFocus
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="What's on your mind?"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={loading || !ideaText.trim()}
                className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Saving..." : "Save Idea"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
