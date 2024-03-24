// Define a class for roads
class Road {
    constructor(startX, startY, controlStartX, controlStartY, controlEndX, controlEndY, endX, endY, roadClass, roadLength, landUse, roadName) {
        // info for drawing the curve
        this.startX = startX;
        this.startY = startY;
        this.controlStartX = controlStartX;
        this.controlStartY = controlStartY;
        this.controlEndX = controlEndX;
        this.controlEndY = controlEndY;
        this.endX = endX;
        this.endY = endY;

        // information about the road
        this.roadClass = roadClass; 
        this.roadLength = roadLength;
        this.landUse = landUse;
        this.roadName = roadName;

        // flag to track if popup has been shown
        this.popupShown = false;
    }

 drawRoad() {
    // init variables to store the width and colour of the lines (roads)
    let lineWidth;
    let lineColour;

    switch (this.roadClass) {
        case 'Strata':
            lineWidth = 1;
            lineColour = color('#DF6D26'); // Hexadecimal representation of the color
            break;
        case 'Local':
            lineWidth = 4;
            lineColour = color('#005EDF'); // Hexadecimal representation of the color
            break;
        case 'Collector':
            lineWidth = 8;
            lineColour = color('#F8BC50'); // Hexadecimal representation of the color
            break;
        case 'Minor Arterial':
            lineWidth = 10;
            lineColour = color('#2E4C46'); // Hexadecimal representation of the color
            break;
        case 'Major Arterial':
            lineWidth = 16;
            lineColour = color('#554C9E'); // Hexadecimal representation of the color
            break;
        case 'Major Arterial (Multilane)':
            lineWidth = 20;
            lineColour = color('#DA5363'); // Hexadecimal representation of the color
            break;
        case 'Highway':
            lineWidth = 30;
            lineColour = color('#0AA3AF'); // Hexadecimal representation of the color
            break;
        default:
            lineWidth = 1;
            lineColour = color(0); // Default to black if road class is not recognized
            break;
    }

    // set the strokeweight and stroke colour based on the switch statement
    strokeWeight(lineWidth);
    stroke(lineColour);
    noFill();

    // draw the curve based on the above information
    curve(this.startX, this.startY, this.controlStartX, this.controlStartY, this.controlEndX, this.controlEndY, this.endX, this.endY);
}

    mouseClicked() {
        // Calculate a point along the curve that is closer to the mouse position
        let closestPoint = this.findClosestPointOnCurve(mouseX, mouseY);

        // Display road information if mouse is close to the road and popup has not been shown
        if (closestPoint.dist < 10 && !this.popupShown) {
            // Create a div element for the popup
            this.popup = createDiv();
            this.popup.position(closestPoint.x, closestPoint.y);
            this.popup.style('background-color', 'black');
            this.popup.style('padding', '10px');
            this.popup.style('font-family', 'Arial');
            this.popup.style('color', 'white');

            // Set the content of the popup
            this.popup.html('<b><u>About ' + this.roadName + ':</u></b><br>' +
                '<b>Road Class: </b>' + this.roadClass + '<br>' +
                '<b>Road Name: </b>' + this.roadName + '<br>' +
                '<b>Road Length: </b>' + this.roadLength + '<br>' +
                '<b>Land Use: </b>' + this.landUse);

            // Set initial opacity to 1 (fully visible)
            this.popup.style('opacity', '1');

            // Gradually reduce opacity over time
            let fadeOutInterval = setInterval(() => {
                let opacity = parseFloat(this.popup.style('opacity'));
                opacity -= 0.005; // Adjust the fade-out speed as needed
                this.popup.style('opacity', opacity);
                if (opacity <= 0) {
                    clearInterval(fadeOutInterval);
                    this.popup.remove(); // Remove the element from the DOM
                    this.popupShown = false; // Reset the popupShown flag
                }
            }, 20); // 20 milliseconds interval for smoother animation
            this.popupShown = true; // Mark the popup as shown
        }
    } 
    

    findClosestPointOnCurve(x, y) {
        let closestDist = Infinity;
        let closestPoint;
        for (let t = 0; t <= 1; t += 0.01) {
            let px = curvePoint(this.startX, this.controlStartX, this.controlEndX, this.endX, t);
            let py = curvePoint(this.startY, this.controlStartY, this.controlEndY, this.endY, t);
            let d = dist(px, py, x, y);
            if (d < closestDist) {
                closestDist = d;
                closestPoint = { x: px, y: py, dist: d };
            }
        }
        return closestPoint;
    }
}
