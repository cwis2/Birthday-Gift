import { createFileRoute } from "@tanstack/react-router";
import { Console3DS } from "@/components/Console3DS";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "3DS Home Menu" },
      { name: "description", content: "An interactive recreation of a clamshell handheld console with a working dual-screen Home Menu." },
      { property: "og:title", content: "3DS Home Menu" },
      { property: "og:description", content: "An interactive recreation of a clamshell handheld console with a working dual-screen Home Menu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#0d0d12]">
      {/* Ambient background using theme preview art */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 blur-xl scale-110 pointer-events-none transition-opacity duration-1000"
        style={{ backgroundImage: `url('/backgrounds/preview.png')` }}
      />
      <div className="absolute inset-0 bg-radial from-transparent via-[#0d0d12]/60 to-[#0d0d12] pointer-events-none" />
      <div className="relative z-10">
        <Console3DS />
      </div>
    </main>
  );
}
