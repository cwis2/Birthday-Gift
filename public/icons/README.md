# App Icons Folder (`public/icons`)

Place any game or application icons here!

Supported formats: `.png`, `.jpg`, `.jpeg`, `.svg`, `.webp`

### How to use them:
In `src/data/apps.ts`, simply point the `icon` field to the path starting with `/icons/`:

```ts
{
  id: "my-game",
  title: "My Custom Game",
  publisher: "Nintendo",
  icon: "/icons/my-game.png", // or .svg / .jpg
  color: "#ff3b30",
}
```
