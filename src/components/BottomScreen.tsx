import { useRef, useState } from "react";
import type { App3DS } from "@/data/apps";
import { SCREEN_THEMES, type ScreenTheme } from "@/data/themes";
import { useDragScroll } from "@/hooks/useDragScroll";
import { AppTile } from "./AppTile";
import { Chat, Community, Friends, Globe, GridView, HomeWrench, Pencil, SingleView } from "./icons";

export const PER_PAGE = 18;
export const COLS = 6;

const TABS = [
  { id: "home", label: "Change Theme / Wallpaper", Icon: HomeWrench },
  { id: "notes", label: "Notes", Icon: Pencil },
  { id: "friends", label: "Friend list", Icon: Friends },
  { id: "chat", label: "Notifications", Icon: Chat },
  { id: "web", label: "Internet browser", Icon: Globe },
  { id: "community", label: "Community", Icon: Community },
];

export interface AppDialogData {
  title?: string;
  message: string;
  app?: App3DS;
  isNewApp?: boolean;
}

interface Props {
  apps: App3DS[];
  pageCount: number;
  currentPage: number;
  selectedIndex: number;
  currentTheme?: ScreenTheme | undefined;
  appDialog?: AppDialogData | null | undefined;
  onCloseAppDialog?: () => void;
  onThemeChange?: (themeIndex: number) => void;
  onSelect: (i: number) => void;
  onPage: (p: number) => void;
  onOpen: () => void;
}

export function BottomScreen({
  apps,
  pageCount,
  currentPage,
  selectedIndex,
  currentTheme,
  appDialog,
  onCloseAppDialog,
  onThemeChange,
  onSelect,
  onPage,
  onOpen,
}: Props) {
  const [tab, setTab] = useState("apps");
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [view, setView] = useState<"single" | "grid">("grid");
  const ref = useRef<HTMLDivElement>(null);
  const { handlers, wasDrag } = useDragScroll(ref, pageCount, currentPage, onPage);

  const handleTabClick = (id: string) => {
    if (id === "home") {
      setShowThemePicker((prev) => !prev);
    } else {
      setShowThemePicker(false);
    }
    setTab(id);
  };

  return (
    <div className="ds-bottom-screen ds-screen-content" style={{ width: 320, height: 240 }}>
      <div className="ds-toolbar">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            aria-label={label}
            onClick={() => handleTabClick(id)}
            className={`ds-tab ${tab === id || (id === "home" && showThemePicker) ? "ds-tab-active" : ""}`}
            title={label}
          >
            <Icon className={id === "home" ? "h-[20px] w-[24px]" : "h-[22px] w-[22px]"} />
          </button>
        ))}
        <div className="flex-1" />
        <button aria-label="Single view" onClick={() => setView("single")} className={`ds-view-btn ${view === "single" ? "ds-view-active" : ""}`}>
          <SingleView className="h-3.5 w-3.5" />
        </button>
        <button aria-label="Grid view" onClick={() => setView("grid")} className={`ds-view-btn ${view === "grid" ? "ds-view-active" : ""}`}>
          <GridView className="h-3.5 w-3.5" />
        </button>
      </div>

      <div
        className={`ds-grid-panel ${currentTheme?.bottomBackground?.startsWith("/") ? "ds-has-theme" : ""}`}
        style={{
          ...(currentTheme?.bottomBackground?.startsWith("/")
            ? {
                backgroundImage: `url(${currentTheme.bottomBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : currentTheme?.bottomBackground
            ? { background: currentTheme.bottomBackground }
            : {}),
        }}
      >
        {/* Theme Settings Overlay */}
        {showThemePicker && (
          <div className="absolute inset-0 z-30 flex flex-col bg-slate-900/90 backdrop-blur-sm p-3 text-white">
            <div className="flex items-center justify-between border-b border-white/20 pb-1.5 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">Theme / Background</span>
              <button
                className="text-[11px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-white font-bold"
                onClick={() => setShowThemePicker(false)}
              >
                Done
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {SCREEN_THEMES.map((t, idx) => {
                const isSelected = currentTheme?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onThemeChange?.(idx)}
                    className={`w-full flex items-center justify-between p-2 rounded text-left text-xs transition-colors ${
                      isSelected ? "bg-cyan-600/80 font-bold border border-cyan-400" : "bg-white/10 hover:bg-white/20 border border-transparent"
                    }`}
                  >
                    <span>{t.name}</span>
                    {isSelected && <span className="text-[10px] bg-white/30 px-1.5 py-0.5 rounded">Active</span>}
                  </button>
                );
              })}
            </div>
            <div className="text-[9px] text-gray-400 text-center pt-1 border-t border-white/10">
              Add your wallpapers to <code>public/backgrounds/</code>
            </div>
          </div>
        )}

        <div ref={ref} className="ds-pager" role="grid" aria-label="Applications" {...handlers}>
          {Array.from({ length: pageCount }, (_, p) => (
            <div key={p} className="ds-page">
              <div className="ds-grid">
                {Array.from({ length: PER_PAGE }, (_, s) => {
                  const i = p * PER_PAGE + s;
                  const app = apps[i];
                  if (!app) return <div key={s} className="ds-slot-empty" aria-hidden />;
                  const sel = i === selectedIndex;
                  return (
                    <button
                      key={s}
                      role="gridcell"
                      aria-label={app.title}
                      aria-selected={sel}
                      className={`ds-slot ${sel ? "ds-selected" : ""}`}
                      onClick={() => !wasDrag() && onSelect(i)}
                      onDoubleClick={() => { onSelect(i); onOpen(); }}
                    >
                      <AppTile app={app} size={38} fontSize={15} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {currentPage > 0 && (
          <button aria-label="Previous page" className="ds-arrow ds-arrow-left" onClick={() => onPage(currentPage - 1)}>
            <span className="ds-tri ds-tri-left" />
          </button>
        )}
        {currentPage < pageCount - 1 && (
          <button aria-label="Next page" className="ds-arrow ds-arrow-right" onClick={() => onPage(currentPage + 1)}>
            <span className="ds-tri ds-tri-right" />
          </button>
        )}

        <div className="ds-dots">
          {Array.from({ length: pageCount }, (_, p) => (
            <span key={p} className={`ds-dot ${p === currentPage ? "ds-dot-on" : ""}`} />
          ))}
        </div>
      </div>

      <button className="ds-open-bar" onClick={onOpen} aria-label="Open selected app">
        <span>Open</span>
      </button>

      {/* 3DS System Alert Dialog */}
      {appDialog && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/65 backdrop-blur-[1px] p-3">
          <div className="w-[270px] max-h-[220px] rounded-2xl bg-gradient-to-b from-[#f8f9fa] via-[#e9edf2] to-[#d8dde6] p-3.5 text-center shadow-2xl border-2 border-white/90 text-gray-800 flex flex-col items-center">
            {appDialog.isNewApp ? (
              <>
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="text-base">🎁</span>
                  <h3 className="text-[13px] font-black text-gray-900 tracking-tight">You have a new app!</h3>
                </div>
                <p className="text-[10px] text-gray-600 mb-2 leading-snug">
                  A new software title has arrived on your Home Menu:
                </p>
                <div className="flex items-center justify-center gap-2.5 bg-white/90 rounded-xl p-2 border border-gray-300 shadow-sm mx-auto mb-2.5 w-full">
                  <img src="/icons/gift.jpg" alt="Birthday Gift" className="w-8 h-8 rounded-md shadow object-cover" />
                  <div className="text-left">
                    <div className="text-[11px] font-black text-gray-900 leading-tight">Birthday Gift</div>
                    <div className="text-[9px] font-semibold text-gray-500">by cwis</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-1.5 mb-1.5">
                  {appDialog.message.includes("Cartridge") ? (
                    <span className="text-sm">⚠️</span>
                  ) : appDialog.message.includes("present") ? (
                    <span className="text-sm">🎁</span>
                  ) : (
                    <span className="text-sm">💬</span>
                  )}
                  <h3 className="text-[12px] font-black text-gray-900 tracking-tight truncate max-w-[200px]">
                    {appDialog.title || "Notice"}
                  </h3>
                </div>
                {appDialog.app && (
                  <div className="flex items-center gap-2 bg-white/80 px-2 py-1 rounded-lg border border-gray-200 mb-2 max-w-full">
                    {appDialog.app.icon ? (
                      <img src={appDialog.app.icon} alt="" className="w-5 h-5 rounded object-cover" />
                    ) : null}
                    <span className="text-[10px] font-bold text-gray-800 truncate">{appDialog.app.title}</span>
                  </div>
                )}
                <div className="text-[11px] font-bold text-gray-800 px-1 py-1 mb-2 leading-snug text-center">
                  {appDialog.message}
                </div>
              </>
            )}
            <button
              onClick={onCloseAppDialog}
              className="px-6 py-1 bg-gradient-to-b from-[#3ba9ff] to-[#147bd6] hover:from-[#4db3ff] hover:to-[#1c88e6] text-white text-[11px] font-black rounded-full shadow-md active:scale-95 border border-[#89ccff] transition-transform"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
