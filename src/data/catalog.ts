import type { Person, Property, Room, Service } from './types';

export const PROPERTIES: Property[] = [
  {
    id: 'ben-yehuda',
    street: '77 Ben Yehuda St',
    unit: 'Apt 4',
    bedrooms: 2,
    area: 70,
    zip: '6343503',
    photo: '/mock/property-ben-yehuda.jpg',
    access: 'Key box by the door, code 4412. Third floor, no lift.',
  },
  {
    id: 'hayarkon',
    street: '164 Hayarkon St',
    unit: 'Apt 12',
    bedrooms: 1,
    area: 48,
    zip: '6345113',
    photo: '/mock/property-hayarkon.jpg',
    access: 'Doorman has the key. Say you are from Patronim.',
  },
  {
    id: 'bograshov',
    street: '3 Bograshov St',
    unit: 'Apt 1',
    bedrooms: 3,
    area: 100,
    zip: '6342507',
    photo: '/mock/property-bograshov.jpg',
    access: 'Smart lock. The code arrives by SMS 30 min before start.',
  },
  {
    id: 'levinski',
    street: '37 Levinski St',
    unit: 'Apt 7',
    bedrooms: 0,
    area: 32,
    zip: '6608612',
    photo: '/mock/property-levinski.jpg',
    access: 'Key box on the gate, code 0719.',
  },
  {
    id: 'weizmann',
    street: '3 Weizmann St',
    unit: 'Apt 1',
    bedrooms: 1,
    area: 55,
    zip: '6423901',
    photo: '/mock/property-weizmann.jpg',
    access: 'Ground floor. Key under the blue plant pot.',
  },
];

export const SERVICES: Service[] = [
  {
    id: 'turnover',
    name: 'Turnover clean',
    summary: 'After checkout, before the next guest',
    includes: ['Full clean of every room', 'Fresh linen and towels made up', 'Restock toiletries'],
    basePrice2br: 290,
    duration2br: 150,
    hasRooms: true,
  },
  {
    id: 'refresh',
    name: 'Quick refresh',
    summary: '2 hours before check-in',
    includes: ['Dust and vacuum', 'Bathroom wipe-down', 'Empty bins, air the rooms'],
    basePrice2br: 150,
    duration2br: 60,
    hasRooms: true,
  },
  {
    id: 'midstay-linen',
    name: 'Mid-stay clean with fresh linen',
    summary: 'For longer stays, guest stays in',
    includes: ['Clean kitchen and bathroom', 'Change bed linen', 'Fresh towels'],
    basePrice2br: 240,
    duration2br: 120,
    hasRooms: true,
  },
  {
    id: 'midstay',
    name: 'Mid-stay clean, no linen change',
    summary: 'For longer stays, guest keeps their linen',
    includes: ['Clean kitchen and bathroom', 'Vacuum and mop', 'Empty bins'],
    basePrice2br: 190,
    duration2br: 90,
    hasRooms: true,
  },
  {
    id: 'linen-only',
    name: 'Linen delivery only',
    summary: 'We drop off fresh sets, no cleaning',
    includes: ['Delivered to the door', 'Used sets collected'],
    basePrice2br: 60,
    duration2br: 30,
    hasRooms: false,
  },
  {
    id: 'owner',
    name: 'Owner clean',
    summary: 'Deep clean when you move back in',
    includes: ['Inside cupboards and appliances', 'Windows and balcony', 'Full reset of every room'],
    basePrice2br: 420,
    duration2br: 240,
    hasRooms: true,
  },
];

export const EXTRA_PRICES = { linen: 45, towels: 20, kit: 30 } as const;

export const EXTRA_LABELS = {
  linen: { name: 'Linen sets', hint: 'Sheets, duvet cover, 2 pillowcases' },
  towels: { name: 'Towel sets', hint: 'Bath, hand and face towel' },
  kit: { name: 'Amenity kit', hint: 'Soap, shampoo, coffee, toilet paper' },
} as const;

export const PEOPLE: Record<string, Person> = {
  dana: { id: 'dana', name: 'Dana Levi', initials: 'DL', role: 'Property manager' },
  avi: { id: 'avi', name: 'Avi Mizrahi', initials: 'AM', role: 'Cleaner' },
  noa: { id: 'noa', name: 'Noa Shapiro', initials: 'NS', role: 'Quality controller' },
  yossi: { id: 'yossi', name: 'Yossi Peretz', initials: 'YP', role: 'Cleaner' },
};

export const ME = { manager: 'dana', patron: 'avi', inspector: 'noa' } as const;

const ROOM_TEMPLATE: { id: string; name: string; items: string[] }[] = [
  {
    id: 'bedroom',
    name: 'Bedroom',
    items: ['Make beds with fresh linen', 'Dust surfaces and lamps', 'Vacuum under the bed', 'Check drawers for guest items', 'Mop the floor'],
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    items: ['Clean toilet and bidet', 'Scrub shower and tiles', 'Polish mirror', 'Hang fresh towels', 'Refill toiletries', 'Mop the floor'],
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    items: ['Wash and put away dishes', 'Wipe counters and hob', 'Clean fridge inside', 'Empty bins, new bags', 'Mop the floor'],
  },
  {
    id: 'living',
    name: 'Living room',
    items: ['Dust shelves and TV', 'Vacuum sofa and rug', 'Fold throws, fluff cushions', 'Wipe balcony door glass'],
  },
];

export const ROOM_PHOTOS: Record<string, string> = {
  bedroom: '/mock/room-bedroom.jpg',
  bathroom: '/mock/room-bathroom.jpg',
  kitchen: '/mock/room-kitchen.jpg',
  living: '/mock/room-living.jpg',
};

export const REDO_PHOTO = '/mock/redo-mirror.jpg';

export const makeRooms = (): Room[] =>
  ROOM_TEMPLATE.map((r) => ({
    id: r.id,
    name: r.name,
    items: r.items.map((label, i) => ({ id: `${r.id}-${i}`, label, done: false })),
  }));

export const MISSING_TYPES = ['Towel', 'Bed sheet', 'Pillowcase', 'Toilet paper', 'Soap', 'Coffee', 'Other'];

export const propertyById = (id: string) => PROPERTIES.find((p) => p.id === id)!;
export const serviceById = (id: string) => SERVICES.find((s) => s.id === id)!;
export const propertyTitle = (p: Property) => `${p.street}, ${p.unit}`;
export const sizeLabel = (p: Property) => `${p.bedrooms === 0 ? 'Studio' : `${p.bedrooms} bedroom${p.bedrooms > 1 ? 's' : ''}`} · ${p.area} m²`;
