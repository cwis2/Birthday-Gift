import { useCallback, useEffect, useRef, useState } from "react";

// ── Text content (populate these) ─────────────────────────────────────────────
type DialogueLine = { speaker: string; text: string };
import { assetUrl } from "@/lib/asset-url";

export const BYSTANDER_BUBBLES: DialogueLine[] = [
  { speaker: "Godzilla Cat", text: "GRAAAAAAAHHHHHH!!" },
  { speaker: "Bystander", text: "..." },
  { speaker: "Bystander", text: "What? Aren't cats supposed to meow?" },
  { speaker: "Godzilla Cat", text: "*angry little cat noises*" },
  { speaker: "Bystander", text: "Oh, sorry. Was that supposed to be scary?" },
];

export const NAHOBEHO_BUBBLES: DialogueLine[] = [
  { speaker: "Nahobeeho", text: "WHOA-HO-HO!! A fellow monster enthusiast, ho!" },
  { speaker: "Nahobeeho", text: "I LOVE CO-HO-SPLAYING!!" },
  { speaker: "Nahobeeho", text: "You even got the little arms and everything, hee-ho! What a committed performance, ho!" },
  { speaker: "Nahobeeho", text: "So, which Godzilla are you dressed as, ho? The one with the atomic breath, or the one that gets beaten up by King Ghidorah every other movie?" },
  { speaker: "Godzilla Cat", text: "..." },
  { speaker: "Nahobeeho", text: "You should totally enter a cosplay contest, hee-ho! You'd win first place in the tiny monster category, ho!" },
];

export const COLLECTOR_BUBBLES: DialogueLine[] = [
  { speaker: "Collector", text: "EXCUSE ME?! WHAT IS THIS SUPPOSED TO BE?!" },
  { speaker: "Collector", text: "This is literally SO disrespectful! A REAL Goji fan would know that Shin Godzilla's fourth form is an existential nightmare representing the consequences of unchecked human hubris, NOT SOME OVERSIZED CAT WITH AN ATTITUDE PROBLEM!" },
  { speaker: "Collector", text: "AND DON'T EVEN GET ME STARTED ON THE SECOND FORM! The aquatic traits, the gills, the evolutionary implications—actually, do you even KNOW what the name *Gojira* means?!" },
  { speaker: "Godzilla Cat", text: "..." },
  { speaker: "Collector", text: "Oh, so you're just going to WALK AWAY?! I HAVEN'T EVEN GOTTEN TO THE EVOLUTIONARY IMPLICATIONS OF THE FIFTH FORM YET!!" },
  { speaker: "Godzilla Cat", text: "*quietly leaves while the collector continues ranting offscreen*" },
];

export const AFTER_COLLECTOR_BUBBLES: DialogueLine[] = [
  { speaker: "Collector", text: "AND ANOTHER THING! MINUS ONE HAD A BETTER—!!" },
  { speaker: "Godzilla Cat", text: "..." },
  { speaker: "Godzilla Cat", text: "Maybe... I'll never be the real Godzilla." },
  { speaker: "Godzilla Cat", text: "Nobody takes me seriously." },
  { speaker: "Godzilla Cat", text: "I'm too small to destroy cities. Too cute to inspire terror. And apparently, too much of a cat to even be a convincing monster..." },
  { speaker: "Godzilla Cat", text: "..." },
  { speaker: "Godzilla Cat", text: "Maybe I should just give up." },
];

export const CHOICE_OPTIONS = [
  "\"You're amazing just the way you are!",
  "\"You're the King of the Monsters to me!",
  "\"Who cares what those losers think?",
  "\"Go show them what you're made of!",
];

export const POST_CHOICE_BUBBLES: DialogueLine[] = [
  { speaker: "Godzilla Cat", text: "..." },
  { speaker: "Godzilla Cat", text: "You're right." },
  { speaker: "Godzilla Cat", text: "I might not be the biggest monster. I might not be the scariest monster. And I might have been mistaken for a cosplayer three times in a row..." },
  { speaker: "Godzilla Cat", text: "But that doesn't mean I can't make someone's day a little more special!" },
  { speaker: "Godzilla Cat", text: "Here! I made this for you!" },
  { speaker: "Godzilla Cat", text: "*Godzilla Cat hands over a little envelope.*" },
  { speaker: "Godzilla Cat", text: "Happy birthday!" },
  { speaker: "Godzilla Cat", text: "And, uh... don't tell anyone I got emotional. I'm supposed to be terrifying." },
];

// ── Types ─────────────────────────────────────────────────────────────────────
export type GamePhase =
  | "blackout"
  | "title"
  | "field-enter"
  | "bystander-enter"
  | "bystander-talk"
  | "bystander-exit"
  | "nahobeho-enter"
  | "nahobeho-talk"
  | "nahobeho-exit"
  | "collector-enter"
  | "collector-talk"
  | "collector-exit"
  | "post-collector-talk"
  | "choice"
  | "post-choice-talk"
  | "letter";

// ── Constants ─────────────────────────────────────────────────────────────────
// Native 3DS resolutions
export const GAME_TOP_W = 400;
export const GAME_TOP_H = 240;
export const GAME_BOT_W = 320;
export const GAME_BOT_H = 240;

// Sprite pixels from top of top-screen where feet land
const GROUND_Y = GAME_TOP_H - 16;

// Sprite display heights (px at native resolution)
const SPRITE_H: Record<string, number> = {
  cat:       330,
  bystander: 180,
  nahobeho:  110,
  collector: 105,
};

function spriteBottom(name: string): number {
  return GROUND_Y - (SPRITE_H[name] ?? 80);
}

// Cat rests at 2/3 right; NPCs stop at 1/3 left — both measured from left edge
const CAT_REST_X  = Math.round(GAME_TOP_W * 0.70);
const NPC_REST_X  = Math.round(GAME_TOP_W * 0.18);
const OFF_LEFT    = -200;   // off-screen left
const OFF_RIGHT   = GAME_TOP_W + 200; // off-screen right

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 2);
}

// ── TextBubble ────────────────────────────────────────────────────────────────
export function TextBubble({
  text,
  speakerName,
  onNext,
}: {
  text: string;
  speakerName?: string;
  onNext: () => void;
}) {
  // capture keydown at capture phase so it fires before Console3DS's listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (["Enter", " ", "a", "A", "z", "Z"].includes(e.key)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        onNext();
      }
    };
    window.addEventListener("keydown", handler, { capture: true });
    return () => window.removeEventListener("keydown", handler, { capture: true });
  }, [onNext]);

  return (
    <div
      onClick={onNext}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "6px 8px",
        cursor: "pointer",
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "rgba(240,248,255,0.97)",
          border: "3px solid #2a6dc5",
          borderRadius: 10,
          padding: "8px 10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          position: "relative",
        }}
      >
        {speakerName && (
          <div
            style={{
              position: "absolute",
              top: -18,
              left: 10,
              background: "#2a6dc5",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              padding: "1px 8px",
              borderRadius: "6px 6px 0 0",
              fontFamily: "monospace",
            }}
          >
            {speakerName}
          </div>
        )}
        <p
          style={{
            margin: 0,
            fontSize: 11,
            lineHeight: 1.45,
            color: "#1a1a2e",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
          }}
        >
          {text}
        </p>
        <div
          style={{
            textAlign: "right",
            fontSize: 9,
            color: "#888",
            marginTop: 4,
            fontFamily: "monospace",
          }}
        >
          ▼
        </div>
      </div>
    </div>
  );
}

// ── ChoiceMenu ────────────────────────────────────────────────────────────────
export function ChoiceMenu({
  options,
  onSelect,
}: {
  options: string[];
  onSelect: (i: number) => void;
}) {
  const [sel, setSel] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopImmediatePropagation();
        setSel((s) => Math.max(0, s - 1));
      }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        e.stopImmediatePropagation();
        setSel((s) => Math.min(options.length - 1, s + 1));
      }
      if (e.key === "Enter" || e.key === " " || e.key.toLowerCase() === "a") {
        e.preventDefault();
        e.stopImmediatePropagation();
        onSelect(sel);
      }
    };
    window.addEventListener("keydown", handler, { capture: true });
    return () => window.removeEventListener("keydown", handler, { capture: true });
  }, [sel, options.length, onSelect]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: 4,
        padding: "48px 8px 8px",
        zIndex: 50,
      }}
    >
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => { setSel(i); onSelect(i); }}
          onMouseEnter={() => setSel(i)}
          style={{
            background: sel === i
              ? "linear-gradient(135deg,#3b9dff,#1055c7)"
              : "rgba(240,248,255,0.9)",
            border: sel === i ? "3px solid #fff" : "2px solid #2a6dc5",
            borderRadius: 8,
            color: sel === i ? "#fff" : "#1a1a2e",
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "monospace",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "4px 6px",
            boxShadow: sel === i ? "0 0 10px rgba(59,157,255,0.7)" : "none",
            transition: "all 0.1s",
          }}
        >
          <span style={{ whiteSpace:"pre-line" }}>{opt}</span>
        </button>
      ))}
    </div>
  );
}

// ── useBirthdayGame hook ──────────────────────────────────────────────────────
// Manages all state; returns render functions for top and bottom screen.
export function useBirthdayGame(onClose: () => void, isActive = false, onEnvelopeAppears?: () => void) {
  const [phase, setPhase]           = useState<GamePhase>("idle" as GamePhase);
  const [titleAlpha, setTitleAlpha] = useState(1);
  const [catX, setCatX]             = useState<number>(OFF_RIGHT);
  const [bystanderX, setBystanderX] = useState<number>(OFF_LEFT);
  const [nahobehoX, setNahobehoX]   = useState<number>(OFF_LEFT);
  const [collectorX, setCollectorX] = useState<number>(OFF_LEFT);
  const [useCatStill, setUseCatStill] = useState(false);
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [letterScale, setLetterScale] = useState(0);
  const animRef  = useRef<number | null>(null);
  const catXRef  = useRef(OFF_RIGHT);

  const cancelAnim = () => { if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; } };

  // Start / reset the game sequence when isActive changes
  useEffect(() => {
    if (isActive) {
      cancelAnim();
      setPhase("blackout");
      setTitleAlpha(1);
      setCatX(OFF_RIGHT);
      setBystanderX(OFF_LEFT);
      setNahobehoX(OFF_LEFT);
      setCollectorX(OFF_LEFT);
      setUseCatStill(false);
      setBubbleIndex(0);
      setLetterScale(0);
      catXRef.current = OFF_RIGHT;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  function animate(
    fromX: number,
    toX: number,
    duration: number,
    setter: (v: number) => void,
    onDone: () => void,
  ): void {
    cancelAnim();
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setter(lerp(fromX, toX, easeOut(t)));
      if (t < 1) { animRef.current = requestAnimationFrame(tick); }
      else { onDone(); }
    };
    animRef.current = requestAnimationFrame(tick);
  }

  // ── Phase machine ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase === "blackout") {
      const t = setTimeout(() => setPhase("title"), 600);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [phase]);

  const goToField = useCallback(() => {
    if (phase !== "title") return;
    setTitleAlpha(0);
    setTimeout(() => {
      setCatX(OFF_RIGHT);
      catXRef.current = OFF_RIGHT;
      setUseCatStill(false);
      setPhase("field-enter");
    }, 500);
  }, [phase]);

  useEffect(() => {
    if (phase !== "title") return;
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      goToField();
    };
    window.addEventListener("keydown", handler, { capture: true });
    return () => window.removeEventListener("keydown", handler, { capture: true });
  }, [phase, goToField]);

  // field-enter: cat walks from left to CAT_REST_X
  useEffect(() => {
    if (phase !== "field-enter") return;
    setCatX(OFF_RIGHT);
    catXRef.current = OFF_RIGHT;
    animate(OFF_RIGHT, CAT_REST_X, 2000, (v) => { setCatX(v); catXRef.current = v; }, () => {
      setBystanderX(OFF_LEFT);
      setPhase("bystander-enter");
    });
    return cancelAnim;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // bystander-enter: bystander walks from left to NPC_REST_X
  useEffect(() => {
    if (phase !== "bystander-enter") return;
    setBystanderX(OFF_LEFT);
    animate(OFF_LEFT, NPC_REST_X, 1800, setBystanderX, () => {
      setUseCatStill(true);
      setBubbleIndex(0);
      setPhase("bystander-talk");
    });
    return cancelAnim;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // bystander-exit: bystander walks RIGHT off-screen
  useEffect(() => {
    if (phase !== "bystander-exit") return;
    setUseCatStill(false);
    const startX = bystanderX;
    animate(startX, OFF_RIGHT, 2400, setBystanderX, () => {
      setUseCatStill(false);
      setNahobehoX(OFF_LEFT);
      setPhase("nahobeho-enter");
    });
    return cancelAnim;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // nahobeho-enter
  useEffect(() => {
    if (phase !== "nahobeho-enter") return;
    setNahobehoX(OFF_LEFT);
    animate(OFF_LEFT, NPC_REST_X, 1800, setNahobehoX, () => {
      setUseCatStill(true);
      setBubbleIndex(0);
      setPhase("nahobeho-talk");
    });
    return cancelAnim;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // nahobeho-exit
  useEffect(() => {
    if (phase !== "nahobeho-exit") return;
    setUseCatStill(false);
    const startX = nahobehoX;
    animate(startX, OFF_RIGHT, 2400, setNahobehoX, () => {
      setUseCatStill(false);
      setCollectorX(OFF_LEFT);
      setPhase("collector-enter");
    });
    return cancelAnim;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // collector-enter
  useEffect(() => {
    if (phase !== "collector-enter") return;
    setCollectorX(OFF_LEFT);
    animate(OFF_LEFT, NPC_REST_X, 1800, setCollectorX, () => {
      setUseCatStill(true);
      setBubbleIndex(0);
      setPhase("collector-talk");
    });
    return cancelAnim;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // collector exits right while the cat stays in place for the dialogue and options
  useEffect(() => {
    if (phase !== "collector-exit") return;
    setUseCatStill(false);
    const startX = collectorX;
    animate(startX, OFF_RIGHT, 2400, setCollectorX, () => {
      setUseCatStill(true);
      setBubbleIndex(0);
      setPhase("post-collector-talk");
    });
    return cancelAnim;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // letter scale-in
  useEffect(() => {
    if (phase !== "letter") return;
    onEnvelopeAppears?.();
    setLetterScale(0);
    const DURATION = 600;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      setLetterScale(easeOut(t));
      if (t < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return cancelAnim;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, onEnvelopeAppears]);

  // ── Bubble advance ─────────────────────────────────────────────────────────
  const nextBubble = useCallback((bubbles: DialogueLine[], nextPhase: GamePhase) => {
    setBubbleIndex((i) => {
      const next = i + 1;
      if (next >= bubbles.length) { setPhase(nextPhase); return 0; }
      return next;
    });
  }, []);

  // ── Visibility helpers ────────────────────────────────────────────────────
  const isBlack = phase === "blackout" || phase === "title";
  const showCat = !isBlack &&
    phase !== "letter";
  const showBystander = ["bystander-enter","bystander-talk","bystander-exit"].includes(phase);
  const showNahobeho  = ["nahobeho-enter","nahobeho-talk","nahobeho-exit"].includes(phase);
  const showCollector = ["collector-enter","collector-talk","collector-exit"].includes(phase);

  // ── Top screen renderer ───────────────────────────────────────────────────
  const renderTop = (): React.ReactNode => {
    if (phase === "idle" as GamePhase) return null;
    if (isBlack) {
      return (
        <div style={{ position:"absolute", inset:0, background:"#000", display:"flex", alignItems:"center", justifyContent:"center", zIndex:20 }}>
          {phase === "title" && (
            <div style={{ opacity: titleAlpha, transition:"opacity 0.5s", textAlign:"center" }}>
              <div style={{ color:"#fff", fontSize:26, fontFamily:"monospace", fontWeight:700, textShadow:"0 0 20px #f5a623,0 0 40px #f5a623", lineHeight:1.3 }}>
                Shin Godzilla Cat's<br/>Big Adventure
              </div>
              <div style={{ color:"#aaa", fontSize:10, fontFamily:"monospace", marginTop:12 }}>by cwis</div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div style={{ position:"absolute", inset:0, overflow:"hidden" }}>
        <img src={assetUrl("/backgrounds/field.png")} alt="" style={{ position:"absolute", left:0, top:0, width:"100%", height:"100%", objectFit:"cover" }} />
        {showBystander && (
          <img src={assetUrl("/sprites/bystander.png")} alt="Bystander"
            style={{ position:"absolute", top: GROUND_Y - SPRITE_H["bystander"] * 90 / 125 - 14, left: bystanderX - 63 - 20, height: SPRITE_H["bystander"], imageRendering:"pixelated" }}
          />
        )}
        {showNahobeho && (
          <img src={assetUrl("/sprites/nahobeho.png")} alt="Nahobeho"
            style={{ position:"absolute", top: GROUND_Y - SPRITE_H["nahobeho"] - 18, left: nahobehoX - 28, height: SPRITE_H["nahobeho"], imageRendering:"pixelated" }}
          />
        )}
        {showCollector && (
          <img src={assetUrl("/sprites/collector.png")} alt="Collector"
            style={{ position:"absolute", top: spriteBottom("collector") - 18, left: collectorX - 24, height: SPRITE_H["collector"], imageRendering:"pixelated" }}
          />
        )}
        {showCat && (
          <img
            src={assetUrl(useCatStill ? "/sprites/cat.png" : "/animations/walk.gif")}
            alt="Shin Godzilla Cat"
            style={{ position:"absolute", top: GROUND_Y - SPRITE_H["cat"] * 376 / 636 - (useCatStill ? 64 : 11), left: catX - SPRITE_H["cat"] * 266 / 636 + 24 - (useCatStill ? 52 : 0), height: SPRITE_H["cat"], imageRendering:"pixelated" }}
          />
        )}
      </div>
    );
  };

  // ── Bottom screen renderer ────────────────────────────────────────────────
  const renderBottom = (): React.ReactNode => {
    if (phase === "idle" as GamePhase) return null;
    if (phase === "blackout") {
      return <div style={{ position:"absolute", inset:0, background:"#000", zIndex:20 }} />;
    }
    if (phase === "title") {
      return (
        <div style={{ position:"absolute", inset:0, background:"#000", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", zIndex:20 }} onClick={goToField}>
          <div style={{ color:"#ccc", fontSize:12, fontFamily:"monospace", opacity: titleAlpha, animation:"blink 1.2s infinite" }}>
            — Press any button to continue —
          </div>
          <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
        </div>
      );
    }
    if (phase === "bystander-talk") {
      const line = BYSTANDER_BUBBLES[bubbleIndex];
      return <div style={{ position:"absolute", inset:0 }}><TextBubble key={bubbleIndex} text={line.text} speakerName={line.speaker} onNext={() => nextBubble(BYSTANDER_BUBBLES, "bystander-exit")} /></div>;
    }
    if (phase === "nahobeho-talk") {
      const line = NAHOBEHO_BUBBLES[bubbleIndex];
      return <div style={{ position:"absolute", inset:0 }}><TextBubble key={bubbleIndex} text={line.text} speakerName={line.speaker} onNext={() => nextBubble(NAHOBEHO_BUBBLES, "nahobeho-exit")} /></div>;
    }
    if (phase === "collector-talk") {
      const line = COLLECTOR_BUBBLES[bubbleIndex];
      return <div style={{ position:"absolute", inset:0 }}><TextBubble key={bubbleIndex} text={line.text} speakerName={line.speaker} onNext={() => nextBubble(COLLECTOR_BUBBLES, "collector-exit")} /></div>;
    }
    if (phase === "post-collector-talk") {
      const line = AFTER_COLLECTOR_BUBBLES[bubbleIndex];
      return <div style={{ position:"absolute", inset:0 }}><TextBubble key={bubbleIndex} text={line.text} speakerName={line.speaker} onNext={() => nextBubble(AFTER_COLLECTOR_BUBBLES, "choice")} /></div>;
    }
    if (phase === "choice") {
      return <div style={{ position:"absolute", inset:0 }}>
        <div style={{ position:"absolute", top:5, left:8, right:8, textAlign:"center", fontFamily:"monospace", color:"#1a1a2e", zIndex:51 }}>
          <div style={{ fontSize:11, fontWeight:700 }}>What will you tell Godzilla Cat?</div>
          <div style={{ fontSize:9 }}>Choose your words carefully...</div>
        </div>
        <ChoiceMenu options={CHOICE_OPTIONS} onSelect={() => { setBubbleIndex(0); setPhase("post-choice-talk"); }} />
      </div>;
    }
    if (phase === "post-choice-talk") {
      const line = POST_CHOICE_BUBBLES[bubbleIndex];
      return <div style={{ position:"absolute", inset:0 }}><TextBubble key={bubbleIndex} text={line.text} speakerName={line.speaker} onNext={() => nextBubble(POST_CHOICE_BUBBLES, "letter")} /></div>;
    }
    if (phase === "letter") {
      return (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"#111", cursor:"pointer" }} onClick={onClose}>
          <img
            src={assetUrl("/sprites/letter.png")}
            alt="Letter"
            style={{ transform:`scale(${letterScale})`, maxWidth: GAME_BOT_W - 10, maxHeight: GAME_BOT_H - 10, objectFit:"contain", borderRadius:4, boxShadow:"0 0 20px rgba(255,200,100,0.5)" }}
          />
          {letterScale >= 1 && (
            <div style={{ position:"absolute", bottom:6, right:8, color:"#aaa", fontSize:9, fontFamily:"monospace" }}>(tap to close)</div>
          )}
        </div>
      );
    }
    return null;
  };

  return { renderTop, renderBottom, isActive: true };
}

// ── Legacy wrapper (not used anymore, kept for type safety) ───────────────────
export function BirthdayGame({ onClose }: { onClose: () => void }) {
  const { renderTop, renderBottom } = useBirthdayGame(onClose);
  return (
    <div style={{ position:"absolute", inset:0 }}>
      <div style={{ position:"absolute", inset:0 }}>{renderTop()}</div>
      <div style={{ position:"absolute", inset:0 }}>{renderBottom()}</div>
    </div>
  );
}




