"use client";

import { useState } from "react";
import type { CategoryTargets } from "@/lib/domain/types";
import { formatDuration } from "@/lib/domain/dates";

const initial: CategoryTargets = { health: 480, relationships: 60, identity: 60, challengeInterest: 420 };

export function OnboardingScreen({
  onComplete,
  onLoadDemo,
}: {
  onComplete: (targets: CategoryTargets) => void;
  onLoadDemo: () => void;
}) {
  const [targets, setTargets] = useState(initial);

  const rows: Array<{ key: keyof CategoryTargets; label: string; hint: string }> = [
    { key: "health", label: "Health", hint: "Sleep, exercise, nutrition" },
    { key: "relationships", label: "Relationships", hint: "Family, friends, connection" },
    { key: "identity", label: "Identity", hint: "Hobbies, creativity, personal pursuits" },
    { key: "challengeInterest", label: "Challenge / Interest", hint: "Study, work, projects, skill-building" },
  ];

  return (
    <main className="site-shell center-shell">
      <section className="onboarding-card">
        <span className="eyebrow">1440</span>
        <h1>Give every hour a purpose.</h1>
        <p className="lede">Set the daily allocation you want your life to reflect. Your score measures how closely your actual day matches these personal goals.</p>

        <div className="target-stack">
          {rows.map((row) => (
            <label key={row.key} className="target-control">
              <div><strong>{row.label}</strong><span>{row.hint}</span></div>
              <div className="range-value">{formatDuration(targets[row.key])}</div>
              <input
                type="range"
                min="0"
                max="720"
                step="15"
                value={targets[row.key]}
                onChange={(event) => setTargets({ ...targets, [row.key]: Number(event.target.value) })}
              />
            </label>
          ))}
        </div>

        <div className="button-row">
          <button className="primary-button" onClick={() => onComplete(targets)}>Start planning tomorrow</button>
          <button className="secondary-button" onClick={onLoadDemo}>Load demo instead</button>
        </div>
        <p className="fine-print">Maintenance and intentional Free time still count toward your 24 hours, but they do not affect the balance score.</p>
      </section>
    </main>
  );
}
