// HexWright — What a hex can contain: exactly one terrain plus any number of features.
// (Classic script: shares the global scope with the other js/ files.)
//
// Terrain is fixed for the life of a map: clear, offboard, wall, pit, water.
// Features sit on top of the terrain and may change during play: fire, sticky, trapdoor, lava, chest...
// Features are interchangeable (every "fire" is the same), so a hex lists each one at most once.
//
// In memory, map.grid[x][y] is an array of words. At most one of them is a terrain word; "clear" is
// the absence of one. Everything else is a feature. normalizeHex() enforces this and is applied
// after every text parse and every tool edit, so the text and the map object can never disagree.

// Terrain, strongest first: if a hex is given two terrains, the stronger one wins.
// Keys are the words stored in map.grid; values are the names used in the game JSON.
const TERRAIN_WORDS = { 'offboard': 'offboard', 'wall hex': 'wall', 'pit': 'pit', 'water': 'water' };
const TERRAIN_FROM_NAME = { offboard: 'offboard', wall: 'wall hex', pit: 'pit', water: 'water', clear: null };

// Alternative spellings that may appear in typed text, mapped to the stored word.
const WORD_ALIASES = {
  'wall': 'wall hex', 'walls': 'wall hex', 'wallhex': 'wall hex',
  'pond': 'water', 'pool': 'water', 'river': 'water', 'stream': 'water',
  'pits': 'pit', 'hole': 'pit', 'holes': 'pit',
  'paths': 'path', 'road': 'path', 'roads': 'path', 'trail': 'path', 'trails': 'path',
  'columns': 'column', 'tree': 'column', 'trees': 'column',
  'bodies': 'body', 'fires': 'fire', 'flame': 'fire', 'flames': 'fire',
  'shadows': 'shadow', 'darkness': 'shadow', 'dark': 'darker', 'light': 'lighter',
  'stars': 'star', 'trapdoors': 'trapdoor', 'tables': 'table', 'altars': 'altar',
  'pentacles': 'pentacle', 'pentagram': 'pentacle', 'barricades': 'barricade',
  'lavas': 'lava', 'acid': 'lava', 'rock': 'stone', 'rocks': 'stone', 'stones': 'stone'
};

// Words that are derived from other data and never typed or saved per hex.
const DERIVED_WORDS = ['bridge'];   // filled in along each bridge by fillBridge()

function canonicalWord( word ) {
  const w = String( word ).trim().toLowerCase();
  return WORD_ALIASES[ w ] || w;
}

function isTerrainWord( word ) {
  return Object.prototype.hasOwnProperty.call( TERRAIN_WORDS, word );
}

// Returns a cleaned copy: aliases resolved, "clear" dropped, duplicates removed,
// only the strongest terrain kept (placed first), and features sorted so the order never depends
// on how the text happened to be grouped.
function normalizeHex( words ) {
  const seen = new Set();
  let terrain = null;
  const features = [];
  const terrainRank = Object.keys( TERRAIN_WORDS );

  for ( const raw of words ) {
    const w = canonicalWord( raw );
    if ( !w || w === 'clear' || seen.has( w ) ) continue;
    seen.add( w );
    if ( isTerrainWord( w ) ) {
      if ( terrain === null || terrainRank.indexOf( w ) < terrainRank.indexOf( terrain ) ) terrain = w;
    } else {
      features.push( w );
    }
  }
  features.sort();
  return terrain ? [ terrain, ...features ] : features;
}

function normalizeGrid() {
  for ( let x = 0; x < map.width; x++ ) {
    for ( let y = 0; y < map.height; y++ ) {
      map.grid[x][y] = normalizeHex( map.grid[x][y] );
    }
  }
}

// Game-facing view of one hex.
function hexTerrain( x, y ) {
  const t = map.grid[x][y].find( isTerrainWord );
  return t ? TERRAIN_WORDS[ t ] : 'clear';
}

function hexFeatures( x, y ) {
  return map.grid[x][y].filter( w => !isTerrainWord( w ) );
}
