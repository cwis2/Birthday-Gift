import { useEffect, useRef, useState } from "react";

interface MessageWindowProps {
  lines: string[];
  isOpen: boolean;
  onClose: () => void;
}

export function MessageWindow({ lines, isOpen, onClose }: MessageWindowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const line = lines[currentIndex] ?? "";
  const isFinal = currentIndex === lines.length - 1;

  useEffect(() => {
    if (!isOpen) return;
    setCurrentIndex(0);
    setIsClosing(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isClosing) return;
    setVisibleCount(0);
    setIsTyping(line.length > 0);
    if (!line.length) return;
    let count = 0;
    const timer = window.setInterval(() => {
      count += 1;
      setVisibleCount(count);
      if (count >= line.length) {
        window.clearInterval(timer);
        setIsTyping(false);
      }
    }, 30);
    return () => window.clearInterval(timer);
  }, [currentIndex, isClosing, isOpen, line]);

  useEffect(() => () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
  }, []);

  const close = () => {
    if (isClosing) return;
    setIsClosing(true);
    closeTimer.current = window.setTimeout(onClose, 200);
  };

  const advance = () => {
    if (isClosing) return;
    if (isTyping) {
      setVisibleCount(line.length);
      setIsTyping(false);
      return;
    }
    if (isFinal) close();
    else setCurrentIndex((index) => index + 1);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (["Enter", " ", "ArrowRight", "a", "A"].includes(event.key)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        advance();
      } else if (["ArrowLeft", "b", "B"].includes(event.key)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (currentIndex === 0 && isTyping) {
          setVisibleCount(line.length);
          setIsTyping(false);
        } else {
          setCurrentIndex((index) => Math.max(0, index - 1));
        }
      }
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [advance, currentIndex, isOpen, isTyping, line.length]);

  if (!isOpen || lines.length === 0) return null;
  const fontSize = line.length > 150 ? 13 : line.length > 110 ? 14 : line.length > 75 ? 15 : 17;

  return (
    <div
      role="dialog"
      aria-label="Birthday message"
      aria-modal="true"
      className={`message-window${isClosing ? " message-window-closing" : ""}`}
      onClick={advance}
    >
      <style>{`
        @keyframes message-window-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes message-line-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes message-hint-blink { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }
        .message-window { position:absolute; inset:0; z-index:100; display:flex; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; color:#3b3b3b; background:linear-gradient(145deg,#ececec,#dcdcdc); border:1px solid #b9b9b9; box-shadow:inset 0 0 0 3px #f7f7f7, inset 0 2px 8px rgb(0 0 0 / .16); font-family:var(--ds-font, Nunito, ui-rounded, system-ui, sans-serif); cursor:pointer; animation:message-window-in 200ms ease-out both; }
        .message-window-closing { opacity:0; transition:opacity 200ms ease-out; }
        .message-line { width:100%; max-height:154px; overflow:hidden; text-align:center; overflow-wrap:anywhere; line-height:1.4; animation:message-line-in 200ms ease-out both; }
        .message-hint-blink { animation:message-hint-blink 1.1s steps(2,end) infinite; }
        @media (prefers-reduced-motion: reduce) { .message-window, .message-line { animation:none; } .message-window-closing { transition:none; } .message-hint-blink { animation:none; } }
      `}</style>
      <div
        key={currentIndex}
        className="message-line"
        aria-live="polite"
        style={{ fontSize, fontStyle: isFinal ? "italic" : undefined, textAlign: isFinal ? "right" : "center" }}
      >
        {line.slice(0, visibleCount)}
      </div>
      <div aria-hidden="true" style={{ position:"absolute", left:20, bottom:12, fontSize:10, opacity:.7 }}>
        {currentIndex + 1} / {lines.length}
      </div>
      {isFinal ? (
        <button
          type="button"
          aria-label="Close message"
          onClick={(event) => { event.stopPropagation(); close(); }}
          style={{ position:"absolute", right:14, bottom:10, border:0, background:"transparent", color:"#555", font: "inherit", fontSize:11, cursor:"pointer" }}
        >Close</button>
      ) : (
        <div className="message-hint-blink" style={{ position:"absolute", right:17, bottom:10, fontSize:14 }} aria-hidden="true">▼ A</div>
      )}
    </div>
  );
}
