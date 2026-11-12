// HexWright — Editing tools: choosing a tool and applying it to a hex.
// (Classic script: shares the global scope with the other js/ files.)

    function setTool( newTool ) {

//      console.log('***********'+newTool);
      global.currentTool = newTool;

      saveSettings();

      document.getElementById('toolOpenerInner').innerHTML = newTool;

      setOpenerColor();

      hideDiv( toolMenu );

    }


    function applyTool( event ) {

      // Same transform that drew the map, so the click hits the hex shown under the pointer.
      const point = displayToOffscreen( event.offsetX, event.offsetY );

      theHex = offscreenPointToHex( point.x, point.y );
      // console.log(theHex);
      // console.log(keys(theHex));
      // if ( keys(theHex) == ['undefined'] ) return;
      if ( theHex.x == undefined ) return;
//      console.log( 'applyTool('+theHex.x+','+ theHex.y +')');

//      console.log('looks like you clicked in ' + theHex.x + ',' + theHex.y );

        if ( map.grid[theHex.x][theHex.y] != undefined ) {

          switch ( global.currentTool ) {
            case 'clear':
              map.grid[theHex.x][theHex.y] = [];
              break;

            case 'wall hex':
              map.grid[theHex.x][theHex.y] = ['wall hex'];
              break;

            case 'water':
              if (map.grid[theHex.x][theHex.y].includes('stone')) {
                map.grid[theHex.x][theHex.y] = ['water','stone'];
              } else {
                map.grid[theHex.x][theHex.y] = ['water'];
              }
              break;

            case 'offboard':
              map.grid[theHex.x][theHex.y] = ['offboard'];
              break;

            case 'pit':
              map.grid[theHex.x][theHex.y] = ['pit'];
              break;

            case 'path':
              if (!map.grid[theHex.x][theHex.y].includes('paths')) {
                  map.grid[theHex.x][theHex.y].push('paths');
              }
              break;

            case 'debris':
              if (!map.grid[theHex.x][theHex.y].includes('debris')) {
                  map.grid[theHex.x][theHex.y].push('debris');
              }
              break;

            case 'stone':
              if (!map.grid[theHex.x][theHex.y].includes('stone')) {
                  map.grid[theHex.x][theHex.y].push('stone');
              }
              break;

            case 'column':
              if (!map.grid[theHex.x][theHex.y].includes('column')) {
                  map.grid[theHex.x][theHex.y].push('column');
              }
              break;

            case 'trapdoor':
              if (!map.grid[theHex.x][theHex.y].includes('trapdoor')) {
                  map.grid[theHex.x][theHex.y].push('trapdoor');
              }
              break;

            case 'table':
              if (!map.grid[theHex.x][theHex.y].includes('table')) {
                  map.grid[theHex.x][theHex.y].push('table');
              }
              break;

            case 'altar':
              if (!map.grid[theHex.x][theHex.y].includes('altar')) {
                  map.grid[theHex.x][theHex.y].push('altar');
              }
              break;

            case 'pentacle':
              if (!map.grid[theHex.x][theHex.y].includes('pentacle')) {
                  map.grid[theHex.x][theHex.y].push('pentacle');
              }
              break;

            case 'paths':
              if (!map.grid[theHex.x][theHex.y].includes('path')) {
                  map.grid[theHex.x][theHex.y].push('path');
              }
              break;

            case 'lava':
              if (map.grid[theHex.x][theHex.y].includes('stone')) {
                map.grid[theHex.x][theHex.y] = ['lava','stone'];
              } else {
                map.grid[theHex.x][theHex.y] = ['lava'];
              }
              break;

            case 'fire':
              if (!map.grid[theHex.x][theHex.y].includes('fire')) {
                  map.grid[theHex.x][theHex.y].push('fire');
              }
              break;

            case 'shadow':
              if (!map.grid[theHex.x][theHex.y].includes('shadow')) {
                  map.grid[theHex.x][theHex.y].push('shadow');
              }
              break;

            case 'body':
              if (!map.grid[theHex.x][theHex.y].includes('body')) {
                  map.grid[theHex.x][theHex.y].push('body');
              }
              break;

            case 'barricade':
              if (!map.grid[theHex.x][theHex.y].includes('barricade')) {
                  map.grid[theHex.x][theHex.y].push('barricade');
              }
              break;

            case 'star':
              if (!map.grid[theHex.x][theHex.y].includes('star')) {
                  map.grid[theHex.x][theHex.y].push('star');
              }
              break;

              case 'tar':
                map.grid[theHex.x][theHex.y] = map.grid[theHex.x][theHex.y].filter(item=>item!=='slippery');
                if (!map.grid[theHex.x][theHex.y].includes('tar')) {
                    map.grid[theHex.x][theHex.y].push('tar');
                }
                break;

            case 'sticky':
              map.grid[theHex.x][theHex.y] = map.grid[theHex.x][theHex.y].filter(item=>item!=='slippery');
              if (!map.grid[theHex.x][theHex.y].includes('sticky')) {
                  map.grid[theHex.x][theHex.y].push('sticky');
              }
              break;

            case 'slippery':
              map.grid[theHex.x][theHex.y] = map.grid[theHex.x][theHex.y].filter(item=>item!=='sticky');
              if (!map.grid[theHex.x][theHex.y].includes('slippery')) {
                  map.grid[theHex.x][theHex.y].push('slippery');
              }
              break;

            case 'lighter':
              map.grid[theHex.x][theHex.y] = map.grid[theHex.x][theHex.y].filter(item=>item!=='darker');
              if (!map.grid[theHex.x][theHex.y].includes('lighter')) {
                  map.grid[theHex.x][theHex.y].push('lighter');
              }
              break;

            case 'darker':
              map.grid[theHex.x][theHex.y] = map.grid[theHex.x][theHex.y].filter(item=>item!=='lighter');
              if (!map.grid[theHex.x][theHex.y].includes('darker')) {
                  map.grid[theHex.x][theHex.y].push('darker');
              }
              break;

            case 'bridge':
              if ( bridgeStart == undefined ) {
                bridgeStart = theHex;
              } else {

                if ( distanceBetween( theHex.x, theHex.y, bridgeStart.x, bridgeStart.y) < 2 ) {
                  return;
                }

                if ( ['wild lands','burrow','woods','swamp'].includes(map.palette.name.toLowerCase()) ) {

                  map.woodBridges.push({
                    startingX: bridgeStart.x,
                    startingY: bridgeStart.y,
                    endingX: theHex.x,
                    endingY: theHex.y
                  });

                } else {
                  map.stoneBridges.push({
                    startingX: bridgeStart.x,
                    startingY: bridgeStart.y,
                    endingX: theHex.x,
                    endingY: theHex.y
                  });

                }
//                  document.getElementById('textDisplayArea').value += 'stone bridge from ' + bridgeStart.x +',' + bridgeStart.y + 'to ' + thehex.x + ',' + theHex.y;
                  //                convertTextToObject();

                  if ( !bridgeGoodDirection( bridgeStart, theHex ) ) {
//                    console.log('crooked bridge');

                    document.getElementById('bridgeWarningDiv').style.display='block';

                  }

                  if (map.stoneBridges && map.stoneBridges.length > 0) {
                      map.stoneBridges.forEach(stoneBridge => {

                          fillBridge( stoneBridge );
                      });
                  }

                  if (map.woodBridges && map.woodBridges.length > 0) {
                      map.woodBridges.forEach(woodBridge => {

                          fillBridge( woodBridge );

                      });
                  }

                bridgeStart = undefined;

              }

        }

        convertObjectToText();
        objectToOffscreen();
        offscreenToDisplay();
        offscreenToMiniMap();

      }

    }
