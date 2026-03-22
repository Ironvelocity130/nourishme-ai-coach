import { useState } from "react";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const mealSlots = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;

const suggestedMeals: Record<string, string[]> = {
  Breakfast: ["Overnight Oats & Berries", "Veggie Omelette", "Smoothie Bowl", "Avocado Toast"],
  Lunch: ["Quinoa Buddha Bowl", "Grilled Chicken Wrap", "Mediterranean Salad", "Lentil Soup"],
  Dinner: ["Salmon & Roasted Veggies", "Turkey Stir Fry", "Black Bean Tacos", "Chicken Curry"],
  Snack: ["Apple & Peanut Butter", "Greek Yogurt", "Trail Mix", "Hummus & Veggies"],
};

type PlanGrid = Record<string, Record<string, string>>;

const buildInitialPlan = (): PlanGrid => {
  const plan: PlanGrid = {};
  days.forEach((day) => {
    plan[day] = {};
    mealSlots.forEach((slot) => {
      plan[day][slot] = "";
    });
  });
  // Prefill a couple
  plan["Mon"]["Breakfast"] = "Overnight Oats & Berries";
  plan["Mon"]["Lunch"] = "Quinoa Buddha Bowl";
  plan["Tue"]["Dinner"] = "Salmon & Roasted Veggies";
  return plan;
};

const MealPlanner = () => {
  const [plan, setPlan] = useState<PlanGrid>(buildInitialPlan);
  const [selectedDay, setSelectedDay] = useState("Mon");

  const autoSuggest = (day: string, slot: string) => {
    const options = suggestedMeals[slot];
    const meal = options[Math.floor(Math.random() * options.length)];
    setPlan((prev) => ({
      ...prev,
      [day]: { ...prev[day], [slot]: meal },
    }));
  };

  const dayIndex = days.indexOf(selectedDay);

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Meal Planner" subtitle="Plan your week for better nutrition." />

      <div className="nourish-section space-y-4">
        {/* Day Selector */}
        <div className="flex items-center gap-2 animate-fade-up">
          <button
            onClick={() => setSelectedDay(days[Math.max(0, dayIndex - 1)])}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 flex gap-1.5">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200 active:scale-95 ${
                  selectedDay === day
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSelectedDay(days[Math.min(6, dayIndex + 1)])}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Meal Slots */}
        <div className="space-y-3 animate-fade-up" style={{ animationDelay: "80ms" }}>
          {mealSlots.map((slot) => {
            const meal = plan[selectedDay]?.[slot];
            return (
              <div key={slot} className="nourish-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{slot}</span>
                  <button
                    onClick={() => autoSuggest(selectedDay, slot)}
                    className="flex items-center gap-1.5 text-xs text-primary font-medium hover:text-primary/80 transition-colors active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Suggest
                  </button>
                </div>
                {meal ? (
                  <p className="text-sm font-medium">{meal}</p>
                ) : (
                  <p className="text-sm text-muted-foreground/60 italic">Tap "Suggest" for ideas</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
