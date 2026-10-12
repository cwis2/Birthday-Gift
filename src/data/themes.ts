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
    topBackground: "/backgrounds/top.png",
    bottomBackground: "/backgrounds/bottom.png",
    bgm: "/backgrounds/bgm.ogg",
  },
  {
    id: "default-grid",
    name: "Classic 3DS",
    topBackground: "", // uses default dark grid
    bottomBackground: "#d8dbe0",
    bgm: "/backgrounds/bgm.ogg",
  },
];

