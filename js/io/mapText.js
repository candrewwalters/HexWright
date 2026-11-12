// HexWright — Map text format: map object <-> text (the saved format).
// (Classic script: shares the global scope with the other js/ files.)

    function convertObjectToText() {

      let newText = 'Name: ' + map.name + '\n';

      newText += 'Description: ' + map.description + '\n';

      newText += 'Height: ' + map.height + '\n';

      newText += 'Width: ' + map.width + '\n';

      if ( map.graphic ) {
        newText += "Graphic: " + map.graphic + '\n';
      }

      if ( map.showDots == 'no' ) {

        newText += 'Show Dots: no\n';

      }

      if ( map.showHexNumbers == 'no' ) {

        newText += 'Show hex Numbers: no\n';

      }

      if ( map.texture == 'yes' ) {

        newText += 'Add Texture: ' + 'yes' + '\n';

      }

      if ( map.lineStyle != 'normal' ) {

        newText += 'Line Style: ' + map.lineStyle + '\n';

      }

      if ( map.palette.name ) {

        newText += 'Palette: ' + map.palette.name + '\n';

      } else  {

          newText += 'Offboard: ' + map.palette.offboard + '\n';
          newText += 'Clear: ' + map.palette.clear + '\n';
          newText += 'Lines: ' + map.palette.lines + '\n';
          newText += 'Walls: ' + map.palette.walls + '\n';
          newText += 'Water: ' + map.palette.water + '\n';
          newText += 'Path: ' + map.palette.paths + '\n';
          newText += 'Columns: ' + map.palette.columns + '\n';
          newText += 'Lava: ' + map.palette.lava + '\n';

      }

      if ( map.megaHexCenters.length != 0 ) {

        newText += "Megahex centers on: " + map.megaHexCenters[0].x + ',' + map.megaHexCenters[0].y + '\n';

      }

      if ( global.groupBy == 'terrain' ) {

        let offboardList = '';
        let wallList = '';
        let pitList = '';
        let fireList = '';
        let shadowList = '';
        let waterList = '';
        let pathList = '';
        let columnList = '';
        let bodyList = '';
        let debrisList = '';
        let trapdoorList = '';
        let tableList = '';
        let altarList = '';
        let pentacleList = '';
        let barricadeList = '';
        let lavaList = '';
        let stoneList = '';
        let stickyList = '';
        let tarList = '';
        let slipperyList = '';
        let darkerList = '';
        let lighterList = '';
        let starList = '';

        for ( let x = 0; x < map.width; x++ ) {
          for ( let y = 0; y < map.height; y++ ) {

            if ( map.grid[x][y].some(item => item.includes('offboard')) ) {
              offboardList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => item.includes('wall')) ) {
              wallList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['water', 'pond', 'river', 'stream', 'pool'].includes(item)) ) {
              waterList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['path', 'paths'].includes(item)) ) {
              pathList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['column', 'columns'].includes(item)) ) {
              columnList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['body', 'bodies'].includes(item)) ) {
              bodyList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['debris'].includes(item)) ) {
              debrisList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['trapdoor', 'trapdoors'].includes(item)) ) {
              trapdoorList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['table', 'tables'].includes(item)) ) {
              tableList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['altar', 'altars'].includes(item)) ) {
              altarList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['pentacle', 'pentacles'].includes(item)) ) {
              pentacleList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['barricade', 'barricades'].includes(item)) ) {
              barricadeList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['fire'].includes(item)) ) {
              fireList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['shadow'].includes(item)) ) {
              shadowList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['lava'].includes(item)) ) {
              lavaList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['stone'].includes(item)) ) {
              stoneList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['tar'].includes(item)) ) {
              tarList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['sticky'].includes(item)) ) {
              stickyList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['slippery'].includes(item)) ) {
              slipperyList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['pit'].includes(item)) ) {
              pitList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['star'].includes(item)) ) {
              starList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['darker'].includes(item)) ) {
              darkerList += x+','+y+' ';
            }

            if ( map.grid[x][y].some(item => ['lighter'].includes(item)) ) {
              lighterList += x+','+y+' ';
            }


          }
        }


        const lists = [
          { label: 'Offboard', list: offboardList },
          { label: 'Walls', list: wallList },
          { label: 'Water', list: waterList },
          { label: 'Path', list: pathList },
          { label: 'Column', list: columnList },
          { label: 'Fire', list: fireList },
          { label: 'Body', list: bodyList },
          { label: 'Shadow', list: shadowList },
          { label: 'Debris', list: debrisList },
          { label: 'Trapdoor', list: trapdoorList },
          { label: 'Barricade', list: barricadeList },
          { label: 'Table', list: tableList },
          { label: 'Altar', list: altarList },
          { label: 'Pentacle', list: pentacleList },
          { label: 'Lava', list: lavaList },
          { label: 'Stone', list: stoneList },
          { label: 'Tar', list: tarList },
          { label: 'Sticky', list: stickyList },
          { label: 'Slippery', list: slipperyList },
          { label: 'Pits', list: pitList },
          { label: 'Darker', list: darkerList },
          { label: 'Lighter', list: lighterList },
          { label: 'Stars', list: starList }
        ];

        lists.forEach(({ label, list }) => {
          newText = addListToText(newText, label, list);
        });


      } else {

        for ( let x = 0; x < map.width; x++ ) {
          for ( let y = 0; y < map.height; y++ ) {

            if ( map.grid[x][y].length == 0 || ( map.grid[x][y].lrngth == 1 && map.grid[x][y][0] === ['clear']  ) ) {
              continue;
            }

            newText += x + ',' + y + ' ' + map.grid[x][y].join(' ') + '\n';


          }
        }


      }


      for ( let i = 0; i < map.stoneBridges.length; i++ ) {
        newText += 'stone bridge from ' + map.stoneBridges[i].startingX + "," + map.stoneBridges[i].startingY + " to " + map.stoneBridges[i].endingX + "," + map.stoneBridges[i].endingY;

        if ( !bridgeGoodDirection( {x:map.stoneBridges[i].startingX, y:map.stoneBridges[i].startingY, },{x:map.stoneBridges[i].endingX,y:map.stoneBridges[i].endingY}) ) {
          newText += ' (note: this bridge will be excluded from TFT Trainer)';
        }

        newText += '\n';

      }

      for ( let i = 0; i < map.woodBridges.length; i++ ) {
        newText += 'wood bridge from ' + map.woodBridges[i].startingX + "," + map.woodBridges[i].startingY + " to " + map.woodBridges[i].endingX + "," + map.woodBridges[i].endingY;

        if ( !bridgeGoodDirection( {x:map.woodBridges[i].startingX, y:map.woodBridges[i].startingY, },{x:map.woodBridges[i].endingX,y:map.woodBridges[i].endingY}) ) {
          newText += '(note: this bridge will be excluded from TFT Trainer)';
        }

        newText += '\n';

      }


      document.getElementById("textDisplayArea").value = newText;

    }


    function addListToText(newText, label, list, maxLength = 80) {
      if (!list) return newText;

      const prefix = label + ': ';
      const fullLine = prefix + list;

      // If line fits within limit, add it normally
      if (fullLine.length <= maxLength) {
        return newText + fullLine + '\n';
      }

      // Need to split into multiple lines
      const availableSpace = maxLength - prefix.length;
      const items = list.split(' ');

      let currentLine = '';
      let currentLength = 0;

      for (let i = 0; i < items.length; i++) {
        const itemWithSpace = (currentLength === 0 ? items[i] : ' ' + items[i]);

        // Check if adding this item would exceed the limit
        if (currentLength + itemWithSpace.length > availableSpace && currentLength > 0) {
          // Output current line and start a new one
          newText += prefix + currentLine + '\n';
          currentLine = items[i]; // Start new line with current item
          currentLength = items[i].length;
        } else {
          // Add item to current line
          currentLine += itemWithSpace;
          currentLength += itemWithSpace.length;
        }
      }

      // Add the final line if it has content
      if (currentLine) {
        newText += prefix + currentLine + '\n';
      }

      return newText;
    }


    function convertTextToObject() {

      const lines = document.getElementById("textDisplayArea").value.split('\n').map(line => line.trim());

      while (lines.length > 0 && lines[0].trim() === '') {
        lines.shift();
      }

      if ( lines[0].startsWith('{"shamat') ) {

        convertShamatToObject();
        return;

      }

      map = {
        name: 'missing data map',
        palette: {}
      }

      map.name = lines.find(line => /^name\s*[:= -]?/i.test(line))?.replace(/^name\s*[:= -]?\s*/i, '');
        if ( map.name === undefined ) {
          map.name = 'Nameless Map';
        }

//        map.description = lines.find(line => /^description\s*[:= -]?/i.test(line))?.replace(/^name\s*[:= -]?\s*/i, '');

      map.description = lines.find(line => /^description\s*[:= -]?/i.test(line))?.replace(/^description\s*[:= -]?\s*/i, '');

      if ( map.description === undefined ) {
        map.description = '...A place shrouded in mystery and silence, untouched by map or legend.';
      }

      map.graphic = lines.find(line => /^(graphic|graphics|background|bg)\b/i.test(line))?.split(' ').pop();

      map.texture = (lines.find(line => /^(use\s+|add\s+|draw\s+)?texture\b/i.test(line))?.match(/\b(yes|no)\b/i)?.[1] || 'no').toLowerCase();

      // map.handDrawn = (lines.find(line => /^(use\s+|add\s+|draw\s+)?hand[\s-]*drawn[\s-]*lines\b/i.test(line))?.match(/\b(yes|no)\b/i)?.[1] || 'no').toLowerCase();

      map.lineStyle = findLineStyle( lines );

      map.showDots = (lines.find(line => /^(?:show\s+)?dots\s*[:= -]?/i.test(line))?.match(/\b(yes|no)\b/i)?.[1] || 'yes').toLowerCase();

      map.showHexNumbers = (lines.find(line => /^(?:show\s+)?hex\s+numbers\s*[:= -]?/i.test(line))?.match(/\b(yes|no)\b/i)?.[1] || 'yes').toLowerCase();

      // const paletteFound = lines.some(line =>
      //     /^palettes?\s*[:=-]?\s*(?:melee|wild\s+land|wizard|cavern|swamp|volcano|woods|frozen|burrow|desert)s?\s*$/i.test(line)
      //   );

      const paletteFound = lines.some(line =>
          /^palettes?\s*[:=-]?\s*(?:melee|wild\s*land|wizard|cavern|swamp|volcano|woods|frozen|burrow|desert|black\s*and\s*white|ethereal\s*plane)s?\s*$/i.test(line)
      );


      if (paletteFound) {
        const paletteLine = lines.find(line =>
          /^palettes?\s*[:=-]?\s*(?:melee|wild\s*land|wizard|cavern|swamp|volcano|woods?|frozen|burrow|desert|black\s*and\s*white|ethereal\s*plane)s?\s*$/i.test(line)
        );
        const match = paletteLine.match(/^palettes?\s*[:=-]?\s*((?:melee|wild\s*land|wizard|cavern|swamp|volcano|woods?|frozen|burrow|desert|black\s*and\s*white|ethereal\s*plane)s?)\s*$/i);
        let paletteWord = match[1].toLowerCase();
        //          console.log(paletteWord);
        // Remove plural 's' if present (but not from 'melee')
        if (paletteWord.endsWith('s') && paletteWord !== 'melee') {
          paletteWord = paletteWord.slice(0, -1);
        }

        // Normalize spacing for lookup
        paletteWord = paletteWord.replace(/\s+/g, ' '); // normalize multiple spaces to single space

        map.palette.name = paletteWord;
        let paletteList = ['melee','wizard','cavern','burrow','wild land','desert','frozen','volcano','woods','swamp','black and white','ethereal plane'];

//        console.log(paletteWord);

        // Check for both spaced and non-spaced versions
        let paletteIndex = paletteList.indexOf(paletteWord);
        if (paletteIndex === -1) {
          // Try without spaces
          const noSpaceWord = paletteWord.replace(/\s+/g, '');
          const noSpaceList = paletteList.map(p => p.replace(/\s+/g, ''));
          paletteIndex = noSpaceList.indexOf(noSpaceWord);
        }

        loadStandardPalette( paletteIndex );

      } else {

        map.palette.paths = (() => {
          const match = lines.find(line => /^paths?\b/i.test(line))?.match(/#?[0-9a-fA-F]{6}\b/);
          return match ? (match[0].startsWith('#') ? match[0] : '#' + match[0]) : "#C2A97F";
        })();

        map.palette.clear = (() => {
          const match = lines.find(line => /^clear?\b/i.test(line))?.match(/#?[0-9a-fA-F]{6}\b/);
          return match ? (match[0].startsWith('#') ? match[0] : '#' + match[0]) : '#A9D18E';
        })();

        map.palette.columns = (() => {
          const match = lines.find(line => /^columns?\b/i.test(line))?.match(/#?[0-9a-fA-F]{6}\b/);
          return match ? (match[0].startsWith('#') ? match[0] : '#' + match[0]) : "#B8860B";
        })();

        map.palette.lines = (() => {
          const match = lines.find(line => /^lines?\b/i.test(line))?.match(/#?[0-9a-fA-F]{6}\b/);
          return match ? (match[0].startsWith('#') ? match[0] : '#' + match[0]) : "#4E7433";
        })();

        map.palette.offboard = (() => {
          const match = lines.find(line => /^offboard?\b/i.test(line))?.match(/#?[0-9a-fA-F]{6}\b/);
          return match ? (match[0].startsWith('#') ? match[0] : '#' + match[0]) : "#B7B7A4";
        })();

        map.palette.walls = (() => {
          const match = lines.find(line => /^walls?\b/i.test(line))?.match(/#?[0-9a-fA-F]{6}\b/);
          return match ? (match[0].startsWith('#') ? match[0] : '#' + match[0]) : "#6B4F3B";
        })();

        map.palette.water = (() => {
          const match = lines.find(line => /^water?\b/i.test(line))?.match(/#?[0-9a-fA-F]{6}\b/);
          return match ? (match[0].startsWith('#') ? match[0] : '#' + match[0]) : "#3A7CA5";
        })();

        map.palette.lava = (() => {
          const match = lines.find(line => /^lava\b/i.test(line))?.match(/#?[0-9a-fA-F]{6}\b/);
          return match ? (match[0].startsWith('#') ? match[0] : '#' + match[0]) : "#000000";
        })();

      }


      map.width = (() => {
        const match = lines.find(line => /^w(?:idth|ide)\b/i.test(line))?.match(/\b([1-9][0-9]{0,2}|1000)\b/);
        return match ? parseInt(match[1], 10) : 12;
      })();

      map.height = (() => {
        const match = lines.find(line => /^height\b/i.test(line))?.match(/\b([1-9][0-9]{0,2}|1000)\b/);
        return match ? parseInt(match[1], 10) : 9;
      })();

      map.grid = Array.from({ length: map.width }, () =>
        Array.from({ length: map.height }, () => [])
      );

//      updateMiniMapSize();

      // const hexContents = [
      //   { pattern: /^(?:offboard|off\s*board)\s*[:= -]?/i, gridValue: 'offboard' },
      //   { pattern: /^walls?\s*[:= -]?/i, gridValue: 'wall hex' },
      //   { pattern: /^(?:pits?|holes?)\s*[:= -]?/i, gridValue: 'pit' },
      //   { pattern: /^(?:water|pool|pond|stream|river)\s*[:= -]?/i, gridValue: 'water' },
      //   { pattern: /^(?:column|tree)\s*[:= -]?/i, gridValue: 'column' },
      //   { pattern: /^(?:trapdoor|trap\s*door)\s*[:= -]?/i, gridValue: 'trapdoor' },
      //   { pattern: /^debris\s*[:= -]?/i, gridValue: 'debris' },
      //   { pattern: /^darker\s*[:= -]?/i, gridValue: 'darker' },
      //   { pattern: /^lighter\s*[:= -]?/i, gridValue: 'lighter' },
      //   { pattern: /^star\s*[:= -]?/i, gridValue: 'star' },
      //   { pattern: /^body\s*[:= -]?/i, gridValue: 'body' },
      //   { pattern: /^table\s*[:= -]?/i, gridValue: 'table' },
      //   { pattern: /^barricade\s*[:= -]?/i, gridValue: 'barricade' },
      //   { pattern: /^altar\s*[:= -]?/i, gridValue: 'altar' },
      //   { pattern: /^(?:shadows?|darkness)\s*[:= -]?/i, gridValue: 'shadow' },
      //   { pattern: /^(?:fires?|flames?)\s*[:= -]?/i, gridValue: 'fire' },
      //   { pattern: /^(?:paths?|roads?|trails?|walkways?)\s*[:= -]?/i, gridValue: 'path' },
      //   { pattern: /^(?:lavas?|acids?)\s*[:= -]?/i, gridValue: 'lava' },
      //   { pattern: /^(?:rock?|stone?)(?!\s*bridge)\b\s*[:= -]?/i, gridValue: 'stone' }
      // ];

      const hexContents = [
        { pattern: /^(?:offboard|off\s*board)\s*[:= -]?/i, gridValue: 'offboard' },
        { pattern: /^walls?\s*[:= -]?/i, gridValue: 'wall hex' },
        { pattern: /^(?:pits?|holes?)\s*[:= -]?/i, gridValue: 'pit' },
        { pattern: /^(?:water|pool|pond|stream|river)\s*[:= -]?/i, gridValue: 'water' },
        { pattern: /^(?:column|tree)\s*[:= -]?/i, gridValue: 'column' },
        { pattern: /^(?:trapdoor|trap\s*door)\s*[:= -]?/i, gridValue: 'trapdoor' },
        { pattern: /^debris\s*[:= -]?/i, gridValue: 'debris' },
        { pattern: /^dark\s*[:= -]?/i, gridValue: 'darker' },
        { pattern: /^light\s*[:= -]?/i, gridValue: 'lighter' },
        { pattern: /^star\s*[:= -]?/i, gridValue: 'star' },
        { pattern: /^slippery\s*[:= -]?/i, gridValue: 'slippery' },
        { pattern: /^sticky\s*[:= -]?/i, gridValue: 'sticky' },
        { pattern: /^tar\s*[:= -]?/i, gridValue: 'tar' },
        { pattern: /^(?:body|bodies)\s*[:= -]?/i, gridValue: 'body' },
        { pattern: /^table\s*[:= -]?/i, gridValue: 'table' },
        { pattern: /^barricade\s*[:= -]?/i, gridValue: 'barricade' },
        { pattern: /^altar\s*[:= -]?/i, gridValue: 'altar' },
        { pattern: /^pentacle\s*[:= -]?/i, gridValue: 'pentacle' },
        { pattern: /^(?:shadows?|darkness)\s*[:= -]?/i, gridValue: 'shadow' },
        { pattern: /^(?:fires?|flames?)\s*[:= -]?/i, gridValue: 'fire' },
        { pattern: /^(?:paths?|roads?|trails?|walkways?)\s*[:= -]?/i, gridValue: 'path' },
        { pattern: /^(?:lavas?|acids?)\s*[:= -]?/i, gridValue: 'lava' },
        { pattern: /^(?:rock?|stone?)(?!\s*bridge)\b\s*[:= -]?/i, gridValue: 'stone' }
      ];

      lines.forEach(line => {
        for (const obj of hexContents) {
          if (obj.pattern.test(line)) {
            const pairs = [...line.matchAll(/\b(\d{1,3})\s*,\s*(\d{1,3})\b/g)];
            for (const [, xStr, yStr] of pairs) {
              const x = parseInt(xStr, 10);
              const y = parseInt(yStr, 10);
              if (x >= 0 && x < map.width && y >= 0 && y < map.height) {
                map.grid[x][y].push(obj.gridValue);
              }
            }
            break; // Move the break here - after processing ALL coordinate pairs
          }
        }
      });

      lines.forEach(line => {
        // Check if line starts with coordinates (with optional whitespace)
        const coordMatch = line.match(/^\s*(\d{1,3})\s*,\s*(\d{1,3})\s+(.+)/);
        if (coordMatch) {
          const x = parseInt(coordMatch[1], 10);
          const y = parseInt(coordMatch[2], 10);
          const contentString = coordMatch[3].trim();

          if (x >= 0 && x < map.width && y >= 0 && y < map.height) {
            // Split the remaining content by whitespace and push each word
            const words = contentString.split(/\s+/).filter(word => word.length > 0);
            for (const word of words) {
              map.grid[x][y].push(word);
            }
          }
        }
      });

      // look for bridges
      // map.bridges=[];
      //
      // lines.forEach(line => {
      //     // Skip if line doesn't contain "bridge"
      //     if (!line.toLowerCase().includes('bridge')) return;
      //
      //     // Remove "bridge" and common separators, clean up the string
      //     let cleanLine = line.toLowerCase()
      //         .replace('bridge', '')
      //         .replace('from', '')
      //         .replace('to', '')
      //         .replace(':', '')
      //         .replace('-', ' ')
      //         .trim();
      //
      //     // Extract all numbers using regex
      //     const numbers = cleanLine.match(/\d+/g);
      //
      //     // We need exactly 4 numbers for startingX, startingY, endingX, endingY
      //     if (numbers && numbers.length === 4) {
      //         const bridgeObj = {
      //             startingX: parseInt(numbers[0]),
      //             startingY: parseInt(numbers[1]),
      //             endingX: parseInt(numbers[2]),
      //             endingY: parseInt(numbers[3])
      //         };
      //
      //         map.bridges.push(bridgeObj);
      //     }
      // });

      // look for bridges
      map.woodBridges = [];
      map.stoneBridges = [];

      lines.forEach(line => {
          const lowerLine = line.toLowerCase();

          // Skip if line doesn't contain "bridge"
          if (!lowerLine.includes('bridge')) return;

          // Check if it's a wood bridge
          let isWoodBridge = lowerLine.includes('wood bridge') ||
                              lowerLine.includes('woodbridge') ||
                              lowerLine.includes('wooden bridge') ||
                              lowerLine.includes('timber bridge');

          // Check if it's a stone bridge
          let isStoneBridge = lowerLine.includes('stone bridge') ||
                               lowerLine.includes('stonebridge') ||
                               lowerLine.includes('rock bridge') ||
                               lowerLine.includes('granite bridge') ||
                               lowerLine.includes('marble bridge');

           // If it's neither wood nor stone, check palette for default assignment
           if (!isWoodBridge && !isStoneBridge) {
               const woodPalettes = ['burrow', 'wild lands', 'woods', 'frozen', 'swamp'];
               if (woodPalettes.includes(map.palette.name.toLowerCase())) {
                   isWoodBridge = true;
               } else {
                 isStoneBridge = true;
               }
           }

          // Remove bridge-related words and common separators, clean up the string
          let cleanLine = lowerLine
              .replace(/wood(en)?\s*bridge/g, '')
              .replace(/woodbridge/g, '')
              .replace(/timber\s*bridge/g, '')
              .replace(/stone\s*bridge/g, '')
              .replace(/stonebridge/g, '')
              .replace(/rock\s*bridge/g, '')
              .replace(/granite\s*bridge/g, '')
              .replace(/marble\s*bridge/g, '')
              .replace(/bridge/g, '')
              .replace(/from/g, '')
              .replace(/to/g, '')
              .replace(/:/g, '')
              .replace(/-/g, ' ')
              .trim();

          // Extract all numbers using regex
          const numbers = cleanLine.match(/\d+/g);

          // We need exactly 4 numbers for startingX, startingY, endingX, endingY
          if (numbers && numbers.length === 4) {
              const bridgeObj = {
                  startingX: parseInt(numbers[0]),
                  startingY: parseInt(numbers[1]),
                  endingX: parseInt(numbers[2]),
                  endingY: parseInt(numbers[3])
              };

              // Add to appropriate array
              if (isWoodBridge) {
                  map.woodBridges.push(bridgeObj);
              } else if (isStoneBridge) {
                  map.stoneBridges.push(bridgeObj);
              }
          }
      });

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


      megaHexOrigin = findMegahexCoordinates(lines)

//      console.table(map.palette);

    }


    function findMegahexCoordinates(lines) {
        // Regex for megahex variants (case insensitive, optional 's', optional space)
        const megahexPattern = /mega\s?hexe?s?/i;

        // Regex for first pair of numbers separated by comma
        const coordPattern = /(-?\d+)\s*,\s*(-?\d+)/;

        for (const line of lines) {
            if (megahexPattern.test(line)) {
                const match = line.match(coordPattern);
                if (match) {
                    return [parseInt(match[1]), parseInt(match[2])];
                }
            }
        }

        return null; // No megahex line found or no coordinates found
    }


      function findLineStyle(lines) {
      // Regex to match line style declarations (case insensitive, flexible punctuation)
//      const lineStylePattern = /line\s*style\s*[:=]\s*(.+)/i;

          const lineStylePattern = /line[\s-]*style\s*[:=\-]?\s*(\S+)/i

      // Style mapping - converts various inputs to standard outputs
      const styleMap = {
          'handdrawn': 'handDrawn',
          'hand-drawn': 'handDrawn',
          'hand drawn': 'handDrawn',
          'uneven': 'handDrawn',
          'cornersonly': 'cornersOnly',
          'corners-only': 'cornersOnly',
          'corners only': 'cornersOnly',
          'only corners': 'cornersOnly',
          'normal': 'normal',
          'regular': 'normal'
      };

      for (const line of lines) {
          const match = line.match(lineStylePattern);
          if (match) {
              let styleValue = match[1]
                  .replace(/['"]/g, '')
                  .trim()
                  .toLowerCase()
                  .replace(/[-\s]+/g, ''); // Remove all spaces and hyphens

              // Now match against normalized keys
              if (styleValue.includes('hand') || styleValue.includes('uneven')) {
                  return 'handDrawn';
              } else if (styleValue.includes('corner')) {
                  return 'cornersOnly';
              } else if (styleValue.includes('normal') || styleValue.includes('regular')) {
                  return 'normal';
              }
          }
      }

      return 'normal'; // Default if nothing found
    }
