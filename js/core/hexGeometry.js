// HexWright — Hex grid geometry: centers, vertices, adjacency, point-to-hex hit testing.
// (Classic script: shares the global scope with the other js/ files.)

function getMegaHexCenters( x, y ) {

  map.megaHexCenters = [{x:x,y:y}];

  // second, push centers above (and right of) given hex until we're out of bounds...
  // we are collecing starting points for rows

  let nextX = x+1;
  let nextY = y - 2 - ( x % 2 );

  while ( nextX < map.width + 3 || nextY > -3 ) {
    map.megaHexCenters.push({x:nextX,y:nextY});
    nextY = nextY - 2 - ( (nextX) % 2 );
    nextX = nextX+1;
  }

  // third we collect the starting points for rows below the start...

  nextX = x-1;
  nextY = y + 2 + ( Math.abs(x+1) % 2 );

  while ( nextX > -3 || nextY < map.height + 3 ) {
    map.megaHexCenters.push({x:nextX,y:nextY});
    nextX = nextX-1;
    nextY = nextY + 2 + Math.abs( ( nextX  ) % 2 );
  }

   rowLimit = map.megaHexCenters.length;

  // now we have one center for each row, we just the centers left and right of each...

  for ( let i = 0; i < rowLimit; i++ ) {

    nextX = map.megaHexCenters[i].x - 3;
    nextY = map.megaHexCenters[i].y + Math.abs( nextX%2 );

    while ( nextX > -3 || nextY < map.height + 3 ) {

      map.megaHexCenters.push({x:nextX,y:nextY});

      nextX -= 3;
      nextY += Math.abs(nextX%2);

    }

  }


  for ( let i = 0; i < rowLimit; i++ ) {

    nextX = map.megaHexCenters[i].x + 3;
    nextY = map.megaHexCenters[i].y - Math.abs( (nextX+1)%2 );

    while ( nextX < map.width + 3 && nextY > -3 ) {

      map.megaHexCenters.push({x:nextX,y:nextY});

      nextX += 3;
      nextY -= Math.abs((nextX+1)%2);

    }

  }


}


    function centerOf( x, y ) {

        if ( x%2 == 0 ) {

          centerX =  3 * ( x / 2 ) * hexSide  + hexSide * 3 / 2;
            centerY = (y+1) * hexHeight + hexHeight / 2;

        } else {

          centerX =  3 * ( x / 2 ) * hexSide  + hexSide * 3 / 2;
            centerY = y * hexHeight + hexHeight;

        }

        return { x: centerX, y: centerY };
    }


    function getHexFromCanvasPoint(canvasX, canvasY) {
        // Step 1: Reverse the coordinate transformation to get approximate grid position

        // Reverse the X calculation: x = 2 * ((centerX - hexSide * 3/2) / (3 * hexSide))
        let approxX = Math.round(2 * (canvasX - hexSide * 3/2) / (3 * hexSide));

        // Reverse the Y calculation (depends on whether column is even or odd)
        let approxY;
        if (approxX % 2 == 0) {
            // Even column: centerY = (y+1) * hexHeight + hexHeight / 2
            // So: y = (centerY - hexHeight / 2) / hexHeight - 1
            approxY = Math.round((canvasY - hexHeight / 2) / hexHeight - 1);
        } else {
            // Odd column: centerY = y * hexHeight + hexHeight
            // So: y = (centerY - hexHeight) / hexHeight
            approxY = Math.round((canvasY - hexHeight) / hexHeight);
        }

        // Step 2: Check the 9 surrounding hexes (3x3 grid centered on our approximation)
        let candidates = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                let testX = approxX + dx;
                let testY = approxY + dy;

                // Only add valid hexes (you might have bounds checking)
                if (inBounds(testX, testY)) {  // Replace with your bounds check
                    candidates.push({x: testX, y: testY});
                }
            }
        }

        // Step 3: Find the closest hex among candidates
        let closestHex = null;
        let minDistance = Infinity;

        for (let candidate of candidates) {
            let center = centerOf(candidate.x, candidate.y);
            let distance = Math.sqrt(
                (canvasX - center.x) ** 2 +
                (canvasY - center.y) ** 2
            );

            if (distance < minDistance) {
                minDistance = distance;
                closestHex = candidate;
            }
        }

        return closestHex;
    }


//     function hexGridOf(canvasX, canvasY) {
//         // Calculate the column (x) first
//         const x = Math.floor((canvasX - hexSide * 3 / 2) / (3 * hexSide / 2));
//
//         let y;
//         if (x % 2 == 0) {
//             // Even columns
//             y = Math.floor((canvasY - hexHeight / 2) / hexHeight) - 1;
//         } else {
//             // Odd columns
//             y = Math.floor((canvasY - hexHeight) / hexHeight);
//         }
//
//         return { x: x, y: y };
//     }
//
//     function hexGridOf2( canvasX, canvasY ) {
//
// //      x = Math.floor( ( 2 * canvasX / 3 * hexSide ) - 1 );
//       x = Math.floor( (canvasX / hexSide - 1.5) / 3 );
//
//       y=-1;
//
//       return { x: x, y: y };
//
//     }


function inBounds( x, y ) {

  if ( x < 0 || y < 0 ) return false;
  if ( x >= map.width || y >= map.height ) return false;

  return true;

}

function hexVertex( x, y, v ) {

  let center = centerOf( x, y );

  v = Math.abs( v ) % 6;

  switch (v) {

    case 0:
      return { x: center.x - hexSide / 2,
        y: center.y - hexHeight / 2 };
      break;

    case 1:
      return { x: center.x + hexSide / 2,
        y: center.y - hexHeight / 2 };
      break;

    case 2:
      return { x: center.x + hexSide,
        y: center.y };
      break;

    case 3:
      return { x: center.x + hexSide / 2,
      y: center.y + hexHeight / 2 };
      break;

    case 4:
      return { x: center.x - hexSide / 2,
      y: center.y + hexHeight / 2 };
      break;

    case 5:
      return { x: center.x - hexSide,
      y: center.y };
      break;

  }

}

// function drawOffboard() {
//
//   for ( let dir = 0; dir < 6; dir++ ) {
//
//     adjHex = hexAdjacent( xI, yI, dir );
//     if ( !inBounds( adjHex.x, adjHex.y ) ) continue;
//     if ( map.grid[adjHex.x][adjHex.y].includes('offboard') ) continue;
//
//     console.log(xI, yI,dir)
//
//     drawHexSide( xI, yI, dir );
//
//   }
//
// }


// function drawHexSide(x, y, sideIndex ) {
//     // Get the two vertices of the side
//     canvasCenter = centerOf( x, y );
//     const vertex1 = hexVertex(x, y, sideIndex);  // Fixed: use x, y instead of canvasCenter
//     const vertex2 = hexVertex(x, y, (sideIndex + 1) % 6);  // Fixed: use x, y instead of canvasCenter
//
//     // Calculate the inward offset distance
//     const inwardOffset = 3;
//
//     // Calculate the vector from center to midpoint of the side
//     const midX = (vertex1.x + vertex2.x) / 2;
//     const midY = (vertex1.y + vertex2.y) / 2;
//     const centerToMidX = midX - canvasCenter.x;
//     const centerToMidY = midY - canvasCenter.y;
//
//     // Normalize this vector
//     const length = Math.sqrt(centerToMidX * centerToMidX + centerToMidY * centerToMidY);
//     const normalX = centerToMidX / length;
//     const normalY = centerToMidY / length;
//
//     // Move both vertices inward by the offset amount
//     const insetVertex1 = {
//         x: vertex1.x - normalX * inwardOffset,
//         y: vertex1.y - normalY * inwardOffset
//     };
//     const insetVertex2 = {
//         x: vertex2.x - normalX * inwardOffset,
//         y: vertex2.y - normalY * inwardOffset
//     };
//
//     // Calculate extension to close gaps
//     const extension = 0;
//     const lineVectorX = insetVertex2.x - insetVertex1.x;
//     const lineVectorY = insetVertex2.y - insetVertex1.y;
//     const lineLength = Math.sqrt(lineVectorX * lineVectorX + lineVectorY * lineVectorY);
//     const extendX = (lineVectorX / lineLength) * extension;
//     const extendY = (lineVectorY / lineLength) * extension;
//
//     // Extend both ends of the line
//     const extendedVertex1 = {
//         x: insetVertex1.x - extendX,
//         y: insetVertex1.y - extendY
//     };
//     const extendedVertex2 = {
//         x: insetVertex2.x + extendX,
//         y: insetVertex2.y + extendY
//     };
//
//     // Draw the thick line
//     let originalLineWidth = offscreenContext.lineWidth;
//     let originalStrokeStyle = offscreenContext.strokeStyle;
//     offscreenContext.lineCap = 'round';
//
//     offscreenContext.lineWidth = 6;
//     offscreenContext.strokeStyle = map.palette.lines;
//     offscreenContext.beginPath();
//     offscreenContext.moveTo(extendedVertex1.x, extendedVertex1.y);
//     offscreenContext.lineTo(extendedVertex2.x, extendedVertex2.y);
//     offscreenContext.stroke();
//     offscreenContext.lineWidth = originalLineWidth;
//     offscreenContext.strokeStyle = originalStrokeStyle;
// }
//

// this one works perfectly, but we're going to attempt to add hatching...
// function drawOutsideBorder(x, y, sideIndex) {
//     const canvasCenter = centerOf(x, y);
//     const vertex1 = hexVertex(x, y, sideIndex);
//     const vertex2 = hexVertex(x, y, (sideIndex + 1) % 6);
//
//     // Calculate the outward offset distance
//     const outwardOffset = 3;  // 3 pixels outward from the hex edge
//
//     // Calculate the vector from center to midpoint of the side
//     const midX = (vertex1.x + vertex2.x) / 2;
//     const midY = (vertex1.y + vertex2.y) / 2;
//     const centerToMidX = midX - canvasCenter.x;
//     const centerToMidY = midY - canvasCenter.y;
//
//     // Normalize this vector
//     const length = Math.sqrt(centerToMidX * centerToMidX + centerToMidY * centerToMidY);
//     const normalX = centerToMidX / length;
//     const normalY = centerToMidY / length;
//
//     // Move both vertices OUTWARD by the offset amount
//     const outsetVertex1 = {
//         x: vertex1.x + normalX * outwardOffset,
//         y: vertex1.y + normalY * outwardOffset
//     };
//     const outsetVertex2 = {
//         x: vertex2.x + normalX * outwardOffset,
//         y: vertex2.y + normalY * outwardOffset
//     };
//
//     // Store original line settings
//     const originalLineWidth = offscreenContext.lineWidth;
//     const originalLineCap = offscreenContext.lineCap;
//
//     // Set line properties
//     offscreenContext.lineWidth = 6;
//     offscreenContext.lineCap = 'round';
//
//     // Draw the line
//     offscreenContext.beginPath();
//     offscreenContext.moveTo(outsetVertex1.x, outsetVertex1.y);
//     offscreenContext.lineTo(outsetVertex2.x, outsetVertex2.y);
//     offscreenContext.stroke();
//
//     // Restore original line settings
//     offscreenContext.lineWidth = originalLineWidth;
//     offscreenContext.lineCap = originalLineCap;
// }


function featureInDirection( x, y, direction, feature ) {

  const otherHex = hexAdjacent( x, y, direction );

  if ( map.grid[otherHex.x][otherHex.y].includes(feature ) ) {
    return true;
  }

  return false;

}


// Steps between two hexes. (Previously max(|dx|,|dy|), which is only right on square grids.)
function distanceBetween( x1, y1, x2, y2 ) {
  return HexGrid.distance( { x: x1, y: y1 }, { x: x2, y: y2 } );
}


function bridgeDirection(start, end) {
  // Convert hex coordinates to canvas coordinates
  const startCanvas = centerOf(start.x, start.y);
  const endCanvas = centerOf(end.x, end.y);

  // Calculate the direction vector
  const dx = endCanvas.x - startCanvas.x;
  const dy = endCanvas.y - startCanvas.y;

  // Calculate angle in radians (atan2 returns angle from -π to π)
  // Note: atan2(dy, dx) gives angle from positive x-axis
  // We need to adjust for "0° is straight up" convention
  let angleRad = Math.atan2(dx, -dy); // Negative dy because canvas y increases downward

  // Convert to degrees
  let angleDeg = angleRad * (180 / Math.PI);

  // Normalize to 0-360 range
  if (angleDeg < 0) {
      angleDeg += 360;
  }

  return (Math.round(angleDeg)/60);

}


    function bridgeGoodDirection(start, end) {
      // Convert hex coordinates to canvas coordinates
      const startCanvas = centerOf(start.x, start.y);
      const endCanvas = centerOf(end.x, end.y);

      // Calculate the direction vector
      const dx = endCanvas.x - startCanvas.x;
      const dy = endCanvas.y - startCanvas.y;

      // Calculate angle in radians (atan2 returns angle from -π to π)
      // Note: atan2(dy, dx) gives angle from positive x-axis
      // We need to adjust for "0° is straight up" convention
      let angleRad = Math.atan2(dx, -dy); // Negative dy because canvas y increases downward

      // Convert to degrees
      let angleDeg = angleRad * (180 / Math.PI);

      // Normalize to 0-360 range
      if (angleDeg < 0) {
          angleDeg += 360;
      }

//      console.log(Math.round(angleDeg)/60);

      // Check if angle is a multiple of 60°
      // Allow small tolerance for floating point precision
      const tolerance = 0.1;
      const remainder = angleDeg % 60;

      return remainder <= tolerance || remainder >= (60 - tolerance);
      }


    function offscreenPointToHex( x, y ) {

      let iX = 0;
      let iY = 0;

//      mapSearchLoop:
      for ( iX = 0; iX < map.width; iX++ ) {
        for ( iY = 0; iY < map.height; iY++ ) {

          hexCenter = centerOf( iX, iY );

          let dx = hexCenter.x - x;
          let dy = hexCenter.y - y;

          if ( dx ** 2 + dy ** 2 <= hexSideSquared ) {

            return { x: iX, y: iY }

//            break mapSearchLoop;

          }
        }
      }

      return { undefined }

    }


// Neighbor of hex x,y in direction f (0 N, 1 NE, 2 SE, 3 S, 4 SW, 5 NW). See js/shared/hexGrid.js.
function hexAdjacent( x, y, f ) {
  return HexGrid.neighbor( { x, y }, f );
}
