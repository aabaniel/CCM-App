"use client";

import { useState } from "react";
import { HistoryScreen } from "./history-screen";
import { OnboardingScreen } from "./onboarding-screen";
import { ProgressScreen } from "./progress-screen";
import { TodayScreen } from "./today-screen";
import { TomorrowScreen } from "./tomorrow-screen";
import { use1440Store } from "@/lib/storage/store";

export type Tab = "today" | "tomorrow" | "history" | "progress";

const tabs: Array<{ id: Tab; label: string; icon: string }> = [
  { id: "today", label: "Today", icon: "◉" },
  { id: "tomorrow", label: "Tomorrow", icon: "＋" },
  { id: "history", label: "History", icon: "↺" },
  { id: "progress", label: "Progress", icon: "◆" },
];

export function 1440App() {
  const store = use1440Store();
  const [tab, setTab] = useState<Tab>("today");

  if (!store.loaded) {
    return (
      <main className="site-shell center-shell">
        <div className="loading-card">Loading your 1,440 minutes…</div>
      </main>
    );
  }

  if (!store.state.onboardingCompleted) {
    return <OnboardingScreen onComplete={store.completeOnboarding} onLoadDemo={store.loadDemo} />;
  }

  return (
    <main className="site-shell">
      <section className="app-frame">
        <header className="topbar">
          <div>
            <div className="brand-row"><span className="brand-mark">1440</span><span className="brand-name">1440</span></div>
            <p className="tagline">You focus on the life that you want to build.</p>
          </div>
          <button className="ghost-button compact" onClick={store.loadDemo}>Demo data</button>
        </header>

        <div className="screen-wrap">
          {tab === "today" && <TodayScreen store={store} />}
          {tab === "tomorrow" && <TomorrowScreen store={store} />}
          {tab === "history" && <HistoryScreen store={store} />}
          {tab === "progress" && <ProgressScreen store={store} />}
        </div>

        <nav className="tabbar" aria-label="Primary navigation">
          {tabs.map((item) => (
            <button
              key={item.id}
              className={tab === item.id ? "tab-button active" : "tab-button"}
              onClick={() => setTab(item.id)}
            >
              <span className="tab-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </section>
      <aside className="desktop-note">
        <span className="eyebrow">WEB MVP</span>
        <h2>Your day is a budget of 1,440 minutes.</h2>
        <p>Plan tomorrow, live today, and compare your actual allocation with the life balance you chose for yourself.</p>
        <div className="desktop-note-grid">
          <div><strong>Local-first</strong><span>No account required</span></div>
          <div><strong>AI optional</strong><span>Works without an API key</span></div>
          <div><strong>Vercel-ready</strong><span>Next.js App Router</span></div>
        </div>
      </aside>
    </main>
  );
}
