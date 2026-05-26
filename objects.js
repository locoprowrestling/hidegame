// objects.js — 8 disguisable object definitions
// Each object: id, label, w/h (px logical), color (fallback), sprite (path or null),
//   believableRooms, believableZoneNames, suspicionMult

var OBJECTS = [
  {
    id: 'chair',
    label: 'Folding Chair',
    w: 12, h: 12,
    color: '#C8A46E',
    sprite: 'Assets/sprites/objects/obj-chair-stack.png',
    believableRooms: ['ring_area','locker_room','storage_room'],
    believableZoneNames: ['ringside','locker_wall','storage_wall','bench_area'],
    suspicionMult: 1.0
  },
  {
    id: 'road_case',
    label: 'Road Case',
    w: 16, h: 12,
    color: '#4A4A4A',
    sprite: 'Assets/sprites/objects/obj-road-case.png',
    believableRooms: ['backstage_hallway','entrance_curtain','storage_room'],
    believableZoneNames: ['wall_side','entrance_side','storage_wall'],
    suspicionMult: 1.0
  },
  {
    id: 'crate',
    label: 'Crate',
    w: 14, h: 14,
    color: '#8B6914',
    sprite: 'Assets/sprites/objects/obj-crate.png',
    believableRooms: ['storage_room','backstage_hallway','locker_room'],
    believableZoneNames: ['storage_wall','wall_side','locker_corner','bench_area'],
    suspicionMult: 1.0
  },
  {
    id: 'trash_can',
    label: 'Trash Can',
    w: 10, h: 12,
    color: '#606060',
    sprite: 'Assets/sprites/objects/obj-trash-can.png',
    believableRooms: ['locker_room','backstage_hallway'],
    believableZoneNames: ['locker_corner','locker_wall','wall_side'],
    suspicionMult: 1.1
  },
  {
    id: 'merch_box',
    label: 'Merch Box',
    w: 14, h: 10,
    color: '#E84444',
    sprite: null,
    believableRooms: ['merch_area','storage_room'],
    believableZoneNames: ['table_back','storage_wall'],
    suspicionMult: 1.2
  },
  {
    id: 'mic_stand',
    label: 'Mic Stand',
    w: 6, h: 18,
    color: '#B0B0B0',
    sprite: null,
    believableRooms: ['ring_area','entrance_curtain'],
    believableZoneNames: ['entrance_side','ringside'],
    suspicionMult: 1.0
  },
  {
    id: 'ladder',
    label: 'Ladder',
    w: 10, h: 20,
    color: '#909090',
    sprite: null,
    believableRooms: ['ring_area','storage_room'],
    believableZoneNames: ['ringside','storage_wall'],
    suspicionMult: 1.3
  },
  {
    id: 'curtain',
    label: 'Curtain Bundle',
    w: 16, h: 14,
    color: '#800020',
    sprite: 'Assets/sprites/objects/obj-curtain.png',
    believableRooms: ['entrance_curtain','backstage_hallway'],
    believableZoneNames: ['entrance_side','wall_side'],
    suspicionMult: 0.9
  }
];
