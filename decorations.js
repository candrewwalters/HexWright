function drawMushrooms(ctx, baseX, baseY, count = 5) {
    // Draw a handful of small mushrooms above and to the right of the given coordinates

    for (let i = 0; i < count; i++) {
        // Random offset for natural placement
        const offsetX = Math.random() * 30 - 5; // -5 to 25 pixels from base
        const offsetY = Math.random() * 25 - 30; // -30 to -5 pixels from base (above)

        const mushroomX = baseX + offsetX;
        const mushroomY = baseY + offsetY;

        // Random size variation (16-24px high)
        const scale = 0.8 + Math.random() * 0.4;
        const height = 20 * scale;
        const capWidth = height * 0.8;
        const capHeight = height * 0.4;
        const stemWidth = height * 0.15;
        const stemHeight = height * 0.6;

        // Random colors for variety
        const capColors = ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F4A460'];
        const stemColors = ['#F5F5DC', '#FFF8DC', '#FFFACD'];
        const capColor = capColors[Math.floor(Math.random() * capColors.length)];
        const stemColor = stemColors[Math.floor(Math.random() * stemColors.length)];

        // Draw stem
        ctx.fillStyle = stemColor;
        ctx.fillRect(
            mushroomX - stemWidth / 2,
            mushroomY - stemHeight,
            stemWidth,
            stemHeight
        );

        // Draw cap (ellipse)
        ctx.fillStyle = capColor;
        ctx.beginPath();
        ctx.ellipse(
            mushroomX,
            mushroomY - stemHeight,
            capWidth / 2,
            capHeight / 2,
            0,
            0,
            2 * Math.PI
        );
        ctx.fill();

        // Add spots for some mushrooms
        if (Math.random() > 0.5) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            const spotCount = 2 + Math.floor(Math.random() * 3);

            for (let j = 0; j < spotCount; j++) {
                const spotX = mushroomX + (Math.random() - 0.5) * capWidth * 0.6;
                const spotY = mushroomY - stemHeight + (Math.random() - 0.5) * capHeight * 0.6;
                const spotSize = 1 + Math.random() * 2;

                ctx.beginPath();
                ctx.arc(spotX, spotY, spotSize, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }
}

// Usage examples:
// drawMushrooms(offscreenContext, 100, 200);           // 5 mushrooms (default)
// drawMushrooms(offscreenContext, 150, 250, 3);        // 3 mushrooms
// drawMushrooms(offscreenContext, 200, 300, 7);        // 7 mushrooms

// Alternative version with more clustering
function drawMushroomClusterColor1(ctx, baseX, baseY, count = 5) {
    const clusterRadius = 15; // Tighter clustering

    for (let i = 0; i < count; i++) {
        // Use polar coordinates for more natural clustering
        const angle = Math.random() * Math.PI; // 0 to 180 degrees (upper semicircle)
        const distance = Math.random() * clusterRadius;

        const mushroomX = baseX + Math.cos(angle) * distance;
        const mushroomY = baseY - Math.sin(angle) * distance - 10; // Offset up

        // Smaller size variation for clusters
        const scale = 0.9 + Math.random() * 0.2;
        const height = 18 * scale;
        const capWidth = height * 0.75;
        const capHeight = height * 0.35;
        const stemWidth = height * 0.12;
        const stemHeight = height * 0.65;

        // More consistent colors for clusters
        const capColor = '#8B4513';
        const stemColor = '#F5F5DC';

        // Draw stem
        ctx.fillStyle = stemColor;
        ctx.fillRect(
            mushroomX - stemWidth / 2,
            mushroomY - stemHeight,
            stemWidth,
            stemHeight
        );

        // Draw cap
        ctx.fillStyle = capColor;
        ctx.beginPath();
        ctx.ellipse(
            mushroomX,
            mushroomY - stemHeight,
            capWidth / 2,
            capHeight / 2,
            0,
            0,
            2 * Math.PI
        );
        ctx.fill();

        // Optional highlight on cap
        ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
        ctx.beginPath();
        ctx.ellipse(
            mushroomX,
            mushroomY - stemHeight - capHeight * 0.1,
            capWidth / 3,
            capHeight / 4,
            0,
            0,
            2 * Math.PI
        );
        ctx.fill();
    }
}


function drawMushrooms(ctx, x, y) {
    // Draw a cluster of 2-5 black and white line-drawn mushrooms
    const count = 2 + Math.floor(Math.random() * 4); // 2-5 mushrooms
    const clusterRadius = 12; // Tight clustering

    // Set drawing style
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'tan';
    ctx.lineWidth = 1;

    for (let i = 0; i < count; i++) {
        // Use polar coordinates for natural clustering around the point
        const angle = Math.random() * 2 * Math.PI; // Full circle
        const distance = Math.random() * clusterRadius;

        const mushroomX = x + Math.cos(angle) * distance;
        const mushroomY = y + Math.sin(angle) * distance;

        // Size variation (16-22px high)
        const scale = 0.8 + Math.random() * 0.4;
        const height = 20 * scale;
        const capWidth = height * 0.8;
        const capHeight = height * 0.4;
        const stemWidth = height * 0.15;
        const stemHeight = height * 0.6;

        // Draw stem (white fill with black outline)
        ctx.fillRect(
            mushroomX - stemWidth / 2,
            mushroomY - stemHeight,
            stemWidth,
            stemHeight
        );
        ctx.strokeRect(
            mushroomX - stemWidth / 2,
            mushroomY - stemHeight,
            stemWidth,
            stemHeight
        );

        // Draw cap (white fill with black outline)
        ctx.beginPath();
        ctx.ellipse(
            mushroomX,
            mushroomY - stemHeight,
            capWidth / 2,
            capHeight / 2,
            0,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.stroke();

        // Add spots (black dots)
        if (Math.random() > 0.4) {
            ctx.fillStyle = 'black';
            const spotCount = 2 + Math.floor(Math.random() * 3);

            for (let j = 0; j < spotCount; j++) {
                const spotX = mushroomX + (Math.random() - 0.5) * capWidth * 0.6;
                const spotY = mushroomY - stemHeight + (Math.random() - 0.5) * capHeight * 0.6;
                const spotSize = 0.8 + Math.random() * 1.2;

                ctx.beginPath();
                ctx.arc(spotX, spotY, spotSize, 0, 2 * Math.PI);
                ctx.fill();
            }
            ctx.fillStyle = 'tan'; // Reset fill style
        }
    }
}

// Usage:
// drawMushrooms(offscreenContext, 100, 200);  // Draws 2-5 mushrooms clustered around point (100, 200)
