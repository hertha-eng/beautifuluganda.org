(function () {
    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function getArticleUrl() {
        const canonical = document.querySelector('link[rel="canonical"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');
        return canonical?.href || ogUrl?.content || window.location.href;
    }

    function getArticleTitle() {
        const heroTitle = document.querySelector("#hero-blog h1");
        const ogTitle = document.querySelector('meta[property="og:title"]');
        return heroTitle?.textContent.trim() || ogTitle?.content || document.title;
    }

    function getArticleDescription() {
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const metaDescription = document.querySelector('meta[name="description"]');
        return ogDescription?.content || metaDescription?.content || "Read this Uganda travel article on Explore Uganda.";
    }

    function buildSharePanelMarkup(url, title, description) {
        const safeUrl = escapeHtml(url);
        const safeTitle = escapeHtml(title);
        const safeDescription = escapeHtml(description);

        return `
            <section class="article-share-panel" aria-labelledby="article-share-title">
                <h2 id="article-share-title">Share This Article</h2>
                <p>Send this guide directly to friends, travellers, or clients with one tap.</p>
                <div class="share-actions" aria-label="Share ${safeTitle}">
                    <span class="share-label">Share:</span>
                    <button type="button" class="share-action" data-share-platform="facebook" data-share-url="${safeUrl}" data-share-title="${safeTitle}" data-share-text="${safeDescription}" aria-label="Share on Facebook">
                        <i class="fab fa-facebook-f" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="share-action" data-share-platform="twitter" data-share-url="${safeUrl}" data-share-title="${safeTitle}" data-share-text="${safeDescription}" aria-label="Share on X">
                        <i class="fab fa-x-twitter" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="share-action" data-share-platform="whatsapp" data-share-url="${safeUrl}" data-share-title="${safeTitle}" data-share-text="${safeDescription}" aria-label="Share on WhatsApp">
                        <i class="fab fa-whatsapp" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="share-action" data-share-platform="copy" data-share-url="${safeUrl}" data-share-title="${safeTitle}" data-share-text="${safeDescription}" aria-label="Copy direct link">
                        <i class="fas fa-link" aria-hidden="true"></i>
                    </button>
                </div>
            </section>
        `;
    }

    document.addEventListener("DOMContentLoaded", function () {
        if (!document.querySelector(".blog-post-full") || document.querySelector(".article-share-panel")) {
            return;
        }

        const hero = document.getElementById("hero-blog");
        const main = document.querySelector("main.container");
        if (!main) {
            return;
        }

        const url = getArticleUrl();
        const title = getArticleTitle();
        const description = getArticleDescription();
        const panel = document.createElement("div");
        panel.innerHTML = buildSharePanelMarkup(url, title, description);

        if (hero && hero.nextElementSibling === main) {
            main.insertAdjacentElement("beforebegin", panel.firstElementChild);
            return;
        }

        main.prepend(panel.firstElementChild);
    });
})();
