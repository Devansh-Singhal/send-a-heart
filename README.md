<div align="center">

# ❤️ Infinite Line Heart

**Send someone a little love, drawn line by line.**
Type their name, add a note, share the link. It opens into a red heart that draws itself in nested lines, with music.

### [→ Make one now (free, no sign-up)](https://send-a-heart.vercel.app)

<img src="demo.gif" width="300" alt="A red heart drawing itself in nested lines on a black background">

## ⭐ If you sent one, please star this repo

### It's how I know people are using it, and it helps others find it.

</div>

---

## How to send one

1. Open **[the site](https://send-a-heart.vercel.app)**.
2. Type their name, and optionally your name and a short note.
3. Tap **Create their heart**, then **Copy link** or **WhatsApp**.

The link opens on their name. You can also make a heart-shaped QR code to print or put on a gift. When they tap, the music starts and their heart unfolds, line by line.

The name and note live inside the link you share. No account or database is needed; anyone with the link can open it.

## How it works

- **The heart:** nested red paths drawn on a canvas using a parametric heart equation. Each line grows from the center until the whole heart is complete. The original Python Turtle drawing is included in `main.py`.
- **The music:** sound and drawing start together when they tap. Replay restarts both, sound can be muted, and audio pauses when the page is hidden. Reduced-motion users see the finished heart after opening.
- **Link previews:** a tiny serverless function adds "A heart for [their name]" to each link (links look like `/f?t=Name&f=From&n=Note`), so WhatsApp and iMessage show the name in the preview.
- It's plain HTML, CSS and JavaScript, with no framework and no build step. It works on phones.

## Make your own copy

Fork this repo (top right) and import your fork on [Vercel](https://vercel.com/new), or click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Devansh-Singhal/send-a-heart)

Free to use and change under the MIT license. Please keep the credit, and a ⭐ is always appreciated.

---

<div align="center">

Made by [Devansh Singhal](https://github.com/Devansh-Singhal) · If this made someone smile, **⭐ star the repo**

</div>
