// =====================================================================
// EDITABLE APP LIST
// Add / remove / edit entries here. Pages (3 rows x 6 cols = 18 slots)
// are recalculated automatically.
//   icon:  an image URL (http/https or /path) — if not a URL, a colored
//          tile is rendered using `color` and `label`.
//   color: fallback background color for the tile.
//   label: 1-2 letter label shown on the fallback tile.
// =====================================================================
export interface App3DS {
  id: string;
  title: string;
  publisher: string;
  icon: string;
  color: string;
  label?: string;
}

export const defaultApps: App3DS[] = [
  {
    id: "app-birthday-gift",
    title: "Birthday Gift",
    publisher: "cwis",
    icon: "/icons/new app.png",
    color: "#ff4081",
  },
  {
    id: "app-security",
    title: "Health & Safety Information",
    publisher: "Nintendo",
    icon: "/icons/Security_information.png",
    color: "#e53935",
  },
  {
    id: "app-camera",
    title: "Nintendo 3DS Camera",
    publisher: "Nintendo",
    icon: "/icons/camera.png",
    color: "#00acc1",
  },
  {
    id: "app-music",
    title: "Nintendo 3DS Sound",
    publisher: "Nintendo",
    icon: "/icons/music.png",
    color: "#8e24aa",
  },
  {
    id: "app-mii-creator",
    title: "Mii Maker",
    publisher: "Nintendo",
    icon: "/icons/mii_creator.png",
    color: "#43a047",
  },
  {
    id: "app-mii-plaza",
    title: "StreetPass Mii Plaza",
    publisher: "Nintendo",
    icon: "/icons/mii_plaza.png",
    color: "#fb8c00",
  },
  {
    id: "app-eshop",
    title: "Nintendo eShop",
    publisher: "Nintendo",
    icon: "/icons/eshop.png",
    color: "#ff9800",
  },
  {
    id: "app-ar",
    title: "AR Games",
    publisher: "Nintendo",
    icon: "/icons/ar.png",
    color: "#fbc02d",
  },
  {
    id: "app-face-raiders",
    title: "Face Raiders",
    publisher: "Nintendo",
    icon: "/icons/face_raiders.png",
    color: "#e53935",
  },
  {
    id: "app-settings",
    title: "System Settings",
    publisher: "Nintendo",
    icon: "/icons/settings.png",
    color: "#546e7a",
  },
  {
    id: "app-badge-arcade",
    title: "Nintendo Badge Arcade",
    publisher: "Nintendo",
    icon: "/icons/Badge_arcade.png",
    color: "#e91e63",
  },
  {
    id: "app-battle-cats",
    title: "The Battle Cats POP!",
    publisher: "PONOS",
    icon: "/icons/battle_cats.png",
    color: "#3f51b5",
  },
  {
    id: "app-bit-trip",
    title: "BIT.TRIP RUNNER",
    publisher: "Gaijin Games",
    icon: "/icons/bittrip.png",
    color: "#000000",
  },
  {
    id: "app-denpamen",
    title: "The Denpa Men: They Came By Wave",
    publisher: "Genius Sonority",
    icon: "/icons/denpamen.png",
    color: "#00bcd4",
  },
  {
    id: "app-fbi",
    title: "FBI",
    publisher: "Steveice10",
    icon: "/icons/FBI.jpg",
    color: "#212121",
  },
  {
    id: "app-flipnote",
    title: "Flipnote Studio 3D",
    publisher: "Nintendo",
    icon: "/icons/flipnote.png",
    color: "#4caf50",
  },
  {
    id: "app-fluidity",
    title: "Fluidity: Spin Cycle",
    publisher: "Curve Studios",
    icon: "/icons/fluidity.png",
    color: "#03a9f4",
  },
  {
    id: "app-harmoknight",
    title: "HarmoKnight",
    publisher: "Game Freak",
    icon: "/icons/harmoknight.png",
    color: "#ff5722",
  },
  {
    id: "app-homebrew",
    title: "Homebrew Launcher",
    publisher: "fincs",
    icon: "/icons/homebrew_channel.jpg",
    color: "#1976d2",
  },
  {
    id: "app-hshop",
    title: "hShop",
    publisher: "Tescu48",
    icon: "/icons/hshop.jpg",
    color: "#1e88e5",
  },
  {
    id: "app-miiverse",
    title: "Miiverse",
    publisher: "Nintendo",
    icon: "/icons/miiverse.png",
    color: "#00c853",
  },
  {
    id: "app-minecraft",
    title: "Minecraft",
    publisher: "Mojang",
    icon: "/icons/minecraft.png",
    color: "#5d4037",
  },
  {
    id: "app-nintendogs",
    title: "nintendogs + cats",
    publisher: "Nintendo",
    icon: "/icons/Nintendogs.jpg",
    color: "#ffb74d",
  },
  {
    id: "app-pushmo",
    title: "Pushmo",
    publisher: "Intelligent Systems",
    icon: "/icons/pushmo.png",
    color: "#ff7043",
  },
  {
    id: "app-rusty",
    title: "Rusty's Real Deal Baseball",
    publisher: "Nintendo",
    icon: "/icons/rusty.png",
    color: "#8d6e63",
  },
  {
    id: "app-twewy",
    title: "The World Ends With You",
    publisher: "Square Enix",
    icon: "/icons/Twewy.jpg",
    color: "#263238",
  },
  {
    id: "app-xenoblade",
    title: "Xenoblade Chronicles 3D",
    publisher: "Nintendo",
    icon: "/icons/xenoblade.png",
    color: "#c62828",
  },
  {
    id: "app-yt",
    title: "YouTube",
    publisher: "Google",
    icon: "/icons/yt.png",
    color: "#d32f2f",
  },
  {
    id: "app-rayman",
    title: "Rayman 3D",
    publisher: "Ubisoft",
    icon: "/icons/rayman.png",
    color: "#ab47bc",
  },
];

export const apps: App3DS[] = [...defaultApps];

export const isUrl = (s: string) => /^(https?:\/\/|\/|data:image)/.test(s);

