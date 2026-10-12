import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { apps, type App3DS } from "@/data/apps";
import { SCREEN_THEMES } from "@/data/themes";
import { TopScreen } from "./TopScreen";
import { BottomScreen, COLS, PER_PAGE, type AppDialogData } from "./BottomScreen";
import { House, Volume, VolumeMute } from "./icons";
import { useBirthdayGame } from "./BirthdayGame";
import { assetUrl } from "@/lib/asset-url";

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

function getAppMessage(app: App3DS, isPresentOpened: boolean): string | null {
  if (app.id === "app-birthday-gift") return null;

  if (!isPresentOpened) {
    return "You have a present!, open it first";
  }

  switch (app.id) {
    case "app-ar":
    case "app-camera":
    case "app-eshop":
    case "app-mii-creator":
    case "app-mii-plaza":
    case "app-miiverse":
    case "app-music":
    case "app-settings":
    case "app-face-raiders":
    case "app-flipnote":
      return "Wouldn't you rather open your new app than play with stock apps? Give it a try!";

    case "app-fbi":
    case "app-hshop":
    case "app-homebrew":
      return "Modding your 3DS must've been hard, take a break and enjoy your new app!";

    case "app-badge-arcade":
    case "app-rusty":
      return "You can spend your money later, someone gifted you something, wouldn't you rather play that?";

    case "app-security":
      return "You know you dont want to open this. Try something else";

    case "app-battle-cats":
    case "app-twewy":
      return "Amazing game. Life changing even, but you should open your new app!";

    case "app-bit-trip":
    case "app-denpamen":
    case "app-pushmo":
    case "app-harmoknight":
    case "app-fluidity":
      return "Playing eShop exclusives is fun, but you should try your new gift!";

    case "app-yt":
      return "You can watch videos later, focus on the now!";

    case "app-nintendogs":
    case "app-rayman":
    case "app-xenoblade":
      return "Cartridge is not inserted properly";

    case "app-minecraft":
      return "FIX MOJANG BEDROCK";

    default:
      return "Wouldn't you rather open your new app than play with stock apps? Give it a try!";
  }
}

export function Console3DS() {
  const [shellTheme, setShellTheme] = useState(0);
  const [screenTheme, setScreenTheme] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);
  const [scale, setScale] = useState(0.6);
  const [slider, setSlider] = useState(0.4);
  const [pressed, setPressed] = useState<string | null>(null);
  const [appList, setAppList] = useState(apps);
  const [appDialog, setAppDialog] = useState<AppDialogData | null>(null);
  const [showBirthdayGame, setShowBirthdayGame] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const launchT = useRef<number[]>([]);

  useEffect(() => {
    if (!appDialog || appDialog.isNewApp || appDialog.app?.id === "app-birthday-gift") return;
    const sound = new Audio(assetUrl("/sounds/Onigiri sound effect.mp3"));
    sound.volume = 1;
    sound.play().catch(() => {});
    return () => {
      sound.pause();
      sound.currentTime = 0;
    };
  }, [appDialog]);

  const openMessage = useCallback(() => setMessageOpen(true), []);
  const closeMessage = useCallback(() => {
    setMessageOpen(false);
    setShowBirthdayGame(false);
  }, []);

  const { renderTop: gameTop, renderBottom: gameBottom } = useBirthdayGame(
    () => setShowBirthdayGame(false),
    showBirthdayGame,
    openMessage,
  );

  const isPresentOpened = useMemo(() => {
    const giftApp = appList.find((a) => a.id === "app-birthday-gift");
    return giftApp ? !giftApp.icon.includes("new app.png") : false;
  }, [appList]);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const pageCount = Math.max(MIN_PAGES, Math.ceil(appList.length / PER_PAGE));
  const selectedApp = appList[selectedIndex];
  const activeTheme = SCREEN_THEMES[screenTheme] ?? SCREEN_THEMES[0]!;

  useEffect(() => {
    const bgmSrc = activeTheme?.bgm || assetUrl("/backgrounds/bgm.ogg");
    if (!audioRef.current) {
      const audio = new Audio(bgmSrc);
      audio.loop = true;
      audio.volume = 0.15;
      audioRef.current = audio;
    } else {
      audioRef.current.src = bgmSrc;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }

    const tryPlay = () => {
      audioRef.current
        ?.play()
        .then(() => {
          setIsPlaying(true);
          window.removeEventListener("pointerdown", tryPlay);
          window.removeEventListener("keydown", tryPlay);
        })
        .catch(() => {});
    };

    window.addEventListener("pointerdown", tryPlay, { once: true });
    window.addEventListener("keydown", tryPlay, { once: true });

    return () => {
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("keydown", tryPlay);
    };
  }, [activeTheme]);

  const toggleSound = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / (CONSOLE_W + 40), window.innerHeight / (CONSOLE_H + 70)));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const handleAppInteraction = useCallback(
    (app: App3DS) => {
      if (app.id === "app-birthday-gift") {
        if (app.icon.includes("new app.png")) {
          // First open: change icon, show "new app" popup
          setAppList((prev) =>
            prev.map((a) => (a.id === "app-birthday-gift" ? { ...a, icon: assetUrl("/icons/gift.jpg") } : a))
          );
          setAppDialog({
            title: "You have a new app!",
            message: "",
            isNewApp: true,
            app,
          });
          return true;
        }
        // Gift already opened: launch the game!
        setShowBirthdayGame(true);
        return true;
      }

      const msg = getAppMessage(app, isPresentOpened);
      if (msg) {
        setAppDialog({
          title: app.title,
          message: msg,
          app,
        });
        return true;
      }
      return false;
    },
    [isPresentOpened],
  );

  const select = useCallback(
    (i: number) => {
      setSelectedIndex(i);
      setCurrentPage(Math.floor(i / PER_PAGE));
      const app = appList[i];
      if (app) {
        handleAppInteraction(app);
      }
    },
    [appList, handleAppInteraction],
  );

  const changePage = useCallback(
    (p: number) => {
      const np = Math.max(0, Math.min(pageCount - 1, p));
      setCurrentPage(np);
      // keep selection on visible page if possible
      setSelectedIndex((cur) => {
        if (Math.floor(cur / PER_PAGE) === np) return cur;
        const first = np * PER_PAGE;
        return first < appList.length ? first : cur;
      });
    },
    [pageCount, appList.length],
  );

  const open = useCallback(() => {
    if (appDialog) {
      setAppDialog(null);
      return;
    }
    if (!selectedApp) return;

    if (handleAppInteraction(selectedApp)) {
      return;
    }

    if (isLaunching) return;
    launchT.current.forEach(clearTimeout);
    setIsLaunching(true);
    launchT.current = [window.setTimeout(() => setIsLaunching(false), 1500)];
  }, [selectedApp, isLaunching, appDialog, handleAppInteraction]);

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
        if (n < 0 || n >= appList.length) return cur;
        setCurrentPage(Math.floor(n / PER_PAGE));
        return n;
      });
    },
    [appList.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "y") {
        e.preventDefault();
        setMessageOpen(true);
        return;
      }
      // Let BirthdayGame capture phase handlers handle keys while game is active
      if (showBirthdayGame) return;
      if (appDialog) {
        if (e.key === "Enter" || e.key.toLowerCase() === "a" || e.key === "Escape" || e.key === " ") {
          e.preventDefault();
          setAppDialog(null);
          return;
        }
      }
      const map: Record<string, "left" | "right" | "up" | "down"> = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); move(dir); flash("dpad-" + dir); }
      else if (e.key === "Enter" || e.key.toLowerCase() === "a") { e.preventDefault(); flash("A"); open(); }
      else if (e.key.toLowerCase() === "l") { flash("L"); changePage(currentPage - 1); }
      else if (e.key.toLowerCase() === "r") { flash("R"); changePage(currentPage + 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, open, changePage, currentPage, appDialog, showBirthdayGame]);

  const theme = SHELL_THEMES[shellTheme] ?? SHELL_THEMES[0]!;
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
                  <TopScreen
                    app={selectedApp}
                    isLaunching={isLaunching}
                    theme={activeTheme}
                    messageOpen={messageOpen}
                    onCloseMessage={closeMessage}
                    children={showBirthdayGame ? <div style={{ position:"absolute", inset:0 }}>{gameTop()}</div> : undefined}
                  />
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
            <div className="flex items-start justify-between px-[18px] pt-[30px]">
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
                  {showBirthdayGame
                    ? gameBottom()
                    : <BottomScreen
                        apps={appList}
                        pageCount={pageCount}
                        currentPage={currentPage}
                        selectedIndex={selectedIndex}
                        currentTheme={activeTheme}
                        appDialog={appDialog}
                        onCloseAppDialog={() => setAppDialog(null)}
                        onThemeChange={setScreenTheme}
                        onSelect={select}
                        onPage={changePage}
                        onOpen={open}
                      />
                  }
                </Screen>
              </div>

              {/* Right controls */}
              <div className="relative mt-[20px] h-[114px] w-[114px]">
                {face.map(({ k, style }) => (
                  <button key={k} aria-label={`${k} button`} style={style} className={`ds-face ${pressed === k ? "ds-pressed" : ""}`}
                    onClick={() => {
                      flash(k);
                      if (messageOpen && (k === "A" || k === "B")) {
                        window.dispatchEvent(new KeyboardEvent("keydown", { key: k === "A" ? "a" : "b", bubbles: true }));
                        return;
                      }
                      if (k === "A") open();
                      if (k === "Y") setMessageOpen(true);
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
        <div className="mt-6 flex flex-col items-center gap-2.5" style={{ position: "relative", top: -20 }}>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <span className="font-semibold text-white/50 text-[11px] uppercase tracking-wider">Shell:</span>
            {SHELL_THEMES.map((t, i) => (
              <button key={t.name} aria-label={`Shell color ${t.name}`} title={t.name} onClick={() => setShellTheme(i)}
                className={`ds-swatch ${i === shellTheme ? "ds-swatch-on" : ""}`} style={{ background: t.base }} />
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-white/70">
            <span className="font-semibold text-white/50 text-[11px] uppercase tracking-wider">Wallpaper:</span>
            {SCREEN_THEMES.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setScreenTheme(i)}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-all ${
                  i === screenTheme
                    ? "bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/30 scale-105"
                    : "bg-white/10 text-white/75 hover:bg-white/20"
                }`}
              >
                {t.name}
              </button>
            ))}

            <button
              onClick={toggleSound}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ml-2 ${
                isPlaying
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                  : "bg-white/10 text-white/75 hover:bg-white/20"
              }`}
              title={isPlaying ? "Mute BGM" : "Play BGM"}
              aria-label={isPlaying ? "Mute BGM" : "Play BGM"}
            >
              {isPlaying ? <Volume className="w-3.5 h-3.5" /> : <VolumeMute className="w-3.5 h-3.5" />}
              <span>{isPlaying ? "Music ON" : "Music OFF"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
