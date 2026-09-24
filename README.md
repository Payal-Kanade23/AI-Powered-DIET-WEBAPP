# NutriGuide

NutriGuide is a full-stack diet companion that uses food-image scanning to build a daily nutrition log, track personalised calorie and macro targets, and generate a weekly meal guide.

## Features

- Account registration and login with JWT authentication.
- AI food-image analysis using Gemini; every scan is stored in MongoDB.
- Personal targets calculated from height, weight, age, gender, activity level, and goal.
- Daily Goal dashboard with live consumed totals, remaining targets, nutrient progress, and scanned foods.
- Local-time daily tracking: a new local calendar day starts at zero while past scans stay in history.
- Seven-day meal guide with BMI and daily calorie, protein, carbohydrate, and fat targets.
- Responsive Scan, Daily Goal, and Weekly Guide pages.

## Tech stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, React Icons
- Backend: Express, MongoDB/Mongoose, JWT, Multer
- AI: Google Gemini (`@google/genai`)

## Prerequisites

- Node.js 18 or newer
- MongoDB database (local or Atlas)
- Google Gemini API key

## Setup

Install the frontend packages from the project root:

```bash
npm install
```

Install backend packages:

```bash
cd backend
npm install
```

Create `backend/.env` with the following values:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=use_a_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
npm run dev
```

The API runs at `http://localhost:5000`; Vite will print the frontend URL (normally `http://localhost:5173`).

## Daily tracking behavior

When the browser requests daily data, it sends its IANA timezone in the `X-Timezone` header. The backend uses it to query scans between the user’s local midnight and the next local midnight, including daylight-saving changes.

This means:

- Multiple scans on the same local day accumulate in the Daily Goal totals.
- The Scan page shows only today’s scans.
- At the next local day, the Scan and Daily Goal pages begin at zero.
- Previous scans are retained and available through the full history endpoint.

## API routes

All routes are prefixed with `/api/food`. Routes marked as protected require `Authorization: Bearer <token>`.

| Method | Route | Description |
| --- | --- | --- |
| POST | `/register` | Create an account |
| POST | `/login` | Log in and receive a token |
| POST | `/scan` | Protected; upload an `image` and store AI nutrition results |
| GET | `/history` | Protected; retrieve all stored scans |
| GET | `/history/today` | Protected; retrieve only scans from the browser’s local day |
| POST | `/profile` | Protected; save profile and generate targets/weekly guide |
| GET | `/profile/me` | Protected; retrieve the saved guide |
| GET | `/guide/weekly` | Protected; retrieve weekly guide data |
| GET | `/analytics/today` | Protected; retrieve daily totals, targets, percentages, insights, and today’s scans |

For `GET /history/today` and `GET /analytics/today`, send `X-Timezone: Asia/Kolkata` (or the browser’s resolved IANA timezone) for correct local-day results.

## API integration details

The frontend currently uses Axios with `http://localhost:5000` as its API base URL. Protected calls include a JWT from `localStorage` and, for daily data, the browser timezone:

```js
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "X-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
};
```

### Authentication calls

#### `POST /api/food/register`

Creates a user and returns a JWT.

```json
{
  "name": "Asha",
  "email": "asha@example.com",
  "password": "password"
}
```

#### `POST /api/food/login`

Authenticates a user. Store the returned `token` in `localStorage` before using protected routes.

```json
{
  "email": "asha@example.com",
  "password": "password"
}
```

### Food scan calls

#### `POST /api/food/scan`

Protected `multipart/form-data` upload. The file field must be named `image`.

```js
const formData = new FormData();
formData.append("image", file);

await axios.post("http://localhost:5000/api/food/scan", formData, {
  headers: { Authorization: `Bearer ${token}` },
});
```

The backend sends the image to Gemini using structured JSON output, then stores this shape in `FoodScan`:

```json
{
  "foodName": "Vegetable rice bowl",
  "calories": 420,
  "protein": 14,
  "carbs": 68,
  "fat": 11,
  "healthRating": "Healthy",
  "suggestion": "Add a protein source for a more balanced meal",
  "image": "uploaded-file-name.jpg",
  "createdAt": "2026-09-25T07:30:00.000Z"
}
```

#### `GET /api/food/history`

Protected. Returns the complete scan history in reverse chronological order. This endpoint intentionally does not filter old records, so it can be reused for future history/report views.

#### `GET /api/food/history/today`

Protected. Requires `X-Timezone`. Returns only scans created during the requester’s current local calendar day.

```json
{
  "date": "2026-09-25",
  "timeZone": "Asia/Kolkata",
  "scans": []
}
```

### Profile and guide calls

#### `POST /api/food/profile`

Protected. Saves or updates the user profile, calculates personalised macro targets, and generates a seven-day meal plan.

```json
{
  "height": 165,
  "weight": 65,
  "age": 24,
  "gender": "female",
  "activityLevel": "moderate",
  "goal": "maintain",
  "dietaryPreference": "vegetarian"
}
```

Allowed activity levels are `sedentary`, `light`, `moderate`, `active`, and `very_active`. Goals are `lose_weight`, `gain_weight`, `maintain`, and `build_muscle`.

The response returned by this call and by `GET /api/food/guide/weekly` has this guide-oriented shape:

```json
{
  "profile": {
    "height": 165,
    "weight": 65,
    "goal": "maintain",
    "goalLabel": "Weight maintenance",
    "bmi": { "value": 23.9, "category": "Healthy range" }
  },
  "targets": { "calories": 2000, "protein": 91, "carbs": 250, "fat": 60 },
  "weeklyPlan": [{ "day": "Monday", "meals": ["..."], "tip": "..." }],
  "generatedAt": "2026-09-25T07:30:00.000Z"
}
```

#### `GET /api/food/analytics/today`

Protected. Requires `X-Timezone`. This powers the Daily Goal page. It aggregates all of today’s scans with `Array.reduce`, compares totals against the stored profile targets, and returns ready-to-render nutrient status data.

```json
{
  "totals": { "calories": 420, "protein": 14, "carbs": 68, "fat": 11 },
  "targets": { "calories": 2000, "protein": 91, "carbs": 250, "fat": 60 },
  "nutrients": [
    {
      "key": "calories",
      "consumed": 420,
      "target": 2000,
      "remaining": 1580,
      "overBy": 0,
      "percentage": 21,
      "status": "below"
    }
  ],
  "itemsToday": 1,
  "scans": [],
  "insights": ["1580 kcal remain in today's budget."]
}
```

`status` is `below`, `on_track`, or `over`. The UI clamps the visible progress-bar width to 100%, while preserving the actual percentage in the API response.

## Feature implementation map

| Feature | Frontend implementation | Backend implementation |
| --- | --- | --- |
| Login/session | JWT is stored in `localStorage` and included as a Bearer token in Axios calls. | `authMiddleware.js` verifies the token and places its payload on `req.user`. |
| Food image scan | `Scan.jsx` accepts a gallery image or webcam screenshot, constructs `FormData`, then posts `image` to `/scan`. | Multer writes the upload; Gemini identifies food and macros; `FoodScan.create()` persists the result. |
| Same-day scan list | `Scan.jsx` calls `/history/today` on mount and prepends a successful new scan to React state. | `getTodayScans()` filters `createdAt` using the local-day date range. |
| Daily totals | `DailyAnalytics.jsx` renders `nutrients`, `scans`, and `insights` from `/analytics/today`. | `getTodayAnalytics()` reads today’s documents and sums calories, protein, carbs, and fat with `reduce()`. |
| Immediate progress refresh | The Scan page dispatches a `food-scan-created` browser event and a `BroadcastChannel` notification. Daily Goal listens for both; it also refreshes every 60 seconds. | No push connection is needed; the existing analytics endpoint returns current database totals on each refresh. |
| New-day reset | The Scan and Daily Goal pages send the browser IANA timezone. | `localDay.js` calculates local midnight-to-midnight in UTC, including DST changes, then queries only that range. |
| Personal targets | `ProfileForm.jsx` posts the user’s measurements and redirects to the Weekly Guide. | `nutrition.js` calculates BMR/TDEE-based targets and BMI. Gemini supplies meals; a curated fallback plan is used if Gemini fails. |
| Weekly guide | `WeeklyPlan.jsx` requests `/guide/weekly` when mounted and renders targets, BMI, meals, and tips. | Profile data and generated plan are read from `UserProfile`. |

## Backend architecture

### Models

`FoodScan` stores one analysis result per upload. Its compound index `{ user: 1, createdAt: -1 }` supports user-specific daily and history reads efficiently.

`UserProfile` stores one profile per user, including input measurements, calculated targets, the generated weekly plan, and generation time.

`User` stores the account identity and hashed password.

### Nutrition target calculation

`backend/utils/nutrition.js` uses the Mifflin-St Jeor BMR formula, multiplies it by an activity factor, then applies a goal adjustment. Protein is calculated from body weight, fat is allocated as a portion of calories, and carbohydrates receive the remaining calories. These are practical guide values rather than medical advice.

### Local-day calculation

MongoDB timestamps are stored in UTC. `backend/utils/localDay.js` converts the browser-supplied IANA timezone into a UTC query range:

```js
{ createdAt: { $gte: startOfLocalDayUtc, $lt: startOfNextLocalDayUtc } }
```

Using an exclusive end boundary avoids duplicate records at midnight. The calculation accounts for 23- and 25-hour daylight-saving days.

## Frontend state and UI behavior

- `Scan.jsx` uses `useState` for selected image, preview, scan result, loading/error feedback, and today’s scan list.
- `useRef` holds the webcam instance used to create a screenshot.
- `useEffect` loads today’s scans when Scan mounts.
- `DailyAnalytics.jsx` uses `useCallback` for its fetch function and `useEffect` to subscribe to scan events, `BroadcastChannel` messages, and a 60-second refresh interval. Cleanup removes listeners and closes the channel.
- Empty states distinguish no scans today from loading and failed requests.
- The shared navigation and primary pages use the same green/slate palette, rounded cards, compact controls, responsive grids, and visible active navigation state.

## Error handling and fallback behavior

- Missing/invalid tokens return `401 Unauthorized` from the authentication middleware.
- Missing food image uploads return `400`.
- Missing user profiles return `404` for guide and analytics calls.
- Scan, guide, and analytics pages display request errors and retry/navigation actions where relevant.
- If the Gemini weekly-plan request fails or returns invalid JSON, the profile endpoint still returns a curated seven-day fallback plan.

## Build verification

Run a production frontend build:

```bash
npm run build
```

## Project structure

```text
src/pages/                 React pages, including Scan and DailyAnalytics
backend/controllers/       Authentication, food scanning, and profile controllers
backend/models/            User, FoodScan, and UserProfile Mongoose models
backend/utils/localDay.js  Local-time calendar-day query helper
backend/utils/nutrition.js Target and BMI calculations
```
