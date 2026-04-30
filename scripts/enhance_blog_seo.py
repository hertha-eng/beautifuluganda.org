#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
BLOG_DIR = ROOT / "blog pages"
SITE_CONTENT = ROOT / "js" / "site-content.js"
GENERATED_CARDS = ROOT / "js" / "generated-blog-cards.js"
SITEMAP = ROOT / "sitemap.xml"

SITE_URL = "https://lovableuganda.com"
BLOG_URL = f"{SITE_URL}/blog.html"
BLOG_ARCHIVE_URL = f"{SITE_URL}/blog-archive.html"
LOGO_URL = f"{SITE_URL}/images/logo.png"
PUBLISHER_NAME = "Explore Uganda"
PUBLISHER_PHONE = "+256 757 714 664"


def js_unescape(value: str) -> str:
    return bytes(value, "utf-8").decode("unicode_escape")


CARD_PATTERN = re.compile(
    r"""\{\s*
        image:\s*"(?P<image>(?:[^"\\]|\\.)*)"\s*,[\s\S]*?
        alt:\s*"(?P<alt>(?:[^"\\]|\\.)*)"\s*,[\s\S]*?
        category:\s*"(?P<category>(?:[^"\\]|\\.)*)"\s*,[\s\S]*?
        tag:\s*"(?P<tag>(?:[^"\\]|\\.)*)"\s*,[\s\S]*?
        keywords:\s*"(?P<keywords>(?:[^"\\]|\\.)*)"\s*,[\s\S]*?
        date:\s*"(?P<date>(?:[^"\\]|\\.)*)"\s*,[\s\S]*?
        displayDate:\s*"(?P<displayDate>(?:[^"\\]|\\.)*)"\s*,[\s\S]*?
        authorName:\s*"(?P<authorName>(?:[^"\\]|\\.)*)"\s*,[\s\S]*?
        authorCountry:\s*"(?P<authorCountry>(?:[^"\\]|\\.)*)"\s*,[\s\S]*?
        authorRole:\s*"(?P<authorRole>(?:[^"\\]|\\.)*)"\s*,[\s\S]*?
        title:\s*"(?P<title>(?:[^"\\]|\\.)*)"\s*,[\s\S]*?
        text:\s*"(?P<text>(?:[^"\\]|\\.)*)"\s*,[\s\S]*?
        buttonLabel:\s*"(?P<buttonLabel>(?:[^"\\]|\\.)*)"\s*,[\s\S]*?
        buttonHref:\s*"(?P<buttonHref>(?:[^"\\]|\\.)*)"
        [\s\S]*?\}""",
    re.VERBOSE,
)


def load_cards() -> tuple[dict[str, dict], list[dict]]:
    cards = []
    for path in (SITE_CONTENT, GENERATED_CARDS):
        text = path.read_text(encoding="utf-8")
        for match in CARD_PATTERN.finditer(text):
            card = {key: js_unescape(value) for key, value in match.groupdict().items()}
            cards.append(card)

    by_href = {}
    for card in cards:
        by_href[card["buttonHref"]] = card
    return by_href, cards


def canonical_for_filename(filename: str) -> str:
    return f"{SITE_URL}/blog%20pages/{filename}"


def article_href_for_filename(filename: str) -> str:
    return f"blog pages/{filename}"


def abs_image_url(image_path: str) -> str:
    clean = image_path.lstrip("./")
    clean = clean.lstrip("/")
    if clean.startswith("images/"):
        return f"{SITE_URL}/{clean}"
    if clean.startswith("../images/"):
        return f"{SITE_URL}/{clean[3:]}"
    if clean.startswith("blog pages/"):
        return f"{SITE_URL}/{clean.replace(' ', '%20')}"
    return f"{SITE_URL}/{clean}"


def extract(pattern: str, text: str, fallback: str = "") -> str:
    match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
    return match.group(1).strip() if match else fallback


def html_escape(value: str) -> str:
    return (
        value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def seo_markered_block(marker_name: str, content: str) -> str:
    return f"<!-- {marker_name}_START -->\n{content}\n<!-- {marker_name}_END -->"


def replace_or_insert_marked_block(text: str, marker_name: str, content: str, before: str) -> str:
    block = seo_markered_block(marker_name, content)
    pattern = re.compile(
        rf"<!-- {marker_name}_START -->[\s\S]*?<!-- {marker_name}_END -->\n?",
        re.MULTILINE,
    )
    if pattern.search(text):
        return pattern.sub(block + "\n", text)
    return text.replace(before, block + "\n" + before, 1)


def build_author_schema(card: dict) -> dict:
    author_name = card.get("authorName", PUBLISHER_NAME)
    if author_name.startswith("Explore Uganda"):
        return {"@type": "Organization", "name": author_name}
    return {"@type": "Person", "name": author_name}


def format_iso_date(date_value: str) -> str:
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", date_value):
        return f"{date_value}T08:00:00+03:00"
    return date_value


def file_modified_iso(path: Path) -> str:
    dt = datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc).astimezone()
    return dt.isoformat(timespec="seconds")


def category_label(card: dict) -> str:
    return card.get("tag") or card.get("category", "Uganda Travel").replace("-", " ").title()


def related_candidates(card: dict, all_cards: list[dict]) -> list[dict]:
    same_category = [
        item
        for item in all_cards
        if item["buttonHref"] != card["buttonHref"] and item.get("category") == card.get("category")
    ]
    same_category.sort(key=lambda item: item.get("date", ""), reverse=True)

    cornerstone_slugs = [
        "why-uganda-should-be-your-next-destination.html",
        "a-first-time-visitor-s-guide-to-uganda.html",
        "best-time-to-visit-uganda-a-seasonal-guide.html",
        "ultimate-uganda-safari-itinerary.html",
        "top-wildlife-experiences-in-uganda.html",
        "best-national-parks-in-uganda-ranked.html",
        "most-beautiful-landscapes-in-uganda.html",
    ]

    cornerstone = []
    for slug in cornerstone_slugs:
        href = f"blog pages/{slug}"
        if href == card["buttonHref"]:
            continue
        candidate = next((item for item in all_cards if item["buttonHref"] == href), None)
        if candidate:
            cornerstone.append(candidate)

    selected = []
    seen = {card["buttonHref"]}
    for group in (same_category, cornerstone):
        for candidate in group:
            href = candidate["buttonHref"]
            if href in seen:
                continue
            selected.append(candidate)
            seen.add(href)
            if len(selected) == 3:
                return selected
    return selected[:3]


def related_section(card: dict, related: list[dict]) -> str:
    if not related:
        return ""

    intro = {
        "wildlife": "Keep exploring Uganda's wildlife stories and plan a route that turns one great sighting into a richer journey.",
        "waterfalls": "Explore more of Uganda's lakes, rivers, and falls to build a route with movement, calm, and scenery in balance.",
        "adventure": "See how Uganda's active side fits together when you pair challenge with the right scenic pauses.",
        "culture": "Explore more culture-led stories and let Uganda feel fuller, more human, and more memorable.",
        "cities": "Keep exploring Uganda beyond the obvious and discover how cities, culture, and local rhythm add depth to the trip.",
        "islands": "Find more places where Uganda softens into lake views, slower mornings, and the kind of beauty that invites lingering.",
        "travel-tips": "Use these guides to turn inspiration into a smoother, better-paced Uganda journey.",
    }.get(card.get("category"), "Explore a few more Uganda stories that can help turn curiosity into a fuller, better-shaped trip.")

    items = "\n".join(
        f'            <li><a href="{html_escape(Path(item["buttonHref"]).name)}">{html_escape(item["title"])}</a></li>'
        for item in related
    )
    return f"""<section class="related-guides" aria-labelledby="related-guides-title">
    <div class="related-guides-inner">
        <p class="related-guides-kicker">Keep Exploring</p>
        <h2 id="related-guides-title">Related Uganda Guides</h2>
        <p class="related-guides-intro">{html_escape(intro)}</p>
        <ul class="related-guides-list">
{items}
        </ul>
    </div>
</section>"""


def article_schema(card: dict, canonical: str, image_url: str, modified_iso: str, page_description: str) -> list[dict]:
    published_iso = format_iso_date(card.get("date", modified_iso[:10]))
    section = category_label(card)
    title = card.get("title", "")
    description = page_description or card.get("text", "")

    return [
        {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": description,
            "image": [image_url],
            "datePublished": published_iso,
            "dateModified": modified_iso,
            "articleSection": section,
            "keywords": card.get("keywords", ""),
            "mainEntityOfPage": {"@type": "WebPage", "@id": canonical},
            "author": build_author_schema(card),
            "publisher": {
                "@type": "Organization",
                "name": PUBLISHER_NAME,
                "logo": {"@type": "ImageObject", "url": LOGO_URL},
                "telephone": PUBLISHER_PHONE,
            },
            "isPartOf": {"@type": "Blog", "name": "Explore Uganda Travel Blog", "url": BLOG_URL},
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE_URL}/index.html"},
                {"@type": "ListItem", "position": 2, "name": "Blog", "item": BLOG_URL},
                {"@type": "ListItem", "position": 3, "name": title, "item": canonical},
            ],
        },
    ]


def enhance_blog_pages() -> None:
    card_map, all_cards = load_cards()
    fallback_card_defaults = {
        "authorName": PUBLISHER_NAME,
        "authorRole": "Uganda Travel Editorial Team",
        "authorCountry": "Uganda",
        "category": "travel-tips",
        "tag": "Uganda Travel Guides",
        "keywords": "uganda travel guide uganda safari pearl of africa",
    }

    for html_path in sorted(BLOG_DIR.glob("*.html")):
        rel_href = article_href_for_filename(html_path.name)
        html = html_path.read_text(encoding="utf-8")

        title = extract(r"<h1>(.*?)</h1>", html, html_path.stem.replace("-", " ").title())
        description = extract(r'<meta name="description" content="(.*?)">', html)
        canonical = extract(r'<link rel="canonical" href="(.*?)">', html, canonical_for_filename(html_path.name))
        og_image = extract(r'<meta property="og:image" content="(.*?)">', html, f"{SITE_URL}/images/blog-hero.jpeg")
        modified_iso = file_modified_iso(html_path)

        card = dict(fallback_card_defaults)
        card.update(
            {
                "title": title,
                "text": description or title,
                "buttonHref": rel_href,
                "date": modified_iso[:10],
            }
        )
        card.update(card_map.get(rel_href, {}))

        if not description:
            description = card.get("text", title)
            html = re.sub(
                r'(<title>.*?</title>)',
                r'\1\n    <meta name="description" content="' + html_escape(description) + '">',
                html,
                count=1,
                flags=re.DOTALL,
            )

        seo_meta = f"""<meta name="author" content="{html_escape(card['authorName'])}">
    <meta property="article:published_time" content="{html_escape(format_iso_date(card.get('date', modified_iso[:10])))}">
    <meta property="article:modified_time" content="{html_escape(modified_iso)}">
    <meta property="article:section" content="{html_escape(category_label(card))}">"""

        schema_json = json.dumps(
            article_schema(card, canonical, og_image, modified_iso, description),
            ensure_ascii=False,
            indent=2,
        )
        seo_schema = f'<script type="application/ld+json">\n{schema_json}\n    </script>'

        html = replace_or_insert_marked_block(html, "SEO_META", seo_meta, '<link rel="stylesheet" href="../css/base.css">')
        html = replace_or_insert_marked_block(html, "SEO_SCHEMA", seo_schema, "</head>")

        related = related_candidates(card, all_cards)
        related_html = related_section(card, related)
        if related_html:
            html = replace_or_insert_marked_block(html, "RELATED_GUIDES", related_html, '<section id="cta-blog">')

        html_path.write_text(html, encoding="utf-8")


def rebuild_sitemap() -> None:
    urls = [
        "index.html",
        "destinations.html",
        "tours.html",
        "souvenirs.html",
        "blog.html",
        "blog-archive.html",
        "plan-trip.html",
        "contact.html",
    ]

    entries = []
    for page in urls:
        path = ROOT / page
        lastmod = datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc).date().isoformat()
        entries.append((f"{SITE_URL}/{page}", lastmod))

    for article in sorted(BLOG_DIR.glob("*.html")):
        encoded_name = article.name.replace(" ", "%20")
        lastmod = datetime.fromtimestamp(article.stat().st_mtime, tz=timezone.utc).date().isoformat()
        entries.append((f"{SITE_URL}/blog%20pages/{encoded_name}", lastmod))

    xml_lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, lastmod in entries:
        xml_lines.append("  <url>")
        xml_lines.append(f"    <loc>{loc}</loc>")
        xml_lines.append(f"    <lastmod>{lastmod}</lastmod>")
        xml_lines.append("  </url>")
    xml_lines.append("</urlset>")
    SITEMAP.write_text("\n".join(xml_lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    enhance_blog_pages()
    rebuild_sitemap()
