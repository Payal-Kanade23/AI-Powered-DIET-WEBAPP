// ProfileForm.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function ProfileForm({ onPlanGenerated }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    height: "", weight: "", age: "", gender: "male",
    activityLevel: "moderate", goal: "maintain", dietaryPreference: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);
          const token = localStorage.getItem("token");
    try {
    const res = await axios.post("http://localhost:5000/api/food/profile", 
     form
    ,
  {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
    onPlanGenerated?.(res.data);
    navigate("/week");
    } catch (error) {
      alert(error.response?.data?.message || "Could not generate your guide.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto  bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Your Details</h2>

      <div className="grid grid-cols-2 gap-3">
        <input name="height" type="number" placeholder="Height (cm)" value={form.height}
          onChange={handleChange} className="border rounded-lg p-2" required />
        <input name="weight" type="number" placeholder="Weight (kg)" value={form.weight}
          onChange={handleChange} className="border rounded-lg p-2" required />
      </div>

      <input name="age" type="number" placeholder="Age" value={form.age}
        onChange={handleChange} className="border rounded-lg p-2 w-full" required />

      <select name="gender" value={form.gender} onChange={handleChange} className="border rounded-lg p-2 w-full">
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <select name="activityLevel" value={form.activityLevel} onChange={handleChange} className="border rounded-lg p-2 w-full">
        <option value="sedentary">Sedentary</option>
        <option value="light">Light</option>
        <option value="moderate">Moderate</option>
        <option value="active">Active</option>
        <option value="very_active">Very Active</option>
      </select>

      <select name="goal" value={form.goal} onChange={handleChange} className="border rounded-lg p-2 w-full">
        <option value="lose_weight">Lose Weight</option>
        <option value="gain_weight">Gain Weight</option>
        <option value="maintain">Maintain</option>
        <option value="build_muscle">Build Muscle</option>
      </select>

      <input name="dietaryPreference" placeholder="Dietary preference (optional)" value={form.dietaryPreference}
        onChange={handleChange} className="border rounded-lg p-2 w-full" />

      <button type="submit" disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
        {loading ? "Generating plan..." : "Generate Weekly Plan"}
      </button>
    </form>
  );
}
