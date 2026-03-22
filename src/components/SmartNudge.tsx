import { Lightbulb } from "lucide-react";

const nudges = [
  "You're under your protein goal today — try adding some chicken or tofu to dinner.",
  "Don't forget to log dinner! You've only logged 2 meals so far.",
  "Nice job hitting your water goal! 💧 Keep it up.",
  "You've been under your calorie goal 3 days in a row — want some higher-calorie ideas?",
];

const SmartNudge = () => {
  const nudge = nudges[Math.floor(Math.random() * nudges.length)];

  return (
    <div className="nourish-card flex items-start gap-3 bg-nourish-green-50 border-nourish-green-200/40">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Lightbulb className="w-4 h-4 text-primary" />
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">{nudge}</p>
    </div>
  );
};

export default SmartNudge;
