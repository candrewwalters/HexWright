// HexWright — High-resolution image export dialog.
// (Classic script: shares the global scope with the other js/ files.)

function showExportDialog() {
    const overlay = document.querySelector('.exportDialogOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        updateFileSizeEstimate();
    }
}

function hideExportDialog() {
    const overlay = document.querySelector('.exportDialogOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function initializeExportDialog() {
    // Set default values
    document.querySelector('input[name="exportDpi"][value="300"]').checked = true;
    document.querySelector('input[name="exportFormat"][value="png"]').checked = true;
    document.querySelector('#exportQualitySlider').value = 90;
    document.querySelector('#exportCustomDpi').disabled = true;
    document.querySelector('#exportQualitySlider').disabled = true;

    // Add event listeners for DPI selection
    document.querySelectorAll('input[name="exportDpi"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const customDpiInput = document.querySelector('#exportCustomDpi');
            customDpiInput.disabled = this.value !== 'custom';
            if (this.value === 'custom') {
                customDpiInput.focus();
            }
            updateFileSizeEstimate();
        });
    });

    // Add event listeners for format selection
    document.querySelectorAll('input[name="exportFormat"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const qualitySlider = document.querySelector('#exportQualitySlider');
            qualitySlider.disabled = this.value !== 'jpg';
            updateFileSizeEstimate();
        });
    });

    // Add event listener for quality slider
    document.querySelector('#exportQualitySlider').addEventListener('input', function() {
        document.querySelector('#exportQualityValue').textContent = this.value + '%';
        updateFileSizeEstimate();
    });

    // Add event listener for custom DPI input
    document.querySelector('#exportCustomDpi').addEventListener('input', updateFileSizeEstimate);

    // Initialize quality display
    document.querySelector('#exportQualityValue').textContent = '90%';
}


function updateFileSizeEstimate() {
    const dpiRadio = document.querySelector('input[name="exportDpi"]:checked');
    const formatRadio = document.querySelector('input[name="exportFormat"]:checked');
    const customDpiInput = document.querySelector('#exportCustomDpi');
    const qualitySlider = document.querySelector('#exportQualitySlider');
    const fileSizeInfo = document.querySelector('.exportFileSizeInfo');

    if (!dpiRadio || !formatRadio) return;

    // Get DPI value
    let dpi = parseInt(dpiRadio.value);
    if (dpiRadio.value === 'custom') {
        dpi = parseInt(customDpiInput.value) || 300;
    }

    // Assuming canvas dimensions - you'll need to replace with actual canvas size
    const canvasWidth = 1000; // Replace with your actual canvas width
    const canvasHeight = 800;  // Replace with your actual canvas height

    // Calculate pixel dimensions at target DPI
    const pixelWidth = Math.round(canvasWidth * dpi / 72);
    const pixelHeight = Math.round(canvasHeight * dpi / 72);

    // Estimate file size
    let estimatedSize;
    if (formatRadio.value === 'png') {
        // PNG: roughly 3-4 bytes per pixel for full color
        estimatedSize = pixelWidth * pixelHeight * 3.5;
    } else {
        // JPG: varies greatly with quality
        const quality = parseInt(qualitySlider.value);
        const compressionFactor = 0.1 + (quality / 100) * 0.9; // 10% to 100% of PNG size
        estimatedSize = pixelWidth * pixelHeight * 3 * compressionFactor;
    }

    // Format file size
    let sizeText;
    if (estimatedSize < 1024) {
        sizeText = Math.round(estimatedSize) + ' bytes';
    } else if (estimatedSize < 1024 * 1024) {
        sizeText = Math.round(estimatedSize / 1024) + ' KB';
    } else {
        sizeText = (estimatedSize / (1024 * 1024)).toFixed(1) + ' MB';
    }

    fileSizeInfo.innerHTML = `
        <strong>Export Size:</strong> ${pixelWidth} × ${pixelHeight} pixels<br>
        <strong>Estimated File Size:</strong> ${sizeText}
    `;
}

  function exportHighResImage() {
      const dpiRadio = document.querySelector('input[name="exportDpi"]:checked');
      const formatRadio = document.querySelector('input[name="exportFormat"]:checked');
      const customDpiInput = document.querySelector('#exportCustomDpi');
      const qualitySlider = document.querySelector('#exportQualitySlider');

      if (!dpiRadio || !formatRadio) {
          alert('Please select both DPI and format options.');
          return;
      }

      // Get DPI value
      let dpi = parseInt(dpiRadio.value);
      if (dpiRadio.value === 'custom') {
          dpi = parseInt(customDpiInput.value);
          if (!dpi || dpi < 1 || dpi > 3000) {
              alert('Please enter a valid DPI value (1-3000).');
              return;
          }
      }

      // Get your canvas element - replace with your actual canvas
      const canvas = document.querySelector('#offscreenCanvas'); // Replace with your canvas selector
      if (!canvas) {
          alert('Canvas not found.');
          return;
      }

      // Calculate scale factor
      const scaleFactor = dpi / 72;

      // Create a temporary high-resolution canvas
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');

      // Set dimensions for high-res export
      tempCanvas.width = canvas.width * scaleFactor;
      tempCanvas.height = canvas.height * scaleFactor;

      // Scale the context for high DPI
      tempCtx.scale(scaleFactor, scaleFactor);

      // Draw your content to the temporary canvas
      // This is where you'll need to redraw your map content at high resolution
      // For example, if you have a function that draws your map:
      // drawMapContent(tempCtx, canvas.width, canvas.height);

      // For now, we'll just copy the existing canvas content
      tempCtx.drawImage(canvas, 0, 0);

      // Export the image
      const format = formatRadio.value;
      let mimeType, quality;

      if (format === 'png') {
          mimeType = 'image/png';
          quality = undefined;
      } else {
          mimeType = 'image/jpeg';
          quality = parseInt(qualitySlider.value) / 100;
      }

      // Convert to blob and download
      tempCanvas.toBlob(function(blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `map_export_${dpi}dpi.${format}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          // Hide the dialog
          hideExportDialog();
      }, mimeType, quality);
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
      initializeExportDialog();
  });

  // Event listeners for dialog buttons
  document.addEventListener('click', function(e) {
      if (e.target.classList.contains('exportBtnCancel')) {
          hideExportDialog();
      } else if (e.target.classList.contains('exportBtnSave')) {
          exportHighResImage();
      }
  });


// end hi res export code
