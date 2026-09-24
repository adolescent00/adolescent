#!/usr/bin/env python3
"""Inline assets/styles.css, assets/main.js and the logo into index.html.
Run after editing anything in assets/. Keeps index.html fully self-contained
(fonts, icons and the OG image stay as files)."""
import base64, pathlib, re
root = pathlib.Path(__file__).parent
html = (root / 'index.html').read_text()
css = (root / 'assets/styles.css').read_text().replace('url(fonts/', 'url(assets/fonts/')
js = (root / 'assets/main.js').read_text()
logo = 'data:image/png;base64,' + base64.b64encode((root / 'assets/logo.png').read_bytes()).decode()
# stylesheet: replace <link> or an existing inline block
if '<link rel="stylesheet" href="assets/styles.css">' in html:
    html = html.replace('<link rel="stylesheet" href="assets/styles.css">', f'<style id="site-styles">\n{css}\n</style>')
else:
    html = re.sub(r'<style id="site-styles">.*?</style>', lambda m: f'<style id="site-styles">\n{css}\n</style>', html, flags=re.S)
if '<script src="assets/main.js" defer></script>' in html:
    html = html.replace('<script src="assets/main.js" defer></script>', f'<script id="site-script">\n{js}\n</script>')
else:
    html = re.sub(r'<script id="site-script">.*?</script>', lambda m: f'<script id="site-script">\n{js}\n</script>', html, flags=re.S)
html = re.sub(r'src="(assets/logo\.png|data:image/png;base64,[A-Za-z0-9+/=]+)"', f'src="{logo}"', html)
html = html.replace('<link rel="preload" href="assets/logo.png" as="image">\n', '')
(root / 'index.html').write_text(html)
print('index.html built:', len(html), 'bytes')
