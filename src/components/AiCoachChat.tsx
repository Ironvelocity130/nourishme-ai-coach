import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Hey there! 👋 I'm your NourishMe coach. I noticed you've been under your calorie goal 3 days in a row — want some higher-calorie healthy meal ideas? Or ask me anything about your diet!",
  },
];

const AiCoachChat = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Mock AI response
    setTimeout(() => {
      const responses = [
        "Based on your logs today, you still have about 400 calories to go. How about a bowl of Greek yogurt with granola and berries? That would also help with your protein goal! 🥣",
        "Great question! Post-lunch fatigue is often caused by high-glycemic carbs. Try swapping white rice for quinoa or adding more leafy greens to stay energized. 🥗",
        "Looking at your week, your protein intake is averaging 62g/day — a bit under your 90g target. Adding a handful of almonds or an egg to breakfast could help! 🥚",
      ];
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responses[Math.floor(Math.random() * responses.length)] },
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-x-0 bottom-20 z-50 mx-4 max-w-lg sm:mx-auto animate-slide-up">
      <div className="bg-card rounded-3xl shadow-2xl shadow-foreground/8 border border-border/60 flex flex-col h-[28rem] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-tight">AI Meal Coach</h3>
            <p className="text-xs text-muted-foreground">Personalized nutrition advice</p>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-secondary-foreground rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse-soft" />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse-soft [animation-delay:0.2s]" />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse-soft [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2">
          <div className="flex items-center gap-2 bg-secondary/60 rounded-2xl px-4 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask your coach anything..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-opacity disabled:opacity-30 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiCoachChat;
