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
    <main className="flex h-screen w-screen items-center justify-center overflow-hidden">
      <Console3DS />
    </main>
  );
}
