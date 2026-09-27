const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bqwohpjschaditdkrdra.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and API Key must be defined in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const initialCatalog = [
  {
    name: 'Rajputana Gold',
    breed: 'Bikaneri Dromedary',
    category: 'camels',
    age: '5 Years',
    exhibitor: 'Golden Camel Estate',
    description: 'Championship breeding dromedary known for high endurance, distinctive golden coat, and grand ceremonial posture.',
    localImage: 'public/assets/livestock_camel.jpg',
    is_featured: true,
  },
  {
    name: 'Cheetak Lineage',
    breed: 'Marwari Stallion',
    category: 'horses',
    age: '4 Years',
    exhibitor: 'Kano Durbar Cavalry',
    description: 'Famous inward-turning ears, athletic build, and heritage lineage trained for ceremonial Durbar parades.',
    localImage: 'public/assets/durbar_horse_rider.jpg',
    is_featured: true,
  },
  {
    name: 'Nandi Crest',
    breed: 'White Fulani Zebu',
    category: 'cattle',
    age: '6 Years',
    exhibitor: 'National Livestock Ranch',
    description: 'Prize-winning indigenous Zebu bull with iconic lyre-shaped horns, robust heat tolerance, and premium genetics.',
    localImage: 'public/assets/livestock_bull_cow.jpg',
    is_featured: true,
  },
  {
    name: 'Sultan of Pushkar',
    breed: 'Jaisalmeri Camel',
    category: 'camels',
    age: '7 Years',
    exhibitor: 'Desert Crown Stud',
    description: 'Celebrated desert racing and parade camel featuring exceptional speed, tall stature, and royal saddle dress.',
    localImage: 'public/assets/livestock_camel.jpg',
    is_featured: false,
  },
  {
    name: 'Sokoto Gudali Prime',
    breed: 'Sokoto Gudali Bull',
    category: 'cattle',
    age: '5 Years',
    exhibitor: 'Northwest Cattle Alliance',
    description: 'Deep-bodied beef bull with smooth white coat, well-developed dewlap, and high live-weight yield certification.',
    localImage: 'public/assets/livestock_spectrum_hero.jpg',
    is_featured: false,
  },
  {
    name: 'Borno Royal Stallion',
    breed: 'Arewa Thoroughbred',
    category: 'horses',
    age: '3 Years',
    exhibitor: 'Borno Emirate Cavalry',
    description: 'High-spirited parade stallion with silver embroidery harness, trained for precision equestrian maneuvers.',
    localImage: 'public/assets/kano_durbar.jpg',
    is_featured: false,
  },
  {
    name: 'Kano Red Dwarf',
    breed: 'Balami Red Sheep',
    category: 'small-ruminants',
    age: '2 Years',
    exhibitor: 'Sahel Livestock Co-op',
    description: 'Large-framed desert sheep breed with pendulous ears, prized for breeding quality and high mutton output.',
    localImage: 'public/assets/livestock_goat_sheep.jpg',
    is_featured: false,
  },
];

async function seed() {
  console.log('--- Starting Supabase Livestock Seeding ---');

  // 1. Ensure Storage Bucket Exists
  const { error: bucketErr } = await supabase.storage.createBucket('livestock-images', { public: true });
  if (bucketErr) {
    console.log('Storage bucket note:', bucketErr.message);
  } else {
    console.log('Created livestock-images bucket.');
  }

  const seededRecords = [];

  for (const item of initialCatalog) {
    let imageUrl = `${supabaseUrl}/storage/v1/object/public/livestock-images/${path.basename(item.localImage)}`;

    // Check if local file exists and upload to Supabase Storage
    const fullPath = path.resolve(process.cwd(), item.localImage);
    if (fs.existsSync(fullPath)) {
      const fileBuffer = fs.readFileSync(fullPath);
      const fileName = path.basename(item.localImage);

      const { error: uploadError } = await supabase.storage
        .from('livestock-images')
        .upload(fileName, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        console.warn(`Upload note for ${fileName}:`, uploadError.message);
      } else {
        const { data: publicData } = supabase.storage
          .from('livestock-images')
          .getPublicUrl(fileName);
        imageUrl = publicData.publicUrl;
        console.log(`Uploaded image for ${item.name}: ${imageUrl}`);
      }
    }

    seededRecords.push({
      name: item.name,
      breed: item.breed,
      category: item.category,
      age: item.age,
      exhibitor: item.exhibitor,
      description: item.description,
      image_url: imageUrl,
      is_featured: item.is_featured,
    });
  }

  // 2. Insert or Upsert into Database Table
  const { data, error: insertError } = await supabase
    .from('livestock')
    .insert(seededRecords);

  if (insertError) {
    console.error('Database insertion error:', insertError.message);
  } else {
    console.log('Successfully inserted livestock catalog items into Supabase database!');
  }

  console.log('--- Seeding Completed ---');
}

seed();
