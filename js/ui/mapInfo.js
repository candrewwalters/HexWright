// HexWright — Map info dialog.
// (Classic script: shares the global scope with the other js/ files.)

    function openInfo() {

      document.getElementById('mapInfoName').value = map.name;
      document.getElementById('mapInfoDescription').value = map.description;

      document.getElementById('mapInfoWidth').value = map.width;
      document.getElementById('mapInfoHeight').value = map.height;


      document.getElementById('mapInfoDialogOverlay').style.display = 'flex';

    }


    function saveMapInfo() {

      map.name = document.getElementById('mapInfoName').value;

      map.description = document.getElementById('mapInfoDescription').value;

      map.showDots = ( document.getElementById('mapInfoShowDots').checked ? 'yes' : 'no' );

      map.showHexNumbers = ( document.getElementById('mapInfoShowHex').checked ? 'yes' : 'no' );

      map.texture = ( document.getElementById('mapInfoTexture').checked ? 'yes' : 'no' );

//      map.handDrawn = ( document.getElementById('mapInfoHandDrawn').checked ? 'yes' : 'no' );

      map.lineStyle = document.querySelector('input[name="lineStyle"]:checked').value;

      // if the dimensions have chnaged we'll have to modify the array...

      const newWidth = parseInt( document.getElementById('mapInfoWidth' ).value );
      const newHeight = parseInt( document.getElementById('mapInfoHeight' ).value );

      if ( newWidth != map.width  || newHeight != map.height ) {

        const oldWidth = map.width;
        const oldHeight = map.height;

        // Create new grid with new dimensions
        const newGrid = [];

        for (let x = 0; x < newWidth; x++) {
            newGrid[x] = [];
            for (let y = 0; y < newHeight; y++) {
                // Copy existing data if within old bounds
                if (x < oldWidth && y < oldHeight) {
                    newGrid[x][y] = [...map.grid[x][y]]; // Copy the array of strings
                } else {
                    newGrid[x][y] = []; // Initialize new cells as empty arrays
                }
            }
        }

        // Update the map object
        map.grid = newGrid;
        map.width = newWidth;
        map.height = newHeight;


      }

      document.getElementById('mapInfoDialogOverlay').style.display = 'none';

      global.changed = 'yes';

      convertObjectToText();

      objectToOffscreen();

      offscreenToMiniMap();

      offscreenToDisplay();

    }


    // Help system functionality
