"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, Plus, Lightbulb, User } from "lucide-react";
import AddModal from "./AddModal";

export default function Navigation() {
  const pathname = usePathname();
  const [showAddModal, setShowAddModal] = useState(false);

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/habits", icon: Target, label: "Habits" },
    { href: "/ideas", icon: Lightbulb, label: "Ideas" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 z-50 shadow-premium-lg safe-bottom">
        <div className="max-w-md mx-auto flex items-center justify-around h-20 px-2 pb-safe">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`tap-target flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 touch-active no-select ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 scale-110"
                    : "text-slate-500 dark:text-slate-400 active:text-slate-700 dark:active:text-slate-300"
                }`}
              >
                <div className={`p-2.5 rounded-xl transition-all duration-200 ${isActive ? "bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 shadow-premium" : "active:bg-slate-100 dark:active:bg-slate-800"}`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className={`text-xs sm:text-sm mt-1 font-semibold tracking-tight ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          <button
            onClick={() => setShowAddModal(true)}
            className="tap-target flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 touch-active no-select active:scale-95"
            aria-label="Add new item"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-premium active:shadow-premium-lg transition-all duration-200 hover:scale-110">
              <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <span className="text-xs sm:text-sm mt-1 font-semibold text-indigo-600 dark:text-indigo-400 tracking-tight">Add</span>
          </button>
        </div>
      </nav>
      <AddModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </>
  );
}
