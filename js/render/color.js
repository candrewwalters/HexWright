// HexWright — Color helpers: HSL conversion, contrast, lighten/darken, inverse.
// (Classic script: shares the global scope with the other js/ files.)

function hexToHsl(hex) {
  // Remove the hash if present
  hex = hex.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h, s, l = (max + min) / 2;

  if (diff === 0) {
    h = s = 0; // achromatic
  } else {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    switch (max) {
      case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
      case g: h = (b - r) / diff + 2; break;
      case b: h = (r - g) / diff + 4; break;
    }
    h /= 6;
  }

  return { hue: h, saturation: s, lightness: l };
}

function hslToHex(hsl) {
  const { hue: h, saturation: s, lightness: l } = hsl;

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getContrastingShade(hexColor) {
  // Convert hex to HSL
  if ( hexColor == undefined ) {
    hexColor='#ffffff';
  }

  const hsl = hexToHsl(hexColor);

  // Determine if color is light or dark
  const isLight = hsl.lightness > 0.2;

  // Adjust lightness for contrast
  if (isLight) {
    // Make darker - reduce lightness by 20-30%
    hsl.lightness = Math.max(0, hsl.lightness - 0.25);
  } else {
    // Make lighter - increase lightness by 20-30%
    hsl.lightness = Math.min(1, hsl.lightness + 0.25);
  }

  return hslToHex(hsl);
}


function darkenColor(hexColor, amount = 0.2) {
  // Convert shorthand hex to full form (e.g., #abc → #aabbcc)
  if (hexColor.length === 4) {
    hexColor = '#' + [...hexColor.slice(1)].map(c => c + c).join('');
  }

  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);

  // Apply darkening
  r = Math.max(0, Math.floor(r * (1 - amount)));
  g = Math.max(0, Math.floor(g * (1 - amount)));
  b = Math.max(0, Math.floor(b * (1 - amount)));

  // Convert back to hex
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

function lightenColor(hexColor, amount = 0.2) {
  // Convert shorthand hex to full form (e.g., #abc → #aabbcc)
  if (hexColor.length === 4) {
    hexColor = '#' + [...hexColor.slice(1)].map(c => c + c).join('');
  }

  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);

  // Apply darkening
  r = Math.min(255, Math.floor(r + (255 - r) * amount));
  g = Math.min(255, Math.floor(g + (255 - g) * amount));
  b = Math.min(255, Math.floor(b + (255 - b) * amount));

  // Convert back to hex
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}


    function getInverseColor(hex) {

      if ( hex === undefined ) {

        return ( '#aaaa22' );

      }

//      console.log(hex);

        // Remove # if present
        hex = hex.replace('#', '');

        // Parse RGB values
        const r = 255 - parseInt(hex.substr(0, 2), 16);
        const g = 255 - parseInt(hex.substr(2, 2), 16);
        const b = 255 - parseInt(hex.substr(4, 2), 16);

        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
