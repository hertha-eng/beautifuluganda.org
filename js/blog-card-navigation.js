(function () {
    function isInteractive(target) {
        return Boolean(target.closest("a, button, input, select, textarea, label"));
    }

    function openCard(card) {
        const href = card.dataset.cardHref;
        if (!href) {
            return;
        }

        window.location.href = href;
    }

    document.addEventListener("click", function (event) {
        const card = event.target.closest(".blog-card.is-clickable");
        if (!card || isInteractive(event.target)) {
            return;
        }

        openCard(card);
    });

    document.addEventListener("keydown", function (event) {
        const card = event.target.closest(".blog-card.is-clickable");
        if (!card) {
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openCard(card);
        }
    });
})();
