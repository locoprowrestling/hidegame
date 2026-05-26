// rooms.js — 6 room definitions
// Each room: id, label, bgColor, bgTileset, staticProps, zones, patrolPath,
//            hunterEntry, playerSpawn, allySpawns

// Zone structure:
//   {name, x, y, w, h, believableObjects:[id,...], defaultMult}
// First matching zone wins. Smaller/specific zones go first in the array.

var ROOMS = {

  ring_area: {
    id: 'ring_area',
    label: 'Ring Area',
    bgColor: '#1a1a2e',
    bgTileset: 'Assets/bg_tiles/hide/wrestling-ring-tileset.png',
    staticProps: [
      {x:68, y:68, w:120, h:120, color:'#333333'},   // ring apron
      {x:84, y:84, w:88,  h:88,  color:'#e8e8e8'},   // ring canvas
    ],
    zones: [
      {name:'ring_interior', x:84,  y:84,  w:88,  h:88,  believableObjects:[], defaultMult:2.0},
      {name:'ringside',      x:48,  y:48,  w:160, h:160, believableObjects:['chair','ladder','mic_stand'], defaultMult:1.0},
      {name:'open_floor',    x:0,   y:20,  w:256, h:236, believableObjects:[], defaultMult:1.0},
    ],
    patrolPath: [{x:128,y:30},{x:220,y:128},{x:128,y:220},{x:30,y:128}],
    hunterEntry: {x:232, y:128},
    playerSpawn: {x:32,  y:128},
    allySpawns:  [{x:32, y:40}, {x:32, y:210}],
  },

  backstage_hallway: {
    id: 'backstage_hallway',
    label: 'Backstage Hallway',
    bgColor: '#2d2d2d',
    bgTileset: 'Assets/bg_tiles/hide/backstage-hallway-tileset.png',
    staticProps: [
      {x:0,   y:20,  w:256, h:36, color:'#3a3a3a'},   // top wall strip
      {x:0,   y:200, w:256, h:56, color:'#3a3a3a'},   // bottom wall strip
      {x:20,  y:28,  w:20,  h:12, color:'#4A4A4A'},   // road cases on wall
      {x:60,  y:28,  w:20,  h:12, color:'#4A4A4A'},
      {x:20,  y:202, w:20,  h:12, color:'#4A4A4A'},
      {x:80,  y:202, w:20,  h:12, color:'#4A4A4A'},
    ],
    zones: [
      {name:'wall_side_top',    x:0,  y:20,  w:256, h:44,  believableObjects:['road_case','crate','curtain'], defaultMult:1.0},
      {name:'wall_side_bottom', x:0,  y:200, w:256, h:56,  believableObjects:['road_case','crate','curtain'], defaultMult:1.0},
      {name:'hallway_center',   x:0,  y:116, w:256, h:44,  believableObjects:[], defaultMult:2.0},
      {name:'open_floor',       x:0,  y:20,  w:256, h:236, believableObjects:[], defaultMult:1.0},
    ],
    patrolPath: [{x:30,y:128},{x:220,y:128},{x:220,y:128},{x:30,y:128}],
    hunterEntry: {x:240, y:128},
    playerSpawn: {x:30, y:128},
    allySpawns:  [{x:30, y:36}, {x:30, y:204}],
  },

  locker_room: {
    id: 'locker_room',
    label: 'Locker Room',
    bgColor: '#1e3048',
    bgTileset: 'Assets/bg_tiles/hide/locker-room-tileset.png',
    staticProps: [
      {x:20, y:24,  w:216, h:24, color:'#2a4a6a'},   // top lockers
      {x:20, y:208, w:216, h:24, color:'#2a4a6a'},   // bottom lockers
      {x:20, y:100, w:16,  h:56, color:'#5a3a1a'},   // bench left
      {x:220,y:100, w:16,  h:56, color:'#5a3a1a'},   // bench right
    ],
    zones: [
      {name:'locker_corner',     x:0,  y:20,  w:50,  h:50,  believableObjects:['trash_can','crate'], defaultMult:0.8},
      {name:'locker_wall_top',   x:0,  y:20,  w:256, h:44,  believableObjects:['trash_can','crate','chair'], defaultMult:1.0},
      {name:'locker_wall_bottom',x:0,  y:200, w:256, h:56,  believableObjects:['trash_can','crate','chair'], defaultMult:1.0},
      {name:'bench_area',        x:0,  y:90,  w:50,  h:76,  believableObjects:['chair','crate'], defaultMult:1.0},
      {name:'open_center',       x:60, y:80,  w:136, h:96,  believableObjects:[], defaultMult:2.0},
      {name:'open_floor',        x:0,  y:20,  w:256, h:236, believableObjects:[], defaultMult:1.0},
    ],
    patrolPath: [{x:128,y:50},{x:220,y:128},{x:128,y:200},{x:36,y:128}],
    hunterEntry: {x:128, y:240},
    playerSpawn: {x:128, y:120},
    allySpawns:  [{x:36, y:50}, {x:220, y:50}],
  },

  merch_area: {
    id: 'merch_area',
    label: 'Merch Table Area',
    bgColor: '#1a1a1a',
    bgTileset: 'Assets/bg_tiles/hide/merch-area-tileset.png',
    staticProps: [
      {x:48,  y:80, w:60, h:24, color:'#5a3010'},   // table left
      {x:148, y:80, w:60, h:24, color:'#5a3010'},   // table right
      {x:50,  y:72, w:16, h:10, color:'#E84444'},   // merch on tables
      {x:72,  y:72, w:16, h:10, color:'#4444E8'},
      {x:150, y:72, w:16, h:10, color:'#44E844'},
      {x:172, y:72, w:16, h:10, color:'#E8E844'},
    ],
    zones: [
      {name:'table_back',  x:40,  y:104, w:176, h:60, believableObjects:['merch_box','crate','chair'], defaultMult:1.0},
      {name:'front_queue', x:40,  y:164, w:176, h:50, believableObjects:[], defaultMult:2.0},
      {name:'open_floor',  x:0,   y:20,  w:256, h:236, believableObjects:[], defaultMult:1.0},
    ],
    patrolPath: [{x:128,y:40},{x:40,y:160},{x:216,y:160},{x:128,y:40}],
    hunterEntry: {x:20, y:128},
    playerSpawn: {x:220, y:160},
    allySpawns:  [{x:60, y:120}, {x:180, y:120}],
  },

  storage_room: {
    id: 'storage_room',
    label: 'Storage Room',
    bgColor: '#1a1208',
    bgTileset: 'Assets/bg_tiles/hide/storage-room-tileset.png',
    staticProps: [
      {x:20,  y:30,  w:16, h:16, color:'#8B6914'},
      {x:40,  y:30,  w:14, h:14, color:'#6a5010'},
      {x:20,  y:54,  w:16, h:16, color:'#8B6914'},
      {x:210, y:30,  w:16, h:16, color:'#8B6914'},
      {x:230, y:40,  w:12, h:14, color:'#6a5010'},
      {x:210, y:54,  w:16, h:16, color:'#8B6914'},
      {x:20,  y:190, w:20, h:14, color:'#8B6914'},
      {x:220, y:190, w:20, h:14, color:'#8B6914'},
    ],
    zones: [
      {name:'storage_wall_left',  x:0,   y:20,  w:60,  h:216, believableObjects:['crate','road_case','chair','trash_can','merch_box','ladder','curtain'], defaultMult:1.0},
      {name:'storage_wall_right', x:196, y:20,  w:60,  h:216, believableObjects:['crate','road_case','chair','trash_can','merch_box','ladder','curtain'], defaultMult:1.0},
      {name:'storage_wall_top',   x:0,   y:20,  w:256, h:50,  believableObjects:['crate','road_case','chair','trash_can','merch_box','ladder','curtain'], defaultMult:1.0},
      {name:'center_isolated',    x:80,  y:100, w:96,  h:80,  believableObjects:[], defaultMult:2.0},
      {name:'open_floor',         x:0,   y:20,  w:256, h:236, believableObjects:['crate','road_case'], defaultMult:1.0},
    ],
    patrolPath: [{x:128,y:40},{x:40,y:128},{x:128,y:215},{x:216,y:128}],
    hunterEntry: {x:128, y:25},
    playerSpawn: {x:128, y:200},
    allySpawns:  [{x:30, y:40}, {x:220, y:40}],
  },

  entrance_curtain: {
    id: 'entrance_curtain',
    label: 'Entrance Curtain',
    bgColor: '#0d0d1a',
    bgTileset: 'Assets/bg_tiles/hide/entrance-curtain-tileset.png',
    staticProps: [
      {x:0,   y:20, w:256, h:60, color:'#1a0020'},   // backdrop
      {x:20,  y:20, w:30,  h:60, color:'#400040'},   // curtain panels
      {x:60,  y:20, w:30,  h:60, color:'#300030'},
      {x:100, y:20, w:30,  h:60, color:'#400040'},
      {x:140, y:20, w:30,  h:60, color:'#300030'},
      {x:180, y:20, w:30,  h:60, color:'#400040'},
      {x:220, y:20, w:30,  h:60, color:'#300030'},
      {x:10,  y:88, w:20,  h:14, color:'#4A4A4A'},   // road cases stage sides
      {x:226, y:88, w:20,  h:14, color:'#4A4A4A'},
    ],
    zones: [
      {name:'entrance_side',      x:0,  y:20,  w:256, h:80,  believableObjects:['curtain','road_case','mic_stand'], defaultMult:1.0},
      {name:'stage_wings_left',   x:0,  y:80,  w:40,  h:120, believableObjects:['road_case','curtain'], defaultMult:1.0},
      {name:'stage_wings_right',  x:216,y:80,  w:40,  h:120, believableObjects:['road_case','curtain'], defaultMult:1.0},
      {name:'center_path',        x:80, y:130, w:96,  h:90,  believableObjects:[], defaultMult:2.0},
      {name:'open_floor',         x:0,  y:20,  w:256, h:236, believableObjects:[], defaultMult:1.0},
    ],
    patrolPath: [{x:40,y:128},{x:128,y:50},{x:216,y:128},{x:128,y:200}],
    hunterEntry: {x:128, y:240},
    playerSpawn: {x:128, y:200},
    allySpawns:  [{x:20, y:100}, {x:230, y:100}],
  },
};

var ROOM_IDS = Object.keys(ROOMS);
