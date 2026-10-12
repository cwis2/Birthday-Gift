import type { App3DS } from "@/data/apps";
import type { ScreenTheme } from "@/data/themes";
import { AppTile } from "./AppTile";
import { StatusBar } from "./StatusBar";
import { Camera } from "./icons";
import { MessageWindow } from "./MessageWindow";
import { messageLines } from "@/data/message";

export function TopScreen({ app, isLaunching, theme, children, messageOpen, onCloseMessage }: {
  app: App3DS | undefined;
  isLaunching: boolean;
  theme?: ScreenTheme | undefined;
  children?: React.ReactNode;
  messageOpen: boolean;
  onCloseMessage: () => void;
}) {
  return (
    <div
      className="ds-top-screen ds-screen-content"
      style={{
        width: 400,
        height: 240,
        ...(theme?.topBackground
          ? {
              backgroundImage: `url(${theme.topBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}),
      }}
    >

      {children ?? <>
      <StatusBar />

      <div className="absolute left-1/2 top-[38px] -translate-x-1/2">
        <div className="ds-bob">
          <div key={app?.id} className={`ds-cradle ds-pop ${isLaunching ? "ds-launch-icon" : ""}`}>
            {app && <AppTile app={app} size={80} fontSize={30} />}
            <div className="ds-cradle-notch" />
          </div>
        </div>
      </div>

      <div className="ds-title-plate absolute left-1/2 top-[160px] -translate-x-1/2">
        {isLaunching ? (
          <div className="font-bold">Launching {app?.title}...</div>
        ) : (
          <>
            <div className="truncate">{app?.title ?? ""}</div>
            <div className="truncate">{app?.publisher ?? ""}</div>
          </>
        )}
      </div>

      <div className="absolute bottom-1.5 left-2 flex items-center gap-1">
        <button aria-label="Camera (Y)" className="ds-hud-btn"><Camera className="h-3 w-4" /></button>
        <span className="ds-hud-circle">Y</span>
      </div>
      <div className="absolute bottom-1.5 right-2 flex items-center gap-1">
        <button aria-label="Screenshot (L + R)" className="ds-hud-btn"><Camera className="h-3 w-4" /></button>
        <span className="ds-hud-key">L</span>
        <span className="ds-outline-text text-[10px] font-bold">+</span>
        <span className="ds-hud-key">R</span>
      </div>

      <div className={`ds-flash ${isLaunching ? "ds-flash-on" : ""}`} />
      </>}
      <MessageWindow lines={messageLines} isOpen={messageOpen} onClose={onCloseMessage} />
    </div>
  );
}
