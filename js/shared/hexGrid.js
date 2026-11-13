// HexGrid — hex-grid math shared by the HexWright editor and the game. Keep both copies identical.
// Version 1. No dependencies; works as a plain <script> (defines the global HexGrid) and in Node.
//
// The grid (the same for every HexWright map):
//   - Flat-topped hexes in columns. x = column, y = row, both from 0 at the top left.
//   - Even-numbered columns sit half a hex LOWER than odd ones ("even-q" layout).
//   - A hex's id is its printed hex number, "x,y".
//   - Directions are numbered clockwise from straight up: 0 N, 1 NE, 2 SE, 3 S, 4 SW, 5 NW.
//
// Every function accepts a hex as an id string ("3,4"), as {x, y}, or as any object with x and y
// (such as a hex from the game file). Functions return plain {x, y} objects.
//
// Internally, positions are converted to "cube" coordinates (q, r, s with q + r + s = 0), which make
// distance, lines and rotation simple. Callers never need them.

const HexGrid = ( () => {

  const DIRECTION_NAMES = [ 'N', 'NE', 'SE', 'S', 'SW', 'NW' ];
  const CUBE_DIRECTIONS = [ [ 0, -1, 1 ], [ 1, -1, 0 ], [ 1, 0, -1 ], [ 0, 1, -1 ], [ -1, 1, 0 ], [ -1, 0, 1 ] ];

  // Megahexes (7-hex flowers) tile the map on a lattice; these two steps, in cube coordinates, reach
  // every megahex center from any other. They match the editor's drawing of megahexes.
  const MEGA_A = [ 1, -3, 2 ], MEGA_B = [ 3, -2, -1 ];

  // --- conversions ------------------------------------------------------------------------------

  function hex( h ) {
    if ( typeof h === 'string' ) {
      const m = /^\s*(-?\d+)\s*,\s*(-?\d+)\s*$/.exec( h );
      if ( !m ) throw new Error( 'HexGrid: not a hex id: "' + h + '"' );
      return { x: +m[1], y: +m[2] };
    }
    return { x: h.x, y: h.y };
  }

  const id = h => { const { x, y } = hex( h ); return x + ',' + y; };

  function toCube( h ) {
    const { x, y } = hex( h );
    const q = x, r = y - ( x + ( x & 1 ) ) / 2;
    return [ q, r, -q - r ];
  }

  const fromCube = ( [ q, r ] ) => ( { x: q, y: r + ( q + ( q & 1 ) ) / 2 } );
  const addCube = ( a, b ) => [ a[0] + b[0], a[1] + b[1], a[2] + b[2] ];
  const cubeDistance = ( a, b ) => Math.max( Math.abs( a[0] - b[0] ), Math.abs( a[1] - b[1] ), Math.abs( a[2] - b[2] ) );

  function roundCube( [ q, r, s ] ) {
    let rq = Math.round( q ), rr = Math.round( r ), rs = Math.round( s );
    const dq = Math.abs( rq - q ), dr = Math.abs( rr - r ), ds = Math.abs( rs - s );
    if ( dq > dr && dq > ds ) rq = -rr - rs; else if ( dr > ds ) rr = -rq - rs; else rs = -rq - rr;
    return [ rq + 0, rr + 0, rs + 0 ];   // + 0 turns -0 into 0
  }

  // --- neighbors and distance -----------------------------------------------------------------

  const neighbor = ( h, direction ) => fromCube( addCube( toCube( h ), CUBE_DIRECTIONS[ ( ( direction % 6 ) + 6 ) % 6 ] ) );

  const neighbors = h => CUBE_DIRECTIONS.map( ( _, d ) => neighbor( h, d ) );

  const distance = ( a, b ) => cubeDistance( toCube( a ), toCube( b ) );

  const areAdjacent = ( a, b ) => distance( a, b ) === 1;

  // Direction (0-5) from a to b when b lies on a straight hex row from a; otherwise null.
  function directionBetween( a, b ) {
    const ca = toCube( a ), cb = toCube( b ), n = cubeDistance( ca, cb );
    if ( n === 0 ) return null;
    const step = [ ( cb[0] - ca[0] ) / n, ( cb[1] - ca[1] ) / n, ( cb[2] - ca[2] ) / n ];
    const d = CUBE_DIRECTIONS.findIndex( v => v[0] === step[0] && v[1] === step[1] && v[2] === step[2] );
    return d === -1 ? null : d;
  }

  // --- areas and lines ------------------------------------------------------------------------

  // All hexes within `radius` of center (radius 0 = just the center), nearest rings first.
  function range( center, radius ) {
    const out = [];
    for ( let k = 0; k <= radius; k++ ) out.push( ...ring( center, k ) );
    return out;
  }

  // Hexes exactly `radius` away, clockwise starting from the one straight north.
  function ring( center, radius ) {
    if ( radius === 0 ) return [ hex( center ) ];
    let c = toCube( center );
    for ( let i = 0; i < radius; i++ ) c = addCube( c, CUBE_DIRECTIONS[0] );
    const out = [];
    for ( let side = 0; side < 6; side++ ) {
      for ( let i = 0; i < radius; i++ ) {
        out.push( fromCube( c ) );
        c = addCube( c, CUBE_DIRECTIONS[ ( side + 2 ) % 6 ] );
      }
    }
    return out;
  }

  // Hexes a straight line from a to b passes through, including both ends.
  // When the line runs exactly along the edge between two hexes, `side` picks which one is used:
  // +1 or -1. (Line-of-sight rules for edge cases belong to the game; try both if it matters.)
  function line( a, b, side = 1 ) {
    const ca = toCube( a ), cb = toCube( b ), n = cubeDistance( ca, cb );
    const nudge = 1e-6 * side, out = [];
    for ( let i = 0; i <= n; i++ ) {
      const t = n === 0 ? 0 : i / n;
      out.push( fromCube( roundCube( [
        ca[0] + ( cb[0] - ca[0] ) * t + nudge, ca[1] + ( cb[1] - ca[1] ) * t + nudge, ca[2] + ( cb[2] - ca[2] ) * t - 2 * nudge
      ] ) ) );
    }
    return out;
  }

  const inBounds = ( h, width, height ) => { const { x, y } = hex( h ); return x >= 0 && y >= 0 && x < width && y < height; };

  // --- megahexes ------------------------------------------------------------------------------

  // Center of the megahex containing h, for a map whose megahexes are centered on `origin`.
  function megahexCenter( h, origin ) {
    const c = toCube( h ), o = toCube( origin );
    const dq = c[0] - o[0], dr = c[1] - o[1];
    // Solve dq,dr = i*A + j*B approximately, then check nearby lattice points.
    const det = MEGA_A[0] * MEGA_B[1] - MEGA_A[1] * MEGA_B[0];
    const i0 = Math.round( ( dq * MEGA_B[1] - dr * MEGA_B[0] ) / det ), j0 = Math.round( ( MEGA_A[0] * dr - MEGA_A[1] * dq ) / det );
    for ( let i = i0 - 1; i <= i0 + 1; i++ ) {
      for ( let j = j0 - 1; j <= j0 + 1; j++ ) {
        const center = [ o[0] + i * MEGA_A[0] + j * MEGA_B[0], o[1] + i * MEGA_A[1] + j * MEGA_B[1], o[2] + i * MEGA_A[2] + j * MEGA_B[2] ];
        if ( cubeDistance( center, c ) <= 1 ) return fromCube( center );
      }
    }
    throw new Error( 'HexGrid: no megahex found (should not happen)' );
  }

  // The 7 hexes of the megahex centered on `center`: the center first, then N, NE, SE, S, SW, NW.
  const megahexMembers = center => [ hex( center ), ...neighbors( center ) ];

  // Distance in megahexes between the megahexes containing a and b (0 = same megahex). Used for
  // missile range. The megahex lattice is itself a hex grid whose six steps are ±A, ±B and ±(B−A).
  function megahexDistance( a, b, origin ) {
    const ca = toCube( megahexCenter( a, origin ) ), cb = toCube( megahexCenter( b, origin ) );
    const dq = cb[0] - ca[0], dr = cb[1] - ca[1];
    const det = MEGA_A[0] * MEGA_B[1] - MEGA_A[1] * MEGA_B[0];
    const i = Math.round( ( dq * MEGA_B[1] - dr * MEGA_B[0] ) / det ), j = Math.round( ( MEGA_A[0] * dr - MEGA_A[1] * dq ) / det );
    return Math.max( Math.abs( i ), Math.abs( j ), Math.abs( i + j ) );
  }

  return {
    VERSION: 1, DIRECTION_NAMES,
    hex, id, neighbor, neighbors, distance, areAdjacent, directionBetween,
    range, ring, line, inBounds, megahexCenter, megahexMembers, megahexDistance,
    toCube, fromCube   // exposed for tests and special cases
  };
} )();

if ( typeof module !== 'undefined' && module.exports ) module.exports = HexGrid;
