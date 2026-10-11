import { useEffect, useState } from "react";
import { Coin, InfoGlyph } from "./icons";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const pad = (n: number) => String(n).padStart(2, "0");

export function StatusBar({ battery = 0.8 }: { battery?: number }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const text = now
    ? `${pad(now.getDate())}/${pad(now.getMonth() + 1)} (${DAYS[now.getDay()]}) ${pad(now.getHours())}:${pad(now.getMinutes())}`
    : "";

  return (
    <div className="absolute inset-x-0 top-0 z-10 flex h-6 items-center gap-1.5 px-1.5">
      <InfoGlyph className="h-[16px] w-[16px]" />
      <div className="ds-internet-pill">Internet</div>
      <Coin className="ml-1 h-[15px] w-[15px]" />
      <span className="ds-outline-text text-[11px] font-extrabold">300</span>
      <div className="flex-1" />
      <span className="ds-outline-text text-[11px] font-bold tabular-nums">{text}</span>
      <div className="ds-battery" aria-label={`Battery ${Math.round(battery * 100)}%`}>
        <div className="ds-battery-fill" style={{ width: `${battery * 100}%` }} />
      </div>
    </div>
  );
}
