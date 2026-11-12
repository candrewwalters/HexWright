// HexWright — Import of Shamat II JSON maps.
// (Classic script: shares the global scope with the other js/ files.)

    function convertShamatToObject() {

//      document.getElementById('shamatWarningDiv').style.display='block';

      showShamatWarning();

      shamatObject = JSON.parse( document.getElementById("textDisplayArea").value );

      map = {
        name: shamatObject.name,
        description: 'Imported from Shamat II\ncreated by ' + shamatObject.author,
        width: shamatObject.cols,
        height: shamatObject.rows,
        grid: Array.from({ length: shamatObject.cols }, () =>
          Array.from({ length: shamatObject.rows }, () => [])
        ),
        palette: {
          name: 'cavern'
        },
        graphic: undefined,
        lineStyle: 'normal',
        showDots: 'no',
        showHexNumbers: 'no',
        stoneBridges: [],
        woodBridges: [],
        texture: 'no',
        megaHexCenters: []
      };

      for ( let i = 0; i < shamatObject.hexes.length; i++ ) {

        const x = Math.floor( i / map.height );
        const y = i % map.width;

        const shamatColor = shamatObject.hexes[i].base[0].color;
        const hexColor = simpleColorCategory( shamatColor );

        switch ( hexColor ) {

          case 'black':
            map.grid[x][y].push('wall hex');
            break;

          case 'blue':
            map.grid[x][y].push('water');
            break;

          case 'red':
            map.grid[x][y].push('lava');
            break;

        }

        if ( shamatObject.hexes[i].decor.length > 0 ) {

          if ( shamatObject.hexes[i].decor[0].component=='pentagram' ) {
            map.grid[x][y].push('pentacle');

          }

          if ( shamatObject.hexes[i].decor[0].component=='trapdoor' ) {
            map.grid[x][y].push('trapdoor');

          }

          if ( shamatObject.hexes[i].decor[0].component=='floor_pit' ) {
            map.grid[x][y].push('pit');

          }
                }


      }

      loadStandardPalette( 2 );

      megaHexOrigin = null;

      normalizeGrid();   // one terrain per hex (core/hexContents.js)

      convertObjectToText();

    }


    let shamatKeyHandler = null;

    function showShamatWarning() {
        const div = document.getElementById('shamatWarningDiv');
        div.style.display = 'block';

        // Add key listener only when dialog is shown
        shamatKeyHandler = function(event) {
            if (event.key === 'Escape' || event.key === ' ' || event.key === 'Enter') {
                hideShamatWarning();
            }
        };

        document.addEventListener('keydown', shamatKeyHandler);
    }

    function hideShamatWarning() {
        const div = document.getElementById('shamatWarningDiv');
        div.style.display = 'none';

        // Remove the key listener when dialog is hidden
        if (shamatKeyHandler) {
            document.removeEventListener('keydown', shamatKeyHandler);
            shamatKeyHandler = null;
        }
    }
