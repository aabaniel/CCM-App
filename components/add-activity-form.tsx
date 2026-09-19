"use client";

import { useState } from "react";
import { CATEGORY_VALUES, type Activity, type ActivityCategory } from "@/lib/domain/types";
import { categoryMeta } from "@/lib/domain/categories";
import { formatMinutes } from "@/lib/domain/dates";

export function AddActivityForm({ onAdd, existing }: { onAdd: (activity: Activity) => void; existing: Activity[] }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ActivityCategory>("challengeInterest");
  const [start, setStart] = useState(540);
  const [end, setEnd] = useState(600);
  const [flexibility, setFlexibility] = useState<Activity["flexibility"]>("flexible");
  const [message, setMessage] = useState("");
  const [classifying, setClassifying] = useState(false);

  const classify = async () => {
    if (!title.trim()) return;
    setClassifying(true);
    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_name: title.trim() }),
      });
      const data = (await response.json()) as { category?: ActivityCategory };
      if (data.category) setCategory(data.category);
    } finally {
      setClassifying(false);
    }
  };

  const submit = () => {
    setMessage("");
    if (!title.trim()) return setMessage("Give the activity a name.");
    if (end <= start) return setMessage("End time must be after start time.");
    if (existing.some((item) => start < item.plannedEndMinutes && end > item.plannedStartMinutes)) {
      return setMessage("That time overlaps another activity.");
    }
    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      category,
      plannedStartMinutes: start,
      plannedEndMinutes: end,
      flexibility,
      status: "planned",
    });
    setTitle("");
    setStart(end);
    setEnd(Math.min(1440, end + 60));
  };

  return (
    <div className="activity-form">
      <div className="form-grid">
        <label className="field wide">
          <span>Activity</span>
          <div className="input-action-row">
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Study algorithms" maxLength={160} />
            <button className="mini-button" onClick={classify} disabled={!title.trim() || classifying}>{classifying ? "…" : "AI classify"}</button>
          </div>
        </label>
        <label className="field">
          <span>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value as ActivityCategory)}>
            {CATEGORY_VALUES.map((value) => <option key={value} value={value}>{categoryMeta[value].label}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Flexibility</span>
          <select value={flexibility} onChange={(event) => setFlexibility(event.target.value as Activity["flexibility"])}>
            <option value="flexible">Flexible</option>
            <option value="fixed">Fixed</option>
          </select>
        </label>
        <label className="field">
          <span>Start · {formatMinutes(start)}</span>
          <input type="range" min="0" max="1425" step="15" value={start} onChange={(event) => setStart(Number(event.target.value))} />
        </label>
        <label className="field">
          <span>End · {formatMinutes(end)}</span>
          <input type="range" min="15" max="1440" step="15" value={end} onChange={(event) => setEnd(Number(event.target.value))} />
        </label>
      </div>
      {message && <p className="form-error">{message}</p>}
      <button className="primary-button full" onClick={submit}>Add to tomorrow</button>
    </div>
  );
}
