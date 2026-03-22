import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { getStoredProfile } from "@/pages/Profile";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`;

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Hey there! 👋 I'm your NourishMe coach. Ask me anything about your diet — meal ideas, nutrition tips, or how to hit your goals!",
  },
];

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    onError(body.error || "Something went wrong");
    return;
  }

  if (!resp.body) {
    onError("No response body");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }

  // Flush remaining
  if (buffer.trim()) {
    for (let raw of buffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

const AiCoachChat = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > updatedMessages.length) {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev.slice(0, updatedMessages.length), { role: "assistant", content: assistantSoFar }];
      });
    };

      const profile = getStoredProfile();
      const contextMsg: Message | null = profile
        ? {
            role: "user" as const,
            content: `[CONTEXT — do not repeat this back, just use it to personalize advice]\nName: ${profile.name}, Age: ${profile.age}, Weight: ${profile.weightLbs} lbs, Height: ${profile.heightFt}'${profile.heightIn}", Goal: ${profile.goal} weight, Daily calorie target: ${profile.dailyCalories ?? "not set"} cal`,
          }
        : null;

      const messagesWithContext = contextMsg
        ? [contextMsg, ...updatedMessages]
        : updatedMessages;

      await streamChat({
        messages: messagesWithContext,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => setLoading(false),
        onError: (msg) => {
          toast.error(msg);
          setLoading(false);
        },
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to reach AI coach");
      setLoading(false);
    }
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
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none [&>p]:m-0 [&>ul]:mt-1 [&>ul]:mb-0">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {loading && messages[messages.length - 1]?.role !== "assistant" && (
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
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
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
