import { isUrl, type App3DS } from "@/data/apps";

export function AppTile({ app, size, fontSize }: { app: App3DS; size: number; fontSize: number }) {
  if (isUrl(app.icon)) {
    return <img src={app.icon} alt={app.title} className="ds-tile-img" style={{ width: size, height: size }} draggable={false} />;
  }
  return (
    <div className="ds-tile-fallback" style={{ width: size, height: size, background: app.color, fontSize }}>
      {app.label ?? app.title.slice(0, 1)}
    </div>
  );
}
