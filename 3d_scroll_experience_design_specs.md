# Design Specification: 3D "Deep Dive" Scroll Experience

## Overview
The goal of this component is to create an immersive, 3D scrolling experience where the user feels as though they are diving deeper and deeper into the Z-axis of the screen. As the user scrolls down, elements seamlessly fly past the camera, and new elements pivot into view from various angles. Scrolling back up reverses the timeline perfectly.

## Tech Stack
*   **Structure:** HTML5
*   **Styling:** Tailwind CSS (utility classes) + Custom CSS (for 3D perspective and hiding scrollbars)
*   **Animation:** GSAP (GreenSock Animation Platform) + ScrollTrigger plugin

## Core Concepts & CSS Architecture

### 1. The Pinned Scene (`#scene-container`)
To create the illusion of flying through space, the main container must be pinned to the screen while the user scrolls. 
*   **`perspective: 1200px;`**: This is crucial. It defines the depth of the 3D space. Lower numbers equal more extreme distortion; 1200px provides a smooth, cinematic depth.
*   **`transform-style: preserve-3d;`**: Ensures child elements are rendered in 3D space rather than flattened.
*   **`overflow: hidden;`**: Prevents scrollbars from appearing as elements scale up massively.

### 2. Centering Utility (`.scene-element`)
All moving cards and text are absolutely positioned in the exact center of the screen (`top: 50%; left: 50%;`). GSAP uses `xPercent: -50` and `yPercent: -50` to perfectly align their centers. This ensures that when an element scales up (zooms in), it scales directly toward the user's camera.

### 3. Glassmorphism Design (`.glass-card`)
Cards use a dark, semi-transparent background with a heavy backdrop blur to look like glass floating in the void.

## The Animation Sequence (GSAP Timeline)

The entire experience is mapped to a single GSAP timeline linked to the scroll position. We use `scrub: 1` so the animation has a 1-second smoothing effect, catching up gently to the user's scroll wheel.

The timeline uses `+=12000` as the end point to stretch the animation over a very long scroll distance, slowing down the visual speed.

### Sequence Breakdown:
1.  **The Welcome Text:** Starts visible. As the user scrolls, it slowly translates upward (`y: -40vh`) and fades out.
2.  **Card 1 (The Rise):** Starts hidden below the screen (`y: 100vh`). Moves to the center (`y: 0`), pauses, then scales up to `40x` its size while fading out, simulating passing through the camera.
3.  **Card 2 (Left Pivot):** Starts deep in the Z-axis (`z: -1500`) and far to the left (`x: -100vw`), rotated aggressively (`rotationY: -70`). As Card 1 zooms past, Card 2 swings into the center, pauses, and scales massively past the camera.
4.  **Card 3 (Right Pivot):** Mirrors Card 2, but swings in from the right (`x: 100vw`, `rotationY: 70`). Pauses, then zooms past.
5.  **Card 4 (Bottom Pivot):** Swings up from the bottom (`y: 100vh`, `rotationX: -70`). Once centered, instead of zooming, it slides up and out of the viewport (`y: -100vh`) to naturally reveal the standard footer below.

---

## Integration Code Snippets

### 1. Essential CSS Setup
Place this in your global CSS or within a `<style>` block:

```css
#scene-container {
    perspective: 1200px;
    transform-style: preserve-3d;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    position: relative;
}

.scene-element {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    will-change: transform, opacity;
}
```

### 2. Core GSAP Logic
Include GSAP and ScrollTrigger in your build, then initialize this script:

```javascript
// Ensure elements are centered accurately
gsap.set('.scene-element', { xPercent: -50, yPercent: -50 });

// Initial Positions (Pre-scroll)
gsap.set('#welcome-title', { opacity: 1, scale: 1, y: 0, z: 0 });
gsap.set('#card-1', { y: '100vh', scale: 0.8, opacity: 0, z: -100 });
gsap.set('#card-2', { x: '-100vw', z: -1500, rotationY: -70, opacity: 0 });
gsap.set('#card-3', { x: '100vw', z: -1500, rotationY: 70, opacity: 0 });
gsap.set('#card-4', { y: '100vh', z: -1500, rotationX: -70, opacity: 0 });

// The Master Scroll Timeline
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#scene-container",
        start: "top top",
        end: "+=12000", // Large number slows down the scroll pacing
        scrub: 1,
        pin: true,
        anticipatePin: 1
    }
});

// 1. Welcome out, Card 1 in
tl.to('#welcome-title', { y: '-40vh', opacity: 0, duration: 3, ease: "power2.inOut" }, 0)
  .to('#card-1', { y: 0, scale: 1, opacity: 1, z: 0, duration: 3, ease: "power2.out" }, 0.5);

// 2. Card 1 zooms out, Card 2 in from left
tl.to('#card-1', { scale: 40, opacity: 0, duration: 4, ease: "power3.in" }, "+=1.5")
  .to('#card-2', { x: 0, z: 0, rotationY: 0, opacity: 1, duration: 4, ease: "power3.out" }, "<1");

// 3. Card 2 zooms out, Card 3 in from right
tl.to('#card-2', { scale: 40, opacity: 0, duration: 4, ease: "power3.in" }, "+=1.5")
  .to('#card-3', { x: 0, z: 0, rotationY: 0, opacity: 1, duration: 4, ease: "power3.out" }, "<1");

// 4. Card 3 zooms out, Card 4 in from bottom
tl.to('#card-3', { scale: 40, opacity: 0, duration: 4, ease: "power3.in" }, "+=1.5")
  .to('#card-4', { y: 0, z: 0, rotationX: 0, opacity: 1, duration: 4, ease: "power3.out" }, "<1");

// 5. Exit scene to reveal footer
tl.to('#card-4', { y: '-100vh', opacity: 0, duration: 3, ease: "power2.in" }, "+=1.5");
```