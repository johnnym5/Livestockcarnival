const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'public', 'assets');

const copyOps = [
  // 1. BRANDING
  { from: 'logo_transparent.png', to: 'branding/carnival-logo-transparent.png' },
  { from: 'logo.jpeg', to: 'branding/carnival-logo-solid.jpeg' },
  { from: 'coat_of_arms.png', to: 'branding/nigeria-coat-of-arms.png' },
  { from: 'fgn-coat-of-arms.svg', to: 'branding/nigeria-coat-of-arms.svg' },
  { from: 'company_logo_clean.png', to: 'branding/legacy-partner-logo.png' },

  // 2. HOME
  { from: 'carnival_animal_parade.jpg', to: 'home/story-equestrian-durbar-parade.jpg' },
  { from: 'durbar_horse_rider.jpg', to: 'home/story-durbar-rider.jpg' },
  { from: 'kano_durbar.jpg', to: 'home/story-kano-durbar-hero.jpg' },
  { from: 'suya_open_flame.jpg', to: 'home/story-suya-grill-fire.jpg' },
  { from: 'bbq_catfish_vendor.jpg', to: 'home/story-bbq-catfish-vendor.jpg' },
  { from: 'gourmet_steak_fish.jpg', to: 'home/story-gourmet-steaks.jpg' },
  { from: 'suya_couples_market.jpg', to: 'home/story-suya-market-couples.jpg' },
  { from: 'ijele.jpg', to: 'home/story-ijele-masquerade.jpg' },
  { from: 'cultural_dancing.jpg', to: 'home/story-cultural-dancers.jpg' },
  { from: 'cultural_festival_party.jpg', to: 'home/story-festival-celebration.jpg' },
  { from: 'live_concert_stage.jpg', to: 'home/story-live-concert-stage.jpg' },
  { from: 'carnival_night_dj.jpg', to: 'home/story-night-dj-performance.jpg' },
  { from: 'fashion_crafts.jpg', to: 'home/story-traditional-fashion-crafts.jpg' },
  { from: 'abuja_carnival_entrance.jpg', to: 'home/story-carnival-entrance-gate.jpg' },
  { from: 'digital_etag.jpg', to: 'home/story-digital-rfid-livestock-tag.jpg' },
  { from: 'hqi_etagging.jpg', to: 'home/story-etagging-veterinary.jpg' },
  { from: 'modern_ranch.jpg', to: 'home/story-modern-ranch-pasture.jpg' },
  { from: 'family_petting_zoo.jpg', to: 'home/story-family-petting-zoo.jpg' },
  { from: 'puppy_petting_family.jpg', to: 'home/story-puppy-petting-kids.jpg' },

  // 3. LIVESTOCK
  { from: 'livestock_bull_cow.jpg', to: 'livestock/breed-bull-cattle.jpg' },
  { from: 'livestock_camel.jpg', to: 'livestock/breed-golden-camel.jpg' },
  { from: 'livestock_goat_sheep.jpg', to: 'livestock/breed-goat-sheep.jpg' },
  { from: 'livestock_poultry.jpg', to: 'livestock/breed-poultry-birds.jpg' },
  { from: 'livestock_aquaculture.jpg', to: 'livestock/breed-fish-aquaculture.jpg' },
  { from: 'livestock_spectrum_hero.jpg', to: 'livestock/showcase-spectrum-hero.jpg' },
  { from: 'livestock_spectrum_grid.jpg', to: 'livestock/showcase-spectrum-grid.jpg' },
  { from: 'livestock_village_arch.jpg', to: 'livestock/village-archway-entrance.jpg' },
  { from: 'parade_camel.jpg', to: 'livestock/parade-adorned-camel.jpg' },
  { from: 'parade_poultry.jpg', to: 'livestock/parade-indigenous-poultry.jpg' },
  { from: 'moorbeta.jpg', to: 'livestock/breed-moorbeta-chicken.jpg' },

  // 4. ATTRACTIONS
  { from: 'kids_horse_petting.jpg', to: 'attractions/arena-breed-judging-court.jpg' },
  { from: 'veterinary_pet_checkup.jpg', to: 'attractions/arena-traceability-coldchain-hub.jpg' },
  { from: 'zone_equestrian.jpg', to: 'attractions/arena-equestrian-durbar-field.jpg' },
  { from: 'fashion_parade_hero.jpg', to: 'attractions/cultural-fashion-runway.jpg' },

  // 5. VENUE MAP
  { from: 'abuja_venue_map.jpg', to: 'venue-map/old-parade-ground-map-clean.jpg' },
  { from: 'abuja_venue_map_annotated.jpg', to: 'venue-map/old-parade-ground-map-annotated.jpg' },
  { from: 'old_parade_ground_rezonal_map.jpg', to: 'venue-map/old-parade-ground-zonal-blueprint.jpg' },
  { from: 'Screenshot_20260819_121826_Maps.jpg', to: 'venue-map/google-satellite-venue-reference.jpg' },

  // 6. ARCHIVE
  { from: 'hqi_cold_chain.jpg', to: 'archive/hqi-cold-chain.jpg' },
  { from: 'hqi_halal_abattoir.jpg', to: 'archive/hqi-halal-abattoir.jpg' },
  { from: 'hqi_halal_feed.jpg', to: 'archive/hqi-halal-feed.jpg' },
  { from: 'hqi_tayyib_transport.jpg', to: 'archive/hqi-tayyib-transport.jpg' },
  { from: 'hqi_veterinary.jpg', to: 'archive/hqi-veterinary.jpg' },
  { from: 'master_team.jpg', to: 'archive/master-team.jpg' },
  { from: 'digital_etag_cow_1787127427360.jpg', to: 'archive/digital_etag_cow_timestamp.jpg' },
  { from: 'ijele_masquerade_1787127365945.jpg', to: 'archive/ijele_masquerade_timestamp.jpg' },
  { from: 'kano_durbar_hero_1787127333095.jpg', to: 'archive/kano_durbar_hero_timestamp.jpg' },
  { from: 'modern_ranch_niger_1787127383417.jpg', to: 'archive/modern_ranch_niger_timestamp.jpg' },
  { from: 'moorbeta_chicken_1787127407207.jpg', to: 'archive/moorbeta_chicken_timestamp.jpg' },
  { from: 'company_logo.png', to: 'archive/company_logo.png' },
  { from: 'COAT OF ARMS.jpg', to: 'archive/coat_of_arms_caps.jpg' },
  { from: 'coat_of_arms.jpg', to: 'archive/coat_of_arms.jpg' },
  { from: 'logo_transparent_trimmed.png', to: 'archive/logo_transparent_trimmed.png' }
];

let successful = 0;
for (const op of copyOps) {
  const source = path.join(srcDir, op.from);
  const destination = path.join(srcDir, op.to);
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, destination);
    successful++;
  } else {
    console.warn(`Source not found: ${op.from}`);
  }
}

console.log(`Successfully copied ${successful} of ${copyOps.length} files into structured folders.`);
