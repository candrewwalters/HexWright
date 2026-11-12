// HexWright — App startup, layout toggles, text-change/undo, test maps, save-on-exit.
// (Classic script: shares the global scope with the other js/ files.)

    function initApp() {

      sampleMapContext = document.getElementById('paletteSampleCanvas').getContext("2d");

      const savedMap = localStorage.getItem('HexWrightWorking');
      if (savedMap) {

        document.getElementById("textDisplayArea").value = savedMap;

        convertTextToObject();

        document.getElementById('mapInfoShowDots').checked = (map.showDots === "yes");
        document.getElementById('mapInfoShowHex').checked = (map.showHexNumbers === "yes");
        document.getElementById('mapInfoTexture').checked = (map.texture === "yes");
        document.getElementById('mapInfoHandDrawn').checked = (map.handDrawn === "yes");

      } else {

        console.log('no saved map found, using default...');

        document.getElementById('textDisplayArea').value = document.getElementById('testText1').innerText;
        convertTextToObject();

        // map = {
        //   name: 'mapname',
        //   description: 'a map',
        //   showDots: 'yes',
        //   showHexNumbers: 'yes',
        //   grid: Array.from({ length: 6 }, () =>
        //     Array.from({ length: 6 }, () => [])
        //   ),
        //   palette: {
        //     lines: '#4C3270',
        //     clear: '#EEECF2',
        //     walls: '#4C3270',
        //     offboard: '#ffffff',
        //     water: '#483D8B',
        //     paths: '#bbb9f2',
        //     columns: '#4C3270',
        //     lava: '#aa0011'
        //   }
        // };

      }

//      global.miniMapSize = 'small';

      const fetchedSettings = localStorage.getItem('HexWrightSettings');
//      console.log('fetchedSettings:', fetchedSettings);
//      console.log('typeof fetchedSettings:', typeof fetchedSettings);
//      console.log('fetchedSettings === null:', fetchedSettings === null);
//      console.log('Boolean(fetchedSettings):', Boolean(fetchedSettings));

//    console.log(fetchedSettings);

      if ( fetchedSettings ) {

        global = JSON.parse( fetchedSettings );
//        console.log(global.currentTool);
        if (!global.hasOwnProperty('groupBy')) global.groupBy = 'terrain';
        document.querySelector(`input[name="groupBy"][value="${global.groupBy}"]`).checked = true;

        if (!global.hasOwnProperty('miniMapSize')) global.miniMapSize = 'medium';
        document.querySelector(`input[name="miniMapSize"][value="${global.miniMapSize}"]`).checked = true;

        if (!global.hasOwnProperty('miniMapPosition')) global.miniMapPosition = 'top-right';

        let iconFunction = 'set' + global.icons.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');

//        console.log(iconFunction);

        window[iconFunction]();

        setPrivacy( global.privacy );

//        console.log(global.currentTool);
        setTool( global.currentTool );

        updateMiniMapPosition();

      } else {

        global = {
          currentTool: 'offboard',
          currentTool: 'clear',
          groupBy: 'terrain',
          miniMapSize: 'medium',
          icons: "vertical-top-left",
          miniMapPosition: 'top-right'
        };

        showPrivacyDialog();


      }


      global.changed = 'no';

      setInterval(saveObjectToLS, 20000);

      window.addEventListener('resize', updateMiniMapSize);


      helpMenu = document.getElementById('helpMenu');
      toolMenu = document.getElementById('toolMenu');
      operationMenu = document.getElementById('operationMenu');
      helpDiv = document.getElementById('helpDiv');
      settingsDiv = document.getElementById('settingsDiv');
      paletteDiv = document.getElementById('paletteDiv');


      document.getElementById('fileInput').addEventListener('change', handleFileChange);
      document.getElementById('fileInput').addEventListener('click', handleFileChange);

      displayContext = displayCanvas.getContext('2d');
      offscreenContext = offscreenCanvas.getContext('2d');
      miniMapContext = miniMapCanvas.getContext('2d');

      operationOpener = document.getElementById('operationOpener');
      toolOpener = document.getElementById('toolOpener');
      helpOpener = document.getElementById('helpOpener');

      convertTextToObject();

      objectToOffscreen();

      focusX = offscreenCanvas.width / 2;
      focusY = offscreenCanvas.height / 2;

      offscreenToDisplay();

      updateMiniMapSize( global.miniMapSize );
      offscreenToMiniMap();

      undoStack.push(textDisplayArea.value);

      // this next part should let the system handle undos if they are editing
      // a text area, but if they are editing the map and thus nothing has
      // focus we will do our undo function.

      document.addEventListener('keydown', function(e) {
          // Check if any input/textarea is currently focused
          let activeElement = document.activeElement;
          let isEditingText = activeElement.tagName === 'TEXTAREA' ||
                             activeElement.tagName === 'INPUT' ||
                             activeElement.isContentEditable;

          // Only intercept undo if NOT editing text
          if (!isEditingText && (e.ctrlKey || e.metaKey) && e.key === 'z') {
              e.preventDefault();
              undo();
          }
      });

      window.addEventListener('pagehide', beforeGoodbye);

    }

    function displayAllMap() {
      document.getElementById('mapDisplayDiv').style.height = '98%';
//      document.getElementById('textDisplayArea').style.height = '0%';
      document.getElementById('textDisplayArea').style.display='none';

      setTimeout( offscreenToDisplay, 602 );
    }

    function displayAllText() {

      document.getElementById('mapDisplayDiv').style.height = '0%';
      document.getElementById('textDisplayArea').style.height = '97%';
      document.getElementById('textDisplayArea').style.display='block';

      setTimeout( offscreenToDisplay, 502 );
    }

    function displaySplit() {

      document.getElementById('mapDisplayDiv').style.height = '77%';
      document.getElementById('textDisplayArea').style.display='block';
      document.getElementById('textDisplayArea').style.height = '20%';

      setTimeout( offscreenToDisplay, 502 );
    }

    function toggleHelpDiv() {
      document.getElementById('helpDiv').classList.toggle('hidden');
    }

    function showDiv( theDiv ) {

      operationMenu.style.display='none';
      toolMenu.style.display='none';
      helpMenu.style.display='none';

      theDiv.style.display='block';

    }

    function hideDiv( theDiv ) {

      theDiv.style.display='none';

    }

    function saveObjectToLS() {

      if ( global.changed == 'no' || global.privacy < 2 ) {

        return

      }

//      localStorage.setItem('HexWrightWorking', JSON.stringify(map));

      localStorage.setItem('HexWrightWorking', document.getElementById("textDisplayArea").value );

      global.changed = 'no';

//      console.log('saved');

    }

    function openPalette() {

      setColorPickers();

      document.getElementById('colorDialogOverlay').style.display='block';

      paletteDiv.style.display = 'flex';

    }


    function updateMiniMapPosition() {

//      console.log( global.miniMapPosition );

      const newMiniMapPositionIndex = miniMapPositions.indexOf( global.miniMapPosition );

      switch( newMiniMapPositionIndex ) {
        case 0:
          document.getElementById('miniMapDiv').style.top = '1%';
          document.getElementById('miniMapDiv').style.right = '1%';
          document.getElementById('miniMapDiv').style.bottom = 'auto';
          document.getElementById('miniMapDiv').style.left = 'auto';
          break;
        case 1:
          document.getElementById('miniMapDiv').style.top = 'auto';
          document.getElementById('miniMapDiv').style.right = '1%';
          document.getElementById('miniMapDiv').style.bottom = '1%';
          document.getElementById('miniMapDiv').style.left = 'auto';
          break;
        case 2:
          document.getElementById('miniMapDiv').style.top = 'auto';
          document.getElementById('miniMapDiv').style.right = 'auto';
          document.getElementById('miniMapDiv').style.bottom = '1%';
          document.getElementById('miniMapDiv').style.left = '1%';
          break;
        case 3:
          document.getElementById('miniMapDiv').style.top = '1%';
          document.getElementById('miniMapDiv').style.right = 'auto';
          document.getElementById('miniMapDiv').style.bottom = 'auto';
          document.getElementById('miniMapDiv').style.left = '1%';
          break;
      }


    }

    const miniMapPositions = ['upper-right', 'lower-right', 'lower-left', 'upper-left'];

    function cycleMiniMapPosition() {

        const currentMiniMapPositionIndex = miniMapPositions.indexOf( global.miniMapPosition );
        const newMiniMapPositionIndex = ( currentMiniMapPositionIndex + 1 ) % 4;

        global.miniMapPosition = miniMapPositions[ newMiniMapPositionIndex ];

        saveSettings();

        updateMiniMapPosition();

    }


    function textChange() {

//      console.log('textChange()')

      undoStack.push(textDisplayArea.value);

      if (undoStack.length > 100) {
        undoStack.shift(); // remove oldest entry
      }


      convertTextToObject();

      objectToOffscreen();

      offscreenToMiniMap();

      offscreenToDisplay();

      global.changed = 'yes';


    }

    function undo() {
        if (undoStack.length > 1) {
            // Remove current state
            undoStack.pop();
            // Get previous state and apply it
            textDisplayArea.value = undoStack[undoStack.length - 1];
        }
    }


function testMap( testNum ) {

  if ( testNum == 8 ) {
    document.getElementById('wizardMapDB').style.display = 'flex';
    return;
  }

  document.getElementById('textDisplayArea').value = document.getElementById('testText'+testNum).innerText;

  convertTextToObject();

  objectToOffscreen();

  offscreenToMiniMap();

  offscreenToDisplay();

}

function wizardMap( whichVersion ) {
  console.log(whichVersion);

  document.getElementById('textDisplayArea').value = document.getElementById('testText8').innerText;

  switch ( whichVersion ) {
    case 'e':
      break;

    case 'w':
      document.getElementById('textDisplayArea').value += '\nwalls: 3,4 3,5 4,3 4,4 4,5 4,8 4,9 5,4 5,5 5,8 5,9 5,10 6,3 6,4 6,8 6,9 7,3 7,4 7,5 7,8 7,9 8,3 8,4 8,7 8,8 8,9 9,3 9,4 9,8 9,9 10,2 10,3 10,4 10,7 10,8 11,3 11,4 11,7 11,8 11,9 12,7 12,8';
      break;

    case 'f':
      document.getElementById('textDisplayArea').value += '\nflame: 3,4 3,5 4,3 4,4 4,5 4,8 4,9 5,4 5,5 5,8 5,9 5,10 6,3 6,4 6,8 6,9 7,3 7,4 7,5 7,8 7,9 8,3 8,4 8,7 8,8 8,9 9,3 9,4 9,8 9,9 10,2 10,3 10,4 10,7 10,8 11,3 11,4 11,7 11,8 11,9 12,7 12,8';
      break;

    case 's':
      document.getElementById('textDisplayArea').value += '\nshadow: 3,4 3,5 4,3 4,4 4,5 4,8 4,9 5,4 5,5 5,8 5,9 5,10 6,3 6,4 6,8 6,9 7,3 7,4 7,5 7,8 7,9 8,3 8,4 8,7 8,8 8,9 9,3 9,4 9,8 9,9 10,2 10,3 10,4 10,7 10,8 11,3 11,4 11,7 11,8 11,9 12,7 12,8';
      break;

    case 'p':
      document.getElementById('textDisplayArea').value += '\npit: 3,4 3,5 4,3 4,4 4,5 4,8 4,9 5,4 5,5 5,8 5,9 5,10 6,3 6,4 6,8 6,9 7,3 7,4 7,5 7,8 7,9 8,3 8,4 8,7 8,8 8,9 9,3 9,4 9,8 9,9 10,2 10,3 10,4 10,7 10,8 11,3 11,4 11,7 11,8 11,9 12,7 12,8';
      break;
  }

  convertTextToObject();

  objectToOffscreen();

  offscreenToMiniMap();

  offscreenToDisplay();

  document.getElementById('wizardMapDB').style.display = 'none';


}


function saveSettings() {

  localStorage.setItem('HexWrightSettings',JSON.stringify(global));
//  console.log(global.currentTool);
}

function beforeGoodbye() {

//  console.log('beforeGoodbye called, privacy:', global.privacy);


    if ( global.privacy == 2 ) {

      localStorage.setItem('HexWrightWorking', document.getElementById("textDisplayArea").value );

    }

//    console.log('->' + global.currentTool);
//    console.log(localStorage.HexWrightSettings);

}
