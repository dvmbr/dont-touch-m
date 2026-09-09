const button = document.querySelector("#runawayButton");

button.addEventListener("mouseenter", () => {
    const padding = 20;

    const maxX = window.innerWidth - button.offsetWidth - padding;
    const maxY = window.innerHeight - button.offsetHeight - padding;

    const x = Math.max(
        padding,
        Math.random() * maxX
    );

    const y = Math.max(
        padding,
        Math.random() * maxY
    );

    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
});