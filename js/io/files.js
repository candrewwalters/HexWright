// HexWright — Saving to / loading from files.
// (Classic script: shares the global scope with the other js/ files.)

// "Map Name 2026-11-12 1503"
function fileStamp() {
  const d = new Date(), pad = n => String( n ).padStart( 2, '0' );
  return d.getFullYear() + '-' + pad( d.getMonth() + 1 ) + '-' + pad( d.getDate() ) + ' ' + pad( d.getHours() ) + pad( d.getMinutes() );
}

function downloadFile( contents, fileName, mimeType ) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL( new Blob( [ contents ], { type: mimeType } ) );
  a.download = fileName;
  a.click();
  URL.revokeObjectURL( a.href );
}

// The human-readable text, exactly as shown in the text box.
function saveToDownloads() {
  downloadFile( document.getElementById('textDisplayArea').value, map.name + ' ' + fileStamp() + '.txt', 'text/plain' );
}

// The game file (JSON), built from the current map.
function saveGameFile() {
  downloadFile( mapToGameJsonText(), map.name + ' ' + fileStamp() + '.json', 'application/json' );
}


function loadMap() {

  document.getElementById('fileInput').click();

}


    function handleFileChange(event) {
//        console.log('handleFileChange()');
        const file = event.target.files[0]; // Get the selected file
        if (!file) {
//            console.log("no file was selected");
            return; // If no file is selected, do nothing
        }

//        console.log( file );

        const reader = new FileReader(); // Create a FileReader object
        reader.onload = handleFileLoad;

        // Read the file as text
        reader.readAsText(file);
    }

    function handleFileLoad(e) {

//      console.log( 'handleFileLoad()' );

        const content = e.target.result; // Get the file content

        document.getElementById('textDisplayArea').value = content; // Load content into the textarea

//        console.log( content.split('\n')[0] );

        convertTextToObject();

        objectToOffscreen();

        offscreenToMiniMap();

        offscreenToDisplay();

    }
