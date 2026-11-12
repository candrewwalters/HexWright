// HexWright — Help window.
// (Classic script: shares the global scope with the other js/ files.)

       class HelpSystem {
           constructor() {
               this.helpSystem = document.getElementById('helpSystem');
               this.helpBackdrop = document.getElementById('helpBackdrop');
               this.tabs = document.querySelectorAll('.help-tab');
               this.sections = document.querySelectorAll('.help-section');

               this.init();
           }

           init() {
               // Add click handlers to tabs
               this.tabs.forEach(tab => {
                   tab.addEventListener('click', (e) => {
                       const sectionName = e.target.dataset.section;
                       this.showSection(sectionName);
                   });
               });

               // Close on backdrop click
               this.helpBackdrop.addEventListener('click', () => {
                   this.hide();
               });

               // Close on Escape key
               document.addEventListener('keydown', (e) => {
                   if (e.key === 'Escape' && this.isVisible()) {
                       this.hide();
                   }
               });
           }

           show(section = 'general') {
               this.helpSystem.style.display = 'block';
               this.helpBackdrop.style.display = 'block';
               this.showSection(section);

               // Focus the help system for keyboard navigation
               this.helpSystem.focus();
           }

           hide() {
               this.helpSystem.style.display = 'none';
               this.helpBackdrop.style.display = 'none';
           }

           isVisible() {
               return this.helpSystem.style.display === 'block';
           }

           showSection(sectionName) {
               // Hide all sections
               this.sections.forEach(section => {
                   section.classList.remove('active');
               });

               // Remove active class from all tabs
               this.tabs.forEach(tab => {
                   tab.classList.remove('active');
               });

               // Show the requested section
               const targetSection = document.getElementById(`section-${sectionName}`);
               const targetTab = document.querySelector(`[data-section="${sectionName}"]`);

               if (targetSection && targetTab) {
                   targetSection.classList.add('active');
                   targetTab.classList.add('active');
               }
           }
       }

       // Initialize the help system after DOM is loaded
       let helpSystem;

       // Wait for DOM to be ready
       if (document.readyState === 'loading') {
           document.addEventListener('DOMContentLoaded', () => {
               helpSystem = new HelpSystem();
           });
       } else {
           // DOM is already ready
           helpSystem = new HelpSystem();
       }

       // Global functions for external access
       function showHelp(section = 'general') {
           if (helpSystem) {
               helpSystem.show(section);
           }
       }

       function hideHelp() {
           if (helpSystem) {
               helpSystem.hide();
           }
       }

       function showHelpSection(section) {
           if (helpSystem) {
               helpSystem.show(section);
           }
       }

       // Example usage - you can call these from anywhere in your app:
       // showHelp(); // Shows help with General tab active
       // showHelp('keys'); // Shows help with Keys tab active
       // showHelpSection('terrain'); // Shows help with Terrain Tools tab active
       // hideHelp(); // Hides the help system
