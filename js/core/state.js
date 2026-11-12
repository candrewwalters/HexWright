// HexWright — Global constants and editor state (hex sizes, view focus/zoom, undo stack).
// (Classic script: shares the global scope with the other js/ files.)

    // global = {
    //   currentTool: 'clear',
    //   changed: 'no'
    // }

    const hexHeight = 100;
    const hexSide = hexHeight / Math.sqrt( 3 );
    const hexSideSquared = hexSide ** 2;
    const hexWidth = 2 * hexSide;

    focusX = 0;
    focusY = 0;

    zoomX = 0;
    zoomY = 0;
    zoomLevel = 300;

    let startX, startY;
    isDragging = false;

    undoStack = [];

    let bridgeStart;


//     const vertexStraddlingAngles = [
//     -2.7576,  // 8° CCW from vertex 0 (top-left)
//     -2.4784,  // 8° CW from vertex 0 (top-left)
//     -2.1108,  // 8° CCW from vertex 1 (top-right)
//     -1.8316,  // 8° CW from vertex 1 (top-right)
//     -1.4640,  // 8° CCW from vertex 2 (right)
//     -1.1848,  // 8° CW from vertex 2 (right)
//     -0.8172,  // 8° CCW from vertex 3 (bottom-right)
//     -0.5380,  // 8° CW from vertex 3 (bottom-right)
//     -0.1704,  // 8° CCW from vertex 4 (bottom-left)
//      0.1088,  // 8° CW from vertex 4 (bottom-left)
//      0.4764,  // 8° CCW from vertex 5 (left)
//      0.7556   // 8° CW from vertex 5 (left)
// ];

// const vertexStraddlingAngles = [
//     -2.7576,  // direction 0, CCW corner (top-left vertex, CCW angle)
//     -2.1108,  // direction 0, CW corner (top-right vertex, CCW angle)
//     -1.8316,  // direction 1, CCW corner (top-right vertex, CW angle)
//     -1.4640,  // direction 1, CW corner (right vertex, CCW angle)
//     -1.1848,  // direction 2, CCW corner (right vertex, CW angle)
//     -0.8172,  // direction 2, CW corner (bottom-right vertex, CCW angle)
//     -0.5380,  // direction 3, CCW corner (bottom-right vertex, CW angle)
//     -0.1704,  // direction 3, CW corner (bottom-left vertex, CCW angle)
//      0.1088,  // direction 4, CCW corner (bottom-left vertex, CW angle)
//      0.4764,  // direction 4, CW corner (left vertex, CCW angle)
//      0.7556,  // direction 5, CCW corner (left vertex, CW angle)
//     -2.4784   // direction 5, CW corner (top-left vertex, CW angle)
// ];

// const vertexStraddlingAngles = [
//     -2.7576,  // direction 0, CCW corner (top-left vertex, CCW angle)
//     -1.7104,  // direction 0, CW corner (top-right vertex, CCW angle)
//     -1.4312,  // direction 1, CCW corner (top-right vertex, CW angle)
//     -0.6632,  // direction 1, CW corner (right vertex, CCW angle)
//     -0.3840,  // direction 2, CCW corner (right vertex, CW angle)
//      0.3840,  // direction 2, CW corner (bottom-right vertex, CCW angle)
//      0.6632,  // direction 3, CCW corner (bottom-right vertex, CW angle)
//      1.4312,  // direction 3, CW corner (bottom-left vertex, CCW angle)
//      1.7104,  // direction 4, CCW corner (bottom-left vertex, CW angle)
//      2.4784,  // direction 4, CW corner (left vertex, CCW angle)
//      2.7576,  // direction 5, CCW corner (left vertex, CW angle)
//     -2.4784   // direction 5, CW corner (top-left vertex, CW angle)
// ];

// const vertexStraddlingAngles = [
//     -2.2340, // direction 0, CCW corner (top-left vertex, CCW angle)
//     -1.1868, // direction 0, CW corner (top-right vertex, CCW angle)
//     -0.9076, // direction 1, CCW corner (top-right vertex, CW angle)
//     -0.1396, // direction 1, CW corner (right vertex, CCW angle)
//      0.1396, // direction 2, CCW corner (right vertex, CW angle)
//      0.9076, // direction 2, CW corner (bottom-right vertex, CCW angle)
//      1.1868, // direction 3, CCW corner (bottom-right vertex, CW angle)
//      1.9548, // direction 3, CW corner (bottom-left vertex, CCW angle)
//      2.2340, // direction 4, CCW corner (bottom-left vertex, CW angle)
//      3.0020, // direction 4, CW corner (left vertex, CCW angle)
//      3.2812, // direction 5, CCW corner (left vertex, CW angle)
//     -1.9548  // direction 5, CW corner (top-left vertex, CW angle)
// ];

// const vertexStraddlingAngles = [
//     -1.1868, // direction 0, CCW corner (top-left vertex, CCW angle)
//     -0.1396, // direction 0, CW corner (top-right vertex, CCW angle)
//      0.1396, // direction 1, CCW corner (top-right vertex, CW angle)
//      0.9076, // direction 1, CW corner (right vertex, CCW angle)
//      1.1868, // direction 2, CCW corner (right vertex, CW angle)
//      1.9548, // direction 2, CW corner (bottom-right vertex, CCW angle)
//      2.2340, // direction 3, CCW corner (bottom-right vertex, CW angle)
//      3.0020, // direction 3, CW corner (bottom-left vertex, CCW angle)
//     -3.0584, // direction 4, CCW corner (bottom-left vertex, CW angle)
//     -2.2904, // direction 4, CW corner (left vertex, CCW angle)
//     -2.0112, // direction 5, CCW corner (left vertex, CW angle)
//     -0.9076  // direction 5, CW corner (top-left vertex, CW angle)
// ];


// const vertexStraddlingAngles = [
//      0.9076, // direction 0, CCW corner (top-left vertex, CCW angle)
//      1.9548, // direction 0, CW corner (top-right vertex, CCW angle)
//      2.2340, // direction 1, CCW corner (top-right vertex, CW angle)
//      3.0020, // direction 1, CW corner (right vertex, CCW angle)
//     -3.0584, // direction 2, CCW corner (right vertex, CW angle)
//     -2.2904, // direction 2, CW corner (bottom-right vertex, CCW angle)
//     -2.0112, // direction 3, CCW corner (bottom-right vertex, CW angle)
//     -0.9076, // direction 3, CW corner (bottom-left vertex, CCW angle)
//     -0.1396, // direction 4, CCW corner (bottom-left vertex, CW angle)
//      0.9076, // direction 4, CW corner (left vertex, CCW angle)
//      1.1868, // direction 5, CCW corner (left vertex, CW angle)
//      2.2340  // direction 5, CW corner (top-left vertex, CW angle)
// ];

const vertexStraddlingAngles = [
    -2.2340, // upper-left vertex, 8° CCW
    -1.9548, // upper-left vertex, 8° CW
    -1.1868, // upper-right vertex, 8° CCW
    -0.9076, // upper-right vertex, 8° CW
    -0.1396, // right vertex, 8° CCW
     0.1396, // right vertex, 8° CW
     0.9076, // lower-right vertex, 8° CCW
     1.1868, // lower-right vertex, 8° CW
     1.9548, // lower-left vertex, 8° CCW
     2.2340, // lower-left vertex, 8° CW
     3.0020, // left vertex, 8° CCW
    -3.0584  // left vertex, 8° CW
];

function drawAngleLines( centerX, centerY ) {

    let ctx = offscreenContext;

    // Draw the hexagon outline for reference
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI/3 - Math.PI*5/6;
        const x = centerX + hexSide * Math.cos(angle);
        const y = centerY + hexSide * Math.sin(angle);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.stroke();

    // Draw lines for each angle
    const lineLength = hexSide * 1.2; // Extend beyond hex

    for (let i = 0; i < vertexStraddlingAngles.length; i++) {
        const angle = vertexStraddlingAngles[i];
        const endX = centerX + lineLength * Math.cos(angle);
        const endY = centerY + lineLength * Math.sin(angle);

        // Color code the lines by direction
        const direction = Math.floor(i / 2);
        const colors = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff'];
        ctx.strokeStyle = colors[direction];
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Add a label at the end of each line
        ctx.fillStyle = colors[direction];
        ctx.font = '12px Arial';
        ctx.fillText(`${i}`, endX + 5, endY + 5);
    }

    // Draw center point
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fill();
}

// Usage example:
// drawAngleLines(ctx, 400, 300, 50);
