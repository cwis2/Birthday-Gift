import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { apps } from "@/data/apps";
import { TopScreen } from "./TopScreen";
import { BottomScreen, COLS, PER_PAGE } from "./BottomScreen";
import { House } from "./icons";

// ---- Configurable constants ----
export const SHELL_THEMES = [
  { name: "Aqua Blue", base: "#3fa9d6", edge: "#2a85ab" },
  { name: "Cosmo Black", base: "#1c1c1e", edge: "#0b0b0c" },
  { name: "Flame Red", base: "#d62c2c", edge: "#a51d1d" },
  { name: "Cobalt Blue", base: "#2449a8", edge: "#173279" },
  { name: "White", base: "#ecedef", edge: "#bfc2c7" },
  { name: "Pink", base: "#f39bc0", edge: "#d26f9a" },
];
const SCREEN_SCALE = 1.5;
const SHOW_SCANLINES = true;
const MIN_PAGES = 4;

const CONSOLE_W = 780;
const CONSOLE_H = 1010;

function Screen({ w, h, children }: { w: number; h: number; children: React.ReactNode }) {
  return (
    <div className="ds-glass" style={{ width: w * SCREEN_SCALE, height: h * SCREEN_SCALE }}>
      <div style={{ transform: `scale(${SCREEN_SCALE})`, transformOrigin: "top left", width: w, height: h }}>{children}</div>
      {SHOW_SCANLINES && <div className="ds-scanlines" />}
      <div className="ds-reflection" />
    </div>
  );
}

function Grill() {
  return (
    <div className="ds-grill">
      {Array.from({ length: 24 }, (_, i) => <span key={i} />)}
    </div>
  );
}

export function Console3DS() {
  const [shellTheme, setShellTheme] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);
  const [scale, setScale] = useState(0.6);
  const [slider, setSlider] = useState(0.4);
  const [pressed, setPressed] = useState<string | null>(null);
  const launchT = useRef<number[]>([]);

  const pageCount = Math.max(MIN_PAGES, Math.ceil(apps.length / PER_PAGE));
  const selectedApp = apps[selectedIndex];

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / (CONSOLE_W + 40), window.innerHeight / (CONSOLE_H + 70)));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const select = useCallback((i: number) => {
    setSelectedIndex(i);
    setCurrentPage(Math.floor(i / PER_PAGE));
  }, []);

  const changePage = useCallback(
    (p: number) => {
      const np = Math.max(0, Math.min(pageCount - 1, p));
      setCurrentPage(np);
      // keep selection on visible page if possible
      setSelectedIndex((cur) => {
        if (Math.floor(cur / PER_PAGE) === np) return cur;
        const first = np * PER_PAGE;
        return first < apps.length ? first : cur;
      });
    },
    [pageCount],
  );

  const open = useCallback(() => {
    if (!selectedApp || isLaunching) return;
    launchT.current.forEach(clearTimeout);
    setIsLaunching(true);
    launchT.current = [window.setTimeout(() => setIsLaunching(false), 1500)];
  }, [selectedApp, isLaunching]);

  const flash = (id: string) => {
    setPressed(id);
    setTimeout(() => setPressed((p) => (p === id ? null : p)), 140);
  };

  const move = useCallback(
    (dir: "left" | "right" | "up" | "down") => {
      setSelectedIndex((cur) => {
        const page = Math.floor(cur / PER_PAGE);
        const slot = cur % PER_PAGE;
        const row = Math.floor(slot / COLS);
        const col = slot % COLS;
        let n = cur;
        if (dir === "right") n = col < COLS - 1 ? cur + 1 : (page + 1) * PER_PAGE + row * COLS;
        if (dir === "left") n = col > 0 ? cur - 1 : (page - 1) * PER_PAGE + row * COLS + COLS - 1;
        if (dir === "down" && row < 2) n = cur + COLS;
        if (dir === "up" && row > 0) n = cur - COLS;
        if (n < 0 || n >= apps.length) return cur;
        setCurrentPage(Math.floor(n / PER_PAGE));
        return n;
      });
    },
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, "left" | "right" | "up" | "down"> = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
      if (map[e.key]) { e.preventDefault(); move(map[e.key]); flash("dpad-" + map[e.key]); }
      else if (e.key === "Enter" || e.key.toLowerCase() === "a") { e.preventDefault(); flash("A"); open(); }
      else if (e.key.toLowerCase() === "l") { flash("L"); changePage(currentPage - 1); }
      else if (e.key.toLowerCase() === "r") { flash("R"); changePage(currentPage + 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, open, changePage, currentPage]);

  const theme = SHELL_THEMES[shellTheme];
  const vars = { "--shell": theme.base, "--shell-edge": theme.edge } as CSSProperties;

  const onSliderDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = e.currentTarget;
    track.setPointerCapture(e.pointerId);
    const upd = (y: number) => {
      const r = track.getBoundingClientRect();
      setSlider(Math.max(0, Math.min(1, (y - r.top) / r.height)));
    };
    upd(e.clientY);
    const mv = (ev: PointerEvent) => upd(ev.clientY);
    const up = () => { track.removeEventListener("pointermove", mv); track.removeEventListener("pointerup", up); };
    track.addEventListener("pointermove", mv);
    track.addEventListener("pointerup", up);
  };

  const face = [
    { k: "X", style: { left: 38, top: 0 } },
    { k: "Y", style: { left: 0, top: 38 } },
    { k: "A", style: { left: 76, top: 38 } },
    { k: "B", style: { left: 38, top: 76 } },
  ];

  return (
    <div className="flex flex-col items-center" style={{ width: CONSOLE_W * scale, height: (CONSOLE_H + 50) * scale }}>
      <div style={{ width: CONSOLE_W, height: CONSOLE_H + 50, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <div className="ds-console" style={{ ...vars, width: CONSOLE_W, height: CONSOLE_H }}>
          {/* Shoulder buttons */}
          <button aria-label="L button, previous page" className={`ds-shoulder ds-shoulder-l ${pressed === "L" ? "ds-pressed" : ""}`} onClick={() => { flash("L"); changePage(currentPage - 1); }}>L</button>
          <button aria-label="R button, next page" className={`ds-shoulder ds-shoulder-r ${pressed === "R" ? "ds-pressed" : ""}`} onClick={() => { flash("R"); changePage(currentPage + 1); }}>R</button>

          {/* TOP SHELL */}
          <div className="ds-shell ds-shell-top">
            <div className="ds-bezel ds-bezel-top">
              <div className="ds-cam-row">
                <span className="ds-led" />
                <span className="ds-inner-cam" />
              </div>
              <div className="flex items-center gap-[22px]">
                <Grill />
                <Screen w={400} h={240}>
                  <TopScreen app={selectedApp} isLaunching={isLaunching} />
                </Screen>
                <Grill />
              </div>
            </div>
            <div className="ds-slider-wrap">
              <div className="ds-slider-track" onPointerDown={onSliderDrag} role="slider" aria-label="3D depth slider" aria-valuenow={Math.round((1 - slider) * 100)}>
                <div className="ds-slider-knob" style={{ top: `${slider * 100}%` }} />
              </div>
              <span className="ds-tiny-label">3D</span>
            </div>
          </div>

          {/* HINGE */}
          <div className="ds-hinge">
            <span className="ds-hinge-dot" />
            <div className="ds-hinge-gap" />
            <span className="ds-hinge-dot" />
          </div>

          {/* BOTTOM SHELL */}
          <div className="ds-shell ds-shell-bottom">
            <div className="flex items-start justify-between px-[22px] pt-[30px]">
              {/* Left controls */}
              <div className="flex w-[120px] flex-col items-center gap-[46px] pt-[14px]">
                <div className="ds-circle-ring"><div className="ds-circle-pad" /></div>
                <div className="ds-dpad">
                  {(["up", "left", "right", "down"] as const).map((d) => (
                    <button key={d} aria-label={`D-pad ${d}`} className={`ds-dpad-${d} ${pressed === "dpad-" + d ? "ds-pressed" : ""}`} onClick={() => { flash("dpad-" + d); move(d); }}>
                      <span className={`ds-notch ds-notch-${d}`} />
                    </button>
                  ))}
                  <span className="ds-dpad-center" />
                </div>
              </div>

              <div className="ds-bezel ds-bezel-bottom">
                <Screen w={320} h={240}>
                  <BottomScreen apps={apps} pageCount={pageCount} currentPage={currentPage} selectedIndex={selectedIndex} onSelect={select} onPage={changePage} onOpen={open} />
                </Screen>
              </div>

              {/* Right controls */}
              <div className="relative mt-[20px] h-[114px] w-[114px]">
                {face.map(({ k, style }) => (
                  <button key={k} aria-label={`${k} button`} style={style} className={`ds-face ${pressed === k ? "ds-pressed" : ""}`}
                    onClick={() => {
                      flash(k);
                      if (k === "A") open();
                      if (k === "B") changePage(0);
                    }}>{k}</button>
                ))}
              </div>
            </div>

            {/* System buttons row */}
            <div className="relative mt-[26px] flex items-center justify-center">
              <div className="absolute left-[40px] flex items-center gap-2">
                <button aria-label="Power" className="ds-power" />
                <span className="ds-charge-led" />
              </div>
              <button aria-label="Home" className="ds-home"><House className="h-[18px] w-[18px]" /></button>
              <div className="absolute right-[48px] flex flex-col gap-2">
                {["START", "SELECT"].map((l) => (
                  <div key={l} className="flex items-center gap-2">
                    <button aria-label={l} className="ds-small-pill" />
                    <span className="ds-tiny-label">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            <span className="ds-mic" />
            <span className="ds-stylus" />
          </div>
        </div>

        <div className="ds-ground-shadow" />
        <div className="mt-6 flex justify-center gap-3" style={{ position: "relative", top: -20 }}>
          {SHELL_THEMES.map((t, i) => (
            <button key={t.name} aria-label={`Shell color ${t.name}`} title={t.name} onClick={() => setShellTheme(i)}
              className={`ds-swatch ${i === shellTheme ? "ds-swatch-on" : ""}`} style={{ background: t.base }} />
          ))}
        </div>
      </div>
    </div>
  );
}
