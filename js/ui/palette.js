// HexWright — Color palettes, color pickers and the palette sample map.
// (Classic script: shares the global scope with the other js/ files.)

    function setColorPickers() {

      document.getElementById('linesColor').value = map.palette.lines;
      document.getElementById('clearColor').value = map.palette.clear;
      document.getElementById('offboardColor').value = map.palette.offboard;
      document.getElementById('wallsColor').value = map.palette.walls;
      document.getElementById('pathsColor').value = map.palette.paths;
      document.getElementById('waterColor').value = map.palette.water;
      document.getElementById('columnsColor').value = map.palette.columns;
      document.getElementById('lavaColor').value = map.palette.lava;

      updateSampleMap();

    }

    function setOpenerColor() {

      document.getElementById('toolOpener').style.backgroundColor = map.palette.lines;

      switch ( global.currentTool ) {

        case 'offboard':
          document.getElementById('toolOpenerInner').style.backgroundColor = map.palette.offboard;
          document.getElementById('toolOpenerInner').style.color = map.palette.lines;
          break;

        case 'water':
          document.getElementById('toolOpenerInner').style.backgroundColor = map.palette.water;
          document.getElementById('toolOpenerInner').style.color = map.palette.clear;
          break;

        case 'lava':
          document.getElementById('toolOpenerInner').style.backgroundColor = map.palette.lava;
          document.getElementById('toolOpenerInner').style.color = '#ffffaa';
          break;

        case 'wall hex':
          document.getElementById('toolOpenerInner').style.backgroundColor = map.palette.walls;
          document.getElementById('toolOpenerInner').style.color = map.palette.clear;
          break;

        case 'paths':
          document.getElementById('toolOpenerInner').style.backgroundColor = map.palette.paths;
          document.getElementById('toolOpenerInner').style.color = map.palette.lines;
          break;

        case 'columns':
          document.getElementById('toolOpenerInner').style.backgroundColor = map.palette.columns;
          document.getElementById('toolOpenerInner').style.color = map.palette.clear;
          break;

        default:
          document.getElementById('toolOpenerInner').style.backgroundColor = map.palette.clear;
          document.getElementById('toolOpenerInner').style.color = map.palette.lines;


      }


    }

    function saveColors() {

      map.palette.lines = document.getElementById('linesColor').value;
      map.palette.clear = document.getElementById('clearColor').value;
      map.palette.offboard = document.getElementById('offboardColor').value;
      map.palette.walls = document.getElementById('wallsColor').value;
      map.palette.paths = document.getElementById('pathsColor').value;
      map.palette.water = document.getElementById('waterColor').value;
      map.palette.columns = document.getElementById('columnsColor').value;
      map.palette.lava = document.getElementById('lavaColor').value;

      document.getElementById('colorDialogOverlay').style.display='none';
//      paletteDiv.style.display='none';

      setOpenerColor();

      convertObjectToText();

      objectToOffscreen();

      offscreenToMiniMap();

      offscreenToDisplay();


    }

    function loadStandardPalette( paletteNum ) {

//      console.log( paletteNum );

      switch (paletteNum) {
        case 0:
          map.palette.lines = '#4C3270';
          map.palette.clear = '#EEECF2';
          map.palette.walls = '#4C3270';
          map.palette.offboard = '#FFFFFF';
          map.palette.water = '#483D8B';
          map.palette.paths = '#BBB9F2';
          map.palette.columns = '#4C3270';
          map.palette.lava = '#aa0011';
          map.palette.name = 'Melee';
          break;

        case 1:
          map.palette.lines = '#42599D';
          map.palette.clear = '#F2F1F7';
          map.palette.walls = '#42599D';
          map.palette.offboard = '#FFFFFF'
          map.palette.water = '#483D8B';
          map.palette.paths = '#E3E2F0';
          map.palette.columns = '#42599D';
          map.palette.lava = '#aa0011';
          map.palette.name = 'Wizard';
          break;

        case 2:
          map.palette.lines = '#444444';
          map.palette.clear = '#999999';
          map.palette.walls = '#333333';
          map.palette.offboard = '#666666';
          map.palette.water = '#5E7A87';
          map.palette.paths = '#BBBBBB';
          map.palette.columns = '#006400';
          map.palette.lava = '#f27602';
          map.palette.name = 'Cavern';
          break;

        case 3: //burrow
          map.palette.lines = '#2D1C12';
          map.palette.clear = '#5B3E2B';
          map.palette.walls = '#4A3223';
          map.palette.offboard = '#3E2A1F';
          map.palette.water = '#3D5A58';
          map.palette.paths = '#8B6F4E';
          map.palette.columns = '#FFFFE0';
          map.palette.lava = '#ec3b13';
          map.palette.name = 'Burrow';
          break;

        case 4:  //wildlands
          map.palette.lines = '#4E7433';
          map.palette.clear = '#A9D18E';
          map.palette.walls = '#6B4F3B';
          map.palette.offboard = '#B7B7A4';
          map.palette.water = '#3A7CA5';
          map.palette.paths = '#C2A97F';
          map.palette.columns = '#B8860B';
          map.palette.lava = '#fab1a0';
          map.palette.name = 'Wild Lands';
          break;

        case 5: // desert
          map.palette.lines = '#8B6B3F';
          map.palette.clear = '#F4E2B6';
          map.palette.walls = '#A67B5B';
          map.palette.offboard = '#D9C8A9';
          map.palette.water = '#2E8C8C';
          map.palette.paths = '#C29B6F';
          map.palette.columns = '#4A3C3D';
          map.palette.lava = '#fab1a0';
          map.palette.name = 'Desert';
          break;

        case 6: // frozen
          map.palette.lines = '#2C3E50';        // Dark blue-gray for lines
          map.palette.clear = '#E8F4F8';        // Very pale blue-white for clear areas
          map.palette.walls = '#34495E';        // Darker blue-gray for walls
          map.palette.offboard = '#5DADE2';     // Ice blue for offboard
          map.palette.water = '#1B4F72';        // Deep frozen water blue
          map.palette.paths = '#AEB6BF';        // Light gray-blue for paths
          map.palette.columns = '#566573';      // Medium gray-blue for columns
          map.palette.lava = '#E74C3C';         // Bright red for contrast (maybe geothermal vents?)
          map.palette.name = 'Frozen';
          break;

        case 7: // volcano
          map.palette.lines = '#8B4513';        // Dark burnt sienna for lines
          map.palette.clear = '#2F1B14';        // Dark volcanic ash for clear areas
          map.palette.walls = '#654321';        // Dark brown volcanic rock for walls
          map.palette.offboard = '#1C1C1C';     // Deep charcoal black for offboard
          map.palette.water = '#ff6b6b';        // Crimson red for lava flows/molten rock
          map.palette.paths = '#CD853F';        // Sandy brown for ash-covered paths
          map.palette.columns = '#A0522D';      // Sienna brown for rock columns
          map.palette.lava = '#FF4500';         // Bright orange-red for active lava
          map.palette.name = 'Volcanic';
          break;

        case 8: // woods
          map.palette.lines = '#2D5016';        // Dark forest green for lines
          map.palette.clear = '#8FBC8F';        // Light forest green for clear areas
          map.palette.walls = '#8B4513';        // Saddle brown for tree trunks/wooden walls
          map.palette.offboard = '#228B22';     // Forest green for offboard
          map.palette.water = '#4682B4';        // Steel blue for streams/ponds
          map.palette.paths = '#D2B48C';        // Tan for dirt paths
          map.palette.columns = '#654321';      // Dark brown for tree trunks/wooden posts
          map.palette.lava = '#FFD700';         // Gold for sunlight patches/clearings
          map.palette.name = 'Woods';
          break;

        case 9: // swamp
          map.palette.lines = '#2F4F2F';        // Dark olive green for lines
          map.palette.clear = '#556B2F';        // Olive drab for murky open areas
          map.palette.walls = '#8B7355';        // Dark khaki for rotting wood/twisted roots
          map.palette.offboard = '#1C3A1C';     // Very dark forest green for offboard
          map.palette.water = '#2F4F4F';        // Dark slate gray for murky swamp water
          map.palette.paths = '#6B8E23';        // Olive green for moss-covered paths
          map.palette.columns = '#5D4E37';      // Dark brown for gnarled tree trunks
          map.palette.lava = '#ADFF2F';         // Scary acid green for toxic pools/gases
          map.palette.name = 'Swamp';
          break;

        case 10: // B&W with jaggy lava pattern
          map.palette.lines = '#000000';
          map.palette.clear = '#ffffff';
          map.palette.walls = '#000000';
          map.palette.offboard = '#000000';
          map.palette.water = '#999999';
          map.palette.paths = '#bbbbbb';
          map.palette.columns = '#000000';
          map.palette.lava = '#444444';
          map.palette.name = 'Black and White';
          break;

      case 11: // ethereal plane
          map.palette.lines = '#E6E6FA';        // Lavender for subtle lines
          map.palette.clear = '#F0F8FF';        // Alice blue for open ethereal space
          map.palette.walls = '#DDA0DD';        // Plum for semi-solid barriers
          map.palette.offboard = '#9370DB';     // Medium slate blue for void areas
          map.palette.water = '#B0C4DE';        // Light steel blue for ethereal mists
          map.palette.paths = '#E0E0E0';        // Light gray for spectral pathways
          map.palette.columns = '#D8BFD8';      // Thistle for ethereal pillars
          map.palette.lava = '#FFE4E1';         // Misty rose for energy vortexes
          map.palette.name = 'Ethereal Plane';
          break;

      }

      setColorPickers();

    }

    function updateColorFromHex(colorType) {
        const hexInput = document.getElementById(colorType + 'Hex');
        const colorPicker = document.getElementById(colorType + 'Color');

        let hexValue = hexInput.value;

        // Add # if missing
        if (!hexValue.startsWith('#')) {
            hexValue = '#' + hexValue;
            hexInput.value = hexValue;
        }


        // Validate hex color
        if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
            colorPicker.value = hexValue;
        } else {
          console.log( 'bad value for color');
        }

        map.palette.name = '';

        updateSampleMap();

    }

    function updateColorFromPicker(colorType) {
      const hexInput = document.getElementById(colorType + 'Hex');
      const colorPicker = document.getElementById(colorType + 'Color');

      hexInput.value = colorPicker.value;

      map.palette.name = '';

      updateSampleMap();

    }

    function updateSampleMap() {

      sampleMapContext.fillStyle = document.getElementById('offboardColor').value;
      sampleMapContext.fillRect(0, 0, sampleMapContext.canvas.width, sampleMapContext.canvas.height);

      sampleMapContext.strokeStyle = document.getElementById('linesColor').value;
      sampleMapContext.fillStyle = document.getElementById('clearColor').value;

      sampleMapContext.lineWidth = 2;

      // ai code follows

      // Hex grid parameters
      const hexSize = 30;
      const hexWidth = hexSize * 2;
      const hexHeight = Math.sqrt(3) * hexSize;
      const canvasWidth = sampleMapContext.canvas.width;
      const canvasHeight = sampleMapContext.canvas.height;

      // Calculate hex grid dimensions
      const colWidth = hexWidth * 0.75; // Distance between column centers
      const rowHeight = hexHeight; // Distance between row centers

      // Calculate how many hexes fit
      const numCols = Math.floor((canvasWidth - hexSize * 0.5) / colWidth);
      const numRows = Math.floor(canvasHeight / rowHeight);

      // Function to draw a single hexagon
      function drawHex(centerX, centerY) {
           points = [];
          for (let i = 0; i < 6; i++) {
              const angle = (Math.PI / 3) * i;
              const x = centerX + hexSize * Math.cos(angle);
              const y = centerY + hexSize * Math.sin(angle);
              points.push({ x, y });
          }

          // Draw filled hex
          sampleMapContext.beginPath();
          sampleMapContext.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
              sampleMapContext.lineTo(points[i].x, points[i].y);
          }
          sampleMapContext.closePath();

          sampleMapContext.fill();

          if ( col==2 && row==3 || col==3 && row==0 ) {

            // Calculate midpoints
            const midpoint1 = {
              x: (points[1].x + points[2].x) / 2,
              y: (points[1].y + points[2].y) / 2
            };

            const midpoint2 = {
              x: (points[4].x + points[5].x) / 2,
              y: (points[4].y + points[5].y) / 2
            };

            // Draw the line
            sampleMapContext.lineWidth = 20;
            sampleMapContext.strokeStyle = document.getElementById('pathsColor').value;

            sampleMapContext.beginPath();
            sampleMapContext.moveTo(midpoint1.x, midpoint1.y);
            sampleMapContext.lineTo(midpoint2.x, midpoint2.y);
            sampleMapContext.stroke();
            sampleMapContext.closePath();

            sampleMapContext.strokeStyle = document.getElementById('linesColor').value;
            sampleMapContext.lineWidth = 2;

          }

          if ( col==2 && row==2  ) {

            // Calculate midpoints
            const midpoint1 = {
              x: (points[5].x + points[0].x) / 2,
              y: (points[5].y + points[0].y) / 2
            };

            const midpoint2 = {
              x: (points[1].x + points[4].x) / 2,
              y: (points[1].y + points[4].y) / 2
            };

            const midpoint3 = {
              x: (points[1].x + points[2].x) / 2,
              y: (points[1].y + points[2].y) / 2
            };

            // Draw the line
            sampleMapContext.lineWidth = 20;
            sampleMapContext.strokeStyle = document.getElementById('pathsColor').value;

            sampleMapContext.beginPath();
            sampleMapContext.moveTo(midpoint1.x, midpoint1.y);
            sampleMapContext.lineTo(midpoint2.x, midpoint2.y);
            sampleMapContext.lineTo(midpoint3.x, midpoint3.y);
            sampleMapContext.stroke();
            sampleMapContext.closePath();

            sampleMapContext.strokeStyle = document.getElementById('linesColor').value;
            sampleMapContext.lineWidth = 2;

          }

          if ( col==3 && row==1  ) {

            // Calculate midpoints
            const midpoint1 = {
              x: (points[2].x + points[3].x) / 2,
              y: (points[2].y + points[3].y) / 2
            };

            const midpoint2 = {
              x: (points[1].x + points[4].x) / 2,
              y: (points[1].y + points[4].y) / 2
            };

            const midpoint3 = {
              x: (points[4].x + points[5].x) / 2,
              y: (points[4].y + points[5].y) / 2
            };

            // Draw the line
            sampleMapContext.lineWidth = 20;
            sampleMapContext.strokeStyle = document.getElementById('pathsColor').value;

            sampleMapContext.beginPath();
            sampleMapContext.moveTo(midpoint1.x, midpoint1.y);
            sampleMapContext.lineTo(midpoint2.x, midpoint2.y);
            sampleMapContext.lineTo(midpoint3.x, midpoint3.y);
            sampleMapContext.stroke();
            sampleMapContext.closePath();

            sampleMapContext.strokeStyle = document.getElementById('linesColor').value;
            sampleMapContext.lineWidth = 2;

          }


          sampleMapContext.beginPath();
          sampleMapContext.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
              sampleMapContext.lineTo(points[i].x, points[i].y);
          }
          sampleMapContext.closePath();

          sampleMapContext.stroke();

          // Draw center dot
          sampleMapContext.strokeRect(centerX - 1, centerY - 1, 2, 2);
      }

      // Draw the hex grid
      for ( row = 0; row < numRows; row++) {
          for ( col = 0; col < numCols; col++) {
              // Calculate hex center position
              const x = hexSize + col * colWidth + 15;
              const y = hexSize + row * rowHeight + (col % 2) * (hexHeight / 2);

              if ( row == 0 && col == 1 ||  row == 0 && col == 2 ||  row == 1 && col == 1 ) {
                sampleMapContext.fillStyle = document.getElementById('wallsColor').value;

              } else if ( row == 1 && col == 2) {
                sampleMapContext.fillStyle = document.getElementById('waterColor').value;

              } else if ( row == 3 && col == 4) {
                sampleMapContext.fillStyle = document.getElementById('lavaColor').value;

              } else {
                sampleMapContext.fillStyle = document.getElementById('clearColor').value;

              }


              // Only draw if hex is fully within canvas bounds
              if (x - hexSize >= 0 && x + hexSize <= canvasWidth &&
                  y - hexSize >= 0 && y + hexSize <= canvasHeight) {
                  drawHex(x, y);

                  if ( row == 2 && col == 1 || row == 1 && col == 5 ) {
                    sampleMapContext.fillStyle = document.getElementById('columnsColor').value;
                    sampleMapContext.beginPath();
                    sampleMapContext.arc(x, y, 12, 0, 2 * Math.PI); // draw a circle
                    sampleMapContext.fill();                           // fill the arc

                  }

              }
          }
      }


    }
