// HexWright — Settings window and settings persistence helpers.
// (Classic script: shares the global scope with the other js/ files.)

           class SettingsWindow {
               constructor() {
                   this.settingsWindow = document.getElementById('settingsWindow');
                   this.settingsBackdrop = document.getElementById('settingsBackdrop');

                   // Default settings values
                   this.settings = {
                       showDots: true,
                       showHex: false,
                       showMiniMap: true
                   };

                   this.init();
               }

               init() {
                   // Close on backdrop click
                   this.settingsBackdrop.addEventListener('click', () => {
                       this.hide();
                   });

                   // Close on Escape key
                   document.addEventListener('keydown', (e) => {
                       if (e.key === 'Escape' && this.isVisible()) {
                           this.hide();
                       }
                   });

                   // Initialize toggle states
                   this.updateToggleStates();
               }

               show() {
                   this.settingsWindow.style.display = 'block';
                   this.settingsBackdrop.style.display = 'block';

                   // Focus the settings window for keyboard navigation
                   this.settingsWindow.focus();
               }

               hide() {
                   this.settingsWindow.style.display = 'none';
                   this.settingsBackdrop.style.display = 'none';
               }

               isVisible() {
                   return this.settingsWindow.style.display === 'block';
               }

               toggleSetting(settingName) {
                   // Toggle the setting value
                   this.settings[settingName] = !this.settings[settingName];

                   // Update the visual state
                   this.updateToggleStates();

                   // Call callback if provided
                   if (this.onSettingChange) {
                       this.onSettingChange(settingName, this.settings[settingName]);
                   }

//                   console.log(`${settingName} is now ${this.settings[settingName] ? 'ON' : 'OFF'}`);
               }

               updateToggleStates() {

                   // Update Show MiniMap toggle
                   const miniMapToggle = document.getElementById('showMiniMapToggle');
                   if (this.settings.showMiniMap) {
                       miniMapToggle.classList.add('active');
                   } else {
                       miniMapToggle.classList.remove('active');
                   }
               }

               // Get current setting value
               getSetting(settingName) {
                   return this.settings[settingName];
               }

               // Set a setting value programmatically
               setSetting(settingName, value) {
                   this.settings[settingName] = value;
                   this.updateToggleStates();

                   if (this.onSettingChange) {
                       this.onSettingChange(settingName, value);
                   }
               }

               // Get all settings
               getAllSettings() {
                   return { ...this.settings };
               }

               // Set callback for when settings change
               setOnSettingChange(callback) {
                   this.onSettingChange = callback;
               }
           }

           // Initialize the settings window after DOM is loaded
           let settingsWindow;

           // Wait for DOM to be ready
           if (document.readyState === 'loading') {
               document.addEventListener('DOMContentLoaded', () => {
                   settingsWindow = new SettingsWindow();
               });
           } else {
               // DOM is already ready
               settingsWindow = new SettingsWindow();
           }

           // Global functions for external access
           function showSettings() {
               if (settingsWindow) {
                   settingsWindow.show();
               }
           }

           function hideSettings() {
               if (settingsWindow) {
                   settingsWindow.hide();
               }
           }

           function toggleSetting(settingName) {
               if (settingsWindow) {
                   settingsWindow.toggleSetting(settingName);
               }
           }

           function getSetting(settingName) {
               return settingsWindow ? settingsWindow.getSetting(settingName) : false;
           }

           function setSetting(settingName, value) {
               if (settingsWindow) {
                   settingsWindow.setSetting(settingName, value);
               }
           }

           function getAllSettings() {
               return settingsWindow ? settingsWindow.getAllSettings() : {};
           }

           // Example of how to listen for setting changes
           function onSettingChanged(settingName, newValue) {
//               console.log(`Setting ${settingName} changed to: ${newValue}`);

               // Handle individual settings
               switch(settingName) {
                   case 'showDots':
                       // Your code to show/hide dots
                       break;
                   case 'showHex':
                       // Your code to show/hide hex numbers
                       break;
                   case 'showMiniMap':
                       // Your code to show/hide minimap
                       break;
               }
           }

           // Set up the callback (do this after the settings window is initialized)
           setTimeout(() => {
               if (settingsWindow) {
                   settingsWindow.setOnSettingChange(onSettingChanged);
               }
           }, 100);


    function groupBy( order ) {
      global.groupBy = order;
      saveSettings();
//      localStorage.setItem('HexWrightSettings',JSON.stringify(global));
    }
