(function () {
    const moreToggle = document.querySelector(".more-toggle");
    const moreItems = document.querySelectorAll(".more-item");

    if (!moreToggle || moreItems.length === 0) {
        return;
    }

    moreToggle.addEventListener("click", () => {
        const isExpanded = moreToggle.textContent === "Less";
        moreItems.forEach((item) => {
            item.style.display = isExpanded ? "none" : "block";
        });
        moreToggle.textContent = isExpanded ? "More" : "Less";
    });
})();
