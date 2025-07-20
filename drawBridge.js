function drawWoodBridge(x1, y1, x2, y2, d) {
    // Calculate the total length of the bridge line
    const totalLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    // Calculate the bridge length (total minus d from each end)
    const bridgeLength = totalLength - 1.4 * d;

    if (bridgeLength <= 0) {
        console.warn('Bridge length is too short for the given distance d');
        return;
    }

    // Calculate the angle of the bridge line
    const angle = Math.atan2(y2 - y1, x2 - x1);

    // Calculate starting point (d distance from x1,y1)
    const startX = x1 + d * 0.75 * Math.cos(angle);
    const startY = y1 + d * 0.75 * Math.sin(angle);

    // Plank dimensions
    const avgPlankWidth = d / 4;
    const avgPlankLength = d * 2 / 3;

    // Calculate number of planks - use slightly smaller spacing to ensure overlap
    const plankSpacing = avgPlankWidth * 0.8; // 20% overlap
    const numPlanks = Math.floor(bridgeLength / plankSpacing) + 1;

    // First, draw the supporting boards underneath
    const supportWidth = avgPlankWidth * 0.5; // Half the width of planks
    const supportOffset = avgPlankLength * 0.35; // Distance from bridge centerline

    // Draw two parallel support boards running lengthwise
    for (let side = -1; side <= 1; side += 2) { // -1 for left side, +1 for right side
        offscreenContext.save();
        offscreenContext.fillStyle = '#8B4513'; // Darker brown for supports
        offscreenContext.strokeStyle = '#000000';
        offscreenContext.lineWidth = 2;

        // Calculate support board position (offset perpendicular to bridge direction)
        const perpAngleSupport = angle + Math.PI / 2;
        const supportCenterX = startX + bridgeLength/2 * Math.cos(angle) + side * supportOffset * Math.cos(perpAngleSupport);
        const supportCenterY = startY + bridgeLength/2 * Math.sin(angle) + side * supportOffset * Math.sin(perpAngleSupport);

        // Calculate support board corners (running parallel to bridge)
        const supportHalfWidth = supportWidth / 2;
        const supportHalfLength = bridgeLength / 2;

        const supportCorners = [
            {
                x: supportCenterX - supportHalfLength * Math.cos(angle) - supportHalfWidth * Math.cos(perpAngleSupport),
                y: supportCenterY - supportHalfLength * Math.sin(angle) - supportHalfWidth * Math.sin(perpAngleSupport)
            },
            {
                x: supportCenterX + supportHalfLength * Math.cos(angle) - supportHalfWidth * Math.cos(perpAngleSupport),
                y: supportCenterY + supportHalfLength * Math.sin(angle) - supportHalfWidth * Math.sin(perpAngleSupport)
            },
            {
                x: supportCenterX + supportHalfLength * Math.cos(angle) + supportHalfWidth * Math.cos(perpAngleSupport),
                y: supportCenterY + supportHalfLength * Math.sin(angle) + supportHalfWidth * Math.sin(perpAngleSupport)
            },
            {
                x: supportCenterX - supportHalfLength * Math.cos(angle) + supportHalfWidth * Math.cos(perpAngleSupport),
                y: supportCenterY - supportHalfLength * Math.sin(angle) + supportHalfWidth * Math.sin(perpAngleSupport)
            }
        ];

        // Draw support board
        offscreenContext.beginPath();
        offscreenContext.moveTo(supportCorners[0].x, supportCorners[0].y);
        for (let j = 1; j < supportCorners.length; j++) {
            offscreenContext.lineTo(supportCorners[j].x, supportCorners[j].y);
        }
        offscreenContext.closePath();
        offscreenContext.fill();
        offscreenContext.stroke();

        offscreenContext.restore();
    }

    // Create array to track which planks to skip (missing planks)
    const missingPlanks = new Set();
    const numMissingPlanks = 1 + Math.floor(Math.random() * 2); // 1 or 2 missing planks
    for (let i = 0; i < numMissingPlanks; i++) {
        const missingIndex = Math.floor(Math.random() * Math.max(1, numPlanks - 2)) + 1; // Don't remove first or last plank
        missingPlanks.add(missingIndex);
    }

    // Draw each plank (except missing ones)
    for (let i = 0; i < numPlanks; i++) {
        // Skip missing planks
        if (missingPlanks.has(i)) continue;

        // Calculate position along the bridge line with consistent spacing
        const plankCenterX = startX + i * plankSpacing * Math.cos(angle);
        const plankCenterY = startY + i * plankSpacing * Math.sin(angle);

        // Stop if we've gone past the bridge end
        const distanceFromStart = i * plankSpacing;
        if (distanceFromStart > bridgeLength) break;

        // Add some variation to plank dimensions (±20% of average)
        const lengthVariation = (Math.random() - 0.5) * 0.4;
        const widthVariation = (Math.random() - 0.5) * 0.4;
        const plankLength = avgPlankLength * (1 + lengthVariation);
        const plankWidth = avgPlankWidth * (1 + widthVariation);

        // Calculate plank angle (perpendicular to bridge line)
        const perpAngle = angle + Math.PI / 2;

        // Add slight rotation variation for rustic appearance (±15 degrees)
        const rotationVariation = (Math.random() - 0.5) * (Math.PI / 12); // ±π/12 radians = ±15 degrees
        const adjustedPerpAngle = perpAngle + rotationVariation;

        // Calculate plank corners (with rotation variation)
        const halfLength = plankLength / 2;
        const halfWidth = plankWidth / 2;

        // Calculate the four corners of the plank rectangle
        const corners = [
            {
                x: plankCenterX + halfLength * Math.cos(adjustedPerpAngle) - halfWidth * Math.cos(angle),
                y: plankCenterY + halfLength * Math.sin(adjustedPerpAngle) - halfWidth * Math.sin(angle)
            },
            {
                x: plankCenterX + halfLength * Math.cos(adjustedPerpAngle) + halfWidth * Math.cos(angle),
                y: plankCenterY + halfLength * Math.sin(adjustedPerpAngle) + halfWidth * Math.sin(angle)
            },
            {
                x: plankCenterX - halfLength * Math.cos(adjustedPerpAngle) + halfWidth * Math.cos(angle),
                y: plankCenterY - halfLength * Math.sin(adjustedPerpAngle) + halfWidth * Math.sin(angle)
            },
            {
                x: plankCenterX - halfLength * Math.cos(adjustedPerpAngle) - halfWidth * Math.cos(angle),
                y: plankCenterY - halfLength * Math.sin(adjustedPerpAngle) - halfWidth * Math.sin(angle)
            }
        ];

        // Draw the plank
        offscreenContext.save();

        // Add some color variation for realistic wood appearance
        const brownBase = 101 + Math.floor(Math.random() * 30);
        const brownVariation = Math.floor(Math.random() * 20);
        offscreenContext.fillStyle = `rgb(${brownBase + brownVariation}, ${Math.floor(brownBase * 0.6) + brownVariation}, ${Math.floor(brownBase * 0.3) + brownVariation})`;

        // Draw plank rectangle
        offscreenContext.beginPath();
        offscreenContext.moveTo(corners[0].x, corners[0].y);
        for (let j = 1; j < corners.length; j++) {
            offscreenContext.lineTo(corners[j].x, corners[j].y);
        }
        offscreenContext.closePath();
        offscreenContext.fill();

        // Add plank outline
        offscreenContext.strokeStyle = '#000000';
        offscreenContext.lineWidth = 1;
        offscreenContext.stroke();

        // Add wood grain effect (simple lines)
        offscreenContext.strokeStyle = `rgba(0, 0, 0, ${0.1 + Math.random() * 0.1})`;
        offscreenContext.lineWidth = 0.5;
        const grainLines = 2 + Math.floor(Math.random() * 3);
        for (let g = 0; g < grainLines; g++) {
            const grainT = (g + 1) / (grainLines + 1);
            const grainStartX = corners[0].x + grainT * (corners[3].x - corners[0].x);
            const grainStartY = corners[0].y + grainT * (corners[3].y - corners[0].y);
            const grainEndX = corners[1].x + grainT * (corners[2].x - corners[1].x);
            const grainEndY = corners[1].y + grainT * (corners[2].y - corners[1].y);

            offscreenContext.beginPath();
            offscreenContext.moveTo(grainStartX, grainStartY);
            offscreenContext.lineTo(grainEndX, grainEndY);
            offscreenContext.stroke();
        }

        offscreenContext.restore();
    }

    // // Draw white dots at start and end points
    // offscreenContext.save();
    // offscreenContext.fillStyle = 'white';
    // offscreenContext.strokeStyle = 'black';
    // offscreenContext.lineWidth = 2;
    //
    // // Draw dot at x1, y1
    // offscreenContext.beginPath();
    // offscreenContext.arc(x1, y1, 5, 0, 2 * Math.PI);
    // offscreenContext.fill();
    // offscreenContext.stroke();
    //
    // // Draw dot at x2, y2
    // offscreenContext.beginPath();
    // offscreenContext.arc(x2, y2, 5, 0, 2 * Math.PI);
    // offscreenContext.fill();
    // offscreenContext.stroke();
    // offscreenContext.restore();

    // Optional: Draw the bridge line for reference (comment out if not needed)
    /*
    offscreenContext.save();
    offscreenContext.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    offscreenContext.lineWidth = 2;
    offscreenContext.setLineDash([5, 5]);
    offscreenContext.beginPath();
    offscreenContext.moveTo(startX, startY);
    offscreenContext.lineTo(startX + bridgeLength * Math.cos(angle), startY + bridgeLength * Math.sin(angle));
    offscreenContext.stroke();
    offscreenContext.restore();
    */
}


function drawStone(x, y, fill) {
    const center = centerOf(x, y);
    const centerX = center.x;
    const centerY = center.y;

    // Stone sizing
    const avgRadius = 0.8 * hexSide * 0.75;
    const maxRadius = 0.9 * hexSide * 0.75;

    // Generate irregular polygon points
    const numPoints = 8 + Math.floor(Math.random() * 4); // 8-11 points for irregularity
    const points = [];

    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI;

        // Add randomness to radius (70% to 100% of avgRadius)
        const radiusVariation = 0.7 + Math.random() * 0.3;
        let radius = avgRadius * radiusVariation;

        // Ensure we stay within maxRadius constraint
        radius = Math.min(radius, maxRadius);

        // Add slight angular variation for more natural look
        const angleVariation = (Math.random() - 0.5) * 0.3; // ±0.15 radians
        const adjustedAngle = angle + angleVariation;

        points.push({
            x: centerX + radius * Math.cos(adjustedAngle),
            y: centerY + radius * Math.sin(adjustedAngle)
        });
    }

    offscreenContext.save();

    // Create the stone shape path
    offscreenContext.beginPath();
    offscreenContext.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        offscreenContext.lineTo(points[i].x, points[i].y);
    }
    offscreenContext.closePath();

    // Add dimensionality with gradient
    const gradient = offscreenContext.createRadialGradient(
        centerX - avgRadius * 0.3, centerY - avgRadius * 0.3, 0, // Light source from top-left
        centerX, centerY, avgRadius
    );

    // Create lighter and darker versions of the fill color
    const fillColor = fill;
    let r, g, b;

    // Parse the fill color (assuming hex format like #RRGGBB)
    if (fillColor.startsWith('#')) {
        r = parseInt(fillColor.substr(1, 2), 16);
        g = parseInt(fillColor.substr(3, 2), 16);
        b = parseInt(fillColor.substr(5, 2), 16);
    } else {
        // Default to gray if color parsing fails
        r = g = b = 128;
    }

    if ( map.texture == 'yes')  {
              // Create highlight and shadow colors
              const highlight = `rgb(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)})`;
              const midtone = fillColor;
              const shadow = `rgb(${Math.max(0, r - 50)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 50)})`;

              gradient.addColorStop(0, highlight);
              gradient.addColorStop(0.4, midtone);
              gradient.addColorStop(1, shadow);

              // Fill with gradient
              offscreenContext.fillStyle = gradient;
              offscreenContext.fill();

              // Add texture with small random dots/speckles
              offscreenContext.fillStyle = `rgba(0, 0, 0, 0.1)`;
              const numSpeckles = 5 + Math.floor(Math.random() * 10);
              for (let i = 0; i < numSpeckles; i++) {
                  const speckleX = centerX + (Math.random() - 0.5) * avgRadius * 1.5;
                  const speckleY = centerY + (Math.random() - 0.5) * avgRadius * 1.5;

                  // Check if speckle is inside the stone shape
                  if (isPointInPolygon(speckleX, speckleY, points)) {
                      offscreenContext.beginPath();
                      offscreenContext.arc(speckleX, speckleY, 1 + Math.random() * 2, 0, 2 * Math.PI);
                      offscreenContext.fill();
                  }
              }

              // Add some lighter speckles for more texture
              offscreenContext.fillStyle = `rgba(255, 255, 255, 0.15)`;
              const numLightSpeckles = 3 + Math.floor(Math.random() * 5);
              for (let i = 0; i < numLightSpeckles; i++) {
                  const speckleX = centerX + (Math.random() - 0.5) * avgRadius * 1.2;
                  const speckleY = centerY + (Math.random() - 0.5) * avgRadius * 1.2;

                  if (isPointInPolygon(speckleX, speckleY, points)) {
                      offscreenContext.beginPath();
                      offscreenContext.arc(speckleX, speckleY, 0.5 + Math.random() * 1, 0, 2 * Math.PI);
                      offscreenContext.fill();
                  }
              }

              // Add subtle crack lines for more realism
              offscreenContext.strokeStyle = `rgba(0, 0, 0, 0.2)`;
              offscreenContext.lineWidth = 0.5;
              const numCracks = 1 + Math.floor(Math.random() * 3);
              for (let i = 0; i < numCracks; i++) {
                  const startAngle = Math.random() * 2 * Math.PI;
                  const startRadius = Math.random() * avgRadius * 0.3;
                  const endRadius = startRadius + Math.random() * avgRadius * 0.4;

                  const startX = centerX + startRadius * Math.cos(startAngle);
                  const startY = centerY + startRadius * Math.sin(startAngle);
                  const endX = centerX + endRadius * Math.cos(startAngle + (Math.random() - 0.5) * 0.5);
                  const endY = centerY + endRadius * Math.sin(startAngle + (Math.random() - 0.5) * 0.5);

                  if (isPointInPolygon(startX, startY, points) && isPointInPolygon(endX, endY, points)) {
                      offscreenContext.beginPath();
                      offscreenContext.moveTo(startX, startY);
                      offscreenContext.lineTo(endX, endY);
                      offscreenContext.stroke();
                  }
              }
          } else {

            offscreenContext.fillStyle = fillColor;
            offscreenContext.fill();

          }
    // Black outline
    offscreenContext.strokeStyle = 'black';
    offscreenContext.lineWidth = 1;
    offscreenContext.beginPath();
    offscreenContext.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        offscreenContext.lineTo(points[i].x, points[i].y);
    }
    offscreenContext.closePath();
    offscreenContext.stroke();

    offscreenContext.restore();
}

// Helper function to check if a point is inside a polygon
function isPointInPolygon(x, y, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        if (((polygon[i].y > y) !== (polygon[j].y > y)) &&
            (x < (polygon[j].x - polygon[i].x) * (y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
            inside = !inside;
        }
    }
    return inside;
}



// function drawStoneBridge(x1, y1, x2, y2, d) {
//     // Calculate the total length of the bridge line
//     const totalLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
//
//     // Calculate the bridge length (total minus d from each end)
//     const bridgeLength = totalLength - 2 * d;
//
//     if (bridgeLength <= 0) {
//         console.warn('Bridge length is too short for the given d distance');
//         return;
//     }
//
//     // Calculate the angle of the bridge line
//     const angle = Math.atan2(y2 - y1, x2 - x1);
//
//     // Calculate starting point (d distance from x1,y1)
//     const startX = x1 + d * Math.cos(angle);
//     const startY = y1 + d * Math.sin(angle);
//
//     // Calculate ending point
//     const endX = startX + bridgeLength * Math.cos(angle);
//     const endY = startY + bridgeLength * Math.sin(angle);
//
//     // Calculate perpendicular angle for width calculations
//     const perpAngle = angle + Math.PI / 2;
//
//     // Bridge width is d
//     const bridgeWidth = d;
//     const halfWidth = bridgeWidth / 2;
//
//     // Calculate bridge corners
//     const bridgeCorners = [
//         {
//             x: startX - halfWidth * Math.cos(perpAngle),
//             y: startY - halfWidth * Math.sin(perpAngle)
//         },
//         {
//             x: endX - halfWidth * Math.cos(perpAngle),
//             y: endY - halfWidth * Math.sin(perpAngle)
//         },
//         {
//             x: endX + halfWidth * Math.cos(perpAngle),
//             y: endY + halfWidth * Math.sin(perpAngle)
//         },
//         {
//             x: startX + halfWidth * Math.cos(perpAngle),
//             y: startY + halfWidth * Math.sin(perpAngle)
//         }
//     ];
//
//     // Draw the bridge base
//     offscreenContext.save();
//     offscreenContext.fillStyle = map.palette.clear;
//     offscreenContext.beginPath();
//     offscreenContext.moveTo(bridgeCorners[0].x, bridgeCorners[0].y);
//     for (let i = 1; i < bridgeCorners.length; i++) {
//         offscreenContext.lineTo(bridgeCorners[i].x, bridgeCorners[i].y);
//     }
//     offscreenContext.closePath();
//     offscreenContext.fill();
//     offscreenContext.restore();
//
//     // Draw stone lines along both sides
//     const stoneWidth = d / 10;
//     const stoneOffsets = [-halfWidth+stoneWidth*0.6, halfWidth-stoneWidth*0.6]; // Left and right sides
//
//     for (let sideIndex = 0; sideIndex < stoneOffsets.length; sideIndex++) {
//         const sideOffset = stoneOffsets[sideIndex];
//
//         // Calculate the number of stones that can fit along the bridge length
//         const numStones = Math.floor(bridgeLength / stoneWidth);
//
//         for (let i = 0; i < numStones; i++) {
//             // Add variation to stone width (±1 pixel)
//             const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
//             const currentStoneWidth = stoneWidth + variation;
//
//             // Calculate stone position along the bridge
//             const stoneStartDistance = i * stoneWidth;
//             const stoneEndDistance = stoneStartDistance + currentStoneWidth;
//
//             // Skip if stone would exceed bridge length
//             if (stoneEndDistance > bridgeLength) break;
//
//             // Calculate stone start and end points
//             const stoneStartX = startX + stoneStartDistance * Math.cos(angle);
//             const stoneStartY = startY + stoneStartDistance * Math.sin(angle);
//             const stoneEndX = startX + stoneEndDistance * Math.cos(angle);
//             const stoneEndY = startY + stoneEndDistance * Math.sin(angle);
//
//             // Calculate stone corners (perpendicular to bridge direction)
//             const stoneCorners = [
//                 {
//                     x: stoneStartX + (sideOffset - stoneWidth/2) * Math.cos(perpAngle),
//                     y: stoneStartY + (sideOffset - stoneWidth/2) * Math.sin(perpAngle)
//                 },
//                 {
//                     x: stoneEndX + (sideOffset - stoneWidth/2) * Math.cos(perpAngle),
//                     y: stoneEndY + (sideOffset - stoneWidth/2) * Math.sin(perpAngle)
//                 },
//                 {
//                     x: stoneEndX + (sideOffset + stoneWidth/2) * Math.cos(perpAngle),
//                     y: stoneEndY + (sideOffset + stoneWidth/2) * Math.sin(perpAngle)
//                 },
//                 {
//                     x: stoneStartX + (sideOffset + stoneWidth/2) * Math.cos(perpAngle),
//                     y: stoneStartY + (sideOffset + stoneWidth/2) * Math.sin(perpAngle)
//                 }
//             ];
//
//             // Draw stone outline
//             offscreenContext.save();
//             offscreenContext.strokeStyle = map.palette.lines;
//             offscreenContext.lineWidth = 1;
//             offscreenContext.beginPath();
//             offscreenContext.moveTo(stoneCorners[0].x, stoneCorners[0].y);
//             for (let j = 1; j < stoneCorners.length; j++) {
//                 offscreenContext.lineTo(stoneCorners[j].x, stoneCorners[j].y);
//             }
//             offscreenContext.closePath();
//             offscreenContext.stroke();
//             offscreenContext.restore();
//         }
//     }
//
//     // Draw perpendicular lines at each end of the bridge
//     offscreenContext.save();
//     offscreenContext.strokeStyle = map.palette.lines;
//     offscreenContext.fillStyle = map.palette.lines;
//     offscreenContext.lineWidth = 1;
//
//     // Draw perpendicular line at the start of the bridge
//     const startLineStart = {
//         x: startX - halfWidth * Math.cos(perpAngle),
//         y: startY - halfWidth * Math.sin(perpAngle)
//     };
//     const startLineEnd = {
//         x: startX + halfWidth * Math.cos(perpAngle),
//         y: startY + halfWidth * Math.sin(perpAngle)
//     };
//
//     offscreenContext.beginPath();
//     offscreenContext.moveTo(startLineStart.x, startLineStart.y);
//     offscreenContext.lineTo(startLineEnd.x, startLineEnd.y);
//     offscreenContext.stroke();
//
//     // Draw perpendicular line at the end of the bridge
//     const endLineStart = {
//         x: endX - halfWidth * Math.cos(perpAngle),
//         y: endY - halfWidth * Math.sin(perpAngle)
//     };
//     const endLineEnd = {
//         x: endX + halfWidth * Math.cos(perpAngle),
//         y: endY + halfWidth * Math.sin(perpAngle)
//     };
//
//     offscreenContext.beginPath();
//     offscreenContext.moveTo(endLineStart.x, endLineStart.y);
//     offscreenContext.lineTo(endLineEnd.x, endLineEnd.y);
//     offscreenContext.stroke();
//
//     offscreenContext.restore();
//
//     // Draw perpendicular lines at odd multiples of d and dots at even multiples
//     const numMarkers = Math.floor(bridgeLength / d);
//
//     for (let i = 1; i <= numMarkers; i++) {
//         const markerDistance = i * d;
//         const markerX = startX + markerDistance * Math.cos(angle);
//         const markerY = startY + markerDistance * Math.sin(angle);
//
//         offscreenContext.save();
//         offscreenContext.strokeStyle = map.palette.lines;
//         offscreenContext.fillStyle = map.palette.lines;
//         offscreenContext.lineWidth = 1;
//
//         if (i % 2 === 1) {
//             // Odd multiple: draw circular dot (4 pixels across = 2 pixel radius)
//             offscreenContext.beginPath();
//             offscreenContext.arc(markerX, markerY, 2, 0, 2 * Math.PI);
//             offscreenContext.fill();
//         } else {
//             // Even multiple: draw perpendicular line
//             const lineStart = {
//                 x: markerX - halfWidth * Math.cos(perpAngle),
//                 y: markerY - halfWidth * Math.sin(perpAngle)
//             };
//             const lineEnd = {
//                 x: markerX + halfWidth * Math.cos(perpAngle),
//                 y: markerY + halfWidth * Math.sin(perpAngle)
//             };
//
//             offscreenContext.beginPath();
//             offscreenContext.moveTo(lineStart.x, lineStart.y);
//             offscreenContext.lineTo(lineEnd.x, lineEnd.y);
//             offscreenContext.stroke();
//         }
//
//         offscreenContext.restore();
//     }
// }


function drawStoneBridge(x1, y1, x2, y2, d) {
    // Calculate the total length of the bridge line
    const totalLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    // Calculate the bridge length (total minus d from each end)
    const bridgeLength = totalLength - 2 * d;

    if (bridgeLength <= 1) {
        console.warn('Bridge length is too short for the given d distance');
        return;
    }

    // Calculate the angle of the bridge line
    const angle = Math.atan2(y2 - y1, x2 - x1);

    // Calculate starting point (d distance from x1,y1)
    const startX = x1 + d * Math.cos(angle);
    const startY = y1 + d * Math.sin(angle);

    // Calculate ending point
    const endX = startX + bridgeLength * Math.cos(angle);
    const endY = startY + bridgeLength * Math.sin(angle);

    // Calculate perpendicular angle for width calculations
    const perpAngle = angle + Math.PI / 2;

    // Bridge width is d * 1.1 (10% wider)
    const bridgeWidth = d * 1.1;
    const halfWidth = bridgeWidth / 2;

    // Calculate bridge corners
    const bridgeCorners = [
        {
            x: startX - halfWidth * Math.cos(perpAngle),
            y: startY - halfWidth * Math.sin(perpAngle)
        },
        {
            x: endX - halfWidth * Math.cos(perpAngle),
            y: endY - halfWidth * Math.sin(perpAngle)
        },
        {
            x: endX + halfWidth * Math.cos(perpAngle),
            y: endY + halfWidth * Math.sin(perpAngle)
        },
        {
            x: startX + halfWidth * Math.cos(perpAngle),
            y: startY + halfWidth * Math.sin(perpAngle)
        }
    ];

    // Draw the bridge base
    offscreenContext.save();
    offscreenContext.fillStyle = '#999999';
    offscreenContext.beginPath();
    offscreenContext.moveTo(bridgeCorners[0].x, bridgeCorners[0].y);
    for (let i = 1; i < bridgeCorners.length; i++) {
        offscreenContext.lineTo(bridgeCorners[i].x, bridgeCorners[i].y);
    }
    offscreenContext.closePath();
    offscreenContext.fill();
    offscreenContext.restore();

    // Draw stone lines along both sides
    const stoneWidth = d / 10;
    const inwardOffset = stoneWidth * 0.6; // Move stones inward by this amount
    const stoneOffsets = [-halfWidth + inwardOffset, halfWidth - inwardOffset]; // Left and right sides moved inward

    for (let sideIndex = 0; sideIndex < stoneOffsets.length; sideIndex++) {
        const sideOffset = stoneOffsets[sideIndex];

        // Calculate the number of stones that can fit along the bridge length (one third as many)
        const numStones = Math.floor(bridgeLength / stoneWidth / 3);
        const stoneSpacing = stoneWidth * 3; // Space stones 3 times further apart
        // Make stones longer to fill the gaps and create continuous appearance
        const stoneLength = stoneSpacing; // Make each stone as long as the spacing

        for (let i = 0; i < numStones; i++) {
            // Calculate stone position along the bridge
            const stoneStartDistance = i * stoneSpacing;
            let stoneEndDistance = stoneStartDistance + stoneLength;

            // Extend the last stone to reach the end of the bridge
            if (i === numStones - 1) {
                stoneEndDistance = bridgeLength;
            }

            // Skip if stone would exceed bridge length (shouldn't happen now)
            if (stoneEndDistance > bridgeLength) break;

            // Calculate stone start and end points
            const stoneStartX = startX + stoneStartDistance * Math.cos(angle);
            const stoneStartY = startY + stoneStartDistance * Math.sin(angle);
            const stoneEndX = startX + stoneEndDistance * Math.cos(angle);
            const stoneEndY = startY + stoneEndDistance * Math.sin(angle);

            // Calculate stone corners (perpendicular to bridge direction)
            const stoneCorners = [
                {
                    x: stoneStartX + (sideOffset - stoneWidth/2) * Math.cos(perpAngle),
                    y: stoneStartY + (sideOffset - stoneWidth/2) * Math.sin(perpAngle)
                },
                {
                    x: stoneEndX + (sideOffset - stoneWidth/2) * Math.cos(perpAngle),
                    y: stoneEndY + (sideOffset - stoneWidth/2) * Math.sin(perpAngle)
                },
                {
                    x: stoneEndX + (sideOffset + stoneWidth/2) * Math.cos(perpAngle),
                    y: stoneEndY + (sideOffset + stoneWidth/2) * Math.sin(perpAngle)
                },
                {
                    x: stoneStartX + (sideOffset + stoneWidth/2) * Math.cos(perpAngle),
                    y: stoneStartY + (sideOffset + stoneWidth/2) * Math.sin(perpAngle)
                }
            ];

            // Draw stone outline
            offscreenContext.save();
            offscreenContext.strokeStyle = '#444444';
            offscreenContext.lineWidth = 1;
            offscreenContext.setLineDash([]); // Ensure solid lines
            offscreenContext.beginPath();
            offscreenContext.moveTo(stoneCorners[0].x, stoneCorners[0].y);
            for (let j = 1; j < stoneCorners.length; j++) {
                offscreenContext.lineTo(stoneCorners[j].x, stoneCorners[j].y);
            }
            offscreenContext.closePath();
            offscreenContext.stroke();
            offscreenContext.restore();
        }
    }

    // Draw perpendicular lines at each end of the bridge
    offscreenContext.save();
    offscreenContext.strokeStyle = map.palette.lines;
    offscreenContext.fillStyle = map.palette.lines;
    offscreenContext.lineWidth = 1;

    // Draw perpendicular line at the start of the bridge
    const startLineStart = {
        x: startX - halfWidth * Math.cos(perpAngle),
        y: startY - halfWidth * Math.sin(perpAngle)
    };
    const startLineEnd = {
        x: startX + halfWidth * Math.cos(perpAngle),
        y: startY + halfWidth * Math.sin(perpAngle)
    };

    offscreenContext.beginPath();
    offscreenContext.moveTo(startLineStart.x, startLineStart.y);
    offscreenContext.lineTo(startLineEnd.x, startLineEnd.y);
    offscreenContext.stroke();

    // Draw perpendicular line at the end of the bridge
    const endLineStart = {
        x: endX - halfWidth * Math.cos(perpAngle),
        y: endY - halfWidth * Math.sin(perpAngle)
    };
    const endLineEnd = {
        x: endX + halfWidth * Math.cos(perpAngle),
        y: endY + halfWidth * Math.sin(perpAngle)
    };

    offscreenContext.beginPath();
    offscreenContext.moveTo(endLineStart.x, endLineStart.y);
    offscreenContext.lineTo(endLineEnd.x, endLineEnd.y);
    offscreenContext.stroke();

    offscreenContext.restore();

    // Draw perpendicular lines at odd multiples of d and dots at even multiples
    const numMarkers = Math.floor(bridgeLength / d);

    for (let i = 1; i <= numMarkers; i++) {
        const markerDistance = i * d;
        const markerX = startX + markerDistance * Math.cos(angle);
        const markerY = startY + markerDistance * Math.sin(angle);

        offscreenContext.save();
        offscreenContext.strokeStyle = map.palette.lines;
        offscreenContext.fillStyle = map.palette.lines;
        offscreenContext.lineWidth = 1;

        if (i % 2 === 1) {
            // Odd multiple: draw circular dot (4 pixels across = 2 pixel radius)
            offscreenContext.beginPath();
            offscreenContext.arc(markerX, markerY, 2, 0, 2 * Math.PI);
            offscreenContext.fill();
        } else {
            // Even multiple: draw perpendicular line
            const lineStart = {
                x: markerX - halfWidth * Math.cos(perpAngle),
                y: markerY - halfWidth * Math.sin(perpAngle)
            };
            const lineEnd = {
                x: markerX + halfWidth * Math.cos(perpAngle),
                y: markerY + halfWidth * Math.sin(perpAngle)
            };

            offscreenContext.beginPath();
            offscreenContext.moveTo(lineStart.x, lineStart.y);
            offscreenContext.lineTo(lineEnd.x, lineEnd.y);
            offscreenContext.stroke();
        }

        offscreenContext.restore();
    }
}
