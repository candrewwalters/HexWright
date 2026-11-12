// HexWright — Game file (JSON) export and import.
// (Classic script: shares the global scope with the other js/ files.)
//
// The game file is for programs; the text in the text box is for people. Both describe the same map.
// Export reads the current map object. Import builds a map object, writes it out as text, and then
// re-reads that text through the normal path, so an imported map behaves exactly like a typed one.
//
// Format (version 1):
// {
//   "format": "hexwright-map", "version": 1,
//   "name": "...", "description": "...", "width": 12, "height": 9,
//   "coordinates": "...explanation...",
//   "hexes": [ { "id": "3,4", "x": 3, "y": 4, "terrain": "pit", "features": ["fire"] }, ... ]   every hex
//   "bridges": [ { "material": "stone", "from": { "x": 1, "y": 2 }, "to": { "x": 4, "y": 2 } } ],
//   "megahexOrigin": { "x": 1, "y": 1 } or null,
//   "display": { "palette": "cavern" or { color fields }, "lineStyle": "normal", "showDots": true,
//                "showHexNumbers": true, "texture": false, "graphic": null }
// }
// terrain is one of: clear, offboard, wall, pit, water. Features are free words ("fire", "chest", ...).
// "bridge" appears in the features of every hex a bridge covers; it is derived from "bridges".

const GAME_FORMAT = 'hexwright-map';
const GAME_FORMAT_VERSION = 1;
const COORDINATE_NOTE = 'x = column, y = row, both from 0 at the top left. Odd-numbered columns sit half a hex ' +
  'higher than even-numbered ones. id is the hex number printed on the map ("x,y").';
const PALETTE_COLOR_FIELDS = [ 'offboard', 'clear', 'lines', 'walls', 'water', 'paths', 'columns', 'lava' ];

function mapToGameObject() {
  const hexes = [];
  for ( let x = 0; x < map.width; x++ ) {
    for ( let y = 0; y < map.height; y++ ) {
      hexes.push( { id: x + ',' + y, x, y, terrain: hexTerrain( x, y ), features: hexFeatures( x, y ) } );
    }
  }

  const bridge = ( b, material ) => ( { material, from: { x: b.startingX, y: b.startingY }, to: { x: b.endingX, y: b.endingY } } );

  let palette;
  if ( map.palette.name ) {
    palette = map.palette.name;
  } else {
    palette = {};
    PALETTE_COLOR_FIELDS.forEach( f => palette[f] = map.palette[f] );
  }

  return {
    format: GAME_FORMAT,
    version: GAME_FORMAT_VERSION,
    name: map.name,
    description: map.description,
    width: map.width,
    height: map.height,
    coordinates: COORDINATE_NOTE,
    hexes,
    bridges: [ ...map.stoneBridges.map( b => bridge( b, 'stone' ) ), ...map.woodBridges.map( b => bridge( b, 'wood' ) ) ],
    megahexOrigin: megaHexOrigin ? { x: megaHexOrigin[0], y: megaHexOrigin[1] } : null,
    display: {
      palette,
      lineStyle: map.lineStyle,
      showDots: map.showDots !== 'no',
      showHexNumbers: map.showHexNumbers !== 'no',
      texture: map.texture === 'yes',
      graphic: map.graphic || null
    }
  };
}

// Pretty-printed, but one hex per line so a large map stays readable.
function mapToGameJsonText() {
  const game = mapToGameObject();
  const hexLines = game.hexes.map( h => '    ' + JSON.stringify( h ) ).join( ',\n' );
  return JSON.stringify( { ...game, hexes: '__HEXES__' }, null, 2 ).replace( '"__HEXES__"', '[\n' + hexLines + '\n  ]' ) + '\n';
}

function isGameJsonText( text ) {
  try {
    return JSON.parse( text ).format === GAME_FORMAT;
  } catch ( e ) {
    return false;
  }
}

function importGameJson( text ) {
  const game = JSON.parse( text );

  if ( game.version > GAME_FORMAT_VERSION ) {
    console.warn( 'HexWright: game file version ' + game.version + ' is newer than this editor understands (' +
      GAME_FORMAT_VERSION + '). Importing what it can.' );
  }

  const size = v => Math.max( 1, Math.min( 1000, parseInt( v, 10 ) || 1 ) );
  const display = game.display || {};

  map = {
    name: game.name || 'Nameless Map',
    description: String( game.description || '' ).replace( /\s*\n\s*/g, ' ' ),   // text format is one line
    width: size( game.width ),
    height: size( game.height ),
    graphic: display.graphic || undefined,
    lineStyle: display.lineStyle || 'normal',
    showDots: display.showDots === false ? 'no' : 'yes',
    showHexNumbers: display.showHexNumbers === false ? 'no' : 'yes',
    texture: display.texture ? 'yes' : 'no',
    palette: typeof display.palette === 'string' ? { name: display.palette } : { ...( display.palette || {} ) },
    stoneBridges: [],
    woodBridges: [],
    megaHexCenters: []
  };
  map.grid = Array.from( { length: map.width }, () => Array.from( { length: map.height }, () => [] ) );

  for ( const hex of game.hexes || [] ) {
    if ( !inBounds( hex.x, hex.y ) ) continue;
    const words = [];
    if ( hex.terrain && hex.terrain !== 'clear' ) {
      if ( Object.prototype.hasOwnProperty.call( TERRAIN_FROM_NAME, hex.terrain ) ) {
        words.push( TERRAIN_FROM_NAME[ hex.terrain ] );
      } else {
        console.warn( 'HexWright: unknown terrain "' + hex.terrain + '" in hex ' + hex.x + ',' + hex.y + '; using clear.' );
      }
    }
    for ( const f of hex.features || [] ) {
      if ( !DERIVED_WORDS.includes( f ) ) words.push( f );
    }
    map.grid[hex.x][hex.y] = words;
  }

  for ( const b of game.bridges || [] ) {
    const entry = { startingX: b.from.x, startingY: b.from.y, endingX: b.to.x, endingY: b.to.y };
    ( b.material === 'wood' ? map.woodBridges : map.stoneBridges ).push( entry );
  }

  if ( game.megahexOrigin ) {
    map.megaHexCenters = [ { x: game.megahexOrigin.x, y: game.megahexOrigin.y } ];
  }

  // Write the readable text, then read it back the normal way (loads the palette, fills bridges, etc.).
  convertObjectToText();
  convertTextToObject();
}
