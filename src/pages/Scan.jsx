import { useState, useRef , useEffect } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
    ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
export default function Scan() {
  const webcamRef = useRef(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/food/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data)
      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const healthy = history.filter(
    (item) => item.healthRating === "Healthy" || "Excellant"
  ).length;

  const moderate = history.filter(
    (item) => item.healthRating === "Moderate"
  ).length;

  const unhealthy = history.filter(
    (item) => item.healthRating === "Unhealthy" || "Poor"
  ).length;

  const data = {
    labels: ["Healthy", "Moderate", "Unhealthy"],
    datasets: [
      {
        data: [healthy, moderate, unhealthy],
        backgroundColor: [
          "#22c55e",
          "#f59e0b",
          "#ef4444",
        ],
      },
    ],
  };

  
  const navigate = useNavigate();
  const [showLoginModel , setShowLoginModel] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [nutrition, setNutrition] = useState(null);

  // Upload from gallery
  const handleScanClick = () =>{
    const token = localStorage.getItem("token");
    if(token){
       setShowCamera(true);
    }else{
      setShowLoginModel(true);
    }
  }
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setShowCamera(false);
  };

  // Capture from webcam
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();

    setImage(imageSrc);
    setPreview(imageSrc);

    setShowCamera(false);
  };

  // Analyze Image
  const analyzeImage = async () => {
    const token = localStorage.getItem("token");
    console.log("tokem"+token);
    if (!image) {
      alert("Please upload or capture an image.");
      return;
    }

    const formData = new FormData();

    if (image instanceof File) {
      formData.append("image", image);
    } else {
      const blob = await (await fetch(image)).blob();
      formData.append("image", blob, "capture.jpg");
    }

    try {
      setLoading(true);
   

      const res = await axios.post(
        "http://localhost:5000/api/food/scan",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data)
      setNutrition(res.data);
      fetchHistory();
    } catch (err) {
      console.log(err);
      alert("Image analysis failed."+err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = nutrition
    ? {
        labels: ["Protein", "Fat", "Carbs"],
        datasets: [
          {
            label: "Nutrition (g)",
            data: [
              nutrition.protein,
              nutrition.fat,
              nutrition.carbs,
            ],
            backgroundColor: [
              "#22c55e",
              "#ef4444",
              "#f59e0b",
            ],
          },
        ],
      }
    : null;

  return (
    <div className="max-w-5xl mx-auto pt-20 py-10 px-5">

      <h1 className="text-4xl font-bold text-center mb-10 text-green-600">
        🍽 AI NutriScanner
      </h1>

      <div className="flex flex-col items-center">

  {/* Scan Card */}
  {!showCamera && !preview && (
    <div
      onClick={handleScanClick}
      className="w-80 h-80 border-2 border-dashed border-green-500 rounded-3xl
      flex flex-col justify-center items-center cursor-pointer
      hover:bg-green-50 hover:scale-105 transition-all duration-300 shadow-lg"
    >
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-5">
        <FaCamera className="text-5xl text-green-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800">
        Scan Food
      </h2>

      <p className="text-gray-500 mt-3 text-center px-6">
        Tap to open your camera and scan your meal
      </p>
    </div>
  )}

  {/* Webcam */}
  {showCamera && (
    <div className="w-full max-w-xl">

      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-2xl w-full shadow-lg"
        videoConstraints={{
          facingMode: "environment",
        }}
      />

      <div className="flex justify-center gap-4 mt-5">

        <button
          onClick={capture}
          className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
        >
          📸 Capture Photo
        </button>

        <button
          onClick={() => setShowCamera(false)}
          className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600"
        >
          Cancel
        </button>

      </div>

    </div>
  )}
  {showLoginModel && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
      <h2 className="text-xl font-bold mb-2">Login Required</h2>

      <p className="text-gray-600 mb-6">
        Please log in to use the Food Scanner.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowLoginModel(false)}
          className="px-4 py-2 bg-gray-300 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={() => navigate("/login",{
            state:{from: "/scan"}
          })}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Login
        </button>
      </div>
    </div>
  </div>
)}

  {/* Gallery Upload */}

  {!showCamera && !preview && (
    <label
      className="mt-8 bg-white border border-gray-300 shadow-md rounded-xl
      px-8 py-4 cursor-pointer hover:shadow-lg transition"
   onClick={(e)=>{
    const token = localStorage.getItem("token");
    if(!token){
      e.preventDefault();
      setShowLoginModel(true);

    }
   }}

   >
      🖼 Upload From Gallery

      <input
        hidden
        type="file"
        accept="image/*"
        onChange={handleImage}
      />
    </label>
  )}

</div>
{preview && (
  <div className="mt-10">

    <img
      src={preview}
      alt="Food"
      className="w-full max-w-xl mx-auto rounded-2xl shadow-lg object-cover"
    />

    <div className="flex justify-center gap-4 mt-6">

      <button
        onClick={analyzeImage}
        className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700"
      >
        {loading ? "Analyzing..." : "🔍 Analyze Food"}
      </button>

      <button
        onClick={() => {
          setPreview("");
          setImage(null);
          setNutrition(null);
        }}
        className="bg-gray-500 text-white px-8 py-3 rounded-xl hover:bg-gray-600"
      >
        Scan Again
      </button>

    </div>

  </div>
)}
      {/* Nutrition */}

      {nutrition && (

        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">

            <div className="bg-blue-100 p-6 rounded-xl text-center shadow">
              <h2 className="font-bold text-lg">Calories</h2>
              <p className="text-2xl mt-2">
                {nutrition.calories} kcal
              </p>
            </div>

            <div className="bg-green-100 p-6 rounded-xl text-center shadow">
              <h2 className="font-bold text-lg">Protein</h2>
              <p className="text-2xl mt-2">
                {nutrition.protein} g
              </p>
            </div>

            <div className="bg-red-100 p-6 rounded-xl text-center shadow">
              <h2 className="font-bold text-lg">Fat</h2>
              <p className="text-2xl mt-2">
                {nutrition.fat} g
              </p>
            </div>

            <div className="bg-yellow-100 p-6 rounded-xl text-center shadow">
              <h2 className="font-bold text-lg">Carbs</h2>
              <p className="text-2xl mt-2">
                {nutrition.carbs} g
              </p>
            </div>

          </div>

          <div className="bg-white shadow-lg rounded-xl p-8 mt-10">

            <h2 className="text-2xl font-bold mb-5">
              Nutrition Graph
            </h2>

            <Bar data={chartData} />

          </div>
        </>

      )}
       <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-600">
        Scan History
      </h1>

      
{history.length === 0 ? (
  <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl border">
    <p className="text-gray-500 text-lg">
      No scan history available.
    </p>
  </div>
):(
  <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-white shadow-lg rounded-xl p-6 m-10">
          <Pie data={data}  />
        </div>
  <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow rounded-lg p-4"
            >
              <h2 className="font-bold text-lg">
                {item.foodName}
              </h2>

              <p>Calories: {item.calories} kcal</p>
              <p>Protein: {item.protein} g</p>
              <p>Carbs: {item.carbs} g</p>
              <p>Fat: {item.fat} g</p>

             <span
  className={`inline-block mt-2 px-3 py-1 rounded-full text-white ${
    ["Very Healthy", "Healthy", "Excellent", "Good"].includes(item.healthRating)
      ? "bg-green-500"
      : item.healthRating === "Moderate"
      ? "bg-yellow-500"
      : "bg-red-500"
  }`}
>
  {item.healthRating}
</span>
               
            </div>
          ))}
        </div>
   </div>   

)}

        
      </div>

    </div>
  );
}