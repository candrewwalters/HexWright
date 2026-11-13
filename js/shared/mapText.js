// MapText — reads HexWright's map text (the text in the editor's text box) into a plain object.
// Shared by the HexWright editor and the game. Keep both copies identical (edit in the editor repo,
// then run scripts/sync-shared.sh). No dependencies on either app; works as a plain <script>
// (defines the global MapText) and in Node.
//
// It follows the same grammar as the editor's own reader (js/io/mapText.js), which the editor still
// uses for now:
//   Name: …            Description: …          Width: 15        Height: 9
//   Palette: Melee     (or custom colors: Clear: #EEECF2, Walls: …)
//   Megahex centers on: 2,2
//   Walls: 3,4 3,5     Offboard: …   Pits: …   Water: …   Fire: …   Stars: …   (one keyword, many hexes)
//   5,6 fire chest     (one hex, many words)
//   stone bridge from 6,4 to 8,3
//
// Result:
//   { name, description, width, height, palette: { name, offboard, clear, lines, walls, water, paths, columns, lava },
//     megahexOrigin: {x, y} | null, bridges: [ { material, from, to, hexes } ],
//     hexes: { "x,y": { terrain: 'clear'|'offboard'|'wall'|'pit'|'water', features: [ … ] } } }   (every hex)

const MapText = ( () => {

  const PALETTES = {
    'melee':           { offboard: '#FFFFFF', clear: '#EEECF2', lines: '#4C3270', walls: '#4C3270', water: '#483D8B', paths: '#BBB9F2', columns: '#4C3270', lava: '#aa0011' },
    'wizard':          { offboard: '#FFFFFF', clear: '#F2F1F7', lines: '#42599D', walls: '#42599D', water: '#483D8B', paths: '#E3E2F0', columns: '#42599D', lava: '#aa0011' },
    'cavern':          { offboard: '#666666', clear: '#999999', lines: '#444444', walls: '#333333', water: '#5E7A87', paths: '#BBBBBB', columns: '#006400', lava: '#f27602' },
    'burrow':          { offboard: '#3E2A1F', clear: '#5B3E2B', lines: '#2D1C12', walls: '#4A3223', water: '#3D5A58', paths: '#8B6F4E', columns: '#FFFFE0', lava: '#ec3b13' },
    'wild land':       { offboard: '#B7B7A4', clear: '#A9D18E', lines: '#4E7433', walls: '#6B4F3B', water: '#3A7CA5', paths: '#C2A97F', columns: '#B8860B', lava: '#fab1a0' },
    'desert':          { offboard: '#D9C8A9', clear: '#F4E2B6', lines: '#8B6B3F', walls: '#A67B5B', water: '#2E8C8C', paths: '#C29B6F', columns: '#4A3C3D', lava: '#fab1a0' },
    'frozen':          { offboard: '#5DADE2', clear: '#E8F4F8', lines: '#2C3E50', walls: '#34495E', water: '#1B4F72', paths: '#AEB6BF', columns: '#566573', lava: '#E74C3C' },
    'volcano':         { offboard: '#1C1C1C', clear: '#2F1B14', lines: '#8B4513', walls: '#654321', water: '#ff6b6b', paths: '#CD853F', columns: '#A0522D', lava: '#FF4500' },
    'woods':           { offboard: '#228B22', clear: '#8FBC8F', lines: '#2D5016', walls: '#8B4513', water: '#4682B4', paths: '#D2B48C', columns: '#654321', lava: '#FFD700' },
    'swamp':           { offboard: '#1C3A1C', clear: '#556B2F', lines: '#2F4F2F', walls: '#8B7355', water: '#2F4F4F', paths: '#6B8E23', columns: '#5D4E37', lava: '#ADFF2F' },
    'black and white': { offboard: '#000000', clear: '#ffffff', lines: '#000000', walls: '#000000', water: '#999999', paths: '#bbbbbb', columns: '#000000', lava: '#444444' },
    'ethereal plane':  { offboard: '#9370DB', clear: '#F0F8FF', lines: '#E6E6FA', walls: '#DDA0DD', water: '#B0C4DE', paths: '#E0E0E0', columns: '#D8BFD8', lava: '#FFE4E1' }
  };
  const DEFAULT_COLORS = { offboard: '#B7B7A4', clear: '#A9D18E', lines: '#4E7433', walls: '#6B4F3B', water: '#3A7CA5', paths: '#C2A97F', columns: '#B8860B', lava: '#000000' };

  // Keyword lines: the first matching pattern wins, and every "x,y" on the line gets that word.
  const KEYWORDS = [
    [ /^(?:offboard|off\s*board)\s*[:= -]?/i, 'offboard' ],
    [ /^walls?\s*[:= -]?/i, 'wall' ],
    [ /^(?:pits?|holes?)\s*[:= -]?/i, 'pit' ],
    [ /^(?:water|pool|pond|stream|river)\s*[:= -]?/i, 'water' ],
    [ /^(?:column|tree)\s*[:= -]?/i, 'column' ],
    [ /^(?:trapdoor|trap\s*door)\s*[:= -]?/i, 'trapdoor' ],
    [ /^debris\s*[:= -]?/i, 'debris' ],
    [ /^dark\s*[:= -]?/i, 'darker' ],
    [ /^light\s*[:= -]?/i, 'lighter' ],
    [ /^star\s*[:= -]?/i, 'star' ],
    [ /^slippery\s*[:= -]?/i, 'slippery' ],
    [ /^sticky\s*[:= -]?/i, 'sticky' ],
    [ /^tar\s*[:= -]?/i, 'tar' ],
    [ /^(?:body|bodies)\s*[:= -]?/i, 'body' ],
    [ /^table\s*[:= -]?/i, 'table' ],
    [ /^barricade\s*[:= -]?/i, 'barricade' ],
    [ /^altar\s*[:= -]?/i, 'altar' ],
    [ /^pentacle\s*[:= -]?/i, 'pentacle' ],
    [ /^(?:shadows?|darkness)\s*[:= -]?/i, 'shadow' ],
    [ /^(?:fires?|flames?)\s*[:= -]?/i, 'fire' ],
    [ /^(?:paths?|roads?|trails?|walkways?)\s*[:= -]?/i, 'path' ],
    [ /^(?:lavas?|acids?)\s*[:= -]?/i, 'lava' ],
    [ /^(?:rock?|stone?)(?!\s*bridge)\b\s*[:= -]?/i, 'stone' ]
  ];

  // Same aliases and terrain words as the editor's core/hexContents.js.
  const TERRAINS = [ 'offboard', 'wall', 'pit', 'water' ];   // strongest first
  const ALIASES = {
    'wall hex': 'wall', 'walls': 'wall', 'wallhex': 'wall',
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
  const canonical = w => { w = String( w ).trim().toLowerCase(); return ALIASES[ w ] || w; };

  const colorFrom = ( lines, re, fallback ) => {
    const m = lines.find( l => re.test( l ) )?.match( /#?[0-9a-fA-F]{6}\b/ );
    return m ? ( m[0].startsWith( '#' ) ? m[0] : '#' + m[0] ) : fallback;
  };

  function parse( text ) {
    const lines = String( text ).split( '\n' ).map( l => l.trim() ).filter( l => l !== '' );
    const field = re => lines.find( l => re.test( l ) )?.replace( re, '' ).trim();
    const number = ( re, fallback ) => {
      const m = lines.find( l => re.test( l ) )?.match( /\b([1-9][0-9]{0,2}|1000)\b/ );
      return m ? parseInt( m[1], 10 ) : fallback;
    };

    const map = {
      name: field( /^name\s*[:= -]?\s*/i ) || 'Nameless Map',
      description: field( /^description\s*[:= -]?\s*/i ) || '',
      width: number( /^w(?:idth|ide)\b/i, 12 ),
      height: number( /^height\b/i, 9 ),
      palette: null, megahexOrigin: null, bridges: [], hexes: {}
    };

    // Palette: a named one, or custom colors.
    const named = lines.map( l => l.match( /^palettes?\s*[:=-]?\s*((?:melee|wild\s*land|wizard|cavern|swamp|volcano|woods?|frozen|burrow|desert|black\s*and\s*white|ethereal\s*plane)s?)\s*$/i ) ).find( Boolean );
    if ( named ) {
      let word = named[1].toLowerCase().replace( /\s+/g, ' ' );
      if ( word.endsWith( 's' ) && word !== 'melee' && word !== 'woods' ) word = word.slice( 0, -1 );
      if ( word === 'wood' ) word = 'woods';
      map.palette = { name: word, ...( PALETTES[ word ] || DEFAULT_COLORS ) };
    } else {
      map.palette = {
        name: null,
        paths: colorFrom( lines, /^paths?\b/i, DEFAULT_COLORS.paths ),
        clear: colorFrom( lines, /^clear?\b/i, DEFAULT_COLORS.clear ),
        columns: colorFrom( lines, /^columns?\b/i, DEFAULT_COLORS.columns ),
        lines: colorFrom( lines, /^lines?\b/i, DEFAULT_COLORS.lines ),
        offboard: colorFrom( lines, /^offboard?\b/i, DEFAULT_COLORS.offboard ),
        walls: colorFrom( lines, /^walls?\b/i, DEFAULT_COLORS.walls ),
        water: colorFrom( lines, /^water?\b/i, DEFAULT_COLORS.water ),
        lava: colorFrom( lines, /^lava\b/i, DEFAULT_COLORS.lava )
      };
    }

    const words = {};
    const add = ( x, y, w ) => {
      if ( x < 0 || y < 0 || x >= map.width || y >= map.height ) return;
      ( words[ x + ',' + y ] = words[ x + ',' + y ] || [] ).push( w );
    };

    for ( const line of lines ) {
      for ( const [ re, word ] of KEYWORDS ) {
        if ( re.test( line ) ) {
          for ( const [ , x, y ] of line.matchAll( /\b(\d{1,3})\s*,\s*(\d{1,3})\b/g ) ) add( +x, +y, word );
          break;
        }
      }
      const one = line.match( /^(\d{1,3})\s*,\s*(\d{1,3})\s+(.+)/ );
      if ( one ) for ( const w of one[3].replace( /wall\s+hex/gi, 'wall' ).split( /\s+/ ) ) add( +one[1], +one[2], w );
    }

    // Bridges: "stone bridge from 6,4 to 8,3". The hexes strictly between the ends are bridge hexes.
    for ( const line of lines ) {
      const low = line.toLowerCase();
      if ( !low.includes( 'bridge' ) ) continue;
      const nums = low.replace( /[a-z:]/g, ' ' ).replace( /-/g, ' ' ).match( /\d+/g );
      if ( !nums || nums.length !== 4 ) continue;
      let material = /wood|timber/.test( low ) ? 'wood' : /stone|rock|granite|marble/.test( low ) ? 'stone' : null;
      if ( !material ) material = [ 'burrow', 'wild land', 'woods', 'frozen', 'swamp' ].includes( map.palette.name ) ? 'wood' : 'stone';
      const from = { x: +nums[0], y: +nums[1] }, to = { x: +nums[2], y: +nums[3] };
      map.bridges.push( { material, from, to, hexes: bridgeHexes( from, to ) } );
    }
    for ( const b of map.bridges ) for ( const h of b.hexes ) add( h.x, h.y, 'bridge' );

    // Megahex origin: the first "x,y" on a line mentioning megahexes.
    for ( const line of lines ) {
      if ( /mega\s?hexe?s?/i.test( line ) ) {
        const m = line.match( /(-?\d+)\s*,\s*(-?\d+)/ );
        if ( m ) { map.megahexOrigin = { x: +m[1], y: +m[2] }; break; }
      }
    }

    // Every hex: one terrain (strongest wins) and a sorted list of features.
    for ( let x = 0; x < map.width; x++ ) {
      for ( let y = 0; y < map.height; y++ ) {
        let terrain = 'clear';
        const features = new Set();
        for ( const raw of words[ x + ',' + y ] || [] ) {
          const w = canonical( raw );
          if ( !w || w === 'clear' ) continue;
          if ( TERRAINS.includes( w ) ) {
            if ( terrain === 'clear' || TERRAINS.indexOf( w ) < TERRAINS.indexOf( terrain ) ) terrain = w;
          } else {
            features.add( w );
          }
        }
        map.hexes[ x + ',' + y ] = { terrain, features: [ ...features ].sort() };
      }
    }
    return map;
  }

  // Hexes strictly between two hexes on a straight hex row (empty if they aren't on one).
  function bridgeHexes( from, to ) {
    const cube = h => { const q = h.x, r = h.y - ( h.x + ( h.x & 1 ) ) / 2; return [ q, r, -q - r ]; };
    const fromCube = ( [ q, r ] ) => ( { x: q, y: r + ( q + ( q & 1 ) ) / 2 } );
    const a = cube( from ), b = cube( to );
    const n = Math.max( Math.abs( a[0] - b[0] ), Math.abs( a[1] - b[1] ), Math.abs( a[2] - b[2] ) );
    if ( n < 2 ) return [];
    const step = [ ( b[0] - a[0] ) / n, ( b[1] - a[1] ) / n, ( b[2] - a[2] ) / n ];
    if ( !step.every( Number.isInteger ) ) return [];
    const out = [];
    for ( let i = 1; i < n; i++ ) out.push( fromCube( [ a[0] + step[0] * i, a[1] + step[1] * i ] ) );
    return out;
  }

  return { VERSION: 1, parse, PALETTES };
} )();

if ( typeof module !== 'undefined' && module.exports ) module.exports = MapText;
