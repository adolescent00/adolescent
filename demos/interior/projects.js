/* ATELIER NORD — project data (fictional). Used by the gallery on index.html and by project.html. */
window.AN_PROJECTS = [
  {
    slug: 'house-no-17', num: '01', title: 'House No. 17', category: 'RESIDENTIAL', location: 'KODAIKANAL', country: 'INDIA', year: '2026',
    hero: { src: 'img/p1-800.webp', srcset: 'img/p1-800.webp 800w, img/p1-1400.webp 1264w', w: 1264, h: 848, alt: 'Living room with a wide window framing misty pine hills, rough stone wall and charcoal sofa.' },
    statement: 'A quiet hillside residence shaped around light, landscape and long views. The design uses warm stone, timber and carefully framed openings to create a sequence of spaces that changes throughout the day.',
    body: ['The house sits on a north-facing slope, so the plan was turned to pull morning light deep into the living spaces while keeping bedrooms cool and shaded. A single stone wall runs the full length of the building and organises everything around it.', 'Openings are few and deliberate. Each frames one view — the ridge, the pines, a strip of sky — rather than glazing the whole elevation.'],
    highlight: 'LIVING,STUDY', route: true,
    materials: [['Travertine', 'Floors, hearth'], ['Oak', 'Joinery, ceiling'], ['Lime plaster', 'Walls'], ['Brushed metal', 'Frames, handles'], ['Natural linen', 'Curtains, seating']],
    images: [
      { src: 'img/p4-600.webp', srcset: 'img/p4-600.webp 600w, img/p4-900.webp 900w', w: 900, h: 900, alt: 'Detail of travertine counter and oak cabinetry in warm daylight.', cap: 'FIG. 02 — KITCHEN THRESHOLD, TRAVERTINE / OAK' },
      { src: 'img/p2-600.webp', srcset: 'img/p2-600.webp 600w, img/p2-900.webp 896w', w: 896, h: 1200, alt: 'Shaded verandah edge with dark timber louvres and green foliage.', cap: 'FIG. 03 — SHADED EDGE TOWARD THE GARDEN' }
    ],
    facts: [['AREA', '312 M²'], ['LEVELS', '2 + ROOF TERRACE'], ['ORIENTATION', 'NORTH-EAST'], ['SCOPE', 'INTERIOR ARCHITECTURE, JOINERY, LIGHTING'], ['STATUS', 'CONCEPT / FICTIONAL']]
  },
  {
    slug: 'monsoon-house', num: '02', title: 'Monsoon House', category: 'RESIDENTIAL', location: 'GOA', country: 'INDIA', year: '2026',
    hero: { src: 'img/p2-600.webp', srcset: 'img/p2-600.webp 600w, img/p2-900.webp 896w', w: 896, h: 1200, alt: 'Shaded verandah with terracotta oxide floor, dark green louvres and a rain-soaked courtyard.', portrait: true },
    statement: 'A house designed for four months of rain. Deep verandahs, oxide floors and louvred timber screens turn the monsoon into the main event rather than something to be kept out.',
    body: ['The interiors take their cues from old Goan houses: rooms that breathe, floors that can get wet, colour that comes from pigment rather than paint. Every threshold is a place to sit.', 'A central courtyard collects rain into a shallow laterite basin; the sound of it reaches every room.'],
    highlight: 'COURTYARD,DINING', route: true,
    materials: [['Red oxide', 'Floors'], ['Teak', 'Louvres, doors'], ['Lime plaster', 'Walls'], ['Laterite', 'Courtyard, plinth'], ['Cotton', 'Screens, bedding']],
    images: [
      { src: 'img/p5-1000.webp', srcset: 'img/p5-1000.webp 1000w, img/p5-1800.webp 1584w', w: 1584, h: 672, alt: 'Dark timber-lined room opening onto still water at dusk.', cap: 'FIG. 02 — EVENING, LOOKING OUT FROM THE SLEEPING ROOM' },
      { src: 'img/mat-plaster.webp', w: 700, h: 700, alt: 'Close-up of moss-grey lime plaster.', cap: 'FIG. 03 — PIGMENTED LIME PLASTER, SAMPLE 14' }
    ],
    facts: [['AREA', '268 M²'], ['LEVELS', '1 + COURTYARD'], ['ORIENTATION', 'SOUTH-WEST (MONSOON FACING)'], ['SCOPE', 'INTERIORS, LANDSCAPE COORDINATION'], ['STATUS', 'CONCEPT / FICTIONAL']]
  },
  {
    slug: 'northline-workspace', num: '03', title: 'Northline Workspace', category: 'COMMERCIAL', location: 'BENGALURU', country: 'INDIA', year: '2025',
    hero: { src: 'img/p3-800.webp', srcset: 'img/p3-800.webp 800w, img/p3-1400.webp 1376w', w: 1376, h: 768, alt: 'Dark workspace with a long black oak table under a linear light and a moss-green felt wall.' },
    statement: 'A workspace for a small design-led company that wanted to feel more like a library than an office. Dark, focused and quiet, with one long table at its centre.',
    body: ['The existing concrete shell was left almost untouched. Instead of partitions, the plan uses a single moss-green felt wall to hold acoustics and define zones without closing them.', 'Lighting is low and linear so that screens, not ceilings, are the brightest surfaces in the room.'],
    highlight: 'STUDY,LIVING', route: false,
    materials: [['Black-stained oak', 'Table, storage'], ['Micro-cement', 'Floors'], ['Wool felt', 'Acoustic wall'], ['Blackened steel', 'Shelving, frames'], ['Exposed concrete', 'Ceiling, columns']],
    images: [
      { src: 'img/mat-timber.webp', w: 700, h: 700, alt: 'Close-up of dark smoked oak grain.', cap: 'FIG. 02 — TABLE TOP, SMOKED OAK' },
      { src: 'img/hero-1000.webp', srcset: 'img/hero-1000.webp 1000w, img/hero-1800.webp 1376w', w: 1376, h: 768, alt: 'Concrete room with a single band of daylight across the floor.', cap: 'FIG. 03 — MEETING ROOM, SLOT WINDOW' }
    ],
    facts: [['AREA', '540 M²'], ['LEVELS', '1'], ['OCCUPANCY', '28 DESKS, 2 ROOMS'], ['SCOPE', 'WORKPLACE INTERIORS, FURNITURE'], ['STATUS', 'CONCEPT / FICTIONAL']]
  },
  {
    slug: 'courtyard-apartment', num: '04', title: 'The Courtyard Apartment', category: 'RESIDENTIAL', location: 'MUMBAI', country: 'INDIA', year: '2025',
    hero: { src: 'img/p4-600.webp', srcset: 'img/p4-600.webp 600w, img/p4-900.webp 900w', w: 900, h: 900, alt: 'Bright kitchen with travertine counter and oak cabinets opening onto a sunlit internal courtyard.', square: true },
    statement: 'A city apartment reorganised around a single planted void. Removing one room gave every other room light, air and somewhere to look.',
    body: ['Mumbai apartments rarely have a view worth keeping, so we made one. The former dining room became an open courtyard; the kitchen, living and study now all face it.', 'Materials are bright and few: white lime wash, bleached oak, travertine and a terracotta floor that carries the courtyard colour inside.'],
    highlight: 'COURTYARD,KITCHEN', route: true,
    materials: [['Travertine', 'Counters'], ['Bleached oak', 'Cabinetry'], ['Lime wash', 'Walls'], ['Terracotta', 'Floors'], ['Rattan', 'Seating']],
    images: [
      { src: 'img/mat-stone.webp', w: 700, h: 700, alt: 'Close-up of honed travertine with natural pits.', cap: 'FIG. 02 — COUNTER, HONED TRAVERTINE' },
      { src: 'img/p1-800.webp', srcset: 'img/p1-800.webp 800w, img/p1-1400.webp 1264w', w: 1264, h: 848, alt: 'Living room with wide window and stone wall.', cap: 'FIG. 03 — LIVING ROOM TOWARD THE COURTYARD' }
    ],
    facts: [['AREA', '146 M²'], ['LEVELS', '1'], ['ORIENTATION', 'TOP-LIT COURTYARD'], ['SCOPE', 'FULL INTERIOR RENOVATION'], ['STATUS', 'CONCEPT / FICTIONAL']]
  },
  {
    slug: 'still-house', num: '05', title: 'Still House', category: 'HOSPITALITY', location: 'KERALA', country: 'INDIA', year: '2025',
    hero: { src: 'img/p5-1000.webp', srcset: 'img/p5-1000.webp 1000w, img/p5-1800.webp 1584w', w: 1584, h: 672, alt: 'Teak-lined hotel room opening onto a still reflecting pool at dusk with palm silhouettes.', wide: true },
    statement: 'Six rooms on the backwaters, each one a dark timber box opened entirely on one side to water. Nothing in the room competes with what is outside it.',
    body: ['Guest rooms are deliberately dim. Teak walls, low beds and a single lamp make the water and sky the brightest things in view.', 'Service spaces are pushed to the back so that arrival, room and dining all share the same long horizon.'],
    highlight: 'BEDROOM,LIVING', route: false,
    materials: [['Teak', 'Walls, floors'], ['Kota stone', 'Bathrooms'], ['Lime plaster', 'Service areas'], ['Brass', 'Fittings'], ['Handloom cotton', 'Bedding, screens']],
    images: [
      { src: 'img/p3-800.webp', srcset: 'img/p3-800.webp 800w, img/p3-1400.webp 1376w', w: 1376, h: 768, alt: 'Dark room with a long table and low linear light.', cap: 'FIG. 02 — DINING ROOM AT NIGHT' },
      { src: 'img/p2-600.webp', srcset: 'img/p2-600.webp 600w, img/p2-900.webp 896w', w: 896, h: 1200, alt: 'Verandah with louvres and foliage.', cap: 'FIG. 03 — ROOM VERANDAH, LOUVRED SCREEN' }
    ],
    facts: [['AREA', '6 ROOMS / 820 M²'], ['LEVELS', '1'], ['ORIENTATION', 'WEST, OVER WATER'], ['SCOPE', 'HOSPITALITY INTERIORS, FF&E'], ['STATUS', 'CONCEPT / FICTIONAL']]
  }
];
