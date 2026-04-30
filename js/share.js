(function () {
    function openShareWindow(url) {
        window.open(url, "_blank", "noopener,noreferrer,width=640,height=720");
    }

    async function copyLink(url, button) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url);
            } else {
                const input = document.createElement("input");
                input.value = url;
                document.body.appendChild(input);
                input.select();
                document.execCommand("copy");
                input.remove();
            }

            const originalLabel = button.getAttribute("aria-label");
            button.classList.add("is-copied");
            button.setAttribute("aria-label", "Link copied");
            setTimeout(() => {
                button.classList.remove("is-copied");
                button.setAttribute("aria-label", originalLabel || "Copy direct link");
            }, 1800);
        } catch (error) {
            window.prompt("Copy this link:", url);
        }
    }

    function getShareTarget(button) {
        return {
            platform: button.dataset.sharePlatform,
            url: button.dataset.shareUrl,
            title: button.dataset.shareTitle || document.title,
            text: button.dataset.shareText || ""
        };
    }

    function buildPlatformUrl(target) {
        const encodedUrl = encodeURIComponent(target.url);
        const encodedTitle = encodeURIComponent(target.title);
        const encodedText = encodeURIComponent(target.text);
        const combinedText = encodeURIComponent(`${target.title} ${target.url}`);

        switch (target.platform) {
            case "facebook":
                return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            case "twitter":
                return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
            case "whatsapp":
                return `https://wa.me/?text=${combinedText}`;
            default:
                return encodedText;
        }
    }

    document.addEventListener("click", async function (event) {
        const button = event.target.closest(".share-action");
        if (!button) {
            return;
        }

        const target = getShareTarget(button);
        if (!target.url || !target.platform) {
            return;
        }

        if (target.platform === "copy") {
            await copyLink(target.url, button);
            return;
        }

        openShareWindow(buildPlatformUrl(target));
    });
})();
