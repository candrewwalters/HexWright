// HexWright — Feature renderers: borders, crumbs, trapdoors, altars, pentacles, barricades, paths, debris, bridges, megahexes.
// (Classic script: shares the global scope with the other js/ files.)

  function drawOutsideBorder(x, y, sideIndex) {
    const canvasCenter = centerOf(x, y);
    const vertex1 = hexVertex(x, y, sideIndex);
    const vertex2 = hexVertex(x, y, (sideIndex + 1) % 6);

    // Calculate the outward offset distance
    const outwardOffset = 3;

    // Calculate the vector from center to midpoint of the side
    const midX = (vertex1.x + vertex2.x) / 2;
    const midY = (vertex1.y + vertex2.y) / 2;
    const centerToMidX = midX - canvasCenter.x;
    const centerToMidY = midY - canvasCenter.y;

    // Normalize this vector
    const length = Math.sqrt(centerToMidX * centerToMidX + centerToMidY * centerToMidY);
    const normalX = centerToMidX / length;
    const normalY = centerToMidY / length;

    // Move both vertices OUTWARD by the offset amount
    const outsetVertex1 = {
        x: vertex1.x + normalX * outwardOffset,
        y: vertex1.y + normalY * outwardOffset
    };
    const outsetVertex2 = {
        x: vertex2.x + normalX * outwardOffset,
        y: vertex2.y + normalY * outwardOffset
    };

    // Store original line settings
    const originalLineWidth = offscreenContext.lineWidth;
    const originalLineCap = offscreenContext.lineCap;

    // Set line properties
    offscreenContext.lineWidth = 6;
    offscreenContext.lineCap = 'round';

    offscreenContext.strokeStyle = map.palette.lines;

    // Draw the main border line
    offscreenContext.beginPath();
    offscreenContext.moveTo(outsetVertex1.x, outsetVertex1.y);
    offscreenContext.lineTo(outsetVertex2.x, outsetVertex2.y);
    offscreenContext.stroke();

    // Restore original line settings
    offscreenContext.lineWidth = originalLineWidth;
    offscreenContext.lineCap = originalLineCap;
  }


  function drawCrumbs(x, y, sideIndex) {
      const canvasCenter = centerOf(x, y);
      const vertex1 = hexVertex(x, y, sideIndex);
      const vertex2 = hexVertex(x, y, (sideIndex + 1) % 6);

      // Calculate the outward offset distance
      const outwardOffset = 3;

      // Calculate the vector from center to midpoint of the side
      const midX = (vertex1.x + vertex2.x) / 2;
      const midY = (vertex1.y + vertex2.y) / 2;
      const centerToMidX = midX - canvasCenter.x;
      const centerToMidY = midY - canvasCenter.y;

      // Normalize this vector
      const length = Math.sqrt(centerToMidX * centerToMidX + centerToMidY * centerToMidY);
      const normalX = centerToMidX / length;
      const normalY = centerToMidY / length;

      // Generate random number of crumbs (2-10)
      const numCrumbs = Math.floor(Math.random() * 9) + 2;

      // Set fill color for crumbs
      offscreenContext.fillStyle = map.palette.walls;

      // Draw crumbs scattered near the wall inside the hex
      for (let i = 0; i < numCrumbs; i++) {
          // Random position along the line (0 to 1)
          const t = Math.random();
          const baseX = vertex1.x + (vertex2.x - vertex1.x) * t;
          const baseY = vertex1.y + (vertex2.y - vertex1.y) * t;

          // Each crumb gets its own random distance from the wall
          const inwardOffset = Math.random() < 0.7 ?
              Math.random() * 4 + 1 :  // 70% chance: 1-5 pixels inward (close to wall)
              Math.random() * 12 + 5;  // 30% chance: 5-17 pixels inward (further from wall)

          // Move this crumb inward by its individual offset
          const crumbBaseX = baseX - normalX * inwardOffset;
          const crumbBaseY = baseY - normalY * inwardOffset;

          // Add some random scatter perpendicular to the wall
          const scatterDistance = Math.random() * 6 - 3; // -3 to +3 pixels
          const perpX = -normalY; // Perpendicular to normal vector
          const perpY = normalX;

          const crumbX = crumbBaseX + perpX * scatterDistance;
          const crumbY = crumbBaseY + perpY * scatterDistance;

          // Small crumb size (2-4 px instead of 2-6)
          const crumbSize = Math.floor(Math.random() * 3) + 2;

          // Save context for rotation
          offscreenContext.save();

          // Translate to crumb center and rotate by random angle
          offscreenContext.translate(crumbX, crumbY);
          offscreenContext.rotate(Math.random() * Math.PI * 2);

          // For larger crumbs (4px), draw two overlapping squares to break up the square shape
          if (crumbSize >= 4) {
              // First square
              const width1 = crumbSize + Math.random() * 2 - 1;
              const height1 = crumbSize + Math.random() * 2 - 1;
              offscreenContext.fillRect(
                  -width1 / 2,
                  -height1 / 2,
                  width1,
                  height1
              );

              // Second square, slightly offset and rotated
              offscreenContext.rotate(Math.random() * Math.PI / 3 - Math.PI / 6); // -30 to +30 degrees
              const offsetX = (Math.random() - 0.5) * 2; // -1 to +1 pixel offset
              const offsetY = (Math.random() - 0.5) * 2;
              const width2 = crumbSize * 0.7 + Math.random() * 1.5 - 0.75;
              const height2 = crumbSize * 0.7 + Math.random() * 1.5 - 0.75;

              offscreenContext.fillRect(
                  offsetX - width2 / 2,
                  offsetY - height2 / 2,
                  width2,
                  height2
              );
          } else {
              // For smaller crumbs, just draw single irregular rectangle
              const width = crumbSize + Math.random() * 2 - 1;
              const height = crumbSize + Math.random() * 2 - 1;

              offscreenContext.fillRect(
                  -width / 2,
                  -height / 2,
                  width,
                  height
              );
          }

          // Restore context
          offscreenContext.restore();
      }
  }

  function drawTrapDoor() {

    ctx = offscreenContext;

    const doorSize = hexSide; // Square size relative to hex
    const halfDoor = doorSize / 2;

    // Colors
    const doorColor = '#A0672A'; // Dark brown
    const hingeColor = '#2F1B1A'; // Darker brown for hinges
    const shadowColor = '#1A0F0E'; // Very dark brown for shadows

    ctx.save();

    // Draw door shadow/outline first
    ctx.fillStyle = shadowColor;
    ctx.fillRect(
      centerX - halfDoor - 1,
      centerY - halfDoor - 1,
      doorSize + 2,
      doorSize + 2
    );

    // Draw main door square
    ctx.fillStyle = doorColor;
    ctx.fillRect(
      centerX - halfDoor,
      centerY - halfDoor,
      doorSize,
      doorSize
    );

    // Add wood grain effect with subtle lines
    ctx.strokeStyle = '#2F1B1A';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;

    // Horizontal wood grain lines
    for (let i = 0; i < 4; i++) {
      const y = centerY - halfDoor + (doorSize / 5) * (i + 1);
      ctx.beginPath();
      ctx.moveTo(centerX - halfDoor + 5, y);
      ctx.lineTo(centerX + halfDoor - 5, y);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // Draw hinges on the left side
    const hingeWidth = 8;
    const hingeHeight = doorSize * 0.15;
    const hingeOffset = doorSize * 0.2;

    ctx.fillStyle = hingeColor;

    // Top hinge
    ctx.fillRect(
      centerX - halfDoor - hingeWidth/2,
      centerY - halfDoor + hingeOffset,
      hingeWidth,
      hingeHeight
    );

    // Bottom hinge
    ctx.fillRect(
      centerX - halfDoor - hingeWidth/2,
      centerY + halfDoor - hingeOffset - hingeHeight,
      hingeWidth,
      hingeHeight
    );

    // Add hinge details (screws/bolts)
    ctx.fillStyle = '#1A1A1A';
    const screwSize = 1.5;

    // Top hinge screws
    ctx.beginPath();
    ctx.arc(centerX - halfDoor - 2, centerY - halfDoor + hingeOffset + hingeHeight/3, screwSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX - halfDoor - 2, centerY - halfDoor + hingeOffset + 2*hingeHeight/3, screwSize, 0, Math.PI * 2);
    ctx.fill();

    // Bottom hinge screws
    ctx.beginPath();
    ctx.arc(centerX - halfDoor - 2, centerY + halfDoor - hingeOffset - hingeHeight/3, screwSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX - halfDoor - 2, centerY + halfDoor - hingeOffset - 2*hingeHeight/3, screwSize, 0, Math.PI * 2);
    ctx.fill();

    // Add a handle/ring on the right side
    const handleX = centerX + halfDoor - 10;
    const handleY = centerY;

    ctx.strokeStyle = '#2F1B1A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(handleX, handleY, 4, 0, Math.PI * 2);
    ctx.stroke();

    // Inner ring
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(handleX, handleY, 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();

  }


  function drawStoneAltar() {
    // Randomly choose rotation: 0°, 60°, or -60°
    const rotations = [0, Math.PI / 3, -Math.PI / 3]; // 0°, 60°, -60° in radians
    const rotation = rotations[Math.floor(Math.random() * rotations.length)];

    offscreenContext.save();

    // Move to center and rotate
    offscreenContext.translate(centerX, centerY);
    offscreenContext.rotate(rotation);

    // Rectangle dimensions - width based on hexSide, height 80% of width
    const width = hexSide * 1.2;
    const height = width * 0.8;

    // Draw concentric rectangles from outside to inside
    const layers = [
      { size: 1.0, fill: '#707070', stroke: '#505050' },   // Outermost - darkest
      { size: 0.8, fill: '#808080', stroke: '#606060' },   // Middle
      { size: 0.6, fill: '#909090', stroke: '#707070' },   // Inner - lightest
      // { size: 0.4, fill: '#858585', stroke: '#656565' }    // Innermost - medium
    ];

    layers.forEach(layer => {
      const layerWidth = width * layer.size;
      const layerHeight = height * layer.size;

      offscreenContext.beginPath();
      offscreenContext.fillStyle = layer.fill;
      offscreenContext.strokeStyle = layer.stroke;
      offscreenContext.lineWidth = 1.5;

      // Draw rectangle centered at origin
      offscreenContext.rect(
        -layerWidth / 2,
        -layerHeight / 2,
        layerWidth,
        layerHeight
      );

      offscreenContext.fill();
      offscreenContext.stroke();
    });

    offscreenContext.restore();
  }


  function drawPentacle() {
      const ctx = offscreenContext;
      const radius = hexSide * 0.9 / 2; // diameter to radius conversion
      const starRadius = radius * 0.8; // Star fits within the circle
      const innerRadius = starRadius * 0.382; // Golden ratio for pentacle proportions

      ctx.save();

      // Draw outer circle (subtle)
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Calculate pentacle points
      const outerPoints = [];
      const innerPoints = [];

      for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI / 5) + (Math.PI / 2); // Start at bottom (flipped)

          // Outer points (star tips)
          outerPoints.push({
              x: centerX + Math.cos(angle) * starRadius,
              y: centerY + Math.sin(angle) * starRadius
          });

          // Inner points (star indentations)
          const innerAngle = angle + (Math.PI / 5);
          innerPoints.push({
              x: centerX + Math.cos(innerAngle) * innerRadius,
              y: centerY + Math.sin(innerAngle) * innerRadius
          });
      }

      // Draw the pentacle star
      ctx.strokeStyle = '#222';
      ctx.fillStyle = '#333';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';

      ctx.beginPath();

      // Start at first outer point
      ctx.moveTo(outerPoints[0].x, outerPoints[0].y);

      // Draw the star by alternating between outer and inner points
      for (let i = 0; i < 5; i++) {
          const nextOuter = (i + 1) % 5;
          ctx.lineTo(innerPoints[i].x, innerPoints[i].y);
          ctx.lineTo(outerPoints[nextOuter].x, outerPoints[nextOuter].y);
      }

      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw simple mystical marks around the circle
      const markRadius = radius * 0.85;

      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';

      for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI / 3); // 6 positions around the circle
          const markX = centerX + Math.cos(angle) * markRadius;
          const markY = centerY + Math.sin(angle) * markRadius;

          // Draw small cross marks
          const markSize = radius * 0.08;

          ctx.beginPath();
          ctx.moveTo(markX - markSize, markY);
          ctx.lineTo(markX + markSize, markY);
          ctx.moveTo(markX, markY - markSize);
          ctx.lineTo(markX, markY + markSize);
          ctx.stroke();
      }

      // Draw additional runic-style marks
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1;

      for (let i = 0; i < 12; i++) {
          const angle = (i * Math.PI / 6); // 12 positions
          const markRadius = radius * 0.95;
          const markLength = radius * 0.05;

          const startX = centerX + Math.cos(angle) * (markRadius - markLength);
          const startY = centerY + Math.sin(angle) * (markRadius - markLength);
          const endX = centerX + Math.cos(angle) * markRadius;
          const endY = centerY + Math.sin(angle) * markRadius;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          // Add small perpendicular marks for runic effect
          if (i % 3 === 0) {
              const perpAngle = angle + Math.PI / 2;
              const perpLength = markLength * 0.3;
              const perpX1 = endX + Math.cos(perpAngle) * perpLength;
              const perpY1 = endY + Math.sin(perpAngle) * perpLength;
              const perpX2 = endX - Math.cos(perpAngle) * perpLength;
              const perpY2 = endY - Math.sin(perpAngle) * perpLength;

              ctx.beginPath();
              ctx.moveTo(perpX1, perpY1);
              ctx.lineTo(perpX2, perpY2);
              ctx.stroke();
          }
      }

      // Draw inner circle for mystical effect
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius * 1.2, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
  }


  function drawDiagonalLines() {
    offscreenContext.save();

    // Set up clipping path for the hex (with 2-3px inset)
    const inset = 2 + Math.random(); // 2-3 pixels inset
    const clippingRadius = hexSide - inset;

    offscreenContext.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = centerX + clippingRadius * Math.cos(angle);
      const y = centerY + clippingRadius * Math.sin(angle);

      if (i === 0) {
        offscreenContext.moveTo(x, y);
      } else {
        offscreenContext.lineTo(x, y);
      }
    }
    offscreenContext.closePath();
    offscreenContext.clip();

    // Set line style
    offscreenContext.lineWidth = 1;

    // Calculate bounds for diagonal lines
    const maxDistance = hexSide + hexHeight; // Ensure we cover the whole hex area

    // Draw 45° diagonal lines (top-left to bottom-right)
    offscreenContext.beginPath();

    // Start from far left and work right, spacing lines 4px apart
    for (let offset = -maxDistance; offset <= maxDistance; offset += 4) {
      // Calculate start and end points for each diagonal line
      const startX = centerX - maxDistance;
      const startY = centerY - maxDistance + offset;
      const endX = centerX + maxDistance;
      const endY = centerY + maxDistance + offset;

      offscreenContext.moveTo(startX, startY);
      offscreenContext.lineTo(endX, endY);
    }

    offscreenContext.stroke();

    offscreenContext.restore();
  }


  function drawBarricade() {
    offscreenContext.save();
    offscreenContext.translate(centerX, centerY);

    // Define color palette for debris
    const colors = [
      '#8B7355', '#A0826D', '#6B5B47', // Browns (wood, dirt)
      '#808080', '#696969', '#A9A9A9', '#778899', // Greys (stone, metal)
      '#654321', '#8B4513', '#D2B48C' // More browns (dark wood, tan)
    ];

    // First draw some long thin pieces (planks, beams, etc.)
    const numLongPieces = 23 + Math.floor(Math.random() * 4); // 3-6 long pieces

    for (let i = 0; i < numLongPieces; i++) {
      // Random position within hex bounds
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * hexSide * 0.6;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      // Long thin dimensions
      const length = hexSide * (0.8 + Math.random() * 0.4); // 80-120% of hexSide
      const width = length * (0.05 + Math.random() * 0.05); // 5-10% of length

      // Random color from palette
      const color = colors[Math.floor(Math.random() * colors.length)];

      offscreenContext.fillStyle = color;
      offscreenContext.strokeStyle = '#000000';
      offscreenContext.lineWidth = 0.5;

      offscreenContext.save();
      offscreenContext.translate(x, y);
      offscreenContext.rotate(Math.random() * Math.PI * 2); // Random direction

      offscreenContext.beginPath();
      offscreenContext.rect(-length/2, -width/2, length, width);
      offscreenContext.fill();
      offscreenContext.stroke();
      offscreenContext.restore();
    }

    // Fill the hex area with random debris pieces
    const numPieces = 15 + Math.floor(Math.random() * 10); // 15-24 pieces

    for (let i = 0; i < numPieces; i++) {
      // Random position within hex bounds
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * hexSide * 0.8;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      // Random size
      const size = 8 + Math.random() * 12; // 8-20 pixels

      // Random color from palette
      const color = colors[Math.floor(Math.random() * colors.length)];

      // Random shape type
      const shapeType = Math.floor(Math.random() * 4);

      offscreenContext.fillStyle = color;
      offscreenContext.strokeStyle = '#000000';
      offscreenContext.lineWidth = 0.5;

      offscreenContext.save();
      offscreenContext.translate(x, y);
      offscreenContext.rotate(Math.random() * Math.PI * 2);

      offscreenContext.beginPath();

      switch(shapeType) {
        case 0: // Rectangle (planks, boards)
          const rectWidth = size * (0.5 + Math.random() * 1.5);
          const rectHeight = size * (0.3 + Math.random() * 0.4);
          offscreenContext.rect(-rectWidth/2, -rectHeight/2, rectWidth, rectHeight);
          break;

        case 1: // Circle (barrels, stones)
          offscreenContext.arc(0, 0, size/2, 0, Math.PI * 2);
          break;

        case 2: // Triangle (broken wood, debris)
          offscreenContext.moveTo(0, -size/2);
          offscreenContext.lineTo(-size/2, size/2);
          offscreenContext.lineTo(size/2, size/2);
          offscreenContext.closePath();
          break;

        case 3: // Irregular polygon (rubble)
          const sides = 5 + Math.floor(Math.random() * 3); // 5-7 sides
          for (let j = 0; j < sides; j++) {
            const sideAngle = (j / sides) * Math.PI * 2;
            const radius = size/2 * (0.7 + Math.random() * 0.6); // Irregular
            const px = Math.cos(sideAngle) * radius;
            const py = Math.sin(sideAngle) * radius;
            if (j === 0) {
              offscreenContext.moveTo(px, py);
            } else {
              offscreenContext.lineTo(px, py);
            }
          }
          offscreenContext.closePath();
          break;
      }

      offscreenContext.fill();
      offscreenContext.stroke();
      offscreenContext.restore();
    }

    offscreenContext.restore();
  }


function drawPath() {

  offscreenContext.fillStyle = map.palette.paths;
  offscreenContext.beginPath();
  offscreenContext.arc( centerI.x, centerI.y, hexSide*0.3, 0, 2 * Math.PI); // draw a circle
  offscreenContext.fill();

  const originalStrokeStyle = offscreenContext.strokeStyle;
  const originalLineWidth = offscreenContext.lineWidth;

  offscreenContext.strokeStyle = map.palette.paths;
  offscreenContext.lineWidth = hexSide*0.6;

  let pathExits = 0;
  let pathExitDir = -1;
  for ( let i = 0; i < 6; i++ ) {

    let adjHex = hexAdjacent( xI, yI, i );

    if ( adjHex.x < 0 || adjHex.y < 0 || adjHex.x > map.width - 1 || adjHex.y > map.height - 1 ) {
      continue;
    }

    if ( map.grid[adjHex.x][adjHex.y].includes('path') || map.grid[adjHex.x][adjHex.y].includes('bridge') ) {

      offscreenContext.beginPath();
      offscreenContext.moveTo( centerI.x, centerI.y );

      const directionRadians = (i * 60 - 90) * Math.PI / 180;
      const endX = centerI.x + Math.cos(directionRadians) * hexHeight/2;
      const endY = centerI.y + Math.sin(directionRadians) * hexHeight/2;

      offscreenContext.lineTo(endX, endY);
      offscreenContext.stroke();
      pathExits++;
      pathExitDir = i;
    }

  }

  if ( pathExits == 1 && ( xI == 0 || xI == map.width-1 || yI == 0 || yI == map.height-1 ) ) {

    let pathOff = ( pathExitDir + 3 ) % 6;

    offscreenContext.beginPath();
    offscreenContext.moveTo( centerI.x, centerI.y );

    const directionRadians = (pathOff * 60 - 90) * Math.PI / 180;
    const endX = centerI.x + Math.cos(directionRadians) * hexHeight/2;
    const endY = centerI.y + Math.sin(directionRadians) * hexHeight/2;

    offscreenContext.lineTo(endX, endY);
    offscreenContext.stroke();

  }

  offscreenContext.strokeStyle = originalStrokeStyle;
  offscreenContext.lineWidth = originalLineWidth;


}

// Function to check if a point is inside the hexagon
function isPointInHex(x, y, centerX, centerY, hexSide) {
    const dx = Math.abs(x - centerX);
    const dy = Math.abs(y - centerY);
    const hexWidth = hexSide * Math.sqrt(3) / 2;

    if (dx > hexWidth || dy > hexSide) return false;
    if (dx <= hexWidth / 2) return true;

    const slope = hexSide / (hexWidth / 2);
    return dy <= hexSide - slope * (dx - hexWidth / 2);
}

// Function to generate a random jagged polygon
function generateDebrisPolygon(centerX, centerY, hexSide) {
    const maxSize = hexSide / 4;
    const minSize = hexSide / 8;

    // Random size for this debris piece
    const size = minSize + Math.random() * (maxSize - minSize);

    // Random center position within the hex (can be up to hexSide distance from center)
    const hexWidth = hexSide * Math.sqrt(3) / 2;
    let debrisCenterX, debrisCenterY;

    // Use polar coordinates to spread more evenly and reach further out
    const angle = Math.random() * Math.PI * 2;
    const maxDistance = Math.min(hexSide * 0.8, hexWidth * 0.8); // Stay within hex bounds
    const distance = Math.random() * maxDistance;

    debrisCenterX = centerX + Math.cos(angle) * distance;
    debrisCenterY = centerY + Math.sin(angle) * distance;

    // Fallback to random positioning if polar method fails
    if (!isPointInHex(debrisCenterX, debrisCenterY, centerX, centerY, hexSide)) {
        do {
            debrisCenterX = centerX + (Math.random() - 0.5) * hexWidth * 1.6;
            debrisCenterY = centerY + (Math.random() - 0.5) * hexSide * 1.6;
        } while (!isPointInHex(debrisCenterX, debrisCenterY, centerX, centerY, hexSide));
    }

    // Generate 5-8 vertices for jagged appearance
    const numVertices = 5 + Math.floor(Math.random() * 4);
    const vertices = [];

    for (let i = 0; i < numVertices; i++) {
        const angle = (i / numVertices) * Math.PI * 2;
        // Vary the radius to create jagged edges
        const radiusVariation = 0.5 + Math.random() * 0.5;
        const radius = size * radiusVariation;

        const x = debrisCenterX + Math.cos(angle) * radius;
        const y = debrisCenterY + Math.sin(angle) * radius;

        vertices.push({ x, y });
    }

    return vertices;
}


// Main debris drawing function
function drawDebris() {
    offscreenContext.strokeStyle = map.palette.lines;
    offscreenContext.fillStyle = map.palette.walls;
    offscreenContext.lineWidth = 1;

    // Generate 12-20 debris pieces
    const numDebris = 12 + Math.floor(Math.random() * 9);

    for (let i = 0; i < numDebris; i++) {
        const vertices = generateDebrisPolygon(centerX, centerY, hexSide);

        // Draw the polygon
        offscreenContext.beginPath();
        offscreenContext.moveTo(vertices[0].x, vertices[0].y);

        for (let j = 1; j < vertices.length; j++) {
            offscreenContext.lineTo(vertices[j].x, vertices[j].y);
        }

        offscreenContext.closePath();
        offscreenContext.fill();
        offscreenContext.stroke();

        // Add 3D highlights if texture is enabled
        if (map.texture === 'yes') {
            // Create a lighter highlight color
            const baseColor = map.palette.walls;
            let highlightColor;

            // Simple way to create a lighter version of the color
            if (baseColor.startsWith('#')) {
                // Convert hex to RGB, lighten, and convert back
                const r = parseInt(baseColor.substr(1, 2), 16);
                const g = parseInt(baseColor.substr(3, 2), 16);
                const b = parseInt(baseColor.substr(5, 2), 16);

                const lighten = 40;
                const newR = Math.min(255, r + lighten);
                const newG = Math.min(255, g + lighten);
                const newB = Math.min(255, b + lighten);

                highlightColor = `rgb(${newR}, ${newG}, ${newB})`;
            } else {
                // Fallback for other color formats
                highlightColor = 'rgba(255, 255, 255, 0.3)';
            }

            // Draw highlight on top-left edges (simulating light from top-left)
            offscreenContext.strokeStyle = highlightColor;
            offscreenContext.lineWidth = 1.5;
            offscreenContext.beginPath();

            // Find the topmost and leftmost vertices for highlighting
            let topVertex = vertices[0];
            let leftVertex = vertices[0];

            for (let k = 1; k < vertices.length; k++) {
                if (vertices[k].y < topVertex.y) topVertex = vertices[k];
                if (vertices[k].x < leftVertex.x) leftVertex = vertices[k];
            }

            // Draw highlight lines on a few edges that would catch light
            for (let k = 0; k < vertices.length; k++) {
                const current = vertices[k];
                const next = vertices[(k + 1) % vertices.length];

                // Highlight edges that are on the top or left side
                const edgeAngle = Math.atan2(next.y - current.y, next.x - current.x);
                const normalizedAngle = ((edgeAngle + Math.PI * 2) % (Math.PI * 2));

                // Highlight edges facing roughly northwest to northeast (top edges)
                if (normalizedAngle > Math.PI * 1.25 && normalizedAngle < Math.PI * 1.75) {
                    offscreenContext.moveTo(current.x, current.y);
                    offscreenContext.lineTo(next.x, next.y);
                }
            }

            offscreenContext.stroke();

            // Reset stroke style for next debris piece
            offscreenContext.strokeStyle = map.palette.lines;
            offscreenContext.lineWidth = 1;
        }
    }
}


function drawArcaneSymbols() {
   // Array of obscure mathematical, astrological, and mystical symbols
   const arcaneSymbols = [
       '∴', '∵',  '∅', '∞', '∝', '∆', '∇', '∂', '∫', '∮', '∯', '∰', '∱',
       '☉', '☽', '☾', '☿', '♀', '♁', '♂', '♃', '♄', '♅', '♆', '♇', '☌', '☍', '☊', '☋',
       '⊕', '⊖', '⊗', '⊙', '⊚', '⊛', '⊜', '⊝', '⊞', '⊟', '⊠', '⊡', '⊢', '⊣', '⊤', '⊥',
       '⟂', '⟃', '⟄', '⟅', '⟆', '⟇', '⟈', '⟉', '⟊', '⟋', '⟌', '⟍', '⟎', '⟏', '⟐', '⟑',
       '⌬', '⌭', '⌮', '⌯', '⌰', '⌱', '⌲', '⌳', '⌴', '⌵', '⌶', '⌷', '⌸', '⌹', '⌺', '⌻',
       '⍝', '⍞', '⍟', '⍠', '⍡', '⍢', '⍣', '⍤', '⍥', '⍦', '⍧', '⍩', '⍪', '⍫', '⍬'
   ];

   const saveFont = offscreenContext.font;

   // Set symbol styling
   offscreenContext.fillStyle = map.palette.lines;
   offscreenContext.font = `${Math.floor(hexSide * 0.8)}px Arial`;
   offscreenContext.textAlign = 'center';
   offscreenContext.font = `40px Arial`;
   offscreenContext.textBaseline = 'middle';


   // Function to draw symbols along an edge
   function drawSymbolsAlongEdge(startX, startY, endX, endY, symbols) {
       const edgeLength = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
       const symbolCount = Math.floor(edgeLength / hexSide);

       if (symbolCount === 0) return;

       const stepX = (endX - startX) / symbolCount;
       const stepY = (endY - startY) / symbolCount;

       for (let i = 0; i < symbolCount; i++) {
           const x = startX + stepX * (i + 0.5);
           const y = startY + stepY * (i + 0.5);
           const symbol = symbols[Math.floor(Math.random() * symbols.length)];
           // Make sure symbol is within the hexSide boundary
           if (x >= hexSide/2 && x <= offscreenCanvas.width - hexSide/2 &&
               y >= hexSide/2 && y <= offscreenCanvas.height - hexSide/2) {
               offscreenContext.fillText(symbol, x, y);
           }
       }
   }

   // Draw symbols around all four edges
   // Top edge
   drawSymbolsAlongEdge(hexSide/2, hexSide/2, offscreenCanvas.width - hexSide/2, hexSide/2, arcaneSymbols);
   // Right edge
   drawSymbolsAlongEdge(offscreenCanvas.width - hexSide/2, hexSide/2, offscreenCanvas.width - hexSide/2, offscreenCanvas.height - hexSide/2, arcaneSymbols);
   // Bottom edge
   drawSymbolsAlongEdge(offscreenCanvas.width - hexSide/2, offscreenCanvas.height - hexSide/2, hexSide/2, offscreenCanvas.height - hexSide/2, arcaneSymbols);
   // Left edge
   drawSymbolsAlongEdge(hexSide/2, offscreenCanvas.height - hexSide/2, hexSide/2, hexSide/2, arcaneSymbols);

   offscreenContext.font = saveFont;

}


function traceHex( x, y ) {

  centerI = centerOf( x, y );

  offscreenContext.beginPath();

  offscreenContext.moveTo( centerI.x - hexSide, centerI.y );
  offscreenContext.lineTo( centerI.x - hexSide / 2, centerI.y - hexHeight / 2 );
  offscreenContext.lineTo( centerI.x + hexSide / 2, centerI.y - hexHeight / 2 );
  offscreenContext.lineTo( centerI.x + hexSide, centerI.y );
  offscreenContext.lineTo( centerI.x + hexSide / 2, centerI.y + hexHeight / 2 );
  offscreenContext.lineTo( centerI.x - hexSide / 2, centerI.y + hexHeight / 2 );
  offscreenContext.lineTo( centerI.x - hexSide, centerI.y );

  offscreenContext.closePath()


}

function drawHexCorners() {

  const cornerLength = 8; // Length of corner segments in pixels

  offscreenContext.beginPath();

  // Define all the corner points
  const points = [
      { x: centerI.x - hexSide, y: centerI.y },
      { x: centerI.x - hexSide / 2, y: centerI.y - hexHeight / 2 },
      { x: centerI.x + hexSide / 2, y: centerI.y - hexHeight / 2 },
      { x: centerI.x + hexSide, y: centerI.y },
      { x: centerI.x + hexSide / 2, y: centerI.y + hexHeight / 2 },
      { x: centerI.x - hexSide / 2, y: centerI.y + hexHeight / 2 }
  ];

  // Draw corner segments for each edge
  for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];

      // Calculate the direction vector
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      const length = Math.sqrt(dx * dx + dy * dy);

      // Normalize the direction vector
      const unitX = dx / length;
      const unitY = dy / length;

      // Draw first corner segment (from current point)
      offscreenContext.moveTo(current.x, current.y);
      offscreenContext.lineTo(
          current.x + unitX * cornerLength,
          current.y + unitY * cornerLength
      );

      // Draw last corner segment (to next point)
      offscreenContext.moveTo(
          next.x - unitX * cornerLength,
          next.y - unitY * cornerLength
      );
      offscreenContext.lineTo(next.x, next.y);
  }

  offscreenContext.stroke();


}


function fillBridge( theBridge ) {

  nextX = theBridge.startingX;
  nextY = theBridge.startingY;

  fillDirection = bridgeDirection( {x:theBridge.startingX,y:theBridge.startingY},{x:theBridge.endingX,y:theBridge.endingY})

  if ( fillDirection == Math.round(fillDirection) ) {

    while ( !( nextX == theBridge.endingX && nextY == theBridge.endingY ) ) {

      nextHex = hexAdjacent( nextX, nextY, fillDirection );
      nextX = nextHex.x;
      nextY = nextHex.y;

      if ( !( nextX == theBridge.endingX && nextY == theBridge.endingY ) ) {

        map.grid[nextX][nextY].push('bridge');

      }

    }

  }

}


// function traceLiquidHex( x, y, liquid ) {
//
//   centerI = centerOf( x, y );
//
//   offscreenContext.beginPath();
//
//   // if ( featureInDirection( x, y, 5, liquid ) || featureInDirection( x, y, 0, liquid ) ) {
//   //   offscreenContext.moveTo( centerI.x - hexSide / 2, centerI.y - hexHeight / 2 );
//   // } else {
//   //   offscreenContext.moveTo( (centerI.x - hexSide / 2)*0.9, (centerI.y - hexHeight / 2)*0.9 );
//   // }
//   //
//   // if ( featureInDirection( x, y, 0, liquid ) ) {
//   //   offscreenContext.lineTo( centerI.x, (centerI.y - hexHeight / 2)*0.9 );
//   // } else {
//   //   offscreenContext.lineTo( centerI.x, (centerI.y - hexHeight / 2) );
//   // }
//   //
//   // if ( featureInDirection( x, y, 0, liquid ) || featureInDirection( x, y, 1, liquid ) ) {
//   //   offscreenContextl.lineTo( centerI.x - hexSide / 2, centerI.y - hexHeight / 2 );
//   // } else {
//   //   offscreenContext.lineTo( (centerI.x + hexSide / 2)*0.9, (centerI.y - hexHeight / 2)*0.9 );
//   // }
//   //
//   // if ( featureInDirection( x, y, 1, liquid )  ) {
//   //   offscreenContext.moveTo( centerI.x + hexSide * 3/4, centerI.y - hexHeight / 4 );
//   // } else {
//   //   offscreenContext.moveTo( (centerI.x + hexSide * 3/4)*0.9, (centerI.y - hexHeight / 4)*0.9 );
//   // }
//   //
//
//   // Start at top-left vertex
//   if ( featureInDirection( x, y, 5, liquid ) || featureInDirection( x, y, 0, liquid ) ) {
//     offscreenContext.moveTo( centerI.x - hexSide / 2, centerI.y - hexHeight / 2 );
//   } else {
//     offscreenContext.moveTo( (centerI.x - hexSide / 2)*0.9, (centerI.y - hexHeight / 2)*0.9 );
//   }
//
//   // To top midpoint
//   if ( featureInDirection( x, y, 0, liquid ) ) {
//     offscreenContext.lineTo( centerI.x, (centerI.y - hexHeight / 2)*0.9 );
//   } else {
//     offscreenContext.lineTo( centerI.x, (centerI.y - hexHeight / 2) );
//   }
//
//   // To top-right vertex
//   if ( featureInDirection( x, y, 0, liquid ) || featureInDirection( x, y, 1, liquid ) ) {
//     offscreenContext.lineTo( centerI.x + hexSide / 2, centerI.y - hexHeight / 2 );
//   } else {
//     offscreenContext.lineTo( (centerI.x + hexSide / 2)*0.9, (centerI.y - hexHeight / 2)*0.9 );
//   }
//
//   // To right midpoint
//   if ( featureInDirection( x, y, 1, liquid ) ) {
//     offscreenContext.lineTo( centerI.x + hexSide * 3/4, (centerI.y - hexHeight / 4)*0.9 );
//   } else {
//     offscreenContext.lineTo( centerI.x + hexSide * 3/4, centerI.y - hexHeight / 4 );
//   }
//
//   // To right vertex
//   if ( featureInDirection( x, y, 1, liquid ) || featureInDirection( x, y, 2, liquid ) ) {
//     offscreenContext.lineTo( centerI.x + hexSide, centerI.y );
//   } else {
//     offscreenContext.lineTo( (centerI.x + hexSide)*0.9, centerI.y );
//   }
//
//   // To bottom-right midpoint
//   if ( featureInDirection( x, y, 2, liquid ) ) {
//     offscreenContext.lineTo( centerI.x + hexSide * 3/4, (centerI.y + hexHeight / 4)*0.9 );
//   } else {
//     offscreenContext.lineTo( centerI.x + hexSide * 3/4, centerI.y + hexHeight / 4 );
//   }
//
//   // To bottom-right vertex
//   if ( featureInDirection( x, y, 2, liquid ) || featureInDirection( x, y, 3, liquid ) ) {
//     offscreenContext.lineTo( centerI.x + hexSide / 2, centerI.y + hexHeight / 2 );
//   } else {
//     offscreenContext.lineTo( (centerI.x + hexSide / 2)*0.9, (centerI.y + hexHeight / 2)*0.9 );
//   }
//
//   // To bottom midpoint
//   if ( featureInDirection( x, y, 3, liquid ) ) {
//     offscreenContext.lineTo( centerI.x, (centerI.y + hexHeight / 2)*0.9 );
//   } else {
//     offscreenContext.lineTo( centerI.x, centerI.y + hexHeight / 2 );
//   }
//
//   // To bottom-left vertex
//   if ( featureInDirection( x, y, 3, liquid ) || featureInDirection( x, y, 4, liquid ) ) {
//     offscreenContext.lineTo( centerI.x - hexSide / 2, centerI.y + hexHeight / 2 );
//   } else {
//     offscreenContext.lineTo( (centerI.x - hexSide / 2)*0.9, (centerI.y + hexHeight / 2)*0.9 );
//   }
//
//   // To left midpoint
//   if ( featureInDirection( x, y, 4, liquid ) ) {
//     offscreenContext.lineTo( (centerI.x - hexSide * 3/4)*0.9, (centerI.y + hexHeight / 4)*0.9 );
//   } else {
//     offscreenContext.lineTo( centerI.x - hexSide * 3/4, centerI.y + hexHeight / 4 );
//   }
//
//   // To left vertex
//   if ( featureInDirection( x, y, 4, liquid ) || featureInDirection( x, y, 5, liquid ) ) {
//     offscreenContext.lineTo( centerI.x - hexSide, centerI.y );
//   } else {
//     offscreenContext.lineTo( (centerI.x - hexSide)*0.9, centerI.y );
//   }
//
//   // To top-left midpoint
//   if ( featureInDirection( x, y, 5, liquid ) ) {
//     offscreenContext.lineTo( (centerI.x - hexSide * 3/4)*0.9, (centerI.y - hexHeight / 4)*0.9 );
//   } else {
//     offscreenContext.lineTo( centerI.x - hexSide * 3/4, centerI.y - hexHeight / 4 );
//   }
//
//
//   offscreenContext.closePath()
//
//
// }


    function drawMegaHex(x, y) {
      offscreenContext.lineWidth = 4;
      offscreenContext.strokeStyle = map.palette.lines;
      offscreenContext.beginPath();

      // Define which edges to draw for each adjacent hex (the outer edges)
      const outerEdges = [
        [5, 0, 1], // Adjacent hex 0: edges 5, 0, 1
        [0, 1, 2], // Adjacent hex 1: edges 0, 1, 2
        [1, 2, 3], // Adjacent hex 2: edges 1, 2, 3
        [2, 3, 4], // Adjacent hex 3: edges 2, 3, 4
        [3, 4, 5], // Adjacent hex 4: edges 3, 4, 5
        [4, 5, 0]  // Adjacent hex 5: edges 4, 5, 0
      ];

      // Draw the outer perimeter
      for (let i = 0; i < 6; i++) {

        const hex = hexAdjacent(x, y, i);

//        console.log(hex.x);
//        console.log(hex.y);

        if ( !inBounds( hex.x, hex.y ) ) continue;
//        console.log(map.grid[hex.x][hex.y]);
        if ( map.grid[hex.x][hex.y].includes('offboard') ) continue;

        const edges = outerEdges[i];

        // Draw each outer edge for this adjacent hex
        for (let j = 0; j < edges.length; j++) {
          const edgeStart = edges[j];
          const edgeEnd = (edges[j] + 1) % 6;

          const vertex1 = hexVertex(hex.x, hex.y, edgeStart);
          const vertex2 = hexVertex(hex.x, hex.y, edgeEnd);

          offscreenContext.moveTo(vertex1.x, vertex1.y);
          offscreenContext.lineTo(vertex2.x, vertex2.y);
        }
      }

      offscreenContext.stroke();
    }

    function unevenLine( srcX, srcY, destX, destY ) {

      // let saveLineWidth = offscreenContext.lineWidth;
      // offscreenContext.lineWidth = 2;


      //switch ( Math.ceil( Math.random() * 3 ) ) {
      switch ( 3 ) {

        case 1:
          offscreenContext.strokeStyle='black';
          offscreenContext.moveTo( srcX, srcY );
          offscreenContext.lineTo( destX, destY );
          offscreenContext.stroke();
          break;

        case 2:
          offscreenContext.strokeStyle='black';
          let breakPoint = 0.1 + Math.random() * 0.8;

          let breakStartX = srcX + breakPoint * ( destX - srcX );
          let breakStartY = srcY + breakPoint * ( destY - srcY );

          let breakEndX = srcX + (breakPoint+0.1) * ( destX - srcX );
          let breakEndY = srcY + (breakPoint+0.1) * ( destY - srcY );

          offscreenContext.moveTo( srcX, srcY );
          offscreenContext.lineTo( breakStartX, breakStartY );
          offscreenContext.moveTo( breakEndX, breakEndY );
          offscreenContext.lineTo( destX, destY );
          offscreenContext.stroke();
          break;

          case 3:

            midwayPoints = [];
            for ( let i = 0; i < 9; i++ ) {
              midwayPoints.push( ( ( i + Math.random() ) / 10 ).toFixed(3) );
            }

            wayPoints = [ { x: srcX, y: srcY } ];
            for ( let i = 0; i < midwayPoints.length; i++ ) {
              wayPoints.push(
                { x: (srcX + ( midwayPoints[i]  * ( destX - srcX ) ) + ( ( Math.random() - 0.5 ) * 2 )).toFixed(3),
                  y: (srcY + ( midwayPoints[i] * ( destY - srcY ) ) + ( ( Math.random() - 0.5 ) * 2 )).toFixed(3)
                } );
            }


            for ( let i = 0; i < wayPoints.length-1; i++ ) {


              if ( i > 0 && i < wayPoints.length - 1 && Math.random() < 0.2 ) {

              } else {

                offscreenContext.beginPath();

                offscreenContext.moveTo( wayPoints[i].x, wayPoints[i].y );

                offscreenContext.lineTo( wayPoints[i+1].x, wayPoints[i+1].y );
                offscreenContext.stroke();
                offscreenContext.closePath();

              }
            }

            offscreenContext.lineTo( destX, destY );

            offscreenContext.stroke();
//              boardContext.strokeStyle='black';

            break;
      }

//      offscreenContext.lineWidth = saveLineWidth;


    }
