// Run with:  node --test "tests/**/*.test.js"
const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const H = require( '../../js/shared/hexGrid.js' );

// The editor's original neighbor rules (hexAdjacent before it used HexGrid), kept as the reference.
function referenceAdjacent( x, y, f ) {
  f = ( ( f % 6 ) + 6 ) % 6;
  const odd = [ [ 0, -1 ], [ 1, -1 ], [ 1, 0 ], [ 0, 1 ], [ -1, 0 ], [ -1, -1 ] ];
  const even = [ [ 0, -1 ], [ 1, 0 ], [ 1, 1 ], [ 0, 1 ], [ -1, 1 ], [ -1, 0 ] ];
  const [ dx, dy ] = ( x % 2 ? odd : even )[ f ];
  return { x: x + dx, y: y + dy };
}

const grid = ( w = 20, h = 20 ) => { const out = []; for ( let x = 0; x < w; x++ ) for ( let y = 0; y < h; y++ ) out.push( { x, y } ); return out; };

test( 'ids parse and print, from strings or objects', () => {
  assert.deepEqual( H.hex( '3,4' ), { x: 3, y: 4 } );
  assert.deepEqual( H.hex( ' 12 , 0 ' ), { x: 12, y: 0 } );
  assert.deepEqual( H.hex( { id: '3,4', x: 3, y: 4, terrain: 'pit' } ), { x: 3, y: 4 } );
  assert.equal( H.id( { x: 7, y: 2 } ), '7,2' );
  assert.throws( () => H.hex( 'nonsense' ) );
} );

test( 'cube conversion round-trips, including negative columns', () => {
  for ( let x = -5; x < 15; x++ ) for ( let y = -5; y < 15; y++ ) assert.deepEqual( H.fromCube( H.toCube( { x, y } ) ), { x, y } );
} );

test( 'neighbors match the editor\'s original rules in every direction', () => {
  for ( const h of grid() ) for ( let d = 0; d < 6; d++ ) assert.deepEqual( H.neighbor( h, d ), referenceAdjacent( h.x, h.y, d ), `${h.x},${h.y} dir ${d}` );
} );

test( 'going one way and back returns to the start; neighbors are distance 1', () => {
  for ( const h of grid() ) for ( let d = 0; d < 6; d++ ) {
    const n = H.neighbor( h, d );
    assert.deepEqual( H.neighbor( n, d + 3 ), h );
    assert.equal( H.distance( h, n ), 1 );
    assert.ok( H.areAdjacent( h, n ) );
  }
} );

test( 'distance: symmetric, zero only for the same hex, and equal to the number of steps on a line', () => {
  const g = grid( 12, 12 );
  for ( const a of g ) for ( const b of g ) {
    const d = H.distance( a, b );
    assert.equal( d, H.distance( b, a ) );
    assert.equal( d === 0, a.x === b.x && a.y === b.y );
    assert.equal( H.line( a, b ).length, d + 1 );
  }
  assert.equal( H.distance( '0,0', '0,5' ), 5 );    // straight down a column
  assert.equal( H.distance( '0,0', '6,0' ), 6 );    // zig-zag across a row
} );

test( 'lines start and end correctly and every step is to a neighbor (both edge-case sides)', () => {
  const g = grid( 10, 10 );
  for ( const side of [ 1, -1 ] ) for ( const a of g ) for ( const b of g ) {
    const l = H.line( a, b, side );
    assert.deepEqual( l[0], a ); assert.deepEqual( l[ l.length - 1 ], b );
    for ( let i = 1; i < l.length; i++ ) assert.ok( H.areAdjacent( l[ i - 1 ], l[i] ) );
  }
} );

test( 'directionBetween finds straight rows only', () => {
  for ( const h of grid( 8, 8 ) ) for ( let d = 0; d < 6; d++ ) {
    let p = h; for ( let k = 0; k < 3; k++ ) p = H.neighbor( p, d );
    assert.equal( H.directionBetween( h, p ), d );
  }
  assert.equal( H.directionBetween( '0,0', '0,0' ), null );
  assert.equal( H.directionBetween( '0,0', '3,4' ), null );
} );

test( 'ring and range sizes, distances and order', () => {
  for ( let r = 0; r <= 4; r++ ) {
    const ring = H.ring( '10,10', r );
    assert.equal( ring.length, r === 0 ? 1 : 6 * r );
    for ( const h of ring ) assert.equal( H.distance( h, '10,10' ), r );
    assert.equal( new Set( ring.map( H.id ) ).size, ring.length );
    assert.equal( H.range( '10,10', r ).length, 1 + 3 * r * ( r + 1 ) );
  }
  assert.deepEqual( H.ring( '10,10', 1 ), H.neighbors( '10,10' ) );   // clockwise from north
} );

test( 'megahexes: every hex is in exactly one, and members are the center and its neighbors', () => {
  for ( const origin of [ '0,0', '1,1', '4,3', '5,2' ] ) {
    const count = new Map();
    for ( const h of grid( 16, 16 ) ) {
      const c = H.megahexCenter( h, origin );
      assert.ok( H.distance( h, c ) <= 1 );
      assert.ok( H.megahexMembers( c ).some( m => m.x === h.x && m.y === h.y ) );
      count.set( H.id( c ), ( count.get( H.id( c ) ) || 0 ) + 1 );
    }
    assert.deepEqual( H.megahexCenter( origin, origin ), H.hex( origin ) );
    // centers fully inside the 16x16 area own exactly 7 hexes
    for ( const [ c, n ] of count ) if ( H.megahexMembers( c ).every( m => H.inBounds( m, 16, 16 ) ) ) assert.equal( n, 7, c );
  }
} );
