// HexWright — Keyboard shortcuts.
// (Classic script: shares the global scope with the other js/ files.)

    function keyDown() {

      const tag = event.target.tagName.toLowerCase();

      if (tag === 'input' || tag === 'textarea' || event.target.isContentEditable) {
        // Let the keystroke go through; user is typing
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
          return;
      }


//      console.log(event.key);

      switch (event.key) {

        case 'Enter':
          if ( paletteDiv.style.display != 'none' ) {
            saveColors();
          }
          break;

        case 'p':
          cycleMiniMapPosition();
          break;

        case 'c':
          openPalette();
          break;

        case 'i':
          openInfo();
          break;

        case 'm':
          toggleMiniMap();
          break;

        case 'd':
          toggleDots();
          break;

        case 'n':
          toggleHexNumbers();
          break;

        case 'a':
          displayAllMap();
          break;

        case 't':
          displayAllText();
          break;

        case 's':
          displaySplit();
          break;

        case '?':
        case '/':
          showHelp();
          break;

        case ';':
          showSettings();
          break;

        case 'Escape':
          paletteDiv.style.display='none';
          document.getElementById('mapInfoDialogOverlay').style.display = 'none';
          break;

        case '1':
          setTool('offboard');
          break;

        case '2':
          setTool('clear');
          break;

        case '3':
          setTool('wall hex');
          break;

        case '4':
          setTool('pit');
          break;

        case '5':
          setTool('paths');
          break;

        case '6':
          setTool('trapdoor');
          break;

        case '7':
          setTool('debris');
          break;

        case '8':
          setTool('water');
          break;

        case '9':
          setTool('barricade');
          break;

        case '0':
          setTool('shadow');
          break;

        case '-':
          setTool('fire');
          break;

        case '=':
          setTool('body');
          break;

        case '`':
          setTool('lava');
          break;

        case 'r':
          setTool('stone');
          break;

        case 'q':
          setTool('column');
          break;

        case 'f':
          setTool('table');
          break;

        case 'g':
          setTool('altar');
          break;

        case 'j':
          setTool('pentacle');
          break;

        case 'o':
          setTool('tar');
          break;

        case 'u':
          setTool('sticky');
          break;

        case 'h':
          setTool('slippery');
          break;

        case 'l':
          setTool('lighter');
          break;

        case 'k':
          setTool('darker');
          break;

        case 'y':
          setTool('star');
          break;

        case 'b':
          setTool('bridge');
          break;

        case '[':
          setMiniMapSmall();
          break;

        case ']':
          setMiniMapMedium();
          break;

        case '\\':
          setMiniMapLarge();
          break;

      }
    }
