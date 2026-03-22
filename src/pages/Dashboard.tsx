import { Droplets, Flame, Plus, Minus, TrendingUp } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SmartNudge from "@/components/SmartNudge";
import { useState } from "react";

const macros = [
  { label: "Protein", current: 62, goal: 90, color: "bg-protein", textColor: "macro-protein" },
  { label: "Carbs", current: 180, goal: 250, color: "bg-carbs", textColor: "macro-carbs" },
  { label: "Fats", current: 45, goal: 65, color: "bg-fats", textColor: "macro-fats" },
];

const recentMeals = [
  { time: "8:30 AM", name: "Oatmeal with Berries", calories: 320, type: "Breakfast" },
  { time: "12:15 PM", name: "Grilled Chicken Salad", calories: 485, type: "Lunch" },
  { time: "3:00 PM", name: "Apple + Almond Butter", calories: 210, type: "Snack" },
];

const Dashboard = () => {
  const [waterGlasses, setWaterGlasses] = useState(5);
  const waterGoal = 8;
  const caloriesCurrent = 1015;
  const caloriesGoal = 2100;
  const caloriePercent = Math.round((caloriesCurrent / caloriesGoal) * 100);

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Good afternoon 🌿" subtitle="Here's your nutrition snapshot for today." />

      <div className="nourish-section space-y-4">
        {/* Smart Nudge */}
        <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
          <SmartNudge />
        </div>

        {/* Calorie Ring */}
        <div className="nourish-card animate-fade-up" style={{ animationDelay: "80ms" }}>
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${caloriePercent * 2.64} 264`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Flame className="w-4 h-4 text-primary mb-0.5" />
                <span className="text-xl font-bold tabular-nums">{caloriesCurrent}</span>
                <span className="text-[10px] text-muted-foreground">/ {caloriesGoal}</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {macros.map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`font-medium ${m.textColor}`}>{m.label}</span>
                    <span className="text-muted-foreground tabular-nums">{m.current}g / {m.goal}g</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${m.color} transition-all duration-700`}
                      style={{ width: `${Math.min((m.current / m.goal) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Water Tracker */}
        <div className="nourish-card animate-fade-up" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-nourish-water" />
              <span className="text-sm font-semibold">Water Intake</span>
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">{waterGlasses} / {waterGoal} glasses</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center active:scale-95 transition-transform"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex-1 flex gap-1.5">
              {Array.from({ length: waterGoal }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-5 rounded-full transition-colors duration-300 ${
                    i < waterGlasses ? "bg-water" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setWaterGlasses(Math.min(waterGoal, waterGlasses + 1))}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recent Meals */}
        <div className="animate-fade-up" style={{ animationDelay: "240ms" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Today's Meals
            </h2>
          </div>
          <div className="space-y-2">
            {recentMeals.map((meal, i) => (
              <div key={i} className="nourish-card flex items-center justify-between py-3.5">
                <div>
                  <p className="text-sm font-medium">{meal.name}</p>
                  <p className="text-xs text-muted-foreground">{meal.type} · {meal.time}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums">{meal.calories} cal</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
