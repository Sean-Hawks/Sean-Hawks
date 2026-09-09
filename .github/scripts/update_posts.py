"""Fill README sections from hawks.tw RSS. Stdlib only."""
import html, re, sys, urllib.request
from email.utils import parsedate_to_datetime
from xml.etree import ElementTree as ET

FEED = "https://hawks.tw/rss.xml"
README = "README.md"

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "profile-readme-bot"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")

def og_image(url):
    try:
        m = re.search(r'<meta property="og:image" content="([^"]+)"', fetch(url))
        return m.group(1) if m else None
    except Exception:
        return None

def clip(text, n=90):
    text = re.sub(r"\s+", " ", html.unescape(text or "")).strip()
    return text if len(text) <= n else text[:n].rstrip() + "…"

root = ET.fromstring(fetch(FEED))
items = []
for it in root.iter("item"):
    items.append({
        "title": html.unescape(it.findtext("title", "")),
        "link": it.findtext("link", ""),
        "date": parsedate_to_datetime(it.findtext("pubDate")).strftime("%Y-%m-%d"),
        "cat": it.findtext("category", ""),
        "desc": it.findtext("description", ""),
    })
by = lambda c: [i for i in items if i["cat"] == c]

# Blog: image cards, 2 per row
blog = by("Blog")[:4]
cells = []
for p in blog:
    img = og_image(p["link"])
    pic = f'<a href="{p["link"]}"><img src="{img}" alt="" width="100%" /></a><br />' if img else ""
    cells.append(
        f'<td width="50%" valign="top">{pic}'
        f'<sub>{p["date"]}</sub><br /><b><a href="{p["link"]}">{html.escape(p["title"])}</a></b>'
        f'</td>'
    )
rows = ["<tr>" + "".join(cells[i:i+2]) + "</tr>" for i in range(0, len(cells), 2)]
blog_md = "<table>\n" + "\n".join(rows) + "\n</table>" if rows else "_Nothing yet._"

lib_md = "\n".join(f'- `{p["date"]}` [{p["title"]}]({p["link"]})' for p in by("Library Review")[:3]) or "_Nothing yet._"

src = open(README, encoding="utf-8").read()
def fill(s, key, body):
    return re.sub(rf"(<!-- {key}:START -->)(.*?)(<!-- {key}:END -->)", lambda m: f"{m.group(1)}\n{body}\n{m.group(3)}", s, flags=re.S)
out = fill(fill(src, "BLOG", blog_md), "LIBRARY", lib_md)
if out != src:
    open(README, "w", encoding="utf-8").write(out)
    print("README updated")
else:
    print("No change")
