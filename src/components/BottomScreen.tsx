import { useRef, useState } from "react";
import type { App3DS } from "@/data/apps";
import { useDragScroll } from "@/hooks/useDragScroll";
import { AppTile } from "./AppTile";
import { Chat, Community, Friends, Globe, GridView, HomeWrench, Pencil, SingleView } from "./icons";

export const PER_PAGE = 18;
export const COLS = 6;

const TABS = [
  { id: "home", label: "Home settings", Icon: HomeWrench },
  { id: "notes", label: "Notes", Icon: Pencil },
  { id: "friends", label: "Friend list", Icon: Friends },
  { id: "chat", label: "Notifications", Icon: Chat },
  { id: "web", label: "Internet browser", Icon: Globe },
  { id: "community", label: "Community", Icon: Community },
];

interface Props {
  apps: App3DS[];
  pageCount: number;
  currentPage: number;
  selectedIndex: number;
  onSelect: (i: number) => void;
  onPage: (p: number) => void;
  onOpen: () => void;
}

export function BottomScreen({ apps, pageCount, currentPage, selectedIndex, onSelect, onPage, onOpen }: Props) {
  const [tab, setTab] = useState("home");
  const [view, setView] = useState<"single" | "grid">("grid");
  const ref = useRef<HTMLDivElement>(null);
  const { handlers, wasDrag } = useDragScroll(ref, pageCount, currentPage, onPage);

  return (
    <div className="ds-bottom-screen ds-screen-content" style={{ width: 320, height: 240 }}>
      <div className="ds-toolbar">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} aria-label={label} onClick={() => setTab(id)} className={`ds-tab ${tab === id ? "ds-tab-active" : ""}`}>
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

      <div className="ds-grid-panel">
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
    </div>
  );
}
