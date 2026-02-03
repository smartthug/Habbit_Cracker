"use client";

import { useEffect, useState, useCallback } from "react";
import { getIdeas, deleteIdea } from "@/app/actions/ideas";
import { getTopics } from "@/app/actions/topics";
import { getHabits } from "@/app/actions/habits";
import { Search, Filter, X, Trash2, Lightbulb, Star } from "lucide-react";
import Navigation from "@/components/Navigation";
import AddModal from "@/components/AddModal";
import { format } from "date-fns";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedHabit, setSelectedHabit] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedIdeas, setExpandedIdeas] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadIdeas = useCallback(async () => {
    const filters: any = {};
    if (searchQuery) filters.search = searchQuery;
    if (selectedTopic) filters.topicId = selectedTopic;
    if (selectedHabit) filters.habitId = selectedHabit;
    if (selectedPriority) filters.priority = selectedPriority;

    const result = await getIdeas(filters);
    if (result.success) {
      setIdeas(result.ideas);
    }
  }, [searchQuery, selectedTopic, selectedHabit, selectedPriority]);

  useEffect(() => {
    loadIdeas();
  }, [loadIdeas]);

  async function loadData() {
    setLoading(true);
    const [ideasResult, topicsResult, habitsResult] = await Promise.all([
      getIdeas({}),
      getTopics(),
      getHabits(),
    ]);

    if (ideasResult.success) {
      setIdeas(ideasResult.ideas);
    }
    if (topicsResult.success) {
      setTopics(topicsResult.topics);
    }
    if (habitsResult.success) {
      setHabits(habitsResult.habits);
    }
    setLoading(false);
  }

  async function handleDelete(ideaId: string) {
    if (confirm("Are you sure you want to delete this idea?")) {
      const result = await deleteIdea(ideaId);
      if (result.success) {
        loadIdeas();
      }
    }
  }

  function toggleExpand(ideaId: string) {
    const newExpanded = new Set(expandedIdeas);
    if (newExpanded.has(ideaId)) {
      newExpanded.delete(ideaId);
    } else {
      newExpanded.add(ideaId);
    }
    setExpandedIdeas(newExpanded);
  }

  const filteredIdeas = ideas.filter((idea) => {
    if (searchQuery && !idea.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedTopic && idea.topicId?.toString() !== selectedTopic) {
      return false;
    }
    if (selectedHabit && idea.habitId?.toString() !== selectedHabit) {
      return false;
    }
    if (selectedPriority && idea.priority !== selectedPriority) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-purple-950/20 dark:to-indigo-950/30 pb-24 sm:pb-20 md:pb-6 md:pl-20 lg:pl-64 safe-bottom flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 dark:border-amber-800 border-t-amber-600 dark:border-t-amber-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading ideas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-purple-950/20 dark:to-indigo-950/30 pb-24 sm:pb-20 md:pb-6 md:pl-20 lg:pl-64 safe-bottom">
      <div className="max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-500 tracking-tight">
              Idea Vault
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1 font-medium">Capture and organize your thoughts</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="tap-target w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg active:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center touch-active no-select"
            aria-label="Add new idea"
          >
            <span className="text-2xl sm:text-3xl font-bold">+</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ideas..."
            className="w-full pl-12 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="tap-target flex items-center gap-2 px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 active:bg-white dark:active:bg-slate-800 transition-colors shadow-sm touch-active no-select min-h-[44px]"
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Filters</span>
          </button>

          {showFilters && (
            <div className="mt-3 p-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-lg md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 md:space-y-0">
              <div>
                <label className="block text-sm font-medium mb-2">Topic</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All topics</option>
                  {topics.map((topic) => (
                    <option key={topic._id} value={topic._id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Habit</label>
                <select
                  value={selectedHabit}
                  onChange={(e) => setSelectedHabit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All habits</option>
                  {habits.map((habit) => (
                    <option key={habit._id} value={habit._id}>
                      {habit.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All priorities</option>
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                </select>
              </div>
              {(selectedTopic || selectedHabit || selectedPriority) && (
                <button
                  onClick={() => {
                    setSelectedTopic("");
                    setSelectedHabit("");
                    setSelectedPriority("");
                  }}
                  className="w-full md:col-span-2 lg:col-span-4 py-2 px-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Ideas List */}
        {filteredIdeas.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
              <Lightbulb className="w-10 h-10 text-amber-500 dark:text-amber-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">
              {searchQuery || selectedTopic || selectedHabit || selectedPriority
                ? "No ideas match your filters"
                : "No ideas yet"}
            </p>
            {!searchQuery && !selectedTopic && !selectedHabit && !selectedPriority && (
              <button
                onClick={() => setShowAddModal(true)}
                className="tap-target px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg active:shadow-xl active:scale-95 transition-all duration-200 touch-active no-select min-h-[48px]"
              >
                Capture your first idea
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredIdeas.map((idea) => {
              const isExpanded = expandedIdeas.has(idea._id);
              return (
                <div
                  key={idea._id}
                  className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg border-l-4 hover:shadow-xl transition-all duration-300 h-full flex flex-col ${
                    idea.priority === "important"
                      ? "border-amber-500 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20"
                      : "border-indigo-500"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {idea.priority === "important" && (
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Important</span>
                        </div>
                      )}
                      <p
                        className={`text-slate-900 dark:text-slate-100 font-medium ${
                          isExpanded ? "" : "line-clamp-2"
                        }`}
                      >
                        {idea.text}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(idea._id)}
                      className="ml-3 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="flex flex-wrap gap-2 flex-1">
                      {idea.habitId && (
                        <span className="text-xs px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">
                          🔗 {habits.find((h) => h._id === idea.habitId)?.name || "Habit"}
                        </span>
                      )}
                      {idea.tags && idea.tags.length > 0 && (
                        <>
                          {idea.tags.map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-2 flex-shrink-0">
                      {format(new Date(idea.createdAt), "MMM d")}
                    </span>
                  </div>

                  {idea.text.length > 100 && (
                    <button
                      onClick={() => toggleExpand(idea._id)}
                      className="mt-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                    >
                      {isExpanded ? "Show less" : "Show more →"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} defaultTab="idea" />
      <Navigation />
    </div>
  );
}
