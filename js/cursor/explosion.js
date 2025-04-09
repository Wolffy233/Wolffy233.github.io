"use strict";

// Catch the canvas element and its context
const canvasEl = document.querySelector(".explosion");
if (!canvasEl) {
    console.error("Canvas element not found.");
} else {
    const ctx = canvasEl.getContext("2d");

    // Configuration variables
    const numberOfParticules = 30;
    const colors = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"];
    let pointerX = 0, pointerY = 0;
    const tapEvent = "mousedown";

    // Update pointer coordinates safely
    function updateCoords(e) {
        if (e.clientX !== undefined) {
            pointerX = e.clientX - canvasEl.getBoundingClientRect().left;
            pointerY = e.clientY - canvasEl.getBoundingClientRect().top;
        } else if (e.touches && e.touches[0]) {
            pointerX = e.touches[0].clientX - canvasEl.getBoundingClientRect().left;
            pointerY = e.touches[0].clientY - canvasEl.getBoundingClientRect().top;
        }
    }

    // Set particle direction with angle and distance
    function setParticuleDirection(e) {
        const angle = anime.random(0, 360) * Math.PI / 180;
        const distance = anime.random(50, 180) * [-1, 1][anime.random(0, 1)];
        return {
            x: e.x + distance * Math.cos(angle),
            y: e.y + distance * Math.sin(angle)
        };
    }

    // Create a particle object
    function createParticule(x, y) {
        const particule = {
            x,
            y,
            color: colors[anime.random(0, colors.length - 1)],
            radius: anime.random(14, 28),
            endPos: setParticuleDirection({ x, y }),
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        };
        return particule;
    }

    // Render particles
    function renderParticule(animation) {
        for (const particule of animation.animatables) {
            particule.target.draw();
        }
    }

    // Animate particles
    function animateParticules(x, y) {
        const particules = Array.from({ length: numberOfParticules }, () => createParticule(x, y));

        anime.timeline()
            .add({
                targets: particules,
                x: particule => particule.endPos.x,
                y: particule => particule.endPos.y,
                radius: 0.1,
                duration: anime.random(1200, 1800),
                easing: "easeOutExpo",
                update: renderParticule
            });
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Set canvas size
    const setCanvasSize = debounce(() => {
        canvasEl.width = window.innerWidth * 2;
        canvasEl.height = window.innerHeight * 2;
        canvasEl.style.width = `${window.innerWidth}px`;
        canvasEl.style.height = `${window.innerHeight}px`;
        ctx.scale(2, 2);
    }, 500);

    // Continuous rendering
    const render = anime({
        duration: Infinity,
        update() {
            ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        }
    });

    // Event listener for triggering animations
    document.addEventListener(tapEvent, (e) => {
        if (
            e.target.id !== "sidebar" &&
            e.target.id !== "toggle-sidebar" &&
            e.target.nodeName !== "A" &&
            e.target.nodeName !== "IMG"
        ) {
            render.play();
            updateCoords(e);
            animateParticules(pointerX, pointerY);
        }
    }, false);

    // Initialize canvas size and listen for resize events
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize, false);
}