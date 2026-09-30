# 3D Deck Scroll Experience: AI Agent Implementation Guide

## Overview
This document provides the exact architecture, styling, and GSAP animation logic required to build the "3D Deck Scroll Experience." 

**Visual Effect:** A pinned 3D scene where a stacked deck of 10 solid, color-coded cards slides up over a background title. As the user scrolls, the top card lifts, zooms in, flips 180 degrees to reveal its content, and then peels off to slip to the bottom of the stack. At the end of the scroll, the deck fans out into a 10-card spread. Clicking any fanned card brings it into sharp fullscreen focus while blurring the others.

---

## 1. Dependencies
The following libraries **MUST** be included in the project:
1. **Tailwind CSS** (for utility-based styling and rapid color mapping).
2. **GSAP (GreenSock)** (`gsap.min.js`) - The core animation engine.
3. **GSAP ScrollTrigger** (`ScrollTrigger.min.js`) - For scroll-linked timeline scrubbing.

---

## 2. Core CSS Architecture (Mandatory)
For the 3D transforms to work correctly without clipping or visual tearing, the following CSS rules are strictly required alongside Tailwind.

```css
/* Must wrap the entire scene */
#scene-container {
    perspective: 2000px; /* Crucial for 3D depth */
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    position: relative;
    background-color: #020617; /* Very dark background recommended */
}

/* Base utility for absolute centering */
.scene-element {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-style: preserve-3d;
    will-change: transform;
}

/* Card 3D Structure */
.deck-card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-style: preserve-3d;
    will-change: transform;
    /* Deep shadow to separate tightly stacked cards */
    filter: drop-shadow(0 20px 30px rgba(0,0,0,0.8)); 
}

.card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    will-change: transform, filter; 
}

/* The faces of the card */
.card-face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden; /* Safari support */
    border-radius: 2rem;
}

.card-face-front {
    transform: rotateY(0deg);
}

.card-face-back {
    transform: rotateY(180deg); /* Pre-flipped so it reveals when parent rotates */
}
```

---
If the damage is t
## 3. HTML Structure & Logo Integration

The DOM must follow this exact nesting hierarchy. 

### Branding Instructions (Adding the Site Logo)
To implement the site's logo on the back of the card (which is visually the `card-face-front` before it flips), place the `<img>` or `<svg>` tag directly inside the `.card-face-front` div. Ensure it is centered using flexbox (`flex items-center justify-center`).

```html
<!-- Main Pinned Container -->
<div id="scene-container">
    
    <!-- Background Watermark Title -->
    <!-- Z-index MUST be 0 to stay behind the deck -->
    <div id="welcome-title" class="scene-element z-0">
        <h1>The Deck</h1>
    </div>

    <!-- The 3D Deck -->
    <div id="deck-container" class="scene-element z-10">
        
        <!-- CARD ITEM (Repeat x10) -->
        <div class="deck-card w-[85vw] md:w-[60vw] lg:w-[45vw] h-[65vh] md:h-[55vh]">
            <div class="card-inner">
                
                <!-- FRONT COVER (Face Down State) -->
                <!-- AI AGENT INSTRUCTION: INJECT SITE LOGO HERE -->
                <div class="card-face card-face-front bg-blue-950 border-2 flex items-center justify-center">
                    <!-- Replace this with actual Logo SVG or IMG -->
                    <img src="/path/to/site-logo.svg" alt="Site Logo" class="w-32 h-32 opacity-50" />
                </div>
                
                <!-- REVEALED CONTENT (Face Up State) -->
                <div class="card-face card-face-back bg-gradient-to-br p-12 flex flex-col justify-between">
                    <!-- Text, Titles, and Content go here -->
                </div>
                
            </div>
        </div>
        
    </div>
</div>
```

---

## 4. GSAP Animation Logic (The Engine)

### A. Initial Setup
* Center elements using `gsap.set('.scene-element', { xPercent: -50, yPercent: -50 })`.
* Define `Y_OFFSET` (e.g., `12`) and `Z_OFFSET` (e.g., `16`). 
* Loop through the `.deck-card` elements to stack them:
  * `y: index * Y_OFFSET`
  * `z: -index * Z_OFFSET`
  * Apply `zIndex: totalCards - index`.
  * Apply `filter: blur(4px)` to all cards *except* `index === 0`.

### B. The ScrollTrigger Timeline
Create a timeline pinned to `#scene-container` with `scrub: 1`. The `end` value should be large (e.g., `+=${totalCards * 2500 + 4000}`) to allow smooth, slow scrolling.

### C. The Loop Sequence (Cards 1 to N-1)
For every card except the final one, append these tweens to the timeline:
1. **Flip & Zoom:** Rotate `.card-inner` to `rotationY: 180`. Simultaneously move `.deck-card` to `z: 200, scale: 1.15, y: -30`. (This brings the card to the camera).
2. **Peel:** Move `.deck-card` to `x: '60vw', y: 100, z: 0, scale: 1, rotationZ: 15`.
3. **Return to Stack Bottom:** Move `.deck-card` to `x: 0, y: (total) * Y_OFFSET, z: -(total) * Z_OFFSET - 50, rotationZ: 0`. 
4. **Blur & Z-Index:** As it returns, reset `.card-inner` to `rotationY: 0`, apply `filter: blur(4px)`, and drop the `zIndex` to a negative value.
5. **Shift Remaining Deck:** Iterate through remaining cards. Animate them forward by reducing their `y` and `z` offsets by 1 position. If a card reaches position `0`, animate its blur to `0px`.

### D. The Climax (The Shuffle Spread)
Once the final card is revealed, add a label (`spreadAll`).
* Calculate a scaled-down size to fit all cards on screen (e.g., `scale: 0.35`).
* Loop through all cards, calculate a dynamic `xPos`, `yPos` (arc), and `rotationZ`.
* Animate all `.deck-card` elements to these spread positions.
* Animate all `.card-inner` elements to `rotationY: 180` and `filter: blur(0px)`.

---

## 5. Click Interactivity (Depth of Field)
Outside of the ScrollTrigger timeline, attach `click` event listeners to every card.
* **State Flag:** Only allow clicks if the timeline has reached the `spreadAll` state.
* **On Click:** 
  * Save the card's fanned `x, y, z, rotationZ` values.
  * Animate the clicked `.deck-card` to `x: 0, y: 0, z: 150, rotationZ: 0, scale: 1, zIndex: 100`. (Force `z: 150` to prevent clipping).
  * Apply `filter: blur(0px)` to the clicked card's `.card-inner`, and `filter: blur(12px)` to all *other* cards' `.card-inner` elements to create a sharp Depth of Field effect.
* **On Second Click (Dismiss):** Revert the card to its saved fanned coordinates and remove the blur from all cards.