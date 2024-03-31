// Define a base class for roads----------------------------------------------------------------------------
class BaseRoad {
    constructor(startX, startY, endY, endX, roadLength, landUse, roadName, speed, amp) {
        // info for drawing the curve
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;

        // information about the road
        this.roadLength = roadLength;
        this.landUse = landUse;
        this.roadName = roadName;

        // flag to track if popup has been shown
        this.popupShown = false;
        this.t = 0; //time variable for the animation
        this.speed = speed; //speed variable for the animation
        this.amp = amp;
    }

   // controls the animation pacing
    update(isDay) {
        // Adjust the speed based on whether it's day or night

        console.log(this.speed);

        let adjustedSpeed = isDay ? this.speed : this.speed / 10;

        this.t += adjustedSpeed;

        // if t exceeds 1, reset it to 0 to restart the animation
        if (this.t > 1) {
            this.t = 0;
        }
    }


    // draws the roads with the specified width and colour
    drawRoad(lineWidth, lineColour) {
        strokeWeight(lineWidth);
        stroke(lineColour);
        noFill();
    
        beginShape();
        for (let t = 0; t <= 1; t += 0.01) {
            let currentX = lerp(this.startX, this.endX, t);
            let currentY = this.startY + sin((currentX + frameCount) * this.speed) * this.amp; // Adjust the amplitude (10 in this case) and speed (0.1 in this case) as needed
    
            curveVertex(currentX, currentY);
        }
        endShape();
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
                '<b>Road Class: </b>' + this.constructor.name + '<br>' +
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
            let currentX = lerp(this.startX, this.endX, t);
            let currentY = this.startY + sin((currentX + frameCount) * this.speed) * this.amp;
            let d = dist(currentX, currentY, x, y);
            if (d < closestDist) {
                closestDist = d;
                closestPoint = { x: currentX, y: currentY, dist: d, t: t };
            }
        }
        return closestPoint;
    }
    
}

// Define subclasses for each road class----------------------------------------------------------------

class StrataRoad extends BaseRoad {
    constructor(startX, startY, endY, endX, roadLength, landUse, roadName, speed, amp) {
        super(startX, startY, endY, endX, roadLength, landUse, roadName, speed, amp);
    }

    drawRoad() {
        // draw road takes two params (line width and colour)
        super.drawRoad(1, color(223, 109, 38)); // Orange color
    }
}

class LocalRoad extends BaseRoad {
    constructor(startX, startY, endY, endX, roadLength, landUse, roadName, speed, amp) {
        super(startX, startY, endY, endX, roadLength, landUse, roadName, speed, amp);
    }

    drawRoad() {
        super.drawRoad(4, color(0, 94, 223)); // Blue color
    }
}

class CollectorRoad extends BaseRoad {
    constructor(startX, startY, endY, endX, roadLength, landUse, roadName, speed, amp) {
        super(startX, startY, endY, endX, roadLength, landUse, roadName, speed, amp);
    }

    drawRoad() {
        super.drawRoad(8, color(248, 188, 80)); // Yellow color
    }
}

class MinorArterialRoad extends BaseRoad {
    constructor(startX, startY, endY, endX, roadLength, landUse, roadName, speed, amp) {
        super(startX, startY, endY, endX, roadLength, landUse, roadName, speed, amp);
    }

    drawRoad() {
        super.drawRoad(10, color(46, 76, 70)); // Dark green color
    }
}

class MajorArterialRoad extends BaseRoad {
    constructor(startX, startY, endY, endX, roadLength, landUse, roadName, speed, amp) {
        super(startX, startY, endY, endX, roadLength, landUse, roadName, speed, amp);
    }

    drawRoad() {
        super.drawRoad(16, color(85, 76, 158)); // Purple color
    }
}

class MajorArterialMultilaneRoad extends BaseRoad {
    constructor(startX, startY, endY, endX, roadLength, landUse, roadName, speed, amp) {
        super(startX, startY, endY, endX, roadLength, landUse, roadName, speed, amp);
    }

    drawRoad() {
        super.drawRoad(20, color(218, 83, 99)); // Red color
    }
}

class HighwayRoad extends BaseRoad {
    constructor(startX, startY, endY, endX, roadLength, landUse, roadName, speed, amp) {
        super(startX, startY, endY, endX, roadLength, landUse, roadName, speed, amp);
    }

    drawRoad() {
        super.drawRoad(30, color(10, 163, 175)); // Cyan color
    }
}
