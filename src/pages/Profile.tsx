import { useState, useEffect } from "react";
import { Target, Activity, Save, Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";

export type UserProfile = {
  name: string;
  age: number;
  weightLbs: number;
  heightFt: number;
  heightIn: number;
  goal: "lose" | "maintain" | "gain";
  dailyCalories?: number;
};

export const getStoredProfile = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem("nourishme-profile");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    return getStoredProfile() || {
      name: "Alex",
      age: 28,
      weightLbs: 159,
      heightFt: 5,
      heightIn: 9,
      goal: "maintain",
    };
  });

  // Convert to metric for BMR calculation
  const weightKg = profile.weightLbs * 0.453592;
  const heightCm = profile.heightFt * 30.48 + profile.heightIn * 2.54;

  const bmr = Math.round(
    profile.goal === "lose"
      ? 10 * weightKg + 6.25 * heightCm - 5 * profile.age - 161 - 300
      : profile.goal === "gain"
      ? 10 * weightKg + 6.25 * heightCm - 5 * profile.age - 161 + 300
      : 10 * weightKg + 6.25 * heightCm - 5 * profile.age - 161
  );

  const dailyCalories = Math.round(bmr * 1.55);

  const goals = [
    { key: "lose" as const, label: "Lose Weight", icon: "📉" },
    { key: "maintain" as const, label: "Maintain", icon: "⚖️" },
    { key: "gain" as const, label: "Gain Weight", icon: "📈" },
  ];

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Profile" subtitle="Your goals shape your nutrition plan." />

      <div className="nourish-section space-y-4">
        {/* Name */}
        <div className="nourish-card animate-fade-up">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</label>
          <input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full mt-2 bg-secondary/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
          />
        </div>

        {/* Body Stats */}
        <div className="nourish-card animate-fade-up" style={{ animationDelay: "80ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Body Stats</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-muted-foreground">Age</label>
              <div className="flex items-baseline gap-1 mt-1">
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                  className="w-full bg-secondary/60 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 tabular-nums"
                />
                <span className="text-[11px] text-muted-foreground shrink-0">yrs</span>
              </div>
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground">Weight</label>
              <div className="flex items-baseline gap-1 mt-1">
                <input
                  type="number"
                  value={profile.weightLbs}
                  onChange={(e) => setProfile({ ...profile, weightLbs: Number(e.target.value) })}
                  className="w-full bg-secondary/60 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 tabular-nums"
                />
                <span className="text-[11px] text-muted-foreground shrink-0">lbs</span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <label className="text-[11px] text-muted-foreground">Height</label>
            <div className="flex items-baseline gap-2 mt-1">
              <input
                type="number"
                value={profile.heightFt}
                onChange={(e) => setProfile({ ...profile, heightFt: Number(e.target.value) })}
                className="w-20 bg-secondary/60 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 tabular-nums"
              />
              <span className="text-[11px] text-muted-foreground shrink-0">ft</span>
              <input
                type="number"
                value={profile.heightIn}
                onChange={(e) => setProfile({ ...profile, heightIn: Number(e.target.value) })}
                className="w-20 bg-secondary/60 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 tabular-nums"
              />
              <span className="text-[11px] text-muted-foreground shrink-0">in</span>
            </div>
          </div>
        </div>

        {/* Goal */}
        <div className="nourish-card animate-fade-up" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Goal</span>
          </div>
          <div className="flex gap-2">
            {goals.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setProfile({ ...profile, goal: key })}
                className={`flex-1 py-3 rounded-xl text-center transition-all duration-200 active:scale-95 ${
                  profile.goal === key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <div className="text-lg mb-0.5">{icon}</div>
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Calculated Target */}
        <div className="nourish-card bg-nourish-green-50 border-nourish-green-200/40 animate-fade-up" style={{ animationDelay: "240ms" }}>
          <p className="text-xs text-muted-foreground mb-1">Your daily calorie target</p>
          <p className="text-3xl font-bold text-primary tabular-nums">{dailyCalories}</p>
          <p className="text-xs text-muted-foreground mt-1">calories / day (based on moderate activity)</p>
        </div>

        <button
          onClick={() => {
            localStorage.setItem("nourishme-profile", JSON.stringify({ ...profile, dailyCalories }));
            toast.success("Profile saved! Your AI coach will use these details.");
          }}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-sm animate-fade-up"
          style={{ animationDelay: "320ms" }}
        >
          <Save className="w-4 h-4" /> Save Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
