// HexWright — Saving to / loading from files.
// (Classic script: shares the global scope with the other js/ files.)

function saveToDownloads() {

    const a = document.createElement('a');
    const file = new Blob([ document.getElementById('textDisplayArea').value ], {type: 'text/plain'});

    var d = new Date();

              dateString = d.getMonth() + "-" + d.getDate() + "-" + d.getYear() + " " + d.getHours() + " " + d.getMinutes();

    a.href= URL.createObjectURL(file);
    a.download = map.name + " " + dateString;
    a.click();

    URL.revokeObjectURL(a.href);


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
