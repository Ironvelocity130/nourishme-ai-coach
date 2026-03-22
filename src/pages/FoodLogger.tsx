import { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const foodDatabase = [
  { name: "Oatmeal", calories: 150, protein: 5, carbs: 27, fats: 3 },
  { name: "Grilled Chicken Breast", calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  { name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fats: 0.7 },
  { name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fats: 1.8 },
  { name: "Salmon Fillet", calories: 208, protein: 20, carbs: 0, fats: 13 },
  { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fats: 0.4 },
  { name: "Almonds (1 oz)", calories: 164, protein: 6, carbs: 6, fats: 14 },
  { name: "Avocado (half)", calories: 160, protein: 2, carbs: 9, fats: 15 },
  { name: "Eggs (2 large)", calories: 144, protein: 13, carbs: 1, fats: 10 },
  { name: "Sweet Potato", calories: 103, protein: 2, carbs: 24, fats: 0.1 },
];

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

type LogEntry = { food: typeof foodDatabase[0]; mealType: MealType };

const FoodLogger = () => {
  const [search, setSearch] = useState("");
  const [activeMeal, setActiveMeal] = useState<MealType>("Lunch");
  const [logged, setLogged] = useState<LogEntry[]>([
    { food: foodDatabase[0], mealType: "Breakfast" },
    { food: foodDatabase[1], mealType: "Lunch" },
  ]);

  const filtered = search.trim()
    ? foodDatabase.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  const addFood = (food: typeof foodDatabase[0]) => {
    setLogged((prev) => [...prev, { food, mealType: activeMeal }]);
    setSearch("");
  };

  const removeFood = (index: number) => {
    setLogged((prev) => prev.filter((_, i) => i !== index));
  };

  const mealEntries = logged.filter((e) => e.mealType === activeMeal);
  const totalCals = logged.reduce((s, e) => s + e.food.calories, 0);

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Food Log" subtitle={`${totalCals} calories logged today`} />

      <div className="nourish-section space-y-4">
        {/* Meal Type Selector */}
        <div className="flex gap-2 animate-fade-up">
          {mealTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveMeal(type)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 active:scale-95 ${
                activeMeal === type
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative animate-fade-up" style={{ animationDelay: "80ms" }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search foods..."
            className="w-full bg-card border border-border/60 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
          />
          {search && filtered.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-card rounded-2xl border border-border/60 shadow-lg overflow-hidden z-20">
              {filtered.map((food, i) => (
                <button
                  key={i}
                  onClick={() => addFood(food)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium">{food.name}</p>
                    <p className="text-xs text-muted-foreground">
                      P: {food.protein}g · C: {food.carbs}g · F: {food.fats}g
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold tabular-nums">{food.calories} cal</span>
                    <Plus className="w-4 h-4 text-primary" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logged Foods */}
        <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
          <h2 className="text-sm font-semibold mb-3">{activeMeal} — {mealEntries.length} items</h2>
          {mealEntries.length === 0 ? (
            <div className="nourish-card text-center py-8">
              <p className="text-sm text-muted-foreground">No foods logged yet for {activeMeal.toLowerCase()}.</p>
              <p className="text-xs text-muted-foreground mt-1">Search above to add foods.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {mealEntries.map((entry, i) => {
                const globalIndex = logged.indexOf(entry);
                return (
                  <div key={i} className="nourish-card flex items-center justify-between py-3.5">
                    <div>
                      <p className="text-sm font-medium">{entry.food.name}</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="macro-protein">{entry.food.protein}g P</span>
                        {" · "}
                        <span className="macro-carbs">{entry.food.carbs}g C</span>
                        {" · "}
                        <span className="macro-fats">{entry.food.fats}g F</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold tabular-nums">{entry.food.calories}</span>
                      <button
                        onClick={() => removeFood(globalIndex)}
                        className="w-7 h-7 rounded-full bg-destructive/10 text-destructive flex items-center justify-center active:scale-95 transition-transform"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodLogger;
