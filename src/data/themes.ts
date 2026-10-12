import { assetUrl } from "@/lib/asset-url";

export interface ScreenTheme {
  id: string;
  name: string;
  topBackground: string;
  bottomBackground: string;
  bgm?: string;
  topStyle?: React.CSSProperties;
  bottomStyle?: React.CSSProperties;
}

export const SCREEN_THEMES: ScreenTheme[] = [
  {
    id: "shin-godzilla",
    name: "Shin Godzilla",
    topBackground: assetUrl("/backgrounds/top.png"),
    bottomBackground: assetUrl("/backgrounds/bottom.png"),
    bgm: assetUrl("/backgrounds/bgm.ogg"),
  },
  {
    id: "default-grid",
    name: "Classic 3DS",
    topBackground: "", // uses default dark grid
    bottomBackground: "#d8dbe0",
    bgm: assetUrl("/backgrounds/bgm.ogg"),
  },
];

