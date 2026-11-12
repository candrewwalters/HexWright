// HexWright — Viewport: zoom, panning, display canvas and minimap.
// (Classic script: shares the global scope with the other js/ files.)

    function offscreenToMiniMap() {

      miniMapContext.drawImage(
              offscreenCanvas,
              0, 0, offscreenCanvas.width, offscreenCanvas.height,  // source rectangle
              0, 0, miniMapCanvas.width, miniMapCanvas.height   // destination rectangle
          );

    }

    // function offscreenToDisplayOld() {
    //
    //   displayCanvas.width = mapDisplayDiv.clientWidth;
    //   displayCanvas.height = mapDisplayDiv.clientHeight;
    //
    //   displayContext.fillStyle = map.palette.offboard;
    //   displayContext.fillRect(0, 0, displayCanvas.width, displayCanvas.height);
    //
    //   const scaleX = displayCanvas.width / offscreenCanvas.width;
    //   const scaleY = displayCanvas.height / offscreenCanvas.height;
    //   const scale = Math.min(scaleX, scaleY); // Use smaller scale to fit entirely
    //   const newWidth = offscreenCanvas.width * scale;
    //   const newHeight = offscreenCanvas.height * scale;
    //   const x = (displayCanvas.width - newWidth) / 2;
    //   const y = (displayCanvas.height - newHeight) / 2;
    //
    //   displayContext.drawImage(offscreenCanvas, x, y, newWidth, newHeight);
    //
    //   miniMapContext.drawImage(offscreenCanvas, x, y, newWidth, newHeight);
    //
    //
    // }

    function zoom(event) {

        event.preventDefault();

//            console.log( event.deltaY );

        if ( event.deltaY < -100 ) {
            zoomLevel -= 20;
        } else if ( event.deltaY < 0 ) {
            zoomLevel -= 10;
        } else if ( event.deltaY < 100 ) {
            zoomLevel += 10;
        } else {
            zoomLevel += 20;
        }

        if ( zoomLevel < 200 ) {
            zoomLevel = 200;
        } else if ( zoomLevel > maxZoomLevel ) {
            zoomLevel = maxZoomLevel;
        }

//            console.log(zoomLevel);

        offscreenToDisplay();

    }

    function displayMouseDown( event ) {

      isDragging = false;
      startX = event.clientX;
      startY = event.clientY;

//      let maybe = getHexFromCanvasPoint( event.clientX, event.clientY);

//      console.log( maybe.x, maybe.y );

    }

    function displayMouseMove( event ) {

//      if (!event) return;

      if (event.buttons === 1) { // Left mouse button is down
          const deltaX = event.clientX - startX;
          const deltaY = event.clientY - startY;

          // If moved more than threshold, start dragging
          if (!isDragging && (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3)) {
              isDragging = true;
          }

          if (isDragging) {

            if ( event.shiftKey) {
              // we are editing multiple hexes

              applyTool( event );


            } else {
              //we are dragging the map

              // Update map position in real-time
              focusX -= deltaX;
              focusY -= deltaY;

              focusX = Math.max(zoomX, Math.min(focusX, offscreenCanvas.width - zoomX));
              focusY = Math.max(zoomY, Math.min(focusY, offscreenCanvas.height - zoomY));

              offscreenToDisplay();

              // Update start position for next move
              startX = event.clientX;
              startY = event.clientY;

            }

          }
      }

    }

    function displayMouseUp( event ) {

      if ( isDragging ) {
        return;
      }

      applyTool( event );

      // const widthRatio = offscreenCanvas.width / displayCanvas.width;
      // const heightRatio = offscreenCanvas.height / displayCanvas.height;


    }


    function offscreenToDisplay() {

      displayCanvas.width = mapDisplayDiv.clientWidth;
      displayCanvas.height = mapDisplayDiv.clientHeight;

      displayContext.fillStyle = map.palette.offboard;
      displayContext.fillRect(0, 0, displayCanvas.width, displayCanvas.height);

      focusX = Math.max(zoomX, Math.min(focusX, offscreenCanvas.width - zoomX));
      focusY = Math.max(zoomY, Math.min(focusY, offscreenCanvas.height - zoomY));


      zoomY = zoomLevel;
      zoomX = zoomLevel * ( displayCanvas.width / displayCanvas.height );

      if ( 2 * zoomX > offscreenCanvas.width ) {
        focusX = offscreenCanvas.width / 2;
      }

      if ( 2 * zoomY > offscreenCanvas.height ) {
        focusY = offscreenCanvas.height / 2;
      }


      displayContext.drawImage( offscreenCanvas, focusX - zoomX, focusY - zoomY, zoomX * 2, zoomY * 2, 0, 0, displayCanvas.width, displayCanvas.height );

      miniMapContext.drawImage(offscreenCanvas,0,0,offscreenCanvas.width,offscreenCanvas.height,0,0,miniMapCanvas.width,miniMapCanvas.height);

      miniMapContext.beginPath();
//        smallMapContext.strokeStyle = "orange";
      miniMapContext.strokeStyle = getInverseColor( map.palette.clear );

      // miniBoardWidthRatio = miniMapCanvas.width / miniMapCanvas.width;
      // miniBoardHeightRatio = miniMapCanvas.height / miniMapCanvas.height;
      // miniMapContext.strokeRect( (focusX-zoomX)*miniBoardWidthRatio,(focusY-zoomY)*miniBoardHeightRatio,2*zoomX*miniBoardWidthRatio,2*zoomY*miniBoardHeightRatio );

//      miniMapContext.strokeRect( focusX - zoomX, focusY - zoomY, zoomX * 2, zoomY * 2 );


      const widthRatio = miniMapCanvas.width / offscreenCanvas.width;
      const heightRatio = miniMapCanvas.height / offscreenCanvas.height;

      const leftside = ( focusX - zoomX ) * widthRatio;
      const rightside = ( zoomX * 2 ) * widthRatio;

      const topSide = ( focusY - zoomY ) * heightRatio;
      const bottomSide = zoomY * 2 * heightRatio;

      miniMapContext.strokeRect( leftside, topSide, rightside, bottomSide );


      miniMapContext.stroke();

    }


    function updateMiniMapSize(size = global.miniMapSize ) {
        const miniMapDiv = document.getElementById('miniMapDiv');
        const canvas = document.getElementById('miniMapCanvas');
        if (!miniMapDiv || !canvas) {
            console.error('Minimap elements not found');
            return;
        }

        // Get browser window dimensions
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Debug logging
//        console.log('Window dimensions:', windowWidth, 'x', windowHeight);
//        console.log('Minimap size setting:', size);

        // Check if window has dimensions
        if (windowWidth === 0 || windowHeight === 0) {
            console.warn('Window has no dimensions');
            return;
        }

        // Get map dimensions - try multiple sources
        let mapWidth, mapHeight;
        if (offscreenCanvas && offscreenCanvas.width && offscreenCanvas.height) {
            mapWidth = offscreenCanvas.width;
            mapHeight = offscreenCanvas.height;
//            console.log('Using offscreenCanvas dimensions:', mapWidth, 'x', mapHeight);
        } else if (map && map.width && map.height) {
            mapWidth = map.width;
            mapHeight = map.height;
//            console.log('Using map dimensions:', mapWidth, 'x', mapHeight);
        } else {
            console.error('No valid map dimensions found');
            return;
        }

        // Define size configurations based on window dimensions
        const sizeConfigs = {
            small: {
                base: Math.min(windowWidth, windowHeight) * 0.25,
                min: Math.min(windowWidth, windowHeight) * 0.10,
                max: Math.min(windowWidth, windowHeight) * 0.40
            },
            medium: {
                base: Math.min(windowWidth, windowHeight) * 0.35,
                min: Math.min(windowWidth, windowHeight) * 0.20,
                max: Math.min(windowWidth, windowHeight) * 0.50
            },
            large: {
                base: Math.min(windowWidth, windowHeight) * 0.45,
                min: Math.min(windowWidth, windowHeight) * 0.30,
                max: Math.min(windowWidth, windowHeight) * 0.60
            }
        };

        // Get the configuration for the requested size
        const config = sizeConfigs[size] || sizeConfigs.medium;
        const baseSize = config.base;
        const minSize = config.min;
        const maxSize = config.max;

//        console.log(`Size config for ${size}:`,
//            `base=${Math.round(baseSize)}px, min=${Math.round(minSize)}px, max=${Math.round(maxSize)}px`);

        const mapAspectRatio = mapWidth / mapHeight;
        let miniMapWidth, miniMapHeight;

        if (mapAspectRatio > 1) {
            // Wider than tall
            miniMapWidth = Math.min(Math.max(baseSize, minSize), maxSize);
            miniMapHeight = miniMapWidth / mapAspectRatio;
        } else {
            // Taller than wide
            miniMapHeight = Math.min(Math.max(baseSize, minSize), maxSize);
            miniMapWidth = miniMapHeight * mapAspectRatio;
        }

        // Ensure minimum size for extreme aspect ratios
        if (miniMapWidth < minSize) {
            miniMapWidth = minSize;
            miniMapHeight = minSize / mapAspectRatio;
        }
        if (miniMapHeight < minSize) {
            miniMapHeight = minSize;
            miniMapWidth = minSize * mapAspectRatio;
        }

//        console.log('Calculated minimap size:', Math.round(miniMapWidth), 'x', Math.round(miniMapHeight));

        // Apply styles to DIV (this creates the border container)
        miniMapDiv.style.width = miniMapWidth + 'px';
        miniMapDiv.style.height = miniMapHeight + 'px';

        // Apply dimensions to canvas (this should fill the DIV)
        canvas.width = miniMapWidth;
        canvas.height = miniMapHeight;

    }


     function setMiniMapSmall() {
         updateMiniMapSize('small');
         document.querySelector('input[name="miniMapSize"][value="small"]').checked = true;
         global.miniMapSize='small';
//         localStorage.setItem('HexWrightSettings',JSON.stringify(global));
          saveSettings()
         offscreenToMiniMap();
     }

     function setMiniMapMedium() {
         updateMiniMapSize('medium');
         document.querySelector('input[name="miniMapSize"][value="medium"]').checked = true;
         global.miniMapSize='medium';
         saveSettings()
//         localStorage.setItem('HexWrightSettings',JSON.stringify(global));
         offscreenToMiniMap();
     }

     function setMiniMapLarge() {
         updateMiniMapSize('large');
         document.querySelector('input[name="miniMapSize"][value="large"]').checked = true;
         global.miniMapSize='large';
         saveSettings()
//         localStorage.setItem('HexWrightSettings',JSON.stringify(global));
         offscreenToMiniMap();
     }


    function toggleMiniMap() {
        const miniMapDiv = document.getElementById('miniMapDiv');
        if (miniMapDiv.style.opacity === '0') {
            miniMapDiv.style.opacity = '1';
            document.getElementById('toolOpener').style.top = '22%';
        } else {
            miniMapDiv.style.opacity = '0';
            document.getElementById('toolOpener').style.top = '2%';
        }
    }

    function miniMapMove( event ) {

      if ( event.buttons%2 == 1 ) {

        miniMapClick( event );

      }

    }

    function miniMapClick( event ) {

      focusX = ( event.offsetX / miniMapCanvas.width ) * offscreenCanvas.width;

      focusY = ( event.offsetY / miniMapCanvas.height ) * offscreenCanvas.height;

      offscreenToDisplay();

    }


    function toggleDots() {

      const dotToggle = document.getElementById('mapInfoShowDots');
      dotToggle.checked = !dotToggle.checked;
      // Trigger change event if you have listeners
//      dotToggle.dispatchEvent(new Event('change'));

      map.showDots = ( dotToggle.checked ? 'yes' : 'no' );
//      console.log(map.showDots);

      convertObjectToText();
      objectToOffscreen();
      offscreenToMiniMap();
      offscreenToDisplay();

      global.changed = 'yes';

    }

    function toggleTexture() {

      const textureToggle = document.getElementById('mapInfoTexture');
      textureToggle.checked = !textureToggle.checked;
      // Trigger change event if you have listeners
//      textureToggle.dispatchEvent(new Event('change'));

      map.Texture = ( textureToggle.checked ? 'yes' : 'no' );

      convertObjectToText();
      objectToOffscreen();
      offscreenToMiniMap();
      offscreenToDisplay();

      global.changed = 'yes';

    }

    function toggleHandDrawn() {

      const handDrawnToggle = document.getElementById('mapInfoHandDrawn');
      handDrawnToggle.checked = !handDrawnToggle.checked;
      // Trigger change event if you have listeners
      handDrawnToggle.dispatchEvent(new Event('change'));


      map.handDrawn = ( handDrawnToggle.checked ? 'yes' : 'no' );

      convertObjectToText();
      objectToOffscreen();
      offscreenToMiniMap();
      offscreenToDisplay();

      global.changed = 'yes';

    }


    function toggleHexNumbers() {

      const hexToggle = document.getElementById('mapInfoShowHex');
      hexToggle.checked = !hexToggle.checked;
      // Trigger change event if you have listeners
      hexToggle.dispatchEvent(new Event('change'));

      map.showHexNumbers = ( hexToggle.checked ? 'yes' : 'no' );

      convertObjectToText();
      objectToOffscreen();
      offscreenToMiniMap();
      offscreenToDisplay();

      global.changed = 'yes';

    }
