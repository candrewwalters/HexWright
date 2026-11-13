// Run with:  node --test "tests/**/*.test.js"
const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const MapText = require( '../../js/shared/mapText.js' );
const H = require( '../../js/shared/hexGrid.js' );

const MELEE = `Name: Melee Arena, cluttered
Description: The Melee arena with one of every kind of terrain.
Height: 9
Width: 15
Palette: Melee
Megahex centers on: 2,2
Offboard: 0,0 0,1 0,2 0,3 0,8 1,0 1,1 2,0 2,8 3,0 3,1 4,0 4,8 5,0 5,8 6,0 6,8
Offboard: 7,0 7,8 8,7 8,8 9,0 9,8 10,7 10,8 11,7 11,8 12,7 12,8 13,7 13,8 14,4
Offboard: 14,5 14,6 14,7 14,8
Walls: 5,2
Water: 7,2 7,3 7,4 7,5 7,6
Column: 9,5
Fire: 11,2
Pits: 3,3
Stars: 0,6 0,7 1,7 1,8 13,0 13,1 14,0 14,1
4,4 wall hex fire
stone bridge from 6,4 to 8,3
`;

test( 'header fields, palette and megahexes', () => {
  const m = MapText.parse( MELEE );
  assert.equal( m.name, 'Melee Arena, cluttered' );
  assert.equal( m.width, 15 );
  assert.equal( m.height, 9 );
  assert.equal( m.palette.name, 'melee' );
  assert.equal( m.palette.clear, '#EEECF2' );
  assert.deepEqual( m.megahexOrigin, { x: 2, y: 2 } );
  assert.equal( Object.keys( m.hexes ).length, 15 * 9 );
} );

test( 'terrain and features, with keyword lines and single-hex lines', () => {
  const m = MapText.parse( MELEE );
  assert.equal( m.hexes['0,0'].terrain, 'offboard' );
  assert.equal( m.hexes['14,8'].terrain, 'offboard' );
  assert.equal( m.hexes['5,2'].terrain, 'wall' );
  assert.equal( m.hexes['3,3'].terrain, 'pit' );
  assert.deepEqual( m.hexes['0,6'].features, [ 'star' ] );
  assert.deepEqual( m.hexes['9,5'].features, [ 'column' ] );
  assert.equal( m.hexes['4,4'].terrain, 'wall' );
  assert.deepEqual( m.hexes['4,4'].features, [ 'fire' ] );
  assert.equal( m.hexes['6,6'].terrain, 'clear' );
  const offboard = Object.values( m.hexes ).filter( h => h.terrain === 'offboard' ).length;
  assert.equal( 15 * 9 - offboard, 99 );   // the Melee arena has 99 hexes
} );

test( 'bridges mark the hexes between their ends', () => {
  const m = MapText.parse( MELEE );
  assert.equal( m.bridges.length, 1 );
  assert.equal( m.bridges[0].material, 'stone' );
  assert.deepEqual( m.bridges[0].hexes, [ { x: 7, y: 4 } ] );
  assert.equal( m.hexes['7,4'].terrain, 'water' );
  assert.deepEqual( m.hexes['7,4'].features, [ 'bridge' ] );
} );

test( 'custom colors and defaults', () => {
  const m = MapText.parse( 'Width: 3\nHeight: 2\nClear: #112233\nwalls 0,0' );
  assert.equal( m.palette.name, null );
  assert.equal( m.palette.clear, '#112233' );
  assert.equal( m.hexes['0,0'].terrain, 'wall' );
  assert.equal( m.megahexOrigin, null );
  assert.equal( MapText.parse( '' ).name, 'Nameless Map' );
} );

test( 'megahex distance: same megahex 0, neighbors 1, and symmetric', () => {
  const o = { x: 2, y: 2 };
  assert.equal( H.megahexDistance( '2,2', '2,3', o ), 0 );
  assert.equal( H.megahexDistance( '2,2', '5,2', o ), 1 );
  assert.equal( H.megahexDistance( '2,2', '1,5', o ), 1 );
  assert.equal( H.megahexDistance( '2,2', '8,1', o ), 2 );
  for ( const [ a, b ] of [ [ '0,6', '14,1' ], [ '3,7', '11,1' ], [ '1,5', '12,5' ] ] ) {
    assert.equal( H.megahexDistance( a, b, o ), H.megahexDistance( b, a, o ) );
    // roughly a third of the hex distance
    const d = H.distance( a, b ), m = H.megahexDistance( a, b, o );
    assert.ok( m >= Math.floor( d / 3 ) - 1 && m <= Math.ceil( d / 3 ) + 1, `${a}→${b}: ${d} hexes, ${m} megahexes` );
  }
} );
