import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import AiCoachChat from "./AiCoachChat";

const AiCoachButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <AiCoachChat onClose={() => setOpen(false)} />}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
        aria-label={open ? "Close AI Coach" : "Open AI Coach"}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
};

export default AiCoachButton;
