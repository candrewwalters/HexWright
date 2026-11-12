// HexWright — Privacy dialog (controls whether the working map is kept in localStorage).
// (Classic script: shares the global scope with the other js/ files.)

    function showPrivacyDialog() {
         document.getElementById('privacyOverlay').style.display = 'flex';
     }

     function setPrivacy( newSetting ) {

       global.privacy = newSetting;
       let whichButton = null;

       switch ( newSetting ) {

         case 0:
          localStorage.removeItem('HexWrightSettings');
          localStorage.removeItem('HexWrightWorking');

           whichButton = Array.from(document.querySelectorAll('.mapInfoButton'))
              .find(btn => btn.textContent.trim() === 'Save Nothing');
          whichButton.classList.add('selected');

          whichButton = Array.from(document.querySelectorAll('.mapInfoButton'))
              .find(btn => btn.textContent.trim() === 'Save Settings');
          whichButton.classList.remove('selected');

          whichButton = Array.from(document.querySelectorAll('.mapInfoButton'))
              .find(btn => btn.textContent.trim() === 'Save My Work');
          whichButton.classList.remove('selected');

          break;

        case 1:
         localStorage.removeItem('HexWrightWorking');
         global.seenPrivacy='yes';

         saveSettings();
//         localStorage.setItem('HexWrightSettings',JSON.stringify(global));

          whichButton = Array.from(document.querySelectorAll('.mapInfoButton'))
             .find(btn => btn.textContent.trim() === 'Save Nothing');
         whichButton.classList.remove('selected');

        whichButton = Array.from(document.querySelectorAll('.mapInfoButton'))
             .find(btn => btn.textContent.trim() === 'Save Settings');
         whichButton.classList.add('selected');

        whichButton = Array.from(document.querySelectorAll('.mapInfoButton'))
             .find(btn => btn.textContent.trim() === 'Save My Work');
         whichButton.classList.remove('selected');

         break;

       case 2:
         global.seenPrivacy='yes';

//         localStorage.setItem('HexWrightSettings',JSON.stringify(global));
        saveSettings();

          whichButton = Array.from(document.querySelectorAll('.mapInfoButton'))
             .find(btn => btn.textContent.trim() === 'Save Nothing');
         whichButton.classList.remove('selected');

        whichButton = Array.from(document.querySelectorAll('.mapInfoButton'))
             .find(btn => btn.textContent.trim() === 'Save Settings');
         whichButton.classList.remove('selected');

        whichButton = Array.from(document.querySelectorAll('.mapInfoButton'))
             .find(btn => btn.textContent.trim() === 'Save My Work');
         whichButton.classList.add('selected');


         break;

       }

       document.getElementById('privacyOverlay').style.display = 'none';

     }
