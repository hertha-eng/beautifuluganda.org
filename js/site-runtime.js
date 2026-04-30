(function () {
    const STORAGE_KEY = "explore-uganda-admin-content";

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function getDefaultContent() {
        return clone(window.ExploreUgandaDefaultContent || {});
    }

    function getBlogCardKey(card) {
        const href = String(card && card.buttonHref || "").trim();
        if (href && href !== "blog.html" && href !== "blog-archive.html") {
            return href;
        }

        return `title:${slugify(card && card.title || card && card.seoTitle || card && card.image || "")}`;
    }

    function resolveBlogCardHref(card) {
        const href = String(card && card.buttonHref || "").trim();
        if (href && href !== "blog.html" && href !== "blog-archive.html") {
            return href;
        }

        return `blog pages/${slugify(card && card.title || "")}.html`;
    }

    function mergeCardsByHref(defaultCards, storedCards) {
        const merged = [];

        (defaultCards || []).forEach((card) => {
            if (!merged.some((existing) => getBlogCardKey(existing) === getBlogCardKey(card))) {
                merged.push(card);
            }
        });

        (storedCards || []).forEach((card) => {
            const existingIndex = merged.findIndex((existing) => getBlogCardKey(existing) === getBlogCardKey(card));
            if (existingIndex >= 0) {
                merged[existingIndex] = {
                    ...merged[existingIndex],
                    ...card
                };
                return;
            }

            merged.push(card);
        });

        return merged;
    }

    function mergeContent(defaults, stored) {
        const merged = {
            ...defaults,
            ...stored
        };

        if (defaults.blog || stored.blog) {
            merged.blog = {
                ...(defaults.blog || {}),
                ...(stored.blog || {})
            };

            merged.blog.cards = mergeCardsByHref(
                defaults.blog && defaults.blog.cards,
                stored.blog && stored.blog.cards
            );
        }

        return merged;
    }

    function getContent() {
        const defaults = getDefaultContent();
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            return mergeContent(defaults, stored);
        } catch (error) {
            return defaults;
        }
    }

    function saveContent(content) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    }

    function resetContent() {
        localStorage.removeItem(STORAGE_KEY);
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function renderList(items) {
        return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    }

    function slugify(text) {
        return String(text)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function buildShareActionsMarkup(options) {
        const url = escapeHtml(options.url);
        const title = escapeHtml(options.title);
        const text = escapeHtml(options.text);
        const label = escapeHtml(options.label || "Share this page");

        return `
            <div class="share-actions" aria-label="${label}">
                <span class="share-label">Share:</span>
                <button type="button" class="share-action" data-share-platform="facebook" data-share-url="${url}" data-share-title="${title}" data-share-text="${text}" aria-label="Share on Facebook">
                    <i class="fab fa-facebook-f" aria-hidden="true"></i>
                </button>
                <button type="button" class="share-action" data-share-platform="twitter" data-share-url="${url}" data-share-title="${title}" data-share-text="${text}" aria-label="Share on X">
                    <i class="fab fa-x-twitter" aria-hidden="true"></i>
                </button>
                <button type="button" class="share-action" data-share-platform="whatsapp" data-share-url="${url}" data-share-title="${title}" data-share-text="${text}" aria-label="Share on WhatsApp">
                    <i class="fab fa-whatsapp" aria-hidden="true"></i>
                </button>
                <button type="button" class="share-action" data-share-platform="copy" data-share-url="${url}" data-share-title="${title}" data-share-text="${text}" aria-label="Copy direct link">
                    <i class="fas fa-link" aria-hidden="true"></i>
                </button>
            </div>
        `;
    }

    function renderHomePage() {
        const content = getContent().home;
        if (!content) {
            return;
        }

        const hero = document.getElementById("hero");
        if (hero) {
            hero.innerHTML = `
                <h1>${escapeHtml(content.hero.title)}</h1>
                <p>${escapeHtml(content.hero.text)}</p>
                <a href="${escapeHtml(content.hero.primaryHref)}" class="btn">${escapeHtml(content.hero.primaryLabel)}</a>
                <a href="${escapeHtml(content.hero.secondaryHref)}" class="btn">${escapeHtml(content.hero.secondaryLabel)}</a>
            `;
        }

        const featuredGrid = document.querySelector("#featured-destinations .destinations-grid");
        if (featuredGrid) {
            featuredGrid.innerHTML = content.featuredDestinations.map((card) => `
                <article class="destination">
                    <img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.alt)}" />
                    <h3>${escapeHtml(card.title)}</h3>
                    <p>${escapeHtml(card.text)}</p>
                    <a href="${escapeHtml(card.buttonHref)}" class="btn">${escapeHtml(card.buttonLabel)}</a>
                </article>
            `).join("");
        }

        const toursGrid = document.querySelector("#top-tours .tours-grid");
        if (toursGrid) {
            toursGrid.innerHTML = content.topTours.map((card) => `
                <article class="tour">
                    <img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.alt)}" />
                    <h3>${escapeHtml(card.title)}</h3>
                    <p>${escapeHtml(card.text)}</p>
                    <a href="${escapeHtml(card.buttonHref)}" class="btn">${escapeHtml(card.buttonLabel)}</a>
                </article>
            `).join("");
        }

        const blogGrid = document.querySelector("#blog-highlights .blog-grid");
        if (blogGrid) {
            blogGrid.innerHTML = content.blogHighlights.map((card) => `
                <article class="blog-post">
                    <img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.alt)}" />
                    <h3>${escapeHtml(card.title)}</h3>
                    <p>${escapeHtml(card.text)}</p>
                    <a href="${escapeHtml(card.buttonHref)}" class="btn">${escapeHtml(card.buttonLabel)}</a>
                </article>
            `).join("");
        }

        const cta = document.getElementById("cta");
        if (cta) {
            cta.innerHTML = `
                <h2>${escapeHtml(content.cta.title)}</h2>
                <a href="${escapeHtml(content.cta.buttonHref)}" class="btn">${escapeHtml(content.cta.buttonLabel)}</a>
            `;
        }
    }

    function renderDestinationsPage() {
        const content = getContent().destinations;
        if (!content) {
            return;
        }

        const hero = document.getElementById("hero-destinations");
        if (hero) {
            hero.innerHTML = `
                <h1>${escapeHtml(content.hero.title)}</h1>
                <p>${escapeHtml(content.hero.text)}</p>
            `;
        }

        const grid = document.querySelector("#destinations-list .destinations-grid");
        if (grid) {
            grid.innerHTML = content.cards.map((card) => `
                <article class="destination" id="${escapeHtml(slugify(card.title))}">
                    <img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.alt)}" />
                    <h3>${escapeHtml(card.title)}</h3>
                    <p>${escapeHtml(card.text)}</p>
                    <h4>Activities:</h4>
                    <ul>${renderList(card.activities || [])}</ul>
                    <div class="destination-actions">
                        <a href="${escapeHtml(card.buttonHref)}" class="btn">${escapeHtml(card.buttonLabel)}</a>
                        ${buildShareActionsMarkup({
                            url: `https://lovableuganda.com/destinations.html#${slugify(card.title)}`,
                            title: card.title,
                            text: `Explore ${card.title} on Explore Uganda.`,
                            label: `Share ${card.title}`
                        })}
                    </div>
                </article>
            `).join("");
        }

        const cta = document.getElementById("cta-destinations");
        if (cta) {
            cta.innerHTML = `
                <h2>${escapeHtml(content.cta.title)}</h2>
                <a href="${escapeHtml(content.cta.buttonHref)}" class="btn">${escapeHtml(content.cta.buttonLabel)}</a>
            `;
        }
    }

    function renderToursPage() {
        const content = getContent().tours;
        if (!content) {
            return;
        }

        const hero = document.getElementById("hero-tours");
        if (hero) {
            hero.innerHTML = `
                <h1>${escapeHtml(content.hero.title)}</h1>
                <p>${escapeHtml(content.hero.text)}</p>
            `;
        }

        const grid = document.querySelector("#tours-list .tours-grid");
        if (grid) {
            grid.innerHTML = content.cards.map((card) => `
                <article class="tour">
                    <img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.alt)}" />
                    <h3>${escapeHtml(card.title)}</h3>
                    <p>${escapeHtml(card.text)}</p>
                    <h4>Included:</h4>
                    <ul>${renderList(card.included || [])}</ul>
                    <a href="${escapeHtml(card.buttonHref)}" class="btn">${escapeHtml(card.buttonLabel)}</a>
                </article>
            `).join("");
        }

        const cta = document.getElementById("cta-tours");
        if (cta) {
            cta.innerHTML = `
                <h2>${escapeHtml(content.cta.title)}</h2>
                <a href="${escapeHtml(content.cta.buttonHref)}" class="btn">${escapeHtml(content.cta.buttonLabel)}</a>
            `;
        }
    }

    function renderSouvenirsPage() {
        const content = getContent().souvenirs;
        if (!content) {
            return;
        }

        const hero = document.getElementById("hero-souvenirs");
        if (hero) {
            hero.innerHTML = `
                <h1>${escapeHtml(content.hero.title)}</h1>
                <p>${escapeHtml(content.hero.text)}</p>
            `;
        }

        const marketNote = document.querySelector(".market-note");
        if (marketNote) {
            marketNote.textContent = content.toolbar.note;
        }

        const currencyNote = document.querySelector(".currency-note");
        if (currencyNote) {
            currencyNote.textContent = content.toolbar.currencyNote;
        }

        const grid = document.querySelector("#souvenirs-list .souvenirs-grid");
        if (grid) {
            grid.innerHTML = content.cards.map((card) => `
                <article class="souvenir" data-price-ugx="${escapeHtml(card.priceUgx)}">
                    <img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.alt)}" />
                    <h3>${escapeHtml(card.title)}</h3>
                    <p>${escapeHtml(card.text)}</p>
                    <p class="souvenir-price">From <span class="price-value" data-price-ugx="${escapeHtml(card.priceUgx)}">UGX ${Number(card.priceUgx).toLocaleString()}</span></p>
                    <button type="button" class="btn add-to-cart" data-item="${escapeHtml(card.title)}">${escapeHtml(card.buttonLabel)}</button>
                </article>
            `).join("");
        }

        const cta = document.getElementById("cta-souvenirs");
        if (cta) {
            cta.innerHTML = `
                <h2>${escapeHtml(content.cta.title)}</h2>
                <a href="${escapeHtml(content.cta.buttonHref)}" class="btn">${escapeHtml(content.cta.buttonLabel)}</a>
            `;
        }
    }

    function sortBlogCardsByDate(cards) {
        return [...cards].sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    function getSortedBlogCards() {
        const content = getContent().blog;
        const defaultCards = (content && content.cards) || [];
        const generatedCards = window.ExploreUgandaGeneratedBlogCards || [];
        return sortBlogCardsByDate(mergeCardsByHref(defaultCards, generatedCards));
    }

    function buildBlogSearchText(card) {
        return [
            card.title,
            card.text,
            card.keywords,
            card.tag,
            card.category,
            card.authorName,
            card.authorCountry,
            card.authorRole,
            card.displayDate,
            card.date
        ].filter(Boolean).join(" ").toLowerCase();
    }

    function buildBlogCardsMarkup(cards) {
        return cards.map((card) => `
            <article class="blog-card is-clickable" data-category="${escapeHtml(card.category)}" data-keywords="${escapeHtml(card.keywords)}" data-title="${escapeHtml(card.title)}" data-author-name="${escapeHtml(card.authorName || "")}" data-author-country="${escapeHtml(card.authorCountry || "")}" data-author-role="${escapeHtml(card.authorRole || "")}" data-search-text="${escapeHtml(buildBlogSearchText(card))}" data-card-href="${escapeHtml(resolveBlogCardHref(card))}" tabindex="0" role="link" aria-label="Open article: ${escapeHtml(card.title)}">
                <img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.alt)}" onerror="this.onerror=null;this.src='images/logo.png';" />
                <div class="blog-card-content">
                    <div class="blog-meta">
                        <span class="blog-tag">${escapeHtml(card.tag)}</span>
                        <time datetime="${escapeHtml(card.date)}">${escapeHtml(card.displayDate)}</time>
                    </div>
                    <p class="blog-author-line">By ${escapeHtml(card.authorName || "Explore Uganda Editorial Team")} · ${escapeHtml(card.authorCountry || "Uganda")} · ${escapeHtml(card.authorRole || "Contributor")}</p>
                    <h3>${escapeHtml(card.title)}</h3>
                    <p>${escapeHtml(card.text)}</p>
                    <div class="blog-card-actions">
                        <a href="${escapeHtml(resolveBlogCardHref(card))}" class="btn">${escapeHtml(card.buttonLabel)}</a>
                        ${buildShareActionsMarkup({
                            url: new URL(resolveBlogCardHref(card), window.location.href).href,
                            title: card.title,
                            text: card.text,
                            label: `Share ${card.title}`
                        })}
                    </div>
                </div>
            </article>
        `).join("");
    }

    function renderBlogPage() {
        const content = getContent().blog;
        if (!content) {
            return;
        }

        const sortedCards = getSortedBlogCards();
        const latestCards = sortedCards.slice(0, 8);

        const hero = document.getElementById("hero-blog");
        if (hero) {
            hero.innerHTML = `
                <h1>${escapeHtml(content.hero.title)}</h1>
                <p>${escapeHtml(content.hero.text)}</p>
            `;
        }

        const intro = document.querySelector(".blog-list-header");
        if (intro) {
            intro.innerHTML = `
                <p class="section-kicker">${escapeHtml(content.listingIntro.kicker)}</p>
                <h2>${escapeHtml(content.listingIntro.title)}</h2>
                <p class="blog-list-intro">${escapeHtml(content.listingIntro.text)}</p>
            `;
        }

        const grid = document.querySelector("#blog-list .blog-grid");
        if (grid) {
            grid.innerHTML = buildBlogCardsMarkup(latestCards);
        }

        const latestCount = document.getElementById("blog-latest-count");
        if (latestCount) {
            latestCount.textContent = String(latestCards.length);
        }

        const archiveCta = document.getElementById("blog-archive-cta");
        if (archiveCta) {
            archiveCta.hidden = sortedCards.length <= 8;
        }

        const cta = document.getElementById("cta-blog");
        if (cta) {
            cta.innerHTML = `
                <h2>${escapeHtml(content.cta.title)}</h2>
                <a href="${escapeHtml(content.cta.buttonHref)}" class="btn">${escapeHtml(content.cta.buttonLabel)}</a>
            `;
        }
    }

    function renderBlogArchivePage() {
        const content = getContent().blog;
        if (!content) {
            return;
        }

        const sortedCards = getSortedBlogCards();

        const hero = document.getElementById("hero-blog");
        if (hero) {
            hero.innerHTML = `
                <h1>All Blog Posts</h1>
                <p>Browse the full Explore Uganda article archive, with the newest stories appearing first.</p>
            `;
        }

        const intro = document.querySelector(".blog-list-header");
        if (intro) {
            intro.innerHTML = `
                <p class="section-kicker">Article Archive</p>
                <h2>Browse Every Uganda Travel Article</h2>
                <p class="blog-list-intro">Use search and category filters to find older stories, travel guides, safari tips, and planning inspiration.</p>
            `;
        }

        const grid = document.querySelector("#blog-list .blog-grid");
        if (grid) {
            grid.innerHTML = buildBlogCardsMarkup(sortedCards);
        }

        const totalCount = document.getElementById("blog-total-count");
        if (totalCount) {
            totalCount.textContent = String(sortedCards.length);
        }
    }

    window.ExploreUgandaContent = {
        STORAGE_KEY,
        getDefaultContent,
        getContent,
        saveContent,
        resetContent,
        renderHomePage,
        renderDestinationsPage,
        renderToursPage,
        renderSouvenirsPage,
        renderBlogPage,
        renderBlogArchivePage,
        buildBlogCardsMarkup,
        getSortedBlogCards,
        buildBlogSearchText
    };
})();
