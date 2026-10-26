# Send a Heart

A little love, drawn line by line. Type their name, add a note, and share a link that opens into an animated red heart.

**[Make one now](https://send-a-heart.vercel.app)** — free, no sign-up.

## Send one
1. Open the site.
2. Enter their name, optionally your name and a short note.
3. Select **Create their heart**, then **Copy link**, **WhatsApp**, or **Share**.

They open the link and tap **Open your heart**. You can also save a heart-shaped QR code for a card or gift; a plain QR option is available.

## How it works
Plain HTML, CSS and JavaScript with no build step. Canvas draws the nested heart using the original Turtle equation in `main.py`. Reduced-motion users get the complete heart immediately. A small Vercel function adds the recipient's name to link previews; notes stay out of preview metadata. Personalization travels in the link, and anyone with that link can view it. No database, account, or payment setup.

## Deploy
Import this repository in Vercel with **Other** as the framework, no build command, and the project root as the output directory. Or run `npx vercel --prod` from this folder. `vercel.json` routes `/f` and `/for` to the personalized preview function.

## Check
Run `node --test tests/heart.test.js`. No installation required.

The original Python drawing remains in `main.py`. Sharing and QR utilities follow [Send a Bouquet](https://github.com/Devansh-Singhal/send-a-bouquet). See LICENSE and the notice in qrcode.js.

Made by [Devansh Singhal](https://github.com/Devansh-Singhal).
