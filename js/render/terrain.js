// HexWright — Terrain renderers: walls, tar, water, pits, falls, lava.
// (Classic script: shares the global scope with the other js/ files.)

    function simpleColorCategory(hexColor) {
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Calculate brightness
        const brightness = (r + g + b) / 3;

        if (brightness < 50) return 'black';
        if (brightness > 200) return 'white';

        // Find dominant color
        const max = Math.max(r, g, b);
        if (r === max && r > g + b) return 'red';
        if (g === max && g > r + b) return 'green';
        if (b === max && b > r + g) return 'blue';

        return 'mixed'; // When no single color dominates
    }


    function drawWall( centerX, centerY ) {
        const ctx = offscreenContext;
        const originalLineWidth = ctx.lineWidth;

        // Calculate hexagon vertices
        const vertices = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = centerX + hexSide * Math.cos(angle);
            const y = centerY + hexSide * Math.sin(angle);
            vertices.push({ x, y });
        }

        // Create hexagon path for clipping
        function createHexPath() {
            ctx.beginPath();
            ctx.moveTo(vertices[0].x, vertices[0].y);
            for (let i = 1; i < vertices.length; i++) {
                ctx.lineTo(vertices[i].x, vertices[i].y);
            }
            ctx.closePath();
        }

        // Save context state
        ctx.save();

        // Clip to hexagon shape
        createHexPath();
        ctx.clip();


        const blobRadius = hexSide * 0.8; // Base size of the blob (increased from 0.15)

        ctx.fillStyle = map.palette.wall;
        ctx.beginPath();

        for ( let direction = 0; direction < 6; direction++ ) {

          // first, figure out what hexes are adjacent
          const ccwHex = hexAdjacent( xI, yI, (direction+5)%6 );
          const acrossHex = hexAdjacent( xI, yI, direction );
          const cwHex = hexAdjacent( xI, yI, (direction+1)%6 );

          const ccwWall = ( inBounds( ccwHex.x, ccwHex.y ) ? map.grid[ccwHex.x][ccwHex.y].includes('wall hex') ||  map.grid[ccwHex.x][ccwHex.y].includes('offboard') : true );

          const acrossWall = ( inBounds( acrossHex.x, acrossHex.y ) ? map.grid[acrossHex.x][acrossHex.y].includes('wall hex')  || map.grid[acrossHex.x][acrossHex.y].includes('offboard') : true );

          const cwWall = ( inBounds(cwHex.x, cwHex.y ) ? map.grid[cwHex.x][cwHex.y].includes('wall hex') ||  map.grid[cwHex.x][cwHex.y].includes('offboard') : true );

          //then we find the corners
          const x1 = centerX + hexSide * Math.cos(direction * Math.PI/3 - Math.PI*2/3);
          const y1 = centerY + hexSide * Math.sin(direction * Math.PI/3 - Math.PI*2/3);

          const x2 = centerX + hexSide * Math.cos((direction+1) * Math.PI/3 - Math.PI*2/3);
          const y2 = centerY + hexSide * Math.sin((direction+1) * Math.PI/3 - Math.PI*2/3);

          // now we move around based on all these established variables.
          if ( ccwWall && acrossWall ) {

              x=x1;
              y=y1;

          } else if ( acrossWall ) {

            x = x1 + 0.15 * (x2 - x1);
            y = y1 + 0.15 * (y2 - y1);

          } else {

            x = centerX + blobRadius * Math.cos( vertexStraddlingAngles[ direction * 2 + 1 ] );
            y = centerY + blobRadius * Math.sin( vertexStraddlingAngles[ direction * 2 + 1 ] );

          }

          // now we move to that points
          if ( direction === 0 ) {
              ctx.moveTo(x, y);
          } else {
              ctx.lineTo(x, y);
          }

          // now we do the next corner
          if ( cwWall && acrossWall ) {

              ctx.lineTo(x2, y2);

          } else if ( acrossWall ) {

            x = x1 + 0.85 * (x2 - x1);
            y = y1 + 0.85 * (y2 - y1);

            ctx.lineTo(x, y);

          } else {

            let x3 = centerX + blobRadius * Math.cos( vertexStraddlingAngles[ (direction * 2 + 2)%12 ] );
            let y3 = centerY + blobRadius * Math.sin( vertexStraddlingAngles[ (direction * 2 + 2)%12 ] );

            ctx.lineTo( x3, y3 );

          }

        }


        ctx.closePath();
        offscreenContext.fillStyle = map.palette.walls;
        ctx.fill();
//        ctx.stroke();


        // Restore context state
        ctx.restore();

        // // Draw hexagon border
        // ctx.strokeStyle = '#2a1f15';
        // ctx.lineWidth = 2;
        // createHexPath();
        // ctx.stroke();

        ctx.lineWidth = originalLineWidth;

    }

    function drawTar( centerX, centerY ) {
        const ctx = offscreenContext;
        const originalLineWidth = ctx.lineWidth;

        // Calculate hexagon vertices
        const vertices = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = centerX + hexSide * Math.cos(angle);
            const y = centerY + hexSide * Math.sin(angle);
            vertices.push({ x, y });
        }

        // Create hexagon path for clipping
        function createHexPath() {
            ctx.beginPath();
            ctx.moveTo(vertices[0].x, vertices[0].y);
            for (let i = 1; i < vertices.length; i++) {
                ctx.lineTo(vertices[i].x, vertices[i].y);
            }
            ctx.closePath();
        }

        // Save context state
        ctx.save();

        // Clip to hexagon shape
        createHexPath();
//        ctx.clip();


        const blobRadius = hexSide * 0.7; // Base size of the blob (increased from 0.15)

        ctx.fillStyle = '#000000';
        ctx.beginPath();

        for ( let direction = 0; direction < 6; direction++ ) {

          // first, figure out what hexes are adjacent
          const ccwHex = hexAdjacent( xI, yI, (direction+5)%6 );
          const acrossHex = hexAdjacent( xI, yI, direction );
          const cwHex = hexAdjacent( xI, yI, (direction+1)%6 );

          //then figure out if they have pits
          const ccwTar = ( inBounds( ccwHex.x, ccwHex.y ) ? map.grid[ccwHex.x][ccwHex.y].includes('tar') ||  map.grid[ccwHex.x][ccwHex.y].includes('offboard') : true );

          const acrossTar = ( inBounds( acrossHex.x, acrossHex.y ) ? map.grid[acrossHex.x][acrossHex.y].includes('tar') ||  map.grid[acrossHex.x][acrossHex.y].includes('offboard') : true );

          const cwTar = ( inBounds(cwHex.x, cwHex.y ) ? map.grid[cwHex.x][cwHex.y].includes('tar') ||  map.grid[cwHex.x][cwHex.y].includes('offboard') : true );

          //then we find the corners
          const x1 = centerX + hexSide * Math.cos(direction * Math.PI/3 - Math.PI*2/3);
          const y1 = centerY + hexSide * Math.sin(direction * Math.PI/3 - Math.PI*2/3);

          const x2 = centerX + hexSide * Math.cos((direction+1) * Math.PI/3 - Math.PI*2/3);
          const y2 = centerY + hexSide * Math.sin((direction+1) * Math.PI/3 - Math.PI*2/3);

          // now we move around based on all these established variables.
//          if ( ccwWater && acrossWater ) {
          if ( ccwTar ) {

              x=x1;
              y=y1;

          } else if ( acrossTar ) {

            x = x1 + 0.15 * (x2 - x1);
            y = y1 + 0.15 * (y2 - y1);

          } else {

            x = centerX + blobRadius * Math.cos( vertexStraddlingAngles[ direction * 2 + 1 ] );
            y = centerY + blobRadius * Math.sin( vertexStraddlingAngles[ direction * 2 + 1 ] );

          }

          // now we move to that points
          if ( direction === 0 ) {
              ctx.moveTo(x, y);
          } else {
              ctx.lineTo(x, y);
          }

          // now we do the next corner
//          if ( cwWater && acrossWater ) {
          if ( cwTar && !ccwTar ) {

              ctx.lineTo(x2, y2);

          } else if ( acrossTar ) {

            x = x1 + 0.85 * (x2 - x1);
            y = y1 + 0.85 * (y2 - y1);

            ctx.lineTo(x, y);

          } else if (cwTar && ccwTar ) {

            // Calculate the new endpoint
              let newX = x1 + 0.85 * (x2 - x1);
              let newY = y1 + 0.85 * (y2 - y1);

              // Get current position (the point you just did lineTo)
              let currentX = x; // your current x position
              let currentY = y; // your current y position

              // Calculate midpoint between current position and new endpoint
              let midX = (currentX + newX) / 2;
              let midY = (currentY + newY) / 2;

              // Calculate direction from midpoint toward center
              let directionToCenter = Math.atan2(centerY - midY, centerX - midX);

              // Calculate control point (10-15% toward center)
              let curveStrength = 0.1 + Math.random() * 0.05; // 10-15%
              let distanceToCenter = Math.sqrt((centerX - midX) ** 2 + (centerY - midY) ** 2);
              let controlX = midX + Math.cos(directionToCenter) * distanceToCenter * curveStrength;
              let controlY = midY + Math.sin(directionToCenter) * distanceToCenter * curveStrength;

              // Draw the curved line
              ctx.quadraticCurveTo(controlX, controlY, newX, newY);
              ctx.lineTo(x2,y2);

          } else {


            let x3 = centerX + blobRadius * Math.cos( vertexStraddlingAngles[ (direction * 2 + 2)%12 ] );
            let y3 = centerY + blobRadius * Math.sin( vertexStraddlingAngles[ (direction * 2 + 2)%12 ] );

            let midX = (x + x3) / 2;
            let midY = (y + y3) / 2;
            let directionToWater = Math.atan2(midY - centerY, midX - centerX);

            // Create two control points with slight variation for more natural curves
            let bulgeDistance = hexSide * (0.1 + Math.random() * 0.1); // Random bulge 0.1-0.2
            let control1X = midX + Math.cos(directionToWater + 0.2) * bulgeDistance;
            let control1Y = midY + Math.sin(directionToWater + 0.2) * bulgeDistance;
            let control2X = midX + Math.cos(directionToWater - 0.2) * bulgeDistance;
            let control2Y = midY + Math.sin(directionToWater - 0.2) * bulgeDistance;

            ctx.bezierCurveTo(control1X, control1Y, control2X, control2Y, x3, y3);

          }

        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#222222';

        // Draw dark patches/bubbles in the tar
            const patchCount = 4 + Math.floor(Math.random() * 4); // 2-4 patches

            for (let patch = 0; patch < patchCount; patch++) {
                const patchAngle = Math.random() * Math.PI * 2;
                const patchRadius = Math.random() * hexSide * 0.6;
                const patchX = centerX + Math.cos(patchAngle) * patchRadius;
                const patchY = centerY + Math.sin(patchAngle) * patchRadius;

                const patchSize = hexSide * (0.08 + Math.random() * 0.12); // Variable patch size

                offscreenContext.beginPath();
                offscreenContext.arc(patchX, patchY, patchSize, 0, Math.PI * 2);
                offscreenContext.fill();
            }


        ctx.restore();

    }


    function drawWater( centerX, centerY ) {
        const ctx = offscreenContext;
        const originalLineWidth = ctx.lineWidth;

        // Calculate hexagon vertices
        const vertices = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = centerX + hexSide * Math.cos(angle);
            const y = centerY + hexSide * Math.sin(angle);
            vertices.push({ x, y });
        }

//         // Create hexagon path for clipping
//         function createHexPath() {
//             ctx.beginPath();
//             ctx.moveTo(vertices[0].x, vertices[0].y);
//             for (let i = 1; i < vertices.length; i++) {
//                 ctx.lineTo(vertices[i].x, vertices[i].y);
//             }
//             ctx.closePath();
//         }
//
//         // Save context state
//         ctx.save();
//
//         // Clip to hexagon shape
//         createHexPath();
// //        ctx.clip();


        const blobRadius = hexSide * 0.8; // Base size of the blob (increased from 0.15)

        ctx.fillStyle = map.palette.water;
        ctx.beginPath();

        for ( let direction = 0; direction < 6; direction++ ) {

          // first, figure out what hexes are adjacent
          const ccwHex = hexAdjacent( xI, yI, (direction+5)%6 );
          const acrossHex = hexAdjacent( xI, yI, direction );
          const cwHex = hexAdjacent( xI, yI, (direction+1)%6 );

          //then figure out if they have pits
          const ccwWater = ( inBounds( ccwHex.x, ccwHex.y ) ? map.grid[ccwHex.x][ccwHex.y].includes('water') || map.grid[ccwHex.x][ccwHex.y].includes('pit') || map.grid[ccwHex.x][ccwHex.y].includes('offboard') : true );

          const acrossWater = ( inBounds( acrossHex.x, acrossHex.y ) ? map.grid[acrossHex.x][acrossHex.y].includes('water') || map.grid[acrossHex.x][acrossHex.y].includes('pit') || map.grid[acrossHex.x][acrossHex.y].includes('offboard') : true );

          const cwWater = ( inBounds(cwHex.x, cwHex.y ) ? map.grid[cwHex.x][cwHex.y].includes('water') || map.grid[cwHex.x][cwHex.y].includes('pit') || map.grid[cwHex.x][cwHex.y].includes('offboard') : true );

          //then we find the corners
          const x1 = centerX + hexSide * Math.cos(direction * Math.PI/3 - Math.PI*2/3);
          const y1 = centerY + hexSide * Math.sin(direction * Math.PI/3 - Math.PI*2/3);

          const x2 = centerX + hexSide * Math.cos((direction+1) * Math.PI/3 - Math.PI*2/3);
          const y2 = centerY + hexSide * Math.sin((direction+1) * Math.PI/3 - Math.PI*2/3);

          // now we move around based on all these established variables.
//          if ( ccwWater && acrossWater ) {
          if ( ccwWater ) {

              x=x1;
              y=y1;

          } else if ( acrossWater ) {

            x = x1 + 0.15 * (x2 - x1);
            y = y1 + 0.15 * (y2 - y1);

          } else {

            x = centerX + blobRadius * Math.cos( vertexStraddlingAngles[ direction * 2 + 1 ] );
            y = centerY + blobRadius * Math.sin( vertexStraddlingAngles[ direction * 2 + 1 ] );

          }

          // now we move to that points
          if ( direction === 0 ) {
              ctx.moveTo(x, y);
          } else {
              ctx.lineTo(x, y);
          }

          // now we do the next corner
//          if ( cwWater && acrossWater ) {
          if ( cwWater && !ccwWater ) {

              ctx.lineTo(x2, y2);

          } else if ( acrossWater ) {

            x = x1 + 0.85 * (x2 - x1);
            y = y1 + 0.85 * (y2 - y1);

            ctx.lineTo(x, y);

          } else if (cwWater && ccwWater ) {

            // Calculate the new endpoint
              let newX = x1 + 0.85 * (x2 - x1);
              let newY = y1 + 0.85 * (y2 - y1);

              // Get current position (the point you just did lineTo)
              let currentX = x; // your current x position
              let currentY = y; // your current y position

              // Calculate midpoint between current position and new endpoint
              let midX = (currentX + newX) / 2;
              let midY = (currentY + newY) / 2;

              // Calculate direction from midpoint toward center
              let directionToCenter = Math.atan2(centerY - midY, centerX - midX);

              // Calculate control point (10-15% toward center)
              let curveStrength = 0.1 + Math.random() * 0.05; // 10-15%
              let distanceToCenter = Math.sqrt((centerX - midX) ** 2 + (centerY - midY) ** 2);
              let controlX = midX + Math.cos(directionToCenter) * distanceToCenter * curveStrength;
              let controlY = midY + Math.sin(directionToCenter) * distanceToCenter * curveStrength;

              // Draw the curved line
              ctx.quadraticCurveTo(controlX, controlY, newX, newY);
              ctx.lineTo(x2,y2);

          } else {

            // x = centerX + blobRadius * Math.cos( vertexStraddlingAngles[ (direction * 2 + 2)%12 ] );
            // y = centerY + blobRadius * Math.sin( vertexStraddlingAngles[ (direction * 2 + 2)%12 ] );
            // ctx.lineTo(x, y);

            let x3 = centerX + blobRadius * Math.cos( vertexStraddlingAngles[ (direction * 2 + 2)%12 ] );
            let y3 = centerY + blobRadius * Math.sin( vertexStraddlingAngles[ (direction * 2 + 2)%12 ] );

//            drawWavyLine( x, y, x3, y3);

            // these worked but there were ugly concave sections
            // let cPoints = getControlPoints( x, y, x3, y3 );
            //
            // ctx.bezierCurveTo( cPoints.control1.x, cPoints.control1.y, cPoints.control2.x, cPoints.control2.y, x3, y3)

            let midX = (x + x3) / 2;
            let midY = (y + y3) / 2;
            let directionToWater = Math.atan2(midY - centerY, midX - centerX);

            // Create two control points with slight variation for more natural curves
            let bulgeDistance = hexSide * (0.1 + Math.random() * 0.1); // Random bulge 0.1-0.2
            let control1X = midX + Math.cos(directionToWater + 0.2) * bulgeDistance;
            let control1Y = midY + Math.sin(directionToWater + 0.2) * bulgeDistance;
            let control2X = midX + Math.cos(directionToWater - 0.2) * bulgeDistance;
            let control2Y = midY + Math.sin(directionToWater - 0.2) * bulgeDistance;

            ctx.bezierCurveTo(control1X, control1Y, control2X, control2Y, x3, y3);

          }

        }

        ctx.closePath();
        ctx.fill();
//        ctx.stroke();

        //////////////////////////////waterRipple

        offscreenContext.strokeStyle = getContrastingShade( map.palette.water );

        for ( let i = 0; i < 6; i++ ) {

          baseAngle = Math.PI - i * Math.PI / 3;

          startPoint = { x: centerX + Math.sin( baseAngle + Math.PI/6 ) * hexSide * 0.65,
                          y: centerY + Math.cos( baseAngle + Math.PI/6 ) * hexSide * 0.65 };

          let adjHex = hexAdjacent( xI, yI, i );

          // if this is a waterfall edge we put current lines
          if ( inBounds( adjHex.x, adjHex.y ) && map.grid[ adjHex.x ][ adjHex.y ].includes('pit') ) {


            // Calculate the angle for the waterfall direction
            const fallAngle = (i * 60 - 90) * Math.PI / 180; // Convert to radians, -90 to start at top

            // Calculate the direction toward the waterfall (perpendicular to the hex edge)
            const towardFallX = Math.cos(fallAngle + Math.PI); // Point toward the fall
            const towardFallY = Math.sin(fallAngle + Math.PI);

            // Calculate parallel direction along the hex edge
            const parallelAngle = fallAngle + Math.PI / 2;
            const parallelX = Math.cos(parallelAngle);
            const parallelY = Math.sin(parallelAngle);

            // Calculate position of the waterfall edge
            const edgeDistance = hexSide * Math.cos(Math.PI / 6); // Distance from center to edge
            const edgeX = centerX + Math.cos(fallAngle) * edgeDistance;
            const edgeY = centerY + Math.sin(fallAngle) * edgeDistance;

            // Draw 4-6 current lines
            const lineCount = 5 + Math.floor(Math.random() * 2);
            const lineLength = hexSide / 5; // Back to original length

            offscreenContext.lineWidth = 1;
            offscreenContext.lineCap = 'round';

            for (let line = 0; line < lineCount; line++) {
                // Spread lines along the waterfall edge (center 80% only)
                const spreadRange = hexSide * 0.8;
                const spreadOffset = (line / (lineCount - 1) - 0.5) * spreadRange;

                // Vary the length of each line
                const baseLength = hexSide / 7;
                const lengthVariation = baseLength; // 50% variation
                const thisLineLength = baseLength + (Math.random()) * lengthVariation;

                // Starting position at the waterfall edge
                const lineEndX = edgeX + parallelX * spreadOffset;
                const lineEndY = edgeY + parallelY * spreadOffset;

                // Calculate start position (variable distance inward from edge)
                const lineStartX = lineEndX + towardFallX * thisLineLength;
                const lineStartY = lineEndY + towardFallY * thisLineLength;

                // Draw wiggly line toward the waterfall
                offscreenContext.beginPath();
                offscreenContext.moveTo(lineStartX, lineStartY);

                // Create wiggly line with multiple segments
                const segments = 4 + Math.floor(Math.random() * 3);

                for (let seg = 1; seg <= segments; seg++) {
                    const progress = seg / segments;

                    // Base position along the line toward waterfall
                    const baseX = lineStartX - towardFallX * thisLineLength * progress;
                    const baseY = lineStartY - towardFallY * thisLineLength * progress;

                    // Add wiggle perpendicular to the main direction
                    const wiggleAmount = (hexSide / 20) * (Math.random() - 0.5);
                    const wiggleX = baseX + parallelX * wiggleAmount;
                    const wiggleY = baseY + parallelY * wiggleAmount;

                    offscreenContext.lineTo(wiggleX, wiggleY);
                }

                offscreenContext.stroke();
            }


          } else { // if it's water or offboard we don't put ripples, otherwise we do

            let adjWater = ( inBounds( adjHex.x, adjHex.y ) ? map.grid[ adjHex.x ][ adjHex.y ].includes('water') || map.grid[ adjHex.x ][ adjHex.y ].includes('offboard') : true );

            if ( !adjWater ) {

              offscreenContext.beginPath();
              offscreenContext.moveTo( startPoint.x, startPoint.y );

              waterRipple();

            }

          }


        }


        // Restore context state
        ctx.restore();

        // // Draw hexagon border
        // ctx.strokeStyle = '#2a1f15';
        // ctx.lineWidth = 2;
        // createHexPath();
        // ctx.stroke();

        ctx.lineWidth = originalLineWidth;

    }

    function waterRipple () {

//      console.log('strokeStyle after setting:', offscreenContext.strokeStyle);
//      console.log('hi');

      const radius = hexSide * 0.65;

//      const bumpSize = Math.random() * 4 + 2;
      const bumpSize = Math.ceil(Math.random() * 2);
      const waves = Math.floor( Math.random() * 3 ) + 1;

      const thetaStart = baseAngle + Math.PI/6;
      const thetaStep = ( (baseAngle - Math.PI/6) - thetaStart ) / 100;
      const radiusStart = 0;
      const radiusStep = ( Math.PI * waves + Math.PI ) / 100;

      let drawing=1;

      for ( i = 0 ; i < 101 ; i ++ ) {

        let thisRadius = radius - Math.sin( radiusStart + radiusStep * i ) * bumpSize;

        if ( drawing > 0 ) {
          offscreenContext.lineTo( centerX + Math.sin( thetaStart + thetaStep * i ) * thisRadius,
                                  centerY + Math.cos( thetaStart + thetaStep * i ) * thisRadius );
        } else {
          offscreenContext.moveTo( centerX + Math.sin( thetaStart + thetaStep * i ) * thisRadius,
                                  centerY + Math.cos( thetaStart + thetaStep * i ) * thisRadius );
          drawing++;
        }

        if ( Math.random() < 0.03 ) {
          drawing = -10 -1 * Math.random() * 10;
        }

      }
      offscreenContext.stroke();
      offscreenContext.beginPath();

    }


    function drawDeepPit( centerX, centerY ) {
        const ctx = offscreenContext;
        const originalLineWidth = ctx.lineWidth;

        // Calculate hexagon vertices
        const vertices = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = centerX + hexSide * Math.cos(angle);
            const y = centerY + hexSide * Math.sin(angle);
            vertices.push({ x, y });
        }

        // Create hexagon path for clipping
        function createHexPath() {
            ctx.beginPath();
            ctx.moveTo(vertices[0].x, vertices[0].y);
            for (let i = 1; i < vertices.length; i++) {
                ctx.lineTo(vertices[i].x, vertices[i].y);
            }
            ctx.closePath();
        }

        // Save context state
        ctx.save();

        // Clip to hexagon shape
        createHexPath();
        ctx.clip();

        // start of original shaded lines code

        // // Draw radiating dark lines from edges toward center
        // const lineCount = 24; // Number of lines to draw
        //
        // for (let i = 0; i < lineCount; i++) {
        //     const angle = (i * Math.PI * 2) / lineCount;
        //
        //     // Start point at edge of hexagon
        //     let startX = centerX + hexSide * Math.cos(angle);
        //     let startY = centerY + hexSide * Math.sin(angle);
        //
        //     // Find intersection with hexagon edge more precisely
        //     let minDist = Infinity;
        //     let edgeX = startX;
        //     let edgeY = startY;
        //
        //     // Check intersection with each hexagon side
        //     for (let j = 0; j < 6; j++) {
        //         const v1 = vertices[j];
        //         const v2 = vertices[(j + 1) % 6];
        //
        //         // Line intersection calculation
        //         const dx = v2.x - v1.x;
        //         const dy = v2.y - v1.y;
        //         const det = dx * Math.sin(angle) - dy * Math.cos(angle);
        //
        //         if (Math.abs(det) > 0.001) {
        //             const u = ((centerX - v1.x) * Math.sin(angle) - (centerY - v1.y) * Math.cos(angle)) / det;
        //             const v = ((centerX - v1.x) * dy - (centerY - v1.y) * dx) / det;
        //
        //             if (u >= 0 && u <= 1 && v > 0) {
        //                 const intX = v1.x + u * dx;
        //                 const intY = v1.y + u * dy;
        //                 const dist = Math.sqrt((intX - centerX) ** 2 + (intY - centerY) ** 2);
        //
        //                 if (dist < minDist) {
        //                     minDist = dist;
        //                     edgeX = intX;
        //                     edgeY = intY;
        //                 }
        //             }
        //         }
        //     }
        //
        //     // End point closer to center (tapered)
        //     const taper = 0.3 + Math.random() * 0.4; // Random taper between 30-70%
        //     const endX = centerX + (edgeX - centerX) * taper;
        //     const endY = centerY + (edgeY - centerY) * taper;
        //
        //     // Create gradient for the line (darker at edge, lighter toward center)
        //     const gradient = ctx.createLinearGradient(edgeX, edgeY, endX, endY);
        //     gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
        //     gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.4)');
        //     gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
        //
        //     // Draw the line with varying width
        //     ctx.strokeStyle = gradient;
        //     ctx.lineWidth = 2 + Math.random() * 3; // Random width between 2-5
        //     ctx.lineCap = 'round';
        //
        //     ctx.beginPath();
        //     ctx.moveTo(edgeX, edgeY);
        //     ctx.lineTo(endX, endY);
        //     ctx.stroke();
        // }
        // end of original shaded lines code


        ///////// jagged lines code

        for (let i = 0; i < 6; i++) {
            const angle = (i * 60 - 90) * Math.PI / 180; // Start from top, go clockwise
            const x = centerX + hexSide * Math.cos(angle);
            const y = centerY + hexSide * Math.sin(angle);
            vertices.push({x, y});
        }

        // Draw 4 jagged lines from each edge toward center
        for (let i = 0; i < 6; i++) {
            const startVertex = vertices[i];
            const endVertex = vertices[(i + 1) % 6];

            // Draw 4 lines along this edge
            for (let j = 0; j < 4; j++) {
                // Position along the edge (0.2, 0.4, 0.6, 0.8)
                const t = (j + 1) / 5;
                const edgeX = startVertex.x + (endVertex.x - startVertex.x) * t;
                const edgeY = startVertex.y + (endVertex.y - startVertex.y) * t;

                // Create jagged path from edge toward center
                const segments = 6; // Number of jagged segments
//                const baseLength = hexSide * 0.6; // Only go 25% toward center

                ctx.beginPath();
                ctx.moveTo(edgeX, edgeY);

                for (let k = 1; k <= segments; k++) {
                    const progress = k / segments;

                    // Base position moving toward center
                    const baseX = edgeX + (centerX - edgeX) * progress * 0.4;
                    const baseY = edgeY + (centerY - edgeY) * progress * 0.4;

                    // Add jagged offset perpendicular to the line
                    const perpX = -(centerY - edgeY);
                    const perpY = (centerX - edgeX);
                    const perpLength = Math.sqrt(perpX * perpX + perpY * perpY);
                    const normalizedPerpX = perpX / perpLength;
                    const normalizedPerpY = perpY / perpLength;

                    // Much smaller jagged offset with rapid tapering
                    const jaggedOffset = (Math.random() - 0.5) * 4 * (1 - progress * progress * 3);
                    const finalX = baseX + normalizedPerpX * jaggedOffset;
                    const finalY = baseY + normalizedPerpY * jaggedOffset;

                    ctx.lineTo(finalX, finalY);
                }

                // ctx.strokeStyle = '#333';
                // ctx.lineWidth = 2;
                // ctx.stroke();

                const gradient = ctx.createLinearGradient(edgeX, edgeY,
                    edgeX + (centerX - edgeX) * 0.4, edgeY + (centerY - edgeY) * 0.4);
                gradient.addColorStop(0, '#333'); // Opaque at start
                gradient.addColorStop(1, 'rgba(51, 51, 51, 0)'); // Transparent at end

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.stroke();


            }
        }

        ///////// end jagged lines code


        const blobRadius = hexSide * 0.66; // Base size of the blob (increased from 0.15)

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.beginPath();

        // this works, but I want to connect to other hexes...
        // // Create irregular black blob at the bottom
        // const blobPoints = 8; // Number of points for irregular shape
        //
        //
        // for (let i = 0; i < blobPoints; i++) {
        //     const angle = (i * Math.PI * 2) / blobPoints;
        //     const randomRadius = blobRadius * (0.6 + Math.random() * 0.6); // Random variation
        //     const x = centerX + randomRadius * Math.cos(angle);
        //     const y = centerY + randomRadius * Math.sin(angle);
        //
        //     if (i === 0) {
        //         ctx.moveTo(x, y);
        //     } else {
        //         ctx.lineTo(x, y);
        //     }
        // }

        for ( let direction = 0; direction < 6; direction++ ) {

          // first, figure out what hexes are adjacent
          const ccwHex = hexAdjacent( xI, yI, (direction+5)%6 );
          const acrossHex = hexAdjacent( xI, yI, direction );
          const cwHex = hexAdjacent( xI, yI, (direction+1)%6 );

          //then figure out if they have pits
          const ccwPit = ( inBounds( ccwHex.x, ccwHex.y ) ? map.grid[ccwHex.x][ccwHex.y].includes('pit') || map.grid[ccwHex.x][ccwHex.y].includes('lava') || map.grid[ccwHex.x][ccwHex.y].includes('water') : true );

          const acrossPit = ( inBounds ( acrossHex.x, acrossHex.y ) ? map.grid[acrossHex.x][acrossHex.y].includes('pit') || map.grid[acrossHex.x][acrossHex.y].includes('lava') || map.grid[acrossHex.x][acrossHex.y].includes('water') : true );

          const cwPit = ( inBounds( cwHex.x, cwHex.y ) ? map.grid[cwHex.x][cwHex.y].includes('pit') || map.grid[cwHex.x][cwHex.y].includes('lava') || map.grid[cwHex.x][cwHex.y].includes('water') : true );

          //then we find the corners
          const x1 = centerX + hexSide * Math.cos(direction * Math.PI/3 - Math.PI*2/3);
          const y1 = centerY + hexSide * Math.sin(direction * Math.PI/3 - Math.PI*2/3);

          const x2 = centerX + hexSide * Math.cos((direction+1) * Math.PI/3 - Math.PI*2/3);
          const y2 = centerY + hexSide * Math.sin((direction+1) * Math.PI/3 - Math.PI*2/3);

          // now we move around based on all these established variables.
          if ( ccwPit && acrossPit ) {

              x=x1;
              y=y1;

          } else if ( acrossPit ) {

            x = x1 + 0.15 * (x2 - x1);
            y = y1 + 0.15 * (y2 - y1);

          } else {

            x = centerX + blobRadius * Math.cos( vertexStraddlingAngles[ direction * 2 + 1 ] );
            y = centerY + blobRadius * Math.sin( vertexStraddlingAngles[ direction * 2 + 1 ] );

          }

          // now we move to that points
          if ( direction === 0 ) {
              ctx.moveTo(x, y);
          } else {
              ctx.lineTo(x, y);
          }

          // now we do the next corner
          if ( cwPit && acrossPit ) {

              ctx.lineTo(x2, y2);

          } else if ( acrossPit ) {

            x = x1 + 0.85 * (x2 - x1);
            y = y1 + 0.85 * (y2 - y1);

            ctx.lineTo(x, y);

          } else {

            // x = centerX + blobRadius * Math.cos( vertexStraddlingAngles[ (direction * 2 + 2)%12 ] );
            // y = centerY + blobRadius * Math.sin( vertexStraddlingAngles[ (direction * 2 + 2)%12 ] );
            // ctx.lineTo(x, y);

            let x3 = centerX + blobRadius * Math.cos( vertexStraddlingAngles[ (direction * 2 + 2)%12 ] );
            let y3 = centerY + blobRadius * Math.sin( vertexStraddlingAngles[ (direction * 2 + 2)%12 ] );

//            drawWavyLine( x, y, x3, y3);

            // let cPoints = getControlPoints( x, y, x3, y3 );
            //
            // ctx.bezierCurveTo( cPoints.control1.x, cPoints.control1.y, cPoints.control2.x, cPoints.control2.y, x3, y3)

            let midX = (x + x3) / 2;
            let midY = (y + y3) / 2;
            let directionToWater = Math.atan2(midY - centerY, midX - centerX);

            // Create two control points with slight variation for more natural curves
            let bulgeDistance = hexSide * (0.1 + Math.random() * 0.1); // Random bulge 0.1-0.2
            let control1X = midX + Math.cos(directionToWater + 0.2) * bulgeDistance;
            let control1Y = midY + Math.sin(directionToWater + 0.2) * bulgeDistance;
            let control2X = midX + Math.cos(directionToWater - 0.2) * bulgeDistance;
            let control2Y = midY + Math.sin(directionToWater - 0.2) * bulgeDistance;

            ctx.bezierCurveTo(control1X, control1Y, control2X, control2Y, x3, y3);


          }


        }


        ctx.closePath();
        ctx.fill();
        ctx.stroke();


        // Add some additional small dark spots around the blob
        for (let i = 0; i < 4; i++) { // Increased from 3 to 4 spots
            const spotAngle = Math.random() * Math.PI * 2;
            const spotDist = blobRadius * (0.1 + Math.random() * 0.7); // Spots closer to main blob
            const spotX = centerX + spotDist * Math.cos(spotAngle);
            const spotY = centerY + spotDist * Math.sin(spotAngle);
            const spotSize = blobRadius * 0.2 * Math.random();

            ctx.fillStyle = 'rgba( 64,64, 64, 1)';
            ctx.beginPath();
            ctx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
            ctx.fill();
        }

        //waterfall/lavafall code

        for ( let direction = 0; direction < 6; direction++ ) {

          const acrossHex = hexAdjacent( xI, yI, direction );

          if ( !( inBounds( acrossHex.x, acrossHex.y ) ) ) continue;

          if ( map.grid[acrossHex.x][acrossHex.y].includes('water') ) {

            offscreenContext.fillStyle = map.palette.water;
            drawFall( direction );

          } else if ( map.grid[acrossHex.x][acrossHex.y].includes('lava') ) {

            offscreenContext.fillStyle = map.palette.lava;
            drawFall( direction );
          }

        }

          // end of waterfall/lavafall code


        // Restore context state
        ctx.restore();

        // Draw hexagon border
        // ctx.strokeStyle = '#2a1f15';
        // ctx.lineWidth = 2;
        // createHexPath();
        // ctx.stroke();

        ctx.lineWidth = originalLineWidth;

    }


    function drawFall(direction) {

      // Calculate the angle for the waterfall side (0 = straight up, clockwise)
       const sideAngle = (direction * 60 - 90) * Math.PI / 180; // Convert to radians, -90 to start at top

       // Calculate the position of the waterfall side's center
       const sideDistance = hexSide * Math.cos(Math.PI / 6); // Distance from center to side
       const sideX = centerX + Math.cos(sideAngle) * sideDistance;
       const sideY = centerY + Math.sin(sideAngle) * sideDistance;

       // Calculate perpendicular direction (inward from the side)
       const perpAngle = sideAngle + Math.PI; // Point inward
       const perpX = Math.cos(perpAngle);
       const perpY = Math.sin(perpAngle);

       // Calculate parallel direction along the side
       const parallelAngle = sideAngle + Math.PI / 2;
       const parallelX = Math.cos(parallelAngle);
       const parallelY = Math.sin(parallelAngle);

       // Get the current fill style to use as base color
       const baseColor = offscreenContext.fillStyle;

       // Helper function to lighten a color
       function lightenColor(color, factor) {
           if (color.startsWith('#')) {
               // Handle hex colors
               const hex = color.slice(1);
               const r = parseInt(hex.substr(0, 2), 16);
               const g = parseInt(hex.substr(2, 2), 16);
               const b = parseInt(hex.substr(4, 2), 16);

               const newR = Math.min(255, Math.floor(r + (255 - r) * factor));
               const newG = Math.min(255, Math.floor(g + (255 - g) * factor));
               const newB = Math.min(255, Math.floor(b + (255 - b) * factor));

               return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
           } else if (color.startsWith('rgb')) {
               // Handle rgb colors
               const matches = color.match(/\d+/g);
               if (matches && matches.length >= 3) {
                   const r = parseInt(matches[0]);
                   const g = parseInt(matches[1]);
                   const b = parseInt(matches[2]);

                   const newR = Math.min(255, Math.floor(r + (255 - r) * factor));
                   const newG = Math.min(255, Math.floor(g + (255 - g) * factor));
                   const newB = Math.min(255, Math.floor(b + (255 - b) * factor));

                   return `rgb(${newR}, ${newG}, ${newB})`;
               }
           }
           return color; // Return original if can't parse
       }

       // Helper function to check if a point is inside the hexagon
       function isInsideHexagon(x, y) {
           const dx = x - centerX;
           const dy = y - centerY;
           const distance = Math.sqrt(dx * dx + dy * dy);

           // Quick circle check first
           if (distance > hexSide) return false;

           // More precise hexagon check
           const angle = Math.atan2(dy, dx);
           const hexAngle = ((angle + Math.PI) % (Math.PI / 3)) - Math.PI / 6;
           const maxDistance = hexSide * Math.cos(Math.PI / 6) / Math.cos(hexAngle);

           return distance <= maxDistance;
       }

       // Layer 0: Edge bubbles - cover the hex edge first
       offscreenContext.fillStyle = baseColor;
       const edgeBubbleCount = 8 + Math.floor(Math.random() * 6);

       for (let i = 0; i < edgeBubbleCount; i++) {
           const bubbleSize = 4 + Math.random() * 6;

           // Position bubbles directly along the hex edge, but only center 80%
           const progress = (i / (edgeBubbleCount - 1)) * 0.8 + 0.1; // Map to 0.1 to 0.9 (center 80%)
           const alongSide = (progress - 0.5) * hexSide; // Center around the side
           const edgeOffset = Math.random() * 2 - 1; // Small random offset from exact edge

           const bubbleX = sideX + parallelX * alongSide + perpX * edgeOffset;
           const bubbleY = sideY + parallelY * alongSide + perpY * edgeOffset;

           // Only draw if inside hexagon
           if (isInsideHexagon(bubbleX, bubbleY)) {
               offscreenContext.beginPath();
               offscreenContext.arc(bubbleX, bubbleY, bubbleSize, 0, 2 * Math.PI);
               offscreenContext.fill();
           }
       }

       // Layer 1: Large bubbles in base color
       const layer1Count = 15 + Math.floor(Math.random() * 10);

       for (let i = 0; i < layer1Count; i++) {
           const bubbleSize = 3 + Math.random() * 8;

           // Position bubbles closer to the waterfall side, but only center 80%
           const alongSide = (Math.random() - 0.5) * hexSide * 0.56; // 0.7 * 0.8 = center 80% of the side
           const inwardDistance = Math.random() * hexSide * 0.25;

           const bubbleX = sideX + parallelX * alongSide + perpX * inwardDistance;
           const bubbleY = sideY + parallelY * alongSide + perpY * inwardDistance;

           // Only draw if inside hexagon
           if (isInsideHexagon(bubbleX, bubbleY)) {
               offscreenContext.beginPath();
               offscreenContext.arc(bubbleX, bubbleY, bubbleSize, 0, 2 * Math.PI);
               offscreenContext.fill();
           }
       }

       // Layer 2: Medium bubbles, lighter color
       offscreenContext.fillStyle = lightenColor(baseColor, 0.3);
       const layer2Count = 10 + Math.floor(Math.random() * 8);

       for (let i = 0; i < layer2Count; i++) {
           const bubbleSize = 2 + Math.random() * 5;

           const alongSide = (Math.random() - 0.5) * hexSide * 0.4; // 0.5 * 0.8 = center 80% of the side
           const inwardDistance = (Math.random() * hexSide * 0.2) + (hexSide * 0.05); // Start 5% inward from edge

           const bubbleX = sideX + parallelX * alongSide + perpX * inwardDistance;
           const bubbleY = sideY + parallelY * alongSide + perpY * inwardDistance;

           if (isInsideHexagon(bubbleX, bubbleY)) {
               offscreenContext.beginPath();
               offscreenContext.arc(bubbleX, bubbleY, bubbleSize, 0, 2 * Math.PI);
               offscreenContext.fill();
           }
       }

       // Layer 3: Small bubbles, even lighter color
       offscreenContext.fillStyle = lightenColor(baseColor, 0.6);
       const layer3Count = 8 + Math.floor(Math.random() * 6);

       for (let i = 0; i < layer3Count; i++) {
           const bubbleSize = 1 + Math.random() * 3;

           const alongSide = (Math.random() - 0.5) * hexSide * 0.24; // 0.3 * 0.8 = center 80% of the side
           const inwardDistance = (Math.random() * hexSide * 0.15) + (hexSide * 0.08); // Start 8% inward from edge

           const bubbleX = sideX + parallelX * alongSide + perpX * inwardDistance;
           const bubbleY = sideY + parallelY * alongSide + perpY * inwardDistance;

           if (isInsideHexagon(bubbleX, bubbleY)) {
               offscreenContext.beginPath();
               offscreenContext.arc(bubbleX, bubbleY, bubbleSize, 0, 2 * Math.PI);
               offscreenContext.fill();
           }
       }

       // Restore the original fill style
       offscreenContext.fillStyle = baseColor;

    }  // end drawFall()


    function drawLava( centerX, centerY ) {
        const ctx = offscreenContext;
        const originalLineWidth = ctx.lineWidth;

        // Calculate hexagon vertices
        const vertices = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = centerX + hexSide * Math.cos(angle);
            const y = centerY + hexSide * Math.sin(angle);
            vertices.push({ x, y });
        }

        // Create hexagon path for clipping
        function createHexPath() {
            ctx.beginPath();
            ctx.moveTo(vertices[0].x, vertices[0].y);
            for (let i = 1; i < vertices.length; i++) {
                ctx.lineTo(vertices[i].x, vertices[i].y);
            }
            ctx.closePath();
        }

        // Save context state
        ctx.save();

        // Clip to hexagon shape
        createHexPath();
        ctx.clip();


        const blobRadius = hexSide * 0.8; // Base size of the blob (increased from 0.15)

        ctx.fillStyle = map.palette.lava;
        ctx.beginPath();

        for ( let direction = 0; direction < 6; direction++ ) {

          // first, figure out what hexes are adjacent
          const ccwHex = hexAdjacent( xI, yI, (direction+5)%6 );
          const acrossHex = hexAdjacent( xI, yI, direction );
          const cwHex = hexAdjacent( xI, yI, (direction+1)%6 );

          //then figure out if they have pits
          const ccwLava = ( inBounds( ccwHex.x, ccwHex.y ) ? map.grid[ccwHex.x][ccwHex.y].includes('lava') || map.grid[ccwHex.x][ccwHex.y].includes('pit') || map.grid[ccwHex.x][ccwHex.y].includes('offboard') : true );

          const acrossLava = ( inBounds( acrossHex.x, acrossHex.y ) ? map.grid[acrossHex.x][acrossHex.y].includes('lava') || map.grid[acrossHex.x][acrossHex.y].includes('pit') || map.grid[acrossHex.x][acrossHex.y].includes('offboard') : true );

          const cwLava = ( inBounds(cwHex.x, cwHex.y ) ? map.grid[cwHex.x][cwHex.y].includes('lava') || map.grid[cwHex.x][cwHex.y].includes('pit')|| map.grid[cwHex.x][cwHex.y].includes('offboard') : true );

          //then we find the corners
          const x1 = centerX + hexSide * Math.cos(direction * Math.PI/3 - Math.PI*2/3);
          const y1 = centerY + hexSide * Math.sin(direction * Math.PI/3 - Math.PI*2/3);

          const x2 = centerX + hexSide * Math.cos((direction+1) * Math.PI/3 - Math.PI*2/3);
          const y2 = centerY + hexSide * Math.sin((direction+1) * Math.PI/3 - Math.PI*2/3);

          // now we move around based on all these established variables.
          if ( ccwLava && acrossLava ) {

              x=x1;
              y=y1;

          } else if ( acrossLava ) {

            x = x1 + 0.15 * (x2 - x1);
            y = y1 + 0.15 * (y2 - y1);

          } else {

            x = centerX + blobRadius * Math.cos( vertexStraddlingAngles[ direction * 2 + 1 ] );
            y = centerY + blobRadius * Math.sin( vertexStraddlingAngles[ direction * 2 + 1 ] );

          }

          // now we move to that points
          if ( direction === 0 ) {
              ctx.moveTo(x, y);
          } else {
              ctx.lineTo(x, y);
          }

          // now we do the next corner
          if ( cwLava && acrossLava ) {

              ctx.lineTo(x2, y2);

          } else if ( acrossLava ) {

            x = x1 + 0.85 * (x2 - x1);
            y = y1 + 0.85 * (y2 - y1);

            ctx.lineTo(x, y);

          } else {

            // x = centerX + blobRadius * Math.cos( vertexStraddlingAngles[ (direction * 2 + 2)%12 ] );
            // y = centerY + blobRadius * Math.sin( vertexStraddlingAngles[ (direction * 2 + 2)%12 ] );
            // ctx.lineTo(x, y);

            let x3 = centerX + blobRadius * Math.cos( vertexStraddlingAngles[ (direction * 2 + 2)%12 ] );
            let y3 = centerY + blobRadius * Math.sin( vertexStraddlingAngles[ (direction * 2 + 2)%12 ] );

//            drawWavyLine( x, y, x3, y3);


            let midX = (x + x3) / 2;
            let midY = (y + y3) / 2;
            let directionToWater = Math.atan2(midY - centerY, midX - centerX);

            // Create two control points with slight variation for more natural curves
            let bulgeDistance = hexSide * (0.1 + Math.random() * 0.1); // Random bulge 0.1-0.2
            let control1X = midX + Math.cos(directionToWater + 0.2) * bulgeDistance;
            let control1Y = midY + Math.sin(directionToWater + 0.2) * bulgeDistance;
            let control2X = midX + Math.cos(directionToWater - 0.2) * bulgeDistance;
            let control2Y = midY + Math.sin(directionToWater - 0.2) * bulgeDistance;

            ctx.bezierCurveTo(control1X, control1Y, control2X, control2Y, x3, y3);


          }


        }


        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        addLavaTexture();
        offscreenContext.beginPath();

        // Restore context state
        ctx.restore();

        // // Draw hexagon border
        // ctx.strokeStyle = '#2a1f15';
        // ctx.lineWidth = 2;
        // createHexPath();
        // ctx.stroke();

        ctx.lineWidth = originalLineWidth;

    }


    ///////////////////////////////////////////


    // Function to check if a point is inside the hexagon


    // Function to create a lighter/glowing version of the lava color
    function createGlowColor(baseColor, lightenAmount = 80) {
        if (baseColor.startsWith('#')) {
            // Convert hex to RGB, lighten significantly
            const r = parseInt(baseColor.substr(1, 2), 16);
            const g = parseInt(baseColor.substr(3, 2), 16);
            const b = parseInt(baseColor.substr(5, 2), 16);

            const newR = Math.min(255, r + lightenAmount);
            const newG = Math.min(255, g + lightenAmount);
            const newB = Math.min(255, b + lightenAmount);

            return `rgb(${newR}, ${newG}, ${newB})`;
        } else {
            // Fallback for other color formats
            return lightenAmount > 100 ? 'rgba(255, 255, 200, 0.9)' : 'rgba(255, 200, 100, 0.8)';
        }
    }

    // Function to draw a cluster of glowing dots
    function drawGlowCluster(clusterCenterX, clusterCenterY, glowColor, dotSizeRange = [1, 3]) {
        // Each cluster has 3-7 dots
        const numDots = 6 + Math.floor(Math.random() * 10);
        const clusterRadius = hexSide / 8; // Tight cluster

        for (let i = 0; i < numDots; i++) {
            // Random position within cluster radius
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * clusterRadius;

            const dotX = clusterCenterX + Math.cos(angle) * distance;
            const dotY = clusterCenterY + Math.sin(angle) * distance;

            // Only draw if dot is within hex
            if (isPointInHex(dotX, dotY, centerX, centerY, hexSide)) {
                // Vary dot size within specified range
                const dotSize = dotSizeRange[0] + Math.random() * (dotSizeRange[1] - dotSizeRange[0]);

                offscreenContext.fillStyle = glowColor;
                offscreenContext.beginPath();
                offscreenContext.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
                offscreenContext.fill();
            }
        }
    }

    // Main function to add lava texture
    function addLavaTexture() {
        const glowColor = createGlowColor(map.palette.lava, 80);
        const brightGlowColor = createGlowColor(map.palette.lava, 180);

        // Create 2-3 clusters
        const numClusters = 2 + Math.floor(Math.random() * 4);
        const hexWidth = hexSide * Math.sqrt(3) / 2;

        for (let i = 0; i < numClusters; i++) {
            // Random cluster center position within hex
            let clusterCenterX, clusterCenterY;

            // Use polar coordinates for better distribution
            const angle = Math.random() * Math.PI * 2;
            const maxDistance = Math.min(hexSide * 0.6, hexWidth * 0.6);
            const distance = Math.random() * maxDistance;

            clusterCenterX = centerX + Math.cos(angle) * distance;
            clusterCenterY = centerY + Math.sin(angle) * distance;

            // Fallback to random positioning if needed
            if (!isPointInHex(clusterCenterX, clusterCenterY, centerX, centerY, hexSide)) {
                do {
                    clusterCenterX = centerX + (Math.random() - 0.5) * hexWidth * 1.2;
                    clusterCenterY = centerY + (Math.random() - 0.5) * hexSide * 1.2;
                } while (!isPointInHex(clusterCenterX, clusterCenterY, centerX, centerY, hexSide));
            }

            // Draw first set of medium glow dots
            drawGlowCluster(clusterCenterX, clusterCenterY, glowColor, [1, 3]);

            // Draw second set of smaller, much brighter dots
            drawGlowCluster(clusterCenterX, clusterCenterY, brightGlowColor, [0.5, 1.5]);
        }
    }


///////////////////////////////////////////


    function getControlPoints(x1, y1, x2, y2) {
        // Calculate the direct line vector
        const dx = x2 - x1;
        const dy = y2 - y1;

        // Calculate perpendicular vector (for offsetting to sides)
        const length = Math.sqrt(dx * dx + dy * dy);
        const perpX = -dy / length; // Perpendicular X (rotated 90 degrees)
        const perpY = dx / length;  // Perpendicular Y

        // Points at 1/3 and 2/3 along the line
        const point1X = x1 + dx * (1/3);
        const point1Y = y1 + dy * (1/3);

        const point2X = x1 + dx * (2/3);
        const point2Y = y1 + dy * (2/3);

        // Random offsets 5-15px to either side
        const offset1 = (3 + Math.random() * 5) * (Math.random() < 0.5 ? -1 : 1);
        const offset2 = (3 + Math.random() * 5) * (Math.random() < 0.5 ? -1 : 1);

        // Apply offsets perpendicular to the line
        const control1 = {
            x: point1X + perpX * offset1,
            y: point1Y + perpY * offset1
        };

        const control2 = {
            x: point2X + perpX * offset2,
            y: point2Y + perpY * offset2
        };

        return { control1, control2 };
    }

    // function generateWavyLine(x1, y1, x2, y2) {
    //     // Calculate the direct distance and angle
    //     const dx = x2 - x1;
    //     const dy = y2 - y1;
    //     const distance = Math.sqrt(dx * dx + dy * dy);
    //     const angle = Math.atan2(dy, dx);
    //
    //     // Create perpendicular direction for waves
    //     const perpAngle = angle + Math.PI / 2;
    //     const perpX = Math.cos(perpAngle);
    //     const perpY = Math.sin(perpAngle);
    //
    //     // Control how much the line deviates (10-20px as requested)
    //     const waveAmplitude = 10 + Math.random() * 10; // 10-20px
    //     const waveFrequency = 0.8 + Math.random() * 0.4; // Vary the waviness
    //
    //     // Generate points along the path
    //     const numPoints = Math.max(4, Math.floor(distance / 15)); // Point every ~15px
    //     const points = [];
    //
    //     for (let i = 0; i <= numPoints; i++) {
    //         const t = i / numPoints;
    //
    //         // Base position along the straight line
    //         const baseX = x1 + dx * t;
    //         const baseY = y1 + dy * t;
    //
    //         // Add wave displacement with gentle tapering only at the very ends
    //         let waveIntensity = 1.0;
    //         if (t < 0.1) {
    //             waveIntensity = t / 0.1; // Fade in over first 10%
    //         } else if (t > 0.9) {
    //             waveIntensity = (1.0 - t) / 0.1; // Fade out over last 10%
    //         }
    //
    //         const waveOffset = Math.sin(t * Math.PI * 2 * waveFrequency) * waveAmplitude * waveIntensity;
    //
    //         // Add some randomness to make it more organic
    //         const randomOffset = (Math.random() - 0.5) * 8 * waveIntensity;
    //         const totalOffset = waveOffset + randomOffset;
    //
    //         points.push({
    //             x: baseX + perpX * totalOffset,
    //             y: baseY + perpY * totalOffset
    //         });
    //     }
    //
    //     return points;
    // }
    // // Function to draw the wavy line using canvas
    // function drawWavyLine(ctx, x1, y1, x2, y2) {
    //     const points = generateWavyLine(x1, y1, x2, y2);
    //
    //     if (points.length < 2) return;
    //
    //     ctx.beginPath();
    //     ctx.moveTo(points[0].x, points[0].y);
    //
    //     // Use quadratic curves for smooth connection between points
    //     for (let i = 1; i < points.length - 1; i++) {
    //         const currentPoint = points[i];
    //         const nextPoint = points[i + 1];
    //
    //         // Control point is the current point
    //         const controlX = currentPoint.x;
    //         const controlY = currentPoint.y;
    //
    //         // End point is halfway to next point
    //         const endX = (currentPoint.x + nextPoint.x) / 2;
    //         const endY = (currentPoint.y + nextPoint.y) / 2;
    //
    //         ctx.quadraticCurveTo(controlX, controlY, endX, endY);
    //     }
    //
    //     // Draw final segment to last point
    //     const lastPoint = points[points.length - 1];
    //     ctx.lineTo(lastPoint.x, lastPoint.y);
    //
    //     ctx.stroke();
    // }
