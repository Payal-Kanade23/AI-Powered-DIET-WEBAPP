// ProfileForm.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function ProfileForm({ onPlanGenerated }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "male",
    activityLevel: "moderate",
    goal: "maintain",
    dietaryPreference: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setError("");
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in before generating a weekly plan.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/food/profile`,
        {
          ...form,
          height: Number(form.height),
          weight: Number(form.weight),
          age: Number(form.age),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onPlanGenerated?.(response.data);
      navigate("/week");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not generate your nutrition guide. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100";

  return (
    <main className="min-h-screen mt-10 bg-slate-50 px-4 py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/60 md:grid-cols-5">
        <section className="bg-gradient-to-br from-green-800 to-emerald-600 p-8 text-white md:col-span-2 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-100">
            Personal nutrition
          </p>

          <h1 className="mt-4 text-3xl font-bold leading-tight">
            Build a plan that fits your lifestyle.
          </h1>

          <p className="mt-4 text-sm leading-6 text-green-50">
            Tell us a few details and we will create personalised calorie and
            nutrition targets for your seven-day meal plan.
          </p>

          <div className="mt-10 space-y-4">
            {[
              ["01", "Your body details"],
              ["02", "Activity and fitness goal"],
              ["03", "Your weekly meal guide"],
            ].map(([number, text]) => (
              <div key={number} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs font-bold">
                  {number}
                </span>
                <span className="text-sm font-medium text-green-50">{text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 sm:p-8 md:col-span-3 md:p-10">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-slate-800">Your details</h2>
            <p className="mt-1 text-sm text-slate-500">
              You can adjust these later from your weekly plan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Height
                </span>
                <div className="relative">
                  <input
                    name="height"
                    type="number"
                    min="50"
                    max="300"
                    placeholder="e.g. 170"
                    value={form.height}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                  <span className="absolute right-4 top-3.5 text-sm text-slate-400">
                    cm
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Weight
                </span>
                <div className="relative">
                  <input
                    name="weight"
                    type="number"
                    min="20"
                    max="500"
                    step="0.1"
                    placeholder="e.g. 65"
                    value={form.weight}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                  <span className="absolute right-4 top-3.5 text-sm text-slate-400">
                    kg
                  </span>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Age
                </span>
                <input
                  name="age"
                  type="number"
                  min="13"
                  max="120"
                  placeholder="e.g. 25"
                  value={form.age}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Gender
                </span>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Daily activity level
              </span>
              <select
                name="activityLevel"
                value={form.activityLevel}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="sedentary">Sedentary — little movement</option>
                <option value="light">Light — exercise 1–3 days/week</option>
                <option value="moderate">Moderate — exercise 3–5 days/week</option>
                <option value="active">Active — exercise 6–7 days/week</option>
                <option value="very_active">Very active — intense daily exercise</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Primary goal
              </span>
              <select
                name="goal"
                value={form.goal}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="lose_weight">Lose weight</option>
                <option value="maintain">Maintain weight</option>
                <option value="gain_weight">Gain weight</option>
                <option value="build_muscle">Build muscle</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Dietary preference{" "}
                <span className="font-normal text-slate-400">(optional)</span>
              </span>
              <input
                name="dietaryPreference"
                placeholder="e.g. Vegetarian, vegan, halal, gluten-free"
                value={form.dietaryPreference}
                onChange={handleChange}
                className={inputClass}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center rounded-xl bg-green-700 px-5 py-3.5 font-semibold text-white shadow-lg shadow-green-700/20 transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating your plan..." : "Generate Weekly Plan"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}