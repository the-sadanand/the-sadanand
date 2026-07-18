# assets/fonts/

Place any locally-hosted font files here (woff2 preferred).

Currently the project loads fonts from Google Fonts CDN in preview.html:
- Orbitron (display / headings)
- Inter (body text)
- JetBrains Mono (code / monospace)

To self-host fonts (faster, no Google dependency):
1. Download from https://gwfh.mranftl.com/fonts
2. Place .woff2 files here
3. Replace the Google Fonts <link> in preview.html with @font-face rules in custom.css
