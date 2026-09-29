# Livestock Cultural Fashion Parade: "Where Agriculture Meets Fashion"

## 1. Page Purpose & Routing
- **Route:** `/fashion-parade` (or nested under `/attractions/fashion-parade`)
- **Objective:** Showcase the intersection of Nigerian cultural textiles and agricultural heritage through a highly visual, editorial-style layout.

## 2. Visual Theme & Layout Engine
- **Canvas:** `#FBFBFA` (Soft Alabaster) with `#111827` (Charcoal Obsidian) text.
- **Hero:** Full-bleed background video or cinematic image of a decorated Kano Durbar horse or Aso-Oke draped bull, heavy vignette, gold serif typography.
- **Scroll Physics:** Lenis smooth scrolling with Framer Motion `staggerChildren` to fade in animal showcase cards sequentially as the user scrolls.

## 3. Component Hierarchy

### A. The Hero Gateway
- **Eyebrow:** RENEWED HOPE CARNIVAL PRESENTS
- **Headline:** Livestock Cultural Fashion Parade
- **Tagline:** "Our Livestock. Our Culture. Our Heritage. One national parade bringing every region's animals, breeds, and traditions onto one stage."
- **Background:** `assets/fashion_parade_hero.jpg` (To be generated).

### B. The "One Nigeria" Zonal Motif Grid
A 4-column Bento-box grid detailing how each region styles their livestock:
- **North:** Camels & Horses (Northern-inspired textiles & handler costumes).
- **West:** Cattle & Horses (Aso-Oke beadwork & Yoruba motifs).
- **East:** Goats & Cultural Displays (Igbo-inspired fabrics & patterns).
- **South:** Specialized Displays (Traditional Niger Delta motifs).

### C. The Runway: Species Showcase (Horizontal Scroll / Carousel)
A high-end, draggable carousel featuring the different animal categories. Each card is `rounded-2xl` with `shadow-card` elevation.
- **Camels & Equines:** Dromedaries, Arabian Horses, Bornu Ponies.
- **Cattle:** White Fulani (Bunaji), Sokoto Gudali, Red Bororo.
- **Small Ruminants:** West African Dwarf Goats, Yankasa Sheep, Balami.
- **Poultry & Small Animals:** MoorBeta Chickens, Frizzle-feather, Guinea Fowl, Rabbits.
- **Exotics & Aquaculture:** Ostriches, Catfish, "Snail Village".

### D. Fashion Rules & Animal Welfare (Zig-Zag Layout)
Alternating text/image blocks explaining the styling rules:
- **Rule 1:** *Decorations on the Saddle, Not the Animal.* (Showcasing a decorated horse).
- **Rule 2:** *Comfort Meets Culture.* (Showing handlers in Ankara matching their goat's loose fabric collar).
- **Rule 3:** *Themed Enclosures for Fowl & Fish.* (Showing decorated aviaries and underwater-safe colored tanks).

### E. The Livestock Village (Sticky Scroll Section)
A sticky left-hand column titled "The Livestock Village," with the right side scrolling through the village amenities (Educational Boards, Veterinary Access, Photo Zones, Traditional Architecture).

## 4. Required Image Generation Prompts (For Antigravity/Midjourney)
1.  **`assets/fashion_parade_hero.jpg`**: A cinematic, golden-hour shot of a majestic Nigerian bull draped in rich, colorful Yoruba Aso-Oke fabric across its back, led by a professional handler in matching traditional attire, walking down a dirt runway with a festival crowd cheering in the background. High fashion meets agriculture, photorealistic, 8k.
2.  **`assets/parade_camel.jpg`**: A tall Sahelian camel wearing an ornate, colorful Northern Nigerian saddle cloth and tassels, led by a handler in flowing traditional robes, warm sunlight, editorial photography style.
3.  **`assets/parade_poultry.jpg`**: A beautifully constructed, traditional bamboo aviary decorated with vibrant African Ankara fabric bunting, housing healthy local Nigerian chickens. Clean, bright, festival atmosphere.
4.  **`assets/livestock_village_arch.jpg`**: An ultra-modern yet culturally inspired temporary "Livestock Village" at an outdoor festival. Traditional Nigerian thatched roofing meets clean, safe, modern animal enclosures. Families walking around, warm afternoon light.