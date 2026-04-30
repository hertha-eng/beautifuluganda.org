(function () {
    const contentApi = window.ExploreUgandaContent;
    const container = document.getElementById("admin-sections");
    const statusEl = document.getElementById("admin-status");
    const saveButton = document.getElementById("save-admin-content");
    const importButton = document.getElementById("import-admin-content");
    const resetButton = document.getElementById("reset-admin-content");
    const exportButton = document.getElementById("export-admin-content");

    if (!contentApi || !container) {
        return;
    }

    const BLOG_FOLDER = "blog pages";
    const BLOG_CSS_FOLDER = "css";
    const DEFAULT_BLOG_STYLESHEET = "css/blog-article.css";
    const EDITOR_STORAGE_KEY = "explore-uganda-blog-editor-selected-article";

    const schema = [
        {
            key: "home",
            title: "Home Page",
            sections: [
                {
                    key: "hero",
                    title: "Hero Section",
                    fields: [
                        ["title", "Hero Title"],
                        ["text", "Hero Text"],
                        ["primaryLabel", "Primary Button Label"],
                        ["primaryHref", "Primary Button Link"],
                        ["secondaryLabel", "Secondary Button Label"],
                        ["secondaryHref", "Secondary Button Link"]
                    ]
                },
                {
                    key: "featuredDestinations",
                    title: "Featured Destinations",
                    type: "cards",
                    listTitle: "Destination Cards",
                    itemFields: [
                        ["image", "Image Path"],
                        ["alt", "Image Alt Text"],
                        ["title", "Title"],
                        ["text", "Description"],
                        ["buttonLabel", "Button Label"],
                        ["buttonHref", "Button Link"]
                    ]
                },
                {
                    key: "topTours",
                    title: "Top Tours",
                    type: "cards",
                    listTitle: "Tour Cards",
                    itemFields: [
                        ["image", "Image Path"],
                        ["alt", "Image Alt Text"],
                        ["title", "Title"],
                        ["text", "Description"],
                        ["buttonLabel", "Button Label"],
                        ["buttonHref", "Button Link"]
                    ]
                },
                {
                    key: "blogHighlights",
                    title: "Blog Highlights",
                    type: "cards",
                    listTitle: "Blog Highlight Cards",
                    itemFields: [
                        ["image", "Image Path"],
                        ["alt", "Image Alt Text"],
                        ["title", "Title"],
                        ["text", "Description"],
                        ["buttonLabel", "Button Label"],
                        ["buttonHref", "Button Link"]
                    ]
                },
                {
                    key: "cta",
                    title: "Call To Action",
                    fields: [
                        ["title", "CTA Title"],
                        ["buttonLabel", "Button Label"],
                        ["buttonHref", "Button Link"]
                    ]
                }
            ]
        },
        {
            key: "destinations",
            title: "Destinations Page",
            sections: [
                {
                    key: "hero",
                    title: "Hero Section",
                    fields: [
                        ["title", "Hero Title"],
                        ["text", "Hero Text"]
                    ]
                },
                {
                    key: "cards",
                    title: "Destination Cards",
                    type: "destinationCards",
                    listTitle: "Destination List",
                    itemFields: [
                        ["image", "Image Path"],
                        ["alt", "Image Alt Text"],
                        ["title", "Title"],
                        ["text", "Description"],
                        ["activities", "Activities (one per line)"],
                        ["buttonLabel", "Button Label"],
                        ["buttonHref", "Button Link"]
                    ]
                },
                {
                    key: "cta",
                    title: "Call To Action",
                    fields: [
                        ["title", "CTA Title"],
                        ["buttonLabel", "Button Label"],
                        ["buttonHref", "Button Link"]
                    ]
                }
            ]
        },
        {
            key: "tours",
            title: "Tours Page",
            sections: [
                {
                    key: "hero",
                    title: "Hero Section",
                    fields: [
                        ["title", "Hero Title"],
                        ["text", "Hero Text"]
                    ]
                },
                {
                    key: "cards",
                    title: "Tour Cards",
                    type: "tourCards",
                    listTitle: "Tour List",
                    itemFields: [
                        ["image", "Image Path"],
                        ["alt", "Image Alt Text"],
                        ["title", "Title"],
                        ["text", "Description"],
                        ["included", "Included Items (one per line)"],
                        ["buttonLabel", "Button Label"],
                        ["buttonHref", "Button Link"]
                    ]
                },
                {
                    key: "cta",
                    title: "Call To Action",
                    fields: [
                        ["title", "CTA Title"],
                        ["buttonLabel", "Button Label"],
                        ["buttonHref", "Button Link"]
                    ]
                }
            ]
        },
        {
            key: "souvenirs",
            title: "Souvenirs Page",
            sections: [
                {
                    key: "hero",
                    title: "Hero Section",
                    fields: [
                        ["title", "Hero Title"],
                        ["text", "Hero Text"]
                    ]
                },
                {
                    key: "toolbar",
                    title: "Toolbar Notes",
                    fields: [
                        ["note", "Market Note"],
                        ["currencyNote", "Currency Note"]
                    ]
                },
                {
                    key: "cards",
                    title: "Souvenir Products",
                    type: "souvenirCards",
                    listTitle: "Souvenir Item",
                    itemFields: [
                        ["image", "Image Path"],
                        ["alt", "Image Alt Text"],
                        ["title", "Product Title"],
                        ["text", "Description"],
                        ["priceUgx", "Price in UGX"],
                        ["buttonLabel", "Button Label"]
                    ]
                },
                {
                    key: "cta",
                    title: "Call To Action",
                    fields: [
                        ["title", "CTA Title"],
                        ["buttonLabel", "Button Label"],
                        ["buttonHref", "Button Link"]
                    ]
                }
            ]
        },
        {
            key: "blog",
            title: "Blog Page",
            sections: [
                {
                    key: "hero",
                    title: "Hero Section",
                    fields: [
                        ["title", "Hero Title"],
                        ["text", "Hero Text"]
                    ]
                },
                {
                    key: "listingIntro",
                    title: "Listing Intro",
                    fields: [
                        ["kicker", "Kicker"],
                        ["title", "Section Title"],
                        ["text", "Section Text"]
                    ]
                },
                {
                    key: "cards",
                    title: "Blog Cards",
                    type: "blogCards",
                    listTitle: "Blog Card List",
                    itemFields: [
                        ["image", "Image Path"],
                        ["alt", "Image Alt Text"],
                        ["category", "Category Value"],
                        ["tag", "Category Label"],
                        ["keywords", "Search Keywords"],
                        ["date", "Date (YYYY-MM-DD)"],
                        ["displayDate", "Display Date"],
                        ["authorName", "Author Name"],
                        ["authorCountry", "Author Country"],
                        ["authorRole", "Author Role"],
                        ["title", "Title"],
                        ["text", "Summary"],
                        ["buttonLabel", "Button Label"],
                        ["buttonHref", "Button Link"]
                    ]
                },
                {
                    key: "cta",
                    title: "Call To Action",
                    fields: [
                        ["title", "CTA Title"],
                        ["buttonLabel", "Button Label"],
                        ["buttonHref", "Button Link"]
                    ]
                }
            ]
        }
    ];

    const blogEditorState = {
        rootHandle: null,
        blogPagesHandle: null,
        blogCssHandle: null,
        managerEl: null,
        formEl: null,
        listEl: null,
        fileInfoEl: null,
        folderStatusEl: null,
        editorStatusEl: null,
        activeArticleHref: window.localStorage.getItem(EDITOR_STORAGE_KEY) || "",
        activeMode: "existing",
        sourceHtml: ""
    };

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function createInput(label, value, key, multiline) {
        const wrapper = document.createElement("div");
        wrapper.className = key === "text" || key === "keywords" || key === "activities" || key === "included" ? "full-width" : "";

        const labelEl = document.createElement("label");
        labelEl.textContent = label;

        const input = multiline ? document.createElement("textarea") : document.createElement("input");
        if (!multiline) {
            input.type = "text";
        }
        input.value = value || "";
        input.dataset.fieldKey = key;

        wrapper.appendChild(labelEl);
        wrapper.appendChild(input);
        return wrapper;
    }

    function createBlogEditorField(label, name, value, options) {
        const wrapper = document.createElement("div");
        wrapper.className = options && options.fullWidth ? "full-width" : "";

        const labelEl = document.createElement("label");
        labelEl.setAttribute("for", `blog-editor-${name}`);
        labelEl.textContent = label;

        const isTextarea = options && options.multiline;
        const input = isTextarea ? document.createElement("textarea") : document.createElement("input");
        input.id = `blog-editor-${name}`;
        input.name = name;
        input.value = value || "";

        if (!isTextarea) {
            input.type = options && options.type ? options.type : "text";
        }

        if (options && options.placeholder) {
            input.placeholder = options.placeholder;
        }

        if (options && options.readOnly) {
            input.readOnly = true;
        }

        if (options && options.rows) {
            input.rows = options.rows;
        }

        wrapper.appendChild(labelEl);
        wrapper.appendChild(input);
        return wrapper;
    }

    function buildSimpleSection(pageKey, sectionConfig, sectionData) {
        const section = document.createElement("section");
        section.className = "field-group";
        section.dataset.sectionKey = sectionConfig.key;
        section.innerHTML = `<h4>${sectionConfig.title}</h4>`;

        const grid = document.createElement("div");
        grid.className = "field-grid";

        sectionConfig.fields.forEach(([fieldKey, label]) => {
            const multiline = fieldKey === "text";
            grid.appendChild(createInput(label, sectionData[fieldKey], fieldKey, multiline));
        });

        section.appendChild(grid);
        return section;
    }

    function buildRepeaterSection(sectionConfig, items) {
        const section = document.createElement("section");
        section.className = "field-group";
        section.dataset.sectionKey = sectionConfig.key;
        section.dataset.sectionType = sectionConfig.type;
        section.innerHTML = `
            <div class="admin-panel-header">
                <h4>${sectionConfig.title}</h4>
                <button type="button" class="small-button add-item-button">Add Item</button>
            </div>
        `;

        const list = document.createElement("div");
        list.className = "repeater-list";

        const createCard = (item, index) => {
            const card = document.createElement("article");
            card.className = "repeater-card";
            card.dataset.index = String(index);
            card.innerHTML = `
                <div class="repeater-card-header">
                    <h4>${sectionConfig.listTitle} ${index + 1}</h4>
                    <button type="button" class="small-button remove-item-button">Remove</button>
                </div>
            `;

            const grid = document.createElement("div");
            grid.className = "field-grid";

            sectionConfig.itemFields.forEach(([fieldKey, label]) => {
                const multiline = fieldKey === "activities" || fieldKey === "included" || fieldKey === "keywords" || fieldKey === "text";
                const value = Array.isArray(item[fieldKey]) ? item[fieldKey].join("\n") : item[fieldKey];
                grid.appendChild(createInput(label, value, fieldKey, multiline));
            });

            card.appendChild(grid);
            return card;
        };

        items.forEach((item, index) => {
            list.appendChild(createCard(item, index));
        });

        list.addEventListener("click", (event) => {
            if (event.target.classList.contains("remove-item-button")) {
                event.target.closest(".repeater-card").remove();
                renumberCards(list, sectionConfig.listTitle);
            }
        });

        section.querySelector(".add-item-button").addEventListener("click", () => {
            const newItem = {};
            sectionConfig.itemFields.forEach(([fieldKey]) => {
                newItem[fieldKey] = fieldKey === "activities" || fieldKey === "included" ? [] : "";
            });
            list.appendChild(createCard(newItem, list.children.length));
        });

        section.appendChild(list);
        return section;
    }

    function renumberCards(list, label) {
        Array.from(list.children).forEach((card, index) => {
            card.dataset.index = String(index);
            const title = card.querySelector(".repeater-card-header h4");
            if (title) {
                title.textContent = `${label} ${index + 1}`;
            }
        });
    }

    function buildPanel(pageConfig, pageData) {
        const panel = document.createElement("section");
        panel.className = "admin-panel";
        panel.dataset.pageKey = pageConfig.key;
        panel.id = `admin-${pageConfig.key}`;
        panel.innerHTML = `
            <div class="admin-panel-header">
                <h3>${pageConfig.title}</h3>
                <a href="${pageConfig.key === "home" ? "index.html" : `${pageConfig.key}.html`}" class="small-button">Open Page</a>
            </div>
        `;

        pageConfig.sections.forEach((sectionConfig) => {
            const sectionData = pageData[sectionConfig.key];
            if (sectionConfig.type) {
                panel.appendChild(buildRepeaterSection(sectionConfig, sectionData || []));
            } else {
                panel.appendChild(buildSimpleSection(pageConfig.key, sectionConfig, sectionData || {}));
            }
        });

        return panel;
    }

    function sortBlogCards(cards) {
        return [...cards].sort((a, b) => new Date(b.date || "") - new Date(a.date || ""));
    }

    function getBlogCards() {
        const content = contentApi.getContent();
        return sortBlogCards((content.blog && content.blog.cards) || []);
    }

    function getArticleFilenameFromHref(href) {
        return String(href || "").split("/").pop() || "";
    }

    function slugify(value) {
        return String(value || "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function formatDisplayDate(dateValue) {
        if (!dateValue) {
            return "";
        }

        const date = new Date(`${dateValue}T00:00:00`);
        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    function getInitialArticleDraft() {
        const today = new Date().toISOString().slice(0, 10);
        return {
            originalHref: "",
            slug: "",
            category: "destinations",
            tag: "Destinations",
            keywords: "",
            date: today,
            displayDate: formatDisplayDate(today),
            image: "images/blog-hero.webp",
            alt: "",
            authorName: "Explore Uganda Editorial Team",
            authorCountry: "Uganda",
            authorRole: "Travel Writer",
            title: "",
            text: "",
            buttonLabel: "Read More",
            seoTitle: "",
            metaDescription: "",
            heroTitle: "",
            heroText: "",
            headerButtonLabel: "Read More",
            headerButtonHref: "../plan-trip.html",
            ctaTitle: "Ready to Explore Uganda?",
            ctaText: "Plan your Uganda adventure with expert help and practical local guidance.",
            ctaButtonLabel: "Plan Your Trip",
            ctaButtonHref: "../plan-trip.html#trip-form",
            stylesheetPath: DEFAULT_BLOG_STYLESHEET,
            articleHtml: "<article class=\"blog-post-full\">\n    <h2>Article Section Heading</h2>\n    <img src=\"../images/blog-hero.webp\" alt=\"Describe the image clearly\">\n\n    <p>\n        Write the first section of your article here.\n    </p>\n</article>"
        };
    }

    function getArticleCardByHref(href) {
        return getBlogCards().find((card) => card.buttonHref === href) || null;
    }

    function extractText(doc, selector) {
        const node = doc.querySelector(selector);
        return node ? node.textContent.trim() : "";
    }

    function extractAttribute(doc, selector, attributeName) {
        const node = doc.querySelector(selector);
        return node ? node.getAttribute(attributeName) || "" : "";
    }

    function getArticleStylesheetPath(doc) {
        const links = Array.from(doc.querySelectorAll("link[rel='stylesheet']"));
        const articleLink = links.find((link) => {
            const href = link.getAttribute("href") || "";
            return !/^https?:\/\//i.test(href)
                && href.indexOf("../css/") === -1
                && href.endsWith(".css");
        });

        return articleLink ? articleLink.getAttribute("href") || DEFAULT_BLOG_STYLESHEET : DEFAULT_BLOG_STYLESHEET;
    }

    async function connectBlogFolder() {
        if (!window.showDirectoryPicker) {
            throw new Error("This browser does not support direct folder access. Use a recent version of Chrome, Edge, or another Chromium browser.");
        }

        const rootHandle = await window.showDirectoryPicker({
            id: "explore-uganda-project-folder",
            mode: "readwrite"
        });

        const blogPagesHandle = await rootHandle.getDirectoryHandle(BLOG_FOLDER);
        const blogCssHandle = await blogPagesHandle.getDirectoryHandle(BLOG_CSS_FOLDER);

        blogEditorState.rootHandle = rootHandle;
        blogEditorState.blogPagesHandle = blogPagesHandle;
        blogEditorState.blogCssHandle = blogCssHandle;
    }

    async function readArticleFile(filename) {
        const fileHandle = await blogEditorState.blogPagesHandle.getFileHandle(filename);
        const file = await fileHandle.getFile();
        return file.text();
    }

    function parseArticleDocument(html, card) {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const main = doc.querySelector("main.container");
        const ctaButtonHref = extractAttribute(doc, "#cta-blog .btn", "href") || "../plan-trip.html#trip-form";
        const draft = getInitialArticleDraft();

        return {
            ...draft,
            originalHref: card.buttonHref,
            slug: slugify(getArticleFilenameFromHref(card.buttonHref).replace(/\.html$/i, "")),
            category: card.category || draft.category,
            tag: card.tag || draft.tag,
            keywords: card.keywords || draft.keywords,
            date: card.date || draft.date,
            displayDate: card.displayDate || formatDisplayDate(card.date || draft.date),
            image: card.image || draft.image,
            alt: card.alt || draft.alt,
            authorName: card.authorName || draft.authorName,
            authorCountry: card.authorCountry || draft.authorCountry,
            authorRole: card.authorRole || draft.authorRole,
            title: card.title || extractText(doc, "#hero-blog h1") || draft.title,
            text: card.text || draft.text,
            buttonLabel: card.buttonLabel || draft.buttonLabel,
            seoTitle: doc.title || card.title || draft.seoTitle,
            metaDescription: extractAttribute(doc, "meta[name='description']", "content") || card.text || draft.metaDescription,
            heroTitle: extractText(doc, "#hero-blog h1") || card.title || draft.heroTitle,
            heroText: extractText(doc, "#hero-blog p") || draft.heroText,
            headerButtonLabel: extractText(doc, "header .header-actions .cta") || draft.headerButtonLabel,
            headerButtonHref: extractAttribute(doc, "header .header-actions .cta", "href") || draft.headerButtonHref,
            ctaTitle: extractText(doc, "#cta-blog h2") || draft.ctaTitle,
            ctaText: extractText(doc, "#cta-blog p") || draft.ctaText,
            ctaButtonLabel: extractText(doc, "#cta-blog .btn") || draft.ctaButtonLabel,
            ctaButtonHref,
            stylesheetPath: getArticleStylesheetPath(doc),
            articleHtml: main ? main.innerHTML.trim() : draft.articleHtml
        };
    }

    function getEditorFieldValue(name) {
        const field = blogEditorState.formEl ? blogEditorState.formEl.elements.namedItem(name) : null;
        return field ? field.value.trim() : "";
    }

    function collectArticleDraft() {
        const fallbackTitle = getEditorFieldValue("title");
        const fallbackSlug = slugify(getEditorFieldValue("slug") || fallbackTitle);
        const date = getEditorFieldValue("date");

        return {
            originalHref: getEditorFieldValue("originalHref"),
            slug: fallbackSlug,
            category: getEditorFieldValue("category") || "destinations",
            tag: getEditorFieldValue("tag") || "Destinations",
            keywords: getEditorFieldValue("keywords"),
            date,
            displayDate: getEditorFieldValue("displayDate") || formatDisplayDate(date),
            image: getEditorFieldValue("image"),
            alt: getEditorFieldValue("alt"),
            authorName: getEditorFieldValue("authorName") || "Explore Uganda Editorial Team",
            authorCountry: getEditorFieldValue("authorCountry") || "Uganda",
            authorRole: getEditorFieldValue("authorRole") || "Contributor",
            title: fallbackTitle,
            text: getEditorFieldValue("text"),
            buttonLabel: getEditorFieldValue("buttonLabel") || "Read More",
            seoTitle: getEditorFieldValue("seoTitle") || fallbackTitle,
            metaDescription: getEditorFieldValue("metaDescription"),
            heroTitle: getEditorFieldValue("heroTitle") || fallbackTitle,
            heroText: getEditorFieldValue("heroText"),
            headerButtonLabel: getEditorFieldValue("headerButtonLabel") || "Read More",
            headerButtonHref: getEditorFieldValue("headerButtonHref") || "../plan-trip.html",
            ctaTitle: getEditorFieldValue("ctaTitle"),
            ctaText: getEditorFieldValue("ctaText"),
            ctaButtonLabel: getEditorFieldValue("ctaButtonLabel") || "Plan Your Trip",
            ctaButtonHref: getEditorFieldValue("ctaButtonHref") || "../plan-trip.html#trip-form",
            stylesheetPath: getEditorFieldValue("stylesheetPath") || DEFAULT_BLOG_STYLESHEET,
            articleHtml: getEditorFieldValue("articleHtml")
        };
    }

    function serializeDocument(doc) {
        return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
    }

    function setMetaContent(doc, selector, value) {
        const node = doc.querySelector(selector);
        if (node) {
            node.setAttribute("content", value);
        }
    }

    function setLinkHref(doc, selector, value) {
        const node = doc.querySelector(selector);
        if (node) {
            node.setAttribute("href", value);
        }
    }

    function setTextContent(doc, selector, value) {
        const node = doc.querySelector(selector);
        if (node) {
            node.textContent = value;
        }
    }

    function updateExistingArticleHtml(sourceHtml, draft) {
        const doc = new DOMParser().parseFromString(sourceHtml, "text/html");
        const canonicalUrl = `https://lovableuganda.com/blog%20pages/${encodeURIComponent(draft.slug).replace(/%2F/g, "/")}.html`;
        const ogImagePath = `https://lovableuganda.com/${String(draft.image || "").replace(/^\.\.\//, "").replace(/^\.\//, "")}`;
        const articleBody = draft.articleHtml.trim();

        doc.title = draft.seoTitle || draft.title;
        setMetaContent(doc, "meta[name='description']", draft.metaDescription || draft.text);
        setLinkHref(doc, "link[rel='canonical']", canonicalUrl);
        setMetaContent(doc, "meta[property='og:title']", draft.seoTitle || draft.title);
        setMetaContent(doc, "meta[property='og:description']", draft.metaDescription || draft.text);
        setMetaContent(doc, "meta[property='og:url']", canonicalUrl);
        setMetaContent(doc, "meta[property='og:image']", ogImagePath);
        setMetaContent(doc, "meta[property='og:image:alt']", draft.alt || draft.title);
        setMetaContent(doc, "meta[name='twitter:title']", draft.seoTitle || draft.title);
        setMetaContent(doc, "meta[name='twitter:description']", draft.metaDescription || draft.text);
        setMetaContent(doc, "meta[name='twitter:image']", ogImagePath);
        setMetaContent(doc, "meta[name='twitter:image:alt']", draft.alt || draft.title);

        setTextContent(doc, "#hero-blog h1", draft.heroTitle || draft.title);
        setTextContent(doc, "#hero-blog p", draft.heroText);
        setTextContent(doc, "header .header-actions .cta", draft.headerButtonLabel || "Read More");
        setLinkHref(doc, "header .header-actions .cta", draft.headerButtonHref || "../plan-trip.html");
        setTextContent(doc, "#cta-blog h2", draft.ctaTitle);
        setTextContent(doc, "#cta-blog p", draft.ctaText);
        setTextContent(doc, "#cta-blog .btn", draft.ctaButtonLabel || "Plan Your Trip");
        setLinkHref(doc, "#cta-blog .btn", draft.ctaButtonHref || "../plan-trip.html#trip-form");
        setLinkHref(doc, "link[href$='.css']:not([href^='http']):not([href^='../css/'])", draft.stylesheetPath || DEFAULT_BLOG_STYLESHEET);

        const main = doc.querySelector("main.container");
        if (main) {
            main.innerHTML = articleBody;
        }

        return serializeDocument(doc);
    }

    function validateArticleDraft(draft) {
        if (!draft.slug) {
            throw new Error("Add a slug so the blog page can be saved.");
        }

        if (!draft.title) {
            throw new Error("Add an article title before saving.");
        }

        if (!draft.date) {
            throw new Error("Add the article date before saving.");
        }

        if (!draft.articleHtml) {
            throw new Error("Add article body HTML before saving.");
        }
    }

    function createArticleHtml(draft) {
        const pageTitle = escapeHtml(draft.seoTitle || draft.title);
        const description = escapeHtml(draft.metaDescription || draft.text);
        const heroTitle = escapeHtml(draft.heroTitle || draft.title);
        const heroText = escapeHtml(draft.heroText);
        const canonicalSlug = encodeURIComponent(draft.slug).replace(/%2F/g, "/");
        const imageUrl = escapeHtml(draft.image || "../images/blog-hero.webp");
        const imageAlt = escapeHtml(draft.alt || draft.title);
        const headerButtonLabel = escapeHtml(draft.headerButtonLabel || "Read More");
        const headerButtonHref = escapeHtml(draft.headerButtonHref || "../plan-trip.html");
        const ctaTitle = escapeHtml(draft.ctaTitle);
        const ctaText = escapeHtml(draft.ctaText);
        const ctaButtonLabel = escapeHtml(draft.ctaButtonLabel);
        const ctaButtonHref = escapeHtml(draft.ctaButtonHref);
        const stylesheetPath = escapeHtml(draft.stylesheetPath || DEFAULT_BLOG_STYLESHEET);
        const articleBody = draft.articleHtml.trim();

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="../images/logo.png" type="image/png">
    <link rel="apple-touch-icon" href="../images/logo.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <title>${pageTitle}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="theme-color" content="#004d40">
    <link rel="canonical" href="https://lovableuganda.com/blog%20pages/${canonicalSlug}.html">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="https://lovableuganda.com/blog%20pages/${canonicalSlug}.html">
    <meta property="og:image" content="https://lovableuganda.com/${imageUrl.replace(/^\.\.\//, "")}">
    <meta property="og:image:alt" content="${imageAlt}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="https://lovableuganda.com/${imageUrl.replace(/^\.\.\//, "")}">
    <meta name="twitter:image:alt" content="${imageAlt}">

    <link rel="stylesheet" href="../css/base.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/footer.css">
    <link rel="stylesheet" href="${stylesheetPath}">
</head>

<body>

<header>
    <div class="logo">
        <img src="../images/logo.png" alt="Explore Uganda logo" class="site-logo" />
        <h1>Explore Uganda</h1>
    </div>
    <nav>
        <ul>
            <li><a href="../index.html">Home</a></li>
            <li><a href="../destinations.html">Destinations</a></li>
            <li><a href="../tours.html">Tours</a></li>
            <li class="more-toggle">More</li>
            <li class="more-item"><a href="../souvenirs.html">Souvenirs</a></li>
            <li class="more-item active"><a href="../blog.html">Blog</a></li>
            <li class="more-item"><a href="../plan-trip.html">Plan My Trip</a></li>
            <li class="more-item"><a href="../contact.html">Contact</a></li>
        </ul>
    </nav>
    <div class="header-actions">
        <a class="back-button" href="../blog.html" data-fallback-href="../blog.html" aria-label="Go back to the previous page">
            <i class="fas fa-arrow-left"></i>
            <span>Back</span>
        </a>
        <a href="${headerButtonHref}" class="cta">${headerButtonLabel}</a>
    </div>
</header>

<section id="hero-blog">
    <h1>${heroTitle}</h1>
    <p>${heroText}</p>
</section>

<main class="container">
${articleBody}
</main>

<section id="cta-blog">
    <h2>${ctaTitle}</h2>
    <p>${ctaText}</p>
    <a href="${ctaButtonHref}" class="btn">${ctaButtonLabel}</a>
</section>

<footer>
    <div class="footer-about">
        <img src="../images/logo.png" alt="Explore Uganda logo" class="footer-logo" />
        <h2>Explore Uganda</h2>
        <p>Discover the Pearl of Africa. Your journey to Uganda’s wildlife, culture, and adventure begins here.</p>
    </div>

    <div class="footer-links">
        <h3>Quick Links</h3>
        <ul>
            <li><a href="../index.html">Home</a></li>
            <li><a href="../destinations.html">Destinations</a></li>
            <li><a href="../tours.html">Tours</a></li>
            <li><a href="../souvenirs.html">Souvenirs</a></li>
            <li><a href="../blog.html">Blog</a></li>
            <li><a href="../plan-trip.html">Plan My Trip</a></li>
            <li><a href="../contact.html">Contact</a></li>
        </ul>
    </div>

    <div class="footer-contact-social">
        <h3>Contact Us & Follow Us</h3>
        <ul>
            <li>Email: info@lovableuganda.com</li>
            <li>Phone: +256 757 714 664</li>
            <li>WhatsApp: <a href="https://wa.me/256773167457" target="_blank">+256 773 167 457</a></li>
            <li>Address: Kampala, Uganda</li>
        </ul>
        <div class="footer-social">
            <ul>
                <li><a href="#" target="_blank"><i class="fab fa-facebook-f"></i></a></li>
                <li><a href="#" target="_blank"><i class="fab fa-instagram"></i></a></li>
                <li><a href="#" target="_blank"><i class="fab fa-x-twitter"></i></a></li>
                <li><a href="#" target="_blank"><i class="fab fa-tiktok"></i></a></li>
                <li><a href="#" target="_blank"><i class="fab fa-youtube"></i></a></li>
            </ul>
        </div>
    </div>

    <div class="footer-subscribe">
        <h3>Subscribe to Our Newsletter</h3>
        <p>Stay updated with the latest news and offers.</p>
        <form>
            <input type="email" placeholder="Enter your email" required>
            <button type="submit">Subscribe</button>
        </form>
    </div>

    <p>&copy; 2026 Explore Uganda. All rights reserved.</p>
</footer>

<script>
    const backButton = document.querySelector('.back-button');
    const fallbackHref = backButton?.dataset.fallbackHref || '../blog.html';

    if (backButton) {
        try {
            const referrerUrl = document.referrer ? new URL(document.referrer) : null;
            const isInternalReferrer = referrerUrl && referrerUrl.origin === window.location.origin;
            const isDifferentPage = isInternalReferrer && referrerUrl.pathname !== window.location.pathname;

            backButton.href = isDifferentPage
                ? \`\${referrerUrl.pathname}\${referrerUrl.search}\${referrerUrl.hash}\`
                : fallbackHref;
        } catch (error) {
            backButton.href = fallbackHref;
        }

        backButton.addEventListener('click', (event) => {
            if (!document.referrer) {
                return;
            }

            try {
                const referrerUrl = new URL(document.referrer);
                const isInternalReferrer = referrerUrl.origin === window.location.origin;
                const isDifferentPage = referrerUrl.pathname !== window.location.pathname;

                if (isInternalReferrer && isDifferentPage && window.history.length > 1) {
                    event.preventDefault();
                    window.history.back();
                }
            } catch (error) {
                backButton.href = fallbackHref;
            }
        });
    }
</script>

<script>
    const moreToggle = document.querySelector('.more-toggle');
    const moreItems = document.querySelectorAll('.more-item');

    if (moreToggle) {
        moreToggle.addEventListener('click', () => {
            const isExpanded = moreToggle.textContent === 'Less';
            moreItems.forEach((item) => {
                item.style.display = isExpanded ? 'none' : 'block';
            });
            moreToggle.textContent = isExpanded ? 'More' : 'Less';
        });
    }
</script>

</body>
</html>`;
    }

    async function writeFile(fileHandle, text) {
        const writable = await fileHandle.createWritable();
        await writable.write(text);
        await writable.close();
    }

    async function saveArticleFile(draft) {
        const filename = `${draft.slug}.html`;
        const fileHandle = await blogEditorState.blogPagesHandle.getFileHandle(filename, { create: true });
        const html = draft.originalHref && blogEditorState.sourceHtml
            ? updateExistingArticleHtml(blogEditorState.sourceHtml, draft)
            : createArticleHtml(draft);
        await writeFile(fileHandle, html);
        return `${BLOG_FOLDER}/${filename}`;
    }

    async function deleteArticleFileByHref(href) {
        const filename = getArticleFilenameFromHref(href);
        if (!filename) {
            return;
        }

        await blogEditorState.blogPagesHandle.removeEntry(filename);
    }

    function updateBlogCardContent(draft, hrefToSave, hrefToReplace) {
        const content = contentApi.getContent();
        const blog = content.blog || {};
        const cards = [...(blog.cards || [])];
        const nextCard = {
            image: draft.image,
            alt: draft.alt,
            category: draft.category,
            tag: draft.tag,
            keywords: draft.keywords,
            date: draft.date,
            displayDate: draft.displayDate || formatDisplayDate(draft.date),
            authorName: draft.authorName,
            authorCountry: draft.authorCountry,
            authorRole: draft.authorRole,
            title: draft.title,
            text: draft.text,
            buttonLabel: draft.buttonLabel || "Read More",
            buttonHref: hrefToSave
        };

        const index = cards.findIndex((card) => card.buttonHref === hrefToReplace);
        if (index >= 0) {
            cards[index] = nextCard;
        } else {
            cards.push(nextCard);
        }

        content.blog = {
            ...blog,
            cards: sortBlogCards(cards)
        };

        contentApi.saveContent(content);
    }

    function removeBlogCard(href) {
        const content = contentApi.getContent();
        const blog = content.blog || {};
        const cards = (blog.cards || []).filter((card) => card.buttonHref !== href);
        content.blog = {
            ...blog,
            cards
        };
        contentApi.saveContent(content);
    }

    function setStatus(message) {
        statusEl.textContent = message;
    }

    function setEditorStatus(message, isError) {
        if (!blogEditorState.editorStatusEl) {
            return;
        }

        blogEditorState.editorStatusEl.textContent = message;
        blogEditorState.editorStatusEl.dataset.state = isError ? "error" : "ok";
    }

    function setFolderStatus() {
        if (!blogEditorState.folderStatusEl) {
            return;
        }

        if (blogEditorState.rootHandle) {
            blogEditorState.folderStatusEl.textContent = `Connected to project folder. Blog files will be saved inside "${BLOG_FOLDER}/".`;
            blogEditorState.folderStatusEl.dataset.state = "ok";
            return;
        }

        blogEditorState.folderStatusEl.textContent = "Not connected yet. Click Connect Folder before editing real blog page files.";
        blogEditorState.folderStatusEl.dataset.state = "warning";
    }

    function buildBlogFileManager() {
        const panel = document.createElement("section");
        panel.className = "admin-panel blog-file-panel";
        panel.id = "admin-blog-pages";
        panel.innerHTML = `
            <div class="admin-panel-header">
                <h3>Blog Page Manager</h3>
                <div class="admin-toolbar-actions">
                    <button type="button" class="small-button" data-action="connect-folder">Connect Folder</button>
                    <button type="button" class="small-button" data-action="new-article">New Article</button>
                    <button type="button" class="small-button" data-action="reload-article">Reload Article</button>
                </div>
            </div>
            <p class="blog-file-note">This editor works with the real article files in <code>${BLOG_FOLDER}/</code>. Use a Chromium-based browser so the page can open the project folder after you approve it.</p>
            <p class="blog-file-status" data-role="folder-status" aria-live="polite"></p>
            <div class="blog-editor-layout">
                <aside class="blog-editor-sidebar">
                    <h4>Existing Blog Pages</h4>
                    <div class="blog-editor-list" data-role="article-list"></div>
                </aside>
                <div class="blog-editor-main">
                    <p class="blog-file-path" data-role="file-info">Choose an article or create a new one.</p>
                    <form class="blog-editor-form" data-role="article-form">
                        <input type="hidden" name="originalHref" value="">
                        <div class="field-grid blog-editor-grid"></div>
                        <div class="field-group">
                            <h4>Article Body HTML</h4>
                            <p class="blog-editor-helper">Use normal article markup like <code>&lt;article class="blog-post-full"&gt;</code>, headings, images, paragraphs, and links.</p>
                            <textarea name="articleHtml" id="blog-editor-articleHtml" rows="18"></textarea>
                        </div>
                        <div class="admin-toolbar-actions">
                            <button type="button" class="btn" data-action="save-article">Save Blog Page</button>
                            <button type="button" class="btn secondary-btn" data-action="delete-article">Delete Blog Page</button>
                        </div>
                    </form>
                    <p class="blog-file-status" data-role="editor-status" aria-live="polite">No blog page loaded yet.</p>
                </div>
            </div>
        `;

        blogEditorState.managerEl = panel;
        blogEditorState.listEl = panel.querySelector("[data-role='article-list']");
        blogEditorState.formEl = panel.querySelector("[data-role='article-form']");
        blogEditorState.fileInfoEl = panel.querySelector("[data-role='file-info']");
        blogEditorState.folderStatusEl = panel.querySelector("[data-role='folder-status']");
        blogEditorState.editorStatusEl = panel.querySelector("[data-role='editor-status']");

        const grid = panel.querySelector(".blog-editor-grid");
        const fields = [
            ["slug", "Slug", "", { placeholder: "unique-wildlife" }],
            ["category", "Category Value", "", { placeholder: "destinations" }],
            ["tag", "Category Label", "", { placeholder: "Wildlife" }],
            ["date", "Publish Date", "", { type: "date" }],
            ["displayDate", "Display Date", "", { placeholder: "March 23, 2026" }],
            ["image", "Card Image Path", "", { placeholder: "images/gorilla.webp" }],
            ["alt", "Card Image Alt Text", "", { placeholder: "Describe the article image" }],
            ["keywords", "Search Keywords", "", { multiline: true, fullWidth: true, rows: 4 }],
            ["authorName", "Author Name", "", {}],
            ["authorCountry", "Author Country", "", {}],
            ["authorRole", "Author Role", "", {}],
            ["title", "Card Title", "", {}],
            ["text", "Card Summary", "", { multiline: true, fullWidth: true, rows: 4 }],
            ["buttonLabel", "Button Label", "Read More", {}],
            ["seoTitle", "SEO Page Title", "", { fullWidth: true }],
            ["metaDescription", "Meta Description", "", { multiline: true, fullWidth: true, rows: 4 }],
            ["heroTitle", "Article Hero Title", "", { fullWidth: true }],
            ["heroText", "Article Hero Text", "", { multiline: true, fullWidth: true, rows: 4 }],
            ["headerButtonLabel", "Header Button Label", "", {}],
            ["headerButtonHref", "Header Button Link", "", {}],
            ["ctaTitle", "CTA Title", "", { fullWidth: true }],
            ["ctaText", "CTA Text", "", { multiline: true, fullWidth: true, rows: 4 }],
            ["ctaButtonLabel", "CTA Button Label", "", {}],
            ["ctaButtonHref", "CTA Button Link", "", {}],
            ["stylesheetPath", "Article Stylesheet", DEFAULT_BLOG_STYLESHEET, {}]
        ];

        fields.forEach(([name, label, value, options]) => {
            grid.appendChild(createBlogEditorField(label, name, value, options));
        });

        panel.addEventListener("click", async (event) => {
            const action = event.target.dataset.action;

            if (!action) {
                return;
            }

            if (action === "connect-folder") {
                try {
                    await connectBlogFolder();
                    setFolderStatus();
                    setEditorStatus("Project folder connected. You can now edit real blog page files.", false);
                    if (blogEditorState.activeArticleHref) {
                        await openArticleInEditor(blogEditorState.activeArticleHref);
                    }
                } catch (error) {
                    setEditorStatus(error.message || "Could not connect the project folder.", true);
                }
                return;
            }

            if (action === "new-article") {
                loadArticleDraft(getInitialArticleDraft(), true);
                setEditorStatus("New article draft ready. Save it to create a new blog page file.", false);
                return;
            }

            if (action === "reload-article") {
                if (!blogEditorState.activeArticleHref) {
                    setEditorStatus("Choose an article first.", true);
                    return;
                }
                try {
                    await openArticleInEditor(blogEditorState.activeArticleHref);
                    setEditorStatus("Article reloaded from file.", false);
                } catch (error) {
                    setEditorStatus(error.message || "Could not reload the selected article.", true);
                }
                return;
            }

            if (action === "save-article") {
                try {
                    if (!blogEditorState.blogPagesHandle) {
                        await connectBlogFolder();
                        setFolderStatus();
                    }

                    const draft = collectArticleDraft();
                    validateArticleDraft(draft);

                    const hrefToSave = await saveArticleFile(draft);
                    const hrefToReplace = draft.originalHref || hrefToSave;

                    if (draft.originalHref && draft.originalHref !== hrefToSave) {
                        await deleteArticleFileByHref(draft.originalHref);
                    }

                    updateBlogCardContent(draft, hrefToSave, hrefToReplace);
                    blogEditorState.activeArticleHref = hrefToSave;
                    window.localStorage.setItem(EDITOR_STORAGE_KEY, hrefToSave);
                    renderAdmin();
                    await openArticleInEditor(hrefToSave);
                    setStatus("Blog page saved to file and blog listing updated.");
                    setEditorStatus(`Saved ${hrefToSave}.`, false);
                } catch (error) {
                    setEditorStatus(error.message || "Could not save the blog page.", true);
                }
                return;
            }

            if (action === "delete-article") {
                const href = getEditorFieldValue("originalHref") || blogEditorState.activeArticleHref;
                if (!href) {
                    setEditorStatus("Choose an article before deleting.", true);
                    return;
                }

                const confirmed = window.confirm(`Delete ${href}? This removes the blog page file and its card from the blog listing.`);
                if (!confirmed) {
                    return;
                }

                try {
                    if (!blogEditorState.blogPagesHandle) {
                        await connectBlogFolder();
                        setFolderStatus();
                    }

                    await deleteArticleFileByHref(href);
                    removeBlogCard(href);
                    blogEditorState.activeArticleHref = "";
                    window.localStorage.removeItem(EDITOR_STORAGE_KEY);
                    renderAdmin();
                    loadArticleDraft(getInitialArticleDraft(), true);
                    setStatus("Blog page deleted and removed from the blog listing.");
                    setEditorStatus(`${href} deleted.`, false);
                } catch (error) {
                    setEditorStatus(error.message || "Could not delete the selected blog page.", true);
                }
            }
        });

        blogEditorState.listEl.addEventListener("click", async (event) => {
            const button = event.target.closest("[data-article-href]");
            if (!button) {
                return;
            }

            const href = button.dataset.articleHref;
            try {
                await openArticleInEditor(href);
                setEditorStatus(`Loaded ${href}.`, false);
            } catch (error) {
                setEditorStatus(error.message || "Could not open the selected article.", true);
            }
        });

        return panel;
    }

    function populateArticleList() {
        if (!blogEditorState.listEl) {
            return;
        }

        const cards = getBlogCards();
        blogEditorState.listEl.innerHTML = cards.map((card) => {
            const isActive = card.buttonHref === blogEditorState.activeArticleHref;
            return `
                <button type="button" class="blog-article-link${isActive ? " is-active" : ""}" data-article-href="${escapeHtml(card.buttonHref)}">
                    <strong>${escapeHtml(card.title)}</strong>
                    <span>${escapeHtml(card.displayDate || card.date || "")}</span>
                    <small>${escapeHtml(card.buttonHref)}</small>
                </button>
            `;
        }).join("");
    }

    function loadArticleDraft(draft, isNewArticle) {
        if (!blogEditorState.formEl) {
            return;
        }

        blogEditorState.activeMode = isNewArticle ? "new" : "existing";
        blogEditorState.sourceHtml = !isNewArticle && draft.sourceHtml ? draft.sourceHtml : "";
        const mergedDraft = {
            ...getInitialArticleDraft(),
            ...draft
        };

        Object.keys(mergedDraft).forEach((key) => {
            const field = blogEditorState.formEl.elements.namedItem(key);
            if (field) {
                field.value = mergedDraft[key] || "";
            }
        });

        const href = mergedDraft.originalHref || (mergedDraft.slug ? `${BLOG_FOLDER}/${mergedDraft.slug}.html` : "");
        blogEditorState.fileInfoEl.textContent = href
            ? `Editing file: ${href}`
            : "Creating a new article. The file path will be generated from the slug when you save.";

        if (!isNewArticle && mergedDraft.originalHref) {
            blogEditorState.activeArticleHref = mergedDraft.originalHref;
            window.localStorage.setItem(EDITOR_STORAGE_KEY, mergedDraft.originalHref);
        }

        populateArticleList();
    }

    async function openArticleInEditor(href) {
        const card = getArticleCardByHref(href);
        if (!card) {
            throw new Error("That article is not in the current blog listing.");
        }

        blogEditorState.activeArticleHref = href;
        window.localStorage.setItem(EDITOR_STORAGE_KEY, href);
        populateArticleList();

        if (!blogEditorState.blogPagesHandle) {
            loadArticleDraft({
                ...getInitialArticleDraft(),
                originalHref: card.buttonHref,
                slug: slugify(getArticleFilenameFromHref(card.buttonHref).replace(/\.html$/i, "")),
                category: card.category,
                tag: card.tag,
                keywords: card.keywords,
                date: card.date,
                displayDate: card.displayDate,
                image: card.image,
                alt: card.alt,
                authorName: card.authorName,
                authorCountry: card.authorCountry,
                authorRole: card.authorRole,
                title: card.title,
                text: card.text,
                buttonLabel: card.buttonLabel
            }, false);
            blogEditorState.fileInfoEl.textContent = `Selected ${href}. Connect the folder to load the full article file.`;
            return;
        }

        const html = await readArticleFile(getArticleFilenameFromHref(href));
        loadArticleDraft({
            ...parseArticleDocument(html, card),
            sourceHtml: html
        }, false);
    }

    function renderAdmin() {
        const content = contentApi.getContent();
        container.innerHTML = "";
        schema.forEach((pageConfig) => {
            container.appendChild(buildPanel(pageConfig, clone(content[pageConfig.key])));
        });

        container.appendChild(buildBlogFileManager());
        populateArticleList();
        setFolderStatus();

        if (blogEditorState.activeArticleHref) {
            const activeCard = getArticleCardByHref(blogEditorState.activeArticleHref);
            if (activeCard) {
                loadArticleDraft({
                    ...getInitialArticleDraft(),
                    originalHref: activeCard.buttonHref,
                    slug: slugify(getArticleFilenameFromHref(activeCard.buttonHref).replace(/\.html$/i, "")),
                    category: activeCard.category,
                    tag: activeCard.tag,
                    keywords: activeCard.keywords,
                    date: activeCard.date,
                    displayDate: activeCard.displayDate,
                    image: activeCard.image,
                    alt: activeCard.alt,
                    authorName: activeCard.authorName,
                    authorCountry: activeCard.authorCountry,
                    authorRole: activeCard.authorRole,
                    title: activeCard.title,
                    text: activeCard.text,
                    buttonLabel: activeCard.buttonLabel
                }, false);
                if (blogEditorState.blogPagesHandle) {
                    openArticleInEditor(blogEditorState.activeArticleHref).catch(() => {
                        setEditorStatus("The saved article selection could not be reopened from file.", true);
                    });
                }
            } else {
                loadArticleDraft(getInitialArticleDraft(), true);
            }
        } else {
            loadArticleDraft(getInitialArticleDraft(), true);
        }
    }

    function collectPanelData(panel, pageConfig) {
        const pageData = {};

        pageConfig.sections.forEach((sectionConfig) => {
            const section = panel.querySelector(`[data-section-key="${sectionConfig.key}"]`);
            if (!section) {
                return;
            }

            if (sectionConfig.type) {
                pageData[sectionConfig.key] = Array.from(section.querySelectorAll(".repeater-card")).map((card) => {
                    const item = {};
                    sectionConfig.itemFields.forEach(([fieldKey]) => {
                        const input = card.querySelector(`[data-field-key="${fieldKey}"]`);
                        const rawValue = input ? input.value.trim() : "";
                        if (fieldKey === "activities" || fieldKey === "included") {
                            item[fieldKey] = rawValue ? rawValue.split("\n").map((line) => line.trim()).filter(Boolean) : [];
                        } else {
                            item[fieldKey] = rawValue;
                        }
                    });
                    return item;
                });
                return;
            }

            const sectionData = {};
            sectionConfig.fields.forEach(([fieldKey]) => {
                const input = section.querySelector(`[data-field-key="${fieldKey}"]`);
                sectionData[fieldKey] = input ? input.value.trim() : "";
            });
            pageData[sectionConfig.key] = sectionData;
        });

        return pageData;
    }

    function collectContent() {
        const content = {};
        schema.forEach((pageConfig) => {
            const panel = container.querySelector(`[data-page-key="${pageConfig.key}"]`);
            content[pageConfig.key] = collectPanelData(panel, pageConfig);
        });
        return content;
    }

    saveButton.addEventListener("click", () => {
        const content = collectContent();
        contentApi.saveContent(content);
        renderAdmin();
        setStatus("Changes saved in this browser. Open the website pages to review them.");
    });

    importButton.addEventListener("click", () => {
        const pasted = window.prompt("Paste the backup JSON here:");
        if (!pasted) {
            return;
        }

        try {
            const parsed = JSON.parse(pasted);
            contentApi.saveContent(parsed);
            renderAdmin();
            setStatus("Backup JSON imported successfully.");
        } catch (error) {
            setStatus("That backup JSON could not be imported. Please check the format and try again.");
        }
    });

    resetButton.addEventListener("click", () => {
        contentApi.resetContent();
        renderAdmin();
        setStatus("Content reset to the website defaults.");
    });

    exportButton.addEventListener("click", async () => {
        const content = collectContent();
        const text = JSON.stringify(content, null, 2);
        try {
            await navigator.clipboard.writeText(text);
            setStatus("Backup JSON copied to your clipboard.");
        } catch (error) {
            setStatus("Could not copy automatically. Save first, then copy from browser tools if needed.");
        }
    });

    renderAdmin();
})();
