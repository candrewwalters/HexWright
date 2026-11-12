// HexWright — objectToOffscreen(): draws the whole map object onto the offscreen canvas.
// (Classic script: shares the global scope with the other js/ files.)

    function objectToOffscreen() {

      if ( map.width % 2 ) {
        boardWidth = Math.floor( map.width / 2 ) * ( hexWidth + hexSide ) + hexSide;
      } else {
        boardWidth = Math.floor( map.width / 2 ) * ( hexWidth + hexSide );
      }

      boardWidth += hexSide * 2;

      boardHeight = hexHeight * ( map.height + 1 ) + hexHeight/2;

      offscreenCanvas.width = boardWidth;
      offscreenCanvas.height = boardHeight;

      maxZoomLevel = Math.min( offscreenCanvas.width/2, offscreenCanvas.height/2 )+9999999999;

      offscreenContext.fillStyle = map.palette.offboard;
      offscreenContext.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);


      if ( map.graphic ) {

        const graphic = map.graphic.toLowerCase();
        if (graphic === 'melee' || graphic === 'wizard') {
          const logoId = `${graphic}Logo`;
          const logo = document.getElementById(logoId);
          const scale = graphic === 'melee' ? 2 : 3;
          const width = logo.naturalWidth / scale;
          const height = logo.naturalHeight / scale;

          // Draw top-left
          offscreenContext.drawImage(logo, 0, 0, width, height);

          // Draw bottom-right
          offscreenContext.drawImage(
            logo,
            offscreenCanvas.width - width,
            offscreenCanvas.height - height,
            width,
            height
          );
        } else if ( map.graphic.toLowerCase() == 'arcane' ) {

          drawArcaneSymbols();

        }
      }

      if ( megaHexOrigin ) {

        getMegaHexCenters( megaHexOrigin[0], megaHexOrigin[1] );

      } else {
        map.megaHexCenters =[];
      }


      for (  xI=0; xI < map.width; xI++ ) {

          for (  yI=0; yI < map.height; yI++ ) {

              if ( map.grid[xI][yI].includes('offboard') ) {
//                drawOffboard();
                continue;
              }

              for ( let dir = 0; dir < 6; dir++ ) {

                let adjHex = hexAdjacent( xI, yI, dir );

                if ( !inBounds( adjHex.x, adjHex.y ) || map.grid[adjHex.x][adjHex.y].includes('offboard') ) {

                  drawOutsideBorder( xI, yI, dir );

                }

              }

              traceHex(xI,yI);

              if ( map.grid[xI][yI].includes('wall hex') ) {

                offscreenContext.fillStyle = map.palette.clear;
                offscreenContext.fill();
                drawWall(centerI.x, centerI.y);


                continue;

              }

              if ( map.grid[xI][yI].includes('water') ) {

                // offscreenContext.fillStyle = map.palette.water;
                // offscreenContext.fill

                offscreenContext.fillStyle = map.palette.clear;
                offscreenContext.fill();

                drawWater( centerI.x, centerI.y);

              } else if ( map.grid[xI][yI].includes('tar') ) {

                  offscreenContext.fillStyle = map.palette.clear;
                  offscreenContext.fill();

                  drawTar( centerI.x, centerI.y );

                } else if ( map.grid[xI][yI].includes('lava') ) {

                  // offscreenContext.fillStyle = map.palette.lava;
                  // offscreenContext.fill();

                  offscreenContext.fillStyle = map.palette.clear;
                  offscreenContext.fill();

                  drawLava( centerI.x, centerI.y );

                } else {

                  if ( map.grid[xI][yI].includes('darker') ) {

                    offscreenContext.fillStyle = darkenColor(map.palette.clear, 0.1); // darken by 20%

                  } else if ( map.grid[xI][yI].includes('lighter') ) {

                    offscreenContext.fillStyle = lightenColor(map.palette.clear, 0.3); // darken by 20%

                  } else {

                    offscreenContext.fillStyle = map.palette.clear;

                  }

                offscreenContext.fill();

              }

              if ( map.lineStyle == 'normal' ) {

                offscreenContext.strokeStyle = map.palette.lines;
                offscreenContext.stroke();

              } else if ( map.lineStyle == 'handDrawn' ) {

                offscreenContext.strokeStyle = map.palette.lines;
                unevenLine( centerI.x - hexSide, centerI.y, centerI.x - hexSide / 2, centerI.y - hexHeight / 2 );
                unevenLine( centerI.x - hexSide / 2, centerI.y - hexHeight / 2, centerI.x + hexSide / 2, centerI.y - hexHeight / 2 );
                unevenLine( centerI.x + hexSide / 2, centerI.y - hexHeight / 2, centerI.x + hexSide, centerI.y );


              } else if ( map.lineStyle == 'cornersOnly' ) {

                offscreenContext.strokeStyle = map.palette.lines;
                drawHexCorners();

              }

              offscreenContext.beginPath();

              if ( map.grid[xI][yI].includes('column') ) {
                offscreenContext.fillStyle = map.palette.columns;
                offscreenContext.strokeStyle = map.palette.lines;
                offscreenContext.beginPath();
                offscreenContext.arc( centerI.x, centerI.y, hexSide*0.4, 0, 2 * Math.PI); // draw a circle
                offscreenContext.fill();
                offscreenContext.stroke();

              }

              if (map.grid[xI][yI].length == 0 && map.texture == 'yes' ) {
                  // Only place mushrooms in 10% of empty hexes
                  if (Math.random() < 0.1) {

//                      console.log(xI + ',' + yI);

                      // Random direction (0 to 360 degrees)
                      const angle = Math.random() * 2 * Math.PI;

                      // Random distance up to hexside/2 pixels
                      const distance = Math.random() * (hexSide / 2);

                      // Calculate offset position
                      const offsetX = Math.cos(angle) * distance;
                      const offsetY = Math.sin(angle) * distance;

                      // Draw mushrooms at the offset position
                      drawMushrooms(offscreenContext, centerI.x + offsetX, centerI.y + offsetY);

                  }
              }

              if ( map.grid[xI][yI].length == 0 && map.texture == 'yes' ) {

                for ( let direction = 0; direction < 6; direction++ ) {

                  if ( Math.random() > 0.3 ) continue;

                  let adjHex = hexAdjacent( xI, yI, direction );

                  if ( !inBounds( adjHex.x, adjHex.y ) || map.grid[adjHex.x][adjHex.y].includes('offboard') || map.grid[adjHex.x][adjHex.y].includes('wallhex') ) {

                    drawCrumbs( xI, yI, direction );

                  }

                }

              }

              // draw paths...

              if ( map.grid[xI][yI].includes('path') ) {

                drawPath();

              }


              // art drawing

              if ( map.grid[xI][yI].includes('trapdoor') ) {

                drawTrapDoor()

              }

              if ( map.grid[xI][yI].includes('pit') ) {

                drawDeepPit( centerI.x, centerI.y);

              }

              if ( map.grid[xI][yI].includes('debris') ) {

                drawDebris();

              }

              if ( map.grid[xI][yI].includes('fire') ) {

                offscreenContext.drawImage( document.getElementById('fire'), centerI.x-hexHeight * 0.5, centerI.y-hexHeight * 0.5, hexHeight, hexHeight ) ;

              }

              if ( map.grid[xI][yI].includes('shadow') ) {

                offscreenContext.drawImage( document.getElementById('shadow'), centerI.x-hexHeight * 0.45, centerI.y-hexHeight * 0.45, hexHeight * 0.9, hexHeight * 0.9 ) ;

              }

              if ( map.grid[xI][yI].includes('body') ) {

                let bodyString = 'body' + (Math.random() < 0.5 ? '1' : '2' );

                  // Replace your original line with this:
                  const img = document.getElementById(bodyString);
                  const targetSize = hexHeight * 0.8;
                  const targetX = centerI.x - hexHeight * 0.4;
                  const targetY = centerI.y - hexHeight * 0.4;

                  // Calculate scale factor to fit within target area while maintaining aspect ratio
                  const scaleX = targetSize / img.naturalWidth;
                  const scaleY = targetSize / img.naturalHeight;
                  const scale = Math.min(scaleX, scaleY); // Use smaller scale to fit within bounds

                  // Calculate actual draw dimensions
                  const drawWidth = img.naturalWidth * scale;
                  const drawHeight = img.naturalHeight * scale;

                  // Calculate centered position within the target area
                  const drawX = targetX + (targetSize - drawWidth) / 2;
                  const drawY = targetY + (targetSize - drawHeight) / 2;

                  // Draw the image
                  offscreenContext.drawImage(img, drawX, drawY, drawWidth, drawHeight);


              }

              if ( map.grid[xI][yI].includes('barricade') ) {

//                offscreenContext.drawImage( document.getElementById('table'), centerI.x-hexHeight * 0.35, centerI.y-hexHeight * 0.35, hexHeight * 0.7, hexHeight * 0.7 ) ;

                drawBarricade();

              }

              if ( map.grid[xI][yI].includes('table') ) {

                offscreenContext.drawImage( document.getElementById('table'), centerI.x-hexHeight * 0.35, centerI.y-hexHeight * 0.35, hexHeight * 0.7, hexHeight * 0.7 ) ;

              }

              if ( map.grid[xI][yI].includes('altar') ) {

                drawStoneAltar();

              }

              if ( map.grid[xI][yI].includes('pentacle') ) {

                drawPentacle();

              }

              if ( map.grid[xI][yI].includes('stone') ) {

                  drawStone(xI,yI,"#999999");

              }

              if ( map.grid[xI][yI].includes('tar') ) {

                drawTar();

              }

              if ( map.grid[xI][yI].includes('sticky') ) {

                offscreenContext.strokeStyle = '#FFA500';
                drawDiagonalLines();

              }

              if ( map.grid[xI][yI].includes('slippery') ) {

                offscreenContext.strokeStyle = '#AAAA00';
                drawDiagonalLines();

              }

              offscreenContext.strokeStyle = map.palette.lines;
              offscreenContext.fillStyle = map.palette.lines;


              if ( map.showDots == 'yes' ) {

                offscreenContext.beginPath();
                offscreenContext.arc( centerI.x, centerI.y, 2, 0, 2 * Math.PI);
                offscreenContext.fill();

              }

              if ( map.grid[xI][yI].includes('star') ) {

                offscreenContext.beginPath();
                for ( let i = 0; i < 10; i ++ ) {
                  const r=(i % 2 === 0) ? hexSide/15 : hexSide/30;
                  const angle = (i * Math.PI) / 5 + - Math.PI / 2;
                  const x = centerI.x + Math.cos(angle) * r;
                  const y = centerI.y + Math.sin(angle) * r;
                  if (i === 0) {
                      offscreenContext.moveTo(x, y);
                  } else {
                      offscreenContext.lineTo(x, y);
                  }
                }
                offscreenContext.closePath();
                offscreenContext.fill();
                offscreenContext.stroke();

              }


              if ( map.showHexNumbers == 'yes' ) {

                offscreenContext.fillText( xI + ',' + yI, centerI.x - 5, centerI.y + 40 );

              }

            } // yI loop (  yI=0; yI < map.height; yI++ )
          }  // xI loop

          for ( let i = 0; i < map.megaHexCenters.length; i++ ) {

            drawMegaHex( map.megaHexCenters[i].x, map.megaHexCenters[i].y );

          }

          if (map.stoneBridges && map.stoneBridges.length > 0) {
              map.stoneBridges.forEach(stoneBridge => {
                  const startCenter = centerOf(stoneBridge.startingX, stoneBridge.startingY);
                  const endCenter = centerOf(stoneBridge.endingX, stoneBridge.endingY);

//                  drawBridge(startCenter.x, startCenter.y, endCenter.x, endCenter.y, hexSide);
                  drawStoneBridge(startCenter.x, startCenter.y, endCenter.x, endCenter.y, hexSide*0.866);

//                  fillBridge( stoneBridge );
              });
          }

          if (map.woodBridges && map.woodBridges.length > 0) {
              map.woodBridges.forEach(woodBridge => {
                  const startCenter = centerOf(woodBridge.startingX, woodBridge.startingY);
                  const endCenter = centerOf(woodBridge.endingX, woodBridge.endingY);

//                  drawBridge(startCenter.x, startCenter.y, endCenter.x, endCenter.y, hexSide);
                  drawWoodBridge(startCenter.x, startCenter.y, endCenter.x, endCenter.y, hexSide*0.866);

//                  fillBridge( woodBridge );

              });
          }

          updateMiniMapSize();

    }   // end of  objectToOffscreen()
