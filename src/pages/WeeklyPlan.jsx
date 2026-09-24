import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000";
const nutrients = [["Calories", "calories", "kcal"], ["Protein", "protein", "g"], ["Carbs", "carbs", "g"], ["Fat", "fat", "g"]];

export default function WeeklyPlan() {
  const [guide, setGuide] = useState(null); const [error, setError] = useState("");
  useEffect(() => { const token = localStorage.getItem("token"); if (!token) return setError("Please log in and complete your profile first."); axios.get(`${API_URL}/api/food/guide/weekly`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => setGuide(r.data)).catch((e) => setError(e.response?.data?.message || "Could not load your weekly guide.")); }, []);
  if (error || !guide) return <GuideMessage message={error || "Building your personal weekly guide..."} />;
  const { profile, targets, weeklyPlan } = guide;
  return <main className="min-h-screen bg-slate-50 pt-24 pb-12 px-4"><div className="max-w-6xl mx-auto">
    <section className="rounded-3xl bg-gradient-to-br from-green-800 to-emerald-600 text-white p-7 md:p-10 shadow-xl"><p className="uppercase tracking-[0.2em] text-xs text-green-100">Your personal nutrition guide</p><div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mt-3"><div><h1 className="text-3xl md:text-4xl font-bold">Weekly plan for {profile.goalLabel}</h1><p className="mt-2 text-green-50">Designed from your height, weight, age and activity level.</p></div><div className="rounded-2xl bg-white/15 px-5 py-3"><p className="text-sm text-green-100">BMI</p><p className="text-2xl font-bold">{profile.bmi.value} <span className="text-sm font-medium">{profile.bmi.category}</span></p></div></div></section>
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">{nutrients.map(([label, key, unit]) => <div key={key} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"><p className="text-2xl font-bold text-slate-800">{targets[key]}<span className="text-sm ml-1 text-slate-500">{unit}</span></p><p className="text-sm text-slate-500 mt-1">Daily {label.toLowerCase()}</p></div>)}</section>
    <section className="mt-8"><div className="flex justify-between items-center mb-4"><div><h2 className="text-2xl font-bold text-slate-800">Your seven-day menu</h2><p className="text-slate-500 text-sm">Adapt portions to your daily targets and hunger.</p></div><Link to="/daily" className="text-sm font-semibold text-green-700">View today’s progress →</Link></div><div className="grid lg:grid-cols-2 gap-4">{weeklyPlan.map((day) => <article key={day.day} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"><h3 className="font-bold text-lg text-slate-800">{day.day}</h3><ul className="mt-3 space-y-2">{day.meals.map((meal, index) => <li key={index} className="text-sm text-slate-600 leading-relaxed border-l-2 border-green-200 pl-3">{meal}</li>)}</ul><p className="mt-4 rounded-xl bg-green-50 text-green-800 p-3 text-sm">Tip: {day.tip}</p></article>)}</div></section>
  </div></main>;
}

function GuideMessage({ message }) { return <main className="min-h-screen pt-28 px-4"><div className="max-w-md mx-auto bg-white rounded-2xl shadow p-7 text-center text-slate-600">{message}<div className="mt-4"><Link to="/form" className="text-green-700 font-semibold">Open profile form</Link></div></div></main>; }
