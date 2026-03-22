import { useState } from "react";
import { Clock, Flame, Filter } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const recipes = [
  {
    name: "Quinoa Buddha Bowl",
    diet: "vegan",
    time: 20,
    calories: 420,
    image: "🥗",
    ingredients: ["Quinoa", "Chickpeas", "Avocado", "Kale", "Tahini"],
    steps: ["Cook quinoa.", "Roast chickpeas at 400°F for 20 min.", "Assemble with greens, avocado, and drizzle tahini."],
    protein: 18, carbs: 52, fats: 16,
  },
  {
    name: "Grilled Salmon Bowl",
    diet: "keto",
    time: 25,
    calories: 520,
    image: "🐟",
    ingredients: ["Salmon", "Asparagus", "Lemon", "Olive Oil", "Garlic"],
    steps: ["Season salmon with lemon and garlic.", "Grill for 4-5 min each side.", "Serve with roasted asparagus."],
    protein: 38, carbs: 8, fats: 35,
  },
  {
    name: "Overnight Oats",
    diet: "vegetarian",
    time: 5,
    calories: 340,
    image: "🥣",
    ingredients: ["Oats", "Almond Milk", "Chia Seeds", "Berries", "Honey"],
    steps: ["Mix oats, milk, and chia seeds.", "Refrigerate overnight.", "Top with berries and honey."],
    protein: 12, carbs: 52, fats: 8,
  },
  {
    name: "Turkey Lettuce Wraps",
    diet: "keto",
    time: 15,
    calories: 280,
    image: "🌯",
    ingredients: ["Ground Turkey", "Butter Lettuce", "Soy Sauce", "Ginger", "Water Chestnuts"],
    steps: ["Brown turkey with ginger.", "Add soy sauce and water chestnuts.", "Spoon into lettuce cups."],
    protein: 28, carbs: 6, fats: 14,
  },
  {
    name: "Chickpea Curry",
    diet: "vegan",
    time: 30,
    calories: 380,
    image: "🍛",
    ingredients: ["Chickpeas", "Coconut Milk", "Curry Paste", "Spinach", "Rice"],
    steps: ["Simmer chickpeas in coconut milk with curry paste.", "Add spinach until wilted.", "Serve over rice."],
    protein: 14, carbs: 48, fats: 15,
  },
  {
    name: "Greek Chicken Salad",
    diet: "balanced",
    time: 15,
    calories: 390,
    image: "🥙",
    ingredients: ["Chicken Breast", "Cucumber", "Tomato", "Feta", "Olives", "Olive Oil"],
    steps: ["Grill and slice chicken.", "Toss veggies with olive oil.", "Top with feta and olives."],
    protein: 35, carbs: 12, fats: 22,
  },
];

const diets = ["all", "vegan", "vegetarian", "keto", "balanced"] as const;

const RecipeBrowser = () => {
  const [diet, setDiet] = useState<string>("all");
  const [selected, setSelected] = useState<typeof recipes[0] | null>(null);

  const filtered = diet === "all" ? recipes : recipes.filter((r) => r.diet === diet);

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Recipes" subtitle="Healthy meals for every lifestyle." />

      <div className="nourish-section space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar animate-fade-up">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {diets.map((d) => (
            <button
              key={d}
              onClick={() => setDiet(d)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 active:scale-95 ${
                diet === d
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {d === "all" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        {/* Recipe Detail */}
        {selected ? (
          <div className="animate-fade-up">
            <button
              onClick={() => setSelected(null)}
              className="text-xs text-primary font-medium mb-3 active:scale-95"
            >
              ← Back to recipes
            </button>
            <div className="nourish-card">
              <div className="text-4xl mb-3">{selected.image}</div>
              <h2 className="text-lg font-bold">{selected.name}</h2>
              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selected.time} min</span>
                <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> {selected.calories} cal</span>
                <span className="capitalize">{selected.diet}</span>
              </div>

              <div className="flex gap-3 mt-4">
                <div className="flex-1 bg-secondary rounded-xl p-2.5 text-center">
                  <p className="text-xs text-muted-foreground">Protein</p>
                  <p className="text-sm font-bold macro-protein tabular-nums">{selected.protein}g</p>
                </div>
                <div className="flex-1 bg-secondary rounded-xl p-2.5 text-center">
                  <p className="text-xs text-muted-foreground">Carbs</p>
                  <p className="text-sm font-bold macro-carbs tabular-nums">{selected.carbs}g</p>
                </div>
                <div className="flex-1 bg-secondary rounded-xl p-2.5 text-center">
                  <p className="text-xs text-muted-foreground">Fats</p>
                  <p className="text-sm font-bold macro-fats tabular-nums">{selected.fats}g</p>
                </div>
              </div>

              <h3 className="text-sm font-semibold mt-5 mb-2">Ingredients</h3>
              <ul className="space-y-1">
                {selected.ingredients.map((ing, i) => (
                  <li key={i} className="text-sm text-foreground/80 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40" /> {ing}
                  </li>
                ))}
              </ul>

              <h3 className="text-sm font-semibold mt-5 mb-2">Steps</h3>
              <ol className="space-y-2">
                {selected.steps.map((step, i) => (
                  <li key={i} className="text-sm text-foreground/80 flex gap-3">
                    <span className="text-xs font-bold text-primary tabular-nums mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          /* Recipe Grid */
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((recipe, i) => (
              <button
                key={recipe.name}
                onClick={() => setSelected(recipe)}
                className="nourish-card text-left hover:shadow-md transition-shadow duration-200 active:scale-[0.98] animate-fade-up"
                style={{ animationDelay: `${80 + i * 60}ms` }}
              >
                <div className="text-3xl mb-2">{recipe.image}</div>
                <h3 className="text-sm font-semibold leading-snug">{recipe.name}</h3>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {recipe.time}m</span>
                  <span className="flex items-center gap-0.5"><Flame className="w-3 h-3" /> {recipe.calories}</span>
                </div>
                <span className="inline-block mt-2 px-2 py-0.5 bg-secondary rounded-full text-[10px] font-medium capitalize">
                  {recipe.diet}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeBrowser;
