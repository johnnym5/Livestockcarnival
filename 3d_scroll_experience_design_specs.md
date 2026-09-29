3D Deck Scroll Experience: AI Agent Implementation Guide
​Overview
​This document provides the exact architecture, styling, and GSAP animation logic required to build the "3D Deck Scroll Experience."
​Visual Effect: A pinned 3D scene where a stacked deck of 10 solid, color-coded cards slides up over a background title. As the user scrolls, the top card lifts, zooms in, flips 180 degrees to reveal its content, and then peels off to slip to the bottom of the stack. At the end of the scroll, the deck fans out into a 10-card spread. Clicking any fanned card brings it into sharp fullscreen focus while blurring the others.
​1. Dependencies
​The following libraries MUST be included in the project:
​Tailwind CSS (for utility-based styling and rapid color mapping).
​GSAP (GreenSock) (gsap.min.js) - The core animation engine.
​GSAP ScrollTrigger (ScrollTrigger.min.js) - For scroll-linked timeline scrubbing.
​2. Core CSS Architecture (Mandatory)
​For the 3D transforms to work correctly without clipping or visual tearing, the following CSS rules are strictly required alongside Tailwind.