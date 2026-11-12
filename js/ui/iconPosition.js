// HexWright — Positioning of the corner menu icons.
// (Classic script: shares the global scope with the other js/ files.)

    //begin icon positioning

    // Icon Position Handler Functions
    function setHorizontalTopLeft() {

        operationOpener.style.top = '2%';
        operationOpener.style.left = '2%';
        operationOpener.style.transform = 'translate(0, 0)';

        toolOpener.style.top = '2%';
        toolOpener.style.left = '2%';
        toolOpener.style.transform = 'translate(5vw, 0)';

        helpOpener.style.top = '2%';
        helpOpener.style.left = '2%';
        helpOpener.style.transform = 'translate(10vw, 0)';

        helpMenu.style.top = '7%';
        helpMenu.style.left = '2%';
        helpMenu.style.bottom = 'auto';
        helpMenu.style.right = 'auto';

        toolMenu.style.top = '7%';
        toolMenu.style.left = '2%';
        toolMenu.style.bottom = 'auto';
        toolMenu.style.right = 'auto';

        operationMenu.style.top = '7%';
        operationMenu.style.left = '2%';
        operationMenu.style.bottom = 'auto';
        operationMenu.style.right = 'auto';

    }

    function setVerticalTopLeft() {

        operationOpener.style.top = '2%';
        operationOpener.style.left = '2%';
        operationOpener.style.transform = 'translate(0, 0)';

        toolOpener.style.top = '2%';
        toolOpener.style.left = '2%';
        toolOpener.style.transform = 'translate(0, 6vh)';

        helpOpener.style.top = '2%';
        helpOpener.style.left = '2%';
        helpOpener.style.transform = 'translate(0, 12vh)';

        helpMenu.style.top = '2%';
        helpMenu.style.left = '5%';
        helpMenu.style.bottom = 'auto';
        helpMenu.style.right = 'auto';

        toolMenu.style.top = '2%';
        toolMenu.style.left = '5%';
        toolMenu.style.bottom = 'auto';
        toolMenu.style.right = 'auto';

        operationMenu.style.top = '2%';
        operationMenu.style.left = '5%';
        operationMenu.style.bottom = 'auto';
        operationMenu.style.right = 'auto';

    }

    function setHorizontalTopRight() {

        operationOpener.style.top = '2%';
        operationOpener.style.left = '2%';
        operationOpener.style.transform = 'translate(calc(96vw - 100%), 0)';

        toolOpener.style.top = '2%';
        toolOpener.style.left = '2%';
        toolOpener.style.transform = 'translate(calc(91vw - 100%), 0)';

        helpOpener.style.top = '2%';
        helpOpener.style.left = '2%';
        helpOpener.style.transform = 'translate(calc(86vw - 100%), 0)';

        helpMenu.style.top = '7%';
        helpMenu.style.right = '2%';
        helpMenu.style.bottom = 'auto';
        helpMenu.style.left = 'auto';

        toolMenu.style.top = '7%';
        toolMenu.style.right = '2%';
        toolMenu.style.bottom = 'auto';
        toolMenu.style.left = 'auto';

        operationMenu.style.top = '7%';
        operationMenu.style.right = '2%';
        operationMenu.style.bottom = 'auto';
        operationMenu.style.left = 'auto';

    }

    function setVerticalTopRight() {

        operationOpener.style.top = '2%';
        operationOpener.style.left = '2%';
        operationOpener.style.transform = 'translate(calc(96vw - 100%), 0)';

        toolOpener.style.top = '2%';
        toolOpener.style.left = '2%';
        toolOpener.style.transform = 'translate(calc(96vw - 100%), 6vh)';

        helpOpener.style.top = '2%';
        helpOpener.style.left = '2%';
        helpOpener.style.transform = 'translate(calc(96vw - 100%), 12vh)';

        helpMenu.style.top = '2%';
        helpMenu.style.right = '5%';
        helpMenu.style.bottom = 'auto';
        helpMenu.style.left = 'auto';

        toolMenu.style.top = '2%';
        toolMenu.style.right = '5%';
        toolMenu.style.bottom = 'auto';
        toolMenu.style.left = 'auto';

        operationMenu.style.top = '2%';
        operationMenu.style.right = '5%';
        operationMenu.style.bottom = 'auto';
        operationMenu.style.left = 'auto';

    }

    function setThreeCorners() {
        console.log('Setting icons to three corners');
        operationOpener.style.top = '2%';
        operationOpener.style.left = '2%';
        operationOpener.style.transform = 'translate(0, 0)';

        toolOpener.style.top = '2%';
        toolOpener.style.left = '2%';
        toolOpener.style.transform = 'translate(calc(96vw - 100%), 0)';

        helpOpener.style.top = '2%';
        helpOpener.style.left = '2%';
        helpOpener.style.transform = 'translate( calc(96vw - 100%), calc(96vh - 100%))';

        helpMenu.style.top = 'auto';
        helpMenu.style.left = 'auto';
        helpMenu.style.bottom = '5%';
        helpMenu.style.right = '3%';

        toolMenu.style.top = '5%';
        toolMenu.style.right = '5%';
        toolMenu.style.bottom = 'auto';
        toolMenu.style.left = 'auto';

        operationMenu.style.top = '2%';
        operationMenu.style.right = 'auto';
        operationMenu.style.bottom = 'auto';
        operationMenu.style.left = '3%';

    }

    function setHorizontalBottomLeft() {
        console.log('Setting icons to horizontal bottom-left');
        operationOpener.style.top = '2%';
        operationOpener.style.left = '2%';
        operationOpener.style.transform = 'translate(0, calc(96vh - 100%))';

        toolOpener.style.top = '2%';
        toolOpener.style.left = '2%';
        toolOpener.style.transform = 'translate(5vw, calc(96vh - 100%))';

        helpOpener.style.top = '2%';
        helpOpener.style.left = '2%';
        helpOpener.style.transform = 'translate(10vw, calc(96vh - 100%))';

        helpMenu.style.top = 'auto';
        helpMenu.style.right = 'auto';
        helpMenu.style.bottom = '5%';
        helpMenu.style.left = '5%';

        toolMenu.style.top = 'auto';
        toolMenu.style.right = 'auto';
        toolMenu.style.bottom = '5%';
        toolMenu.style.left = '5%';

        operationMenu.style.top = 'auto';
        operationMenu.style.right = 'auto';
        operationMenu.style.bottom = '5%';
        operationMenu.style.left = '5%';

    }


        // Main handler function
    function handleIconPositionChange(event) {
        const selectedValue = event.target.value;

        global.icons = selectedValue;
        saveSettings()
//        localStorage.setItem('HexWrightSettings',JSON.stringify(global));

        switch(selectedValue) {
            case 'horizontal-top-left':
                setHorizontalTopLeft();
                break;
            case 'vertical-top-left':
                setVerticalTopLeft();
                break;
            case 'horizontal-top-right':
                setHorizontalTopRight();
                break;
            case 'vertical-top-right':
                setVerticalTopRight();
                break;
            case 'three-corners':
                setThreeCorners();
                break;
            case 'horizontal-bottom-left':
                setHorizontalBottomLeft();
                break;
            default:
                console.warn('Unknown icon position:', selectedValue);
        }
    }

    // Set up event listeners when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Get all radio buttons for icon position
        const iconPositionRadios = document.querySelectorAll('input[name="iconPosition"]');

        // Add event listener to each radio button
        iconPositionRadios.forEach(radio => {
            radio.addEventListener('change', handleIconPositionChange);
        });
    });


    //end icon positioning

// hi res export coded


// Export Dialog JavaScript Functions
