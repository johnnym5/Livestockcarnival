import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const envPath = path.join(projectRoot, '.env.local');

// Parse .env.local manually
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      if (key === 'NEXT_PUBLIC_SUPABASE_URL' && !supabaseUrl) supabaseUrl = value;
      if (key === 'SUPABASE_SERVICE_ROLE_KEY' && !serviceRoleKey) serviceRoleKey = value;
    }
  }
}

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const BUCKET_NAME = 'media-assets';

function getMimeType(filepath) {
  const ext = path.extname(filepath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.avif':
      return 'image/avif';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

async function uploadFolderRecursively(dirPath, baseDir) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const uploadedFiles = {};

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'archive') continue; // skip archive folder
      const subUploaded = await uploadFolderRecursively(fullPath, baseDir);
      Object.assign(uploadedFiles, subUploaded);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) continue;

      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      const fileBuffer = fs.readFileSync(fullPath);
      const mimeType = getMimeType(fullPath);

      console.log(`Uploading: ${relativePath}...`);
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(relativePath, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) {
        console.error(`Failed to upload ${relativePath}:`, error.message);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(relativePath);

        uploadedFiles[relativePath] = publicUrlData.publicUrl;
        console.log(`Success: ${relativePath} -> ${publicUrlData.publicUrl}`);
      }
    }
  }

  return uploadedFiles;
}

async function main() {
  console.log('--- Starting Media Assets & Posts Migration ---');

  const assetsDir = path.join(projectRoot, 'public', 'assets');
  if (!fs.existsSync(assetsDir)) {
    console.error('Assets directory not found at:', assetsDir);
    process.exit(1);
  }

  console.log('\nStep 1: Uploading local assets to Supabase Storage (media-assets bucket)...');
  const uploadedUrls = await uploadFolderRecursively(assetsDir, assetsDir);
  console.log(`\nUploaded ${Object.keys(uploadedUrls).length} assets to Supabase Storage.`);

  console.log('\nStep 2: Seeding initial media stories to Supabase Database (media_posts table)...');

  const initialPosts = [
    {
      title: 'Federal Government Declares Abuja as Sole National Host for 2026 Renewed Hope National Livestock Carnival',
      slug: 'federal-government-declares-abuja-sole-national-host-2026',
      category: 'Official Communique',
      excerpt: 'The Federal Government of Nigeria and NHESICS unveil the master operational framework positioning Old Parade Ground as Nigeria\'s central agri-export showcase.',
      body: `The Federal Government of Nigeria, in strategic collaboration with the National Livestock Transformation Secretariat and NHESICS, has formally announced the comprehensive operational staging for the inaugural 2026 Renewed Hope National Livestock Carnival.\n\nHeadquartered exclusively at the historic Old Parade Ground in Abuja, the three-day fixture will aggregate purebred cattle, camels, goats, sheep, poultry, and aquaculture genetic assets alongside institutional trade finance and state-of-the-art cold chain infrastructure under a unified national canopy.\n\nStakeholders across all 36 states and the Federal Capital Territory are invited to register as exhibitors, delegates, and trade partners as Nigeria opens a new chapter in agricultural transformation and international meat trade.`,
      cover_image_path: 'home/story-carnival-entrance-gate.jpg',
      status: 'published',
      published_at: new Date('2026-10-15T09:00:00Z').toISOString(),
    },
    {
      title: 'Bank of Industry Commits Single-Digit Financing Facility for Modern Feedlots & Abattoirs',
      slug: 'bank-of-industry-commits-single-digit-financing-facility',
      category: 'Investment & Policy',
      excerpt: 'Concessionary capital window activated to back commercial pastoralists, veterinary telematics operators, and hygienic artisanal and industrial abattoir networks.',
      body: `A landmark memorandum has been structured between institutional development lenders and the livestock secretariat. Under the newly created Agri-Transform Window, verified livestock enterprises adopting biometric ear-tagging and standardized live-weight trading will access concessional expansion loans tailored to reduce production overheads and upgrade processing standards.\n\nThe facility aims to catalyze private sector investments across commercial breeding ranches, climate-resilient feed production facilities, and cold storage logistics hubs nationwide.`,
      cover_image_path: 'hqi_cold_chain.jpg',
      status: 'published',
      published_at: new Date('2026-10-02T10:30:00Z').toISOString(),
    },
    {
      title: 'Quality & Inspection Infrastructure Framework Achieves Bilateral Gulf Export Alignment',
      slug: 'quality-inspection-infrastructure-framework-achieves-export-alignment',
      category: 'Technology & Inspection',
      excerpt: 'Harmonized standards ensure direct Nigerian beef, lamb, poultry, and aquaculture consignments meet stringent Gulf and Middle Eastern market import protocols.',
      body: `Nigeria's positioning within the global livestock export economy receives a decisive catalyst with the formal codification of the Quality & Inspection Infrastructure (QII).\n\nIntegrating digital biometric RFID ear tags with tamper-proof veterinary ledgers and mobile processing modularity guarantees verifiable farm-to-cargo port provenance across all livestock categories.\n\nInternational trade envoys and bilateral delegations will inspect live QII demonstrations during the Abuja Carnival staging.`,
      cover_image_path: 'digital_etag.jpg',
      status: 'published',
      published_at: new Date('2026-09-18T14:15:00Z').toISOString(),
    },
    {
      title: 'Royal Durbar Cavalry Contingents Confirm Historic Abuja Festival Procession',
      slug: 'royal-durbar-cavalry-contingents-confirm-historic-abuja-procession',
      category: 'Cultural Heritage',
      excerpt: 'Premier emirates and northern cavalry councils will assemble over two hundred elite war horses and royal retinues in a spectacular display of equestrian skill.',
      body: `Centuries of regal horsemanship and equestrian pageantry will animate the Old Parade Ground track in Abuja. The 2026 Festival will host representative delegations from Kano, Katsina, Bauchi, Bida, and Adamawa in a calibrated parade celebrating national heritage, peacebuilding, and pastoral excellence.\n\nEquestrian fans and cultural enthusiasts from around the world will witness traditional horsemanship, ceremonial adornment, and musical processions throughout the grand carnival weekend.`,
      cover_image_path: 'durbar_horse_rider.jpg',
      status: 'published',
      published_at: new Date('2026-08-25T11:00:00Z').toISOString(),
    },
  ];

  for (const post of initialPosts) {
    const coverUrl = uploadedUrls[post.cover_image_path] || null;

    const { data, error } = await supabase
      .from('media_posts')
      .upsert(
        {
          title: post.title,
          slug: post.slug,
          category: post.category,
          excerpt: post.excerpt,
          body: post.body,
          cover_image_url: coverUrl,
          cover_image_path: post.cover_image_path,
          status: post.status,
          published_at: post.published_at,
        },
        { onConflict: 'slug' }
      )
      .select();

    if (error) {
      console.error(`Error upserting post "${post.title}":`, error.message);
    } else {
      console.log(`Seeded post: "${post.title}" (Cover: ${coverUrl ? 'Yes' : 'No'})`);
    }
  }

  console.log('\n--- Migration Complete! ---');
}

main().catch((err) => {
  console.error('Fatal error during upload/seed:', err);
  process.exit(1);
});
