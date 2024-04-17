// Define a base class for roads----------------------------------------------------------------------------
class BaseRoad {
    constructor(startX, startY, endY, endX, roadLength, landUse, roadName, direction, speed, amp) {
        // info for drawing the curve
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;

        // information about the road
        this.roadLength = roadLength;
        this.landUse = landUse;
        this.roadName = roadName;
        this.direction = direction;

        // flag to track if popup has been shown
        this.popupShown = false;
        this.t = 0; //time variable for the animation
        this.speed = speed; //speed variable for the animation
        this.defaultAmp = amp; //default amplitude
        this.currentAmp = amp; //current amplitude
    }

   // controls the animation pacing
   update(isDay) {
        let newSpeed = 0;
        let newAmp = this.currentAmp;
        // Adjust the speed based on whether it's day or night
        if(isDay){
            newSpeed = this.speed;
            newAmp = this.defaultAmp+0.5;
        }else{
            console.log(this.speed);
            newSpeed = this.speed/10;
            newAmp = this.defaultAmp/8; // use default amplitude
        }

        this.t += newSpeed;
        this.currentAmp = newAmp;

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
    
        push(); // Save the current drawing state
        if (this.direction === "NS") {
            translate(this.startX, this.startY); // Translate to the start of the road
            rotate(HALF_PI); // Rotate 90 degrees for North-South direction
        } else if (this.direction === "EW") {
            translate(this.startX, this.startY); // Translate to the start of the road
            // No rotation needed for East-West direction
        }
    
        beginShape();
        for (let t = 0; t <= 1; t += 0.01) {
            let currentX = lerp(0, this.endX - this.startX, t); // Adjust for translation
            let currentY = sin((currentX + frameCount) * this.speed) * this.currentAmp; // Adjust for translation
    
            curveVertex(currentX, currentY);
        }
        endShape();
    
        pop(); // Restore the original drawing state
    }
    

    // creates the info box for the road on mouseclick
    // TODO: improve accuracy based on vertical translation
    mouseClicked() {
        // Calculate a point along the curve that is closer to the mouse position
        let closestPoint = this.findClosestPointOnCurve(mouseX, mouseY);

        // Display road information if mouse is close to the road and popup has not been shown
        if (closestPoint.dist < 10 && !this.popupShown) {
            // Create a div element for the popup
            this.popup = createDiv();
            this.popup.position(closestPoint.x, closestPoint.y);
            this.popup.style('padding', '10px');
            this.popup.style('font-family', 'Arial');
            if(isDay == true){
                this.popup.style('background-color', 'black');
                this.popup.style('color', 'white');
            }else{
                this.popup.style('background-color', 'white');
                this.popup.style('color', 'black');
            }
            
            // Set the content of the popup
            this.popup.html('<b><u>About ' + this.roadName + ':</u></b><br>' +
                '<b>Road Class: </b>' + this.constructor.name + '<br>' +
                '<b>Road Name: </b>' + this.roadName + '<br>' +
                '<b>Road Length: </b>' + this.roadLength + '<br>' +
                '<b>Land Use: </b>' + this.landUse + '<br>' +
                '<b>Direction: </b>' + this.direction);

            // Set initial opacity to 1 (fully visible)
            this.popup.style('opacity', '1');
            soundEffect.play();

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

    // determines the closest point on the curve
    findClosestPointOnCurve(x, y) {
        let closestDist = Infinity;
        let closestPoint;
        let stepSize = 0.001; // Smaller step size for higher accuracy
        for (let t = 0; t <= 1; t += stepSize) {
            let currentX = lerp(this.startX, this.endX, t);
            let currentY = this.startY + sin((currentX + frameCount) * this.speed) * this.currentAmp;
    
            if (this.direction === 'NS') {
                currentY = lerp(this.startY, this.endY, t);
                currentX = this.startX + sin((currentY + frameCount) * this.speed) * this.currentAmp;
            }
    
            let d = dist(currentX, currentY, x, y);
            if (d < closestDist) {
                closestDist = d;
                closestPoint = { x: currentX, y: currentY, dist: d, t: t };
            }
        }
        return closestPoint;
    }
    
}//end baseRoad class

// Define subclasses for each road class----------------------------------------------------------------

class StrataRoad extends BaseRoad {
    constructor(startX, startY, endY, endX, roadLength, landUse, roadName, direction, speed, amp) {
        super(startX, startY, endY, endX, roadLength, landUse, roadName, direction, speed, amp);
    }

    drawRoad() {
        // draw road takes two params (line width and colour)
        super.drawRoad(1, color(223, 109, 38)); // Orange color
    }
}

class LocalRoad extends BaseRoad {
    constructor(startX, startY, endY, endX, roadLength, landUse, roadName, direction, speed, amp) {
        super(startX, startY, endY, endX, roadLength, landUse, roadName, direction, speed, amp);
    }

    drawRoad() {
        super.drawRoad(4, color(0, 94, 223)); // Blue color
    }
}

class CollectorRoad extends BaseRoad {
    constructor(startX, startY, endY, endX, roadLength, landUse, roadName, direction, speed, amp) {
        super(startX, startY, endY, endX, roadLength, landUse, roadName, direction, speed, amp);
    }

    drawRoad() {
        super.drawRoad(8, color(248, 188, 80)); // Yellow color
    }
}

class MinorArterialRoad extends BaseRoad {
    constructor(startX, startY, endY, endX, roadLength, landUse, roadName, direction, speed, amp) {
        super(startX, startY, endY, endX, roadLength, landUse, roadName, direction, speed, amp);
    }

    drawRoad() {
        super.drawRoad(10, color(46, 76, 70)); // Dark green color
    }
}

class MajorArterialRoad extends BaseRoad {
    constructor(startX, startY, endY, endX, roadLength, landUse, roadName, direction, speed, amp) {
        super(startX, startY, endY, endX, roadLength, landUse, roadName, direction, speed, amp);
    }

    drawRoad() {
        super.drawRoad(16, color(85, 76, 158)); // Purple color
    }
}

class MajorArterialMultilaneRoad extends BaseRoad {
    constructor(startX, startY, endY, endX, roadLength, landUse, roadName, direction, speed, amp) {
        super(startX, startY, endY, endX, roadLength, landUse, roadName, direction, speed, amp);
    }

    drawRoad() {
        super.drawRoad(20, color(218, 83, 99)); // Red color
    }
}

class HighwayRoad extends BaseRoad {
    constructor(startX, startY, endY, endX, roadLength, landUse, roadName, direction, speed, amp) {
        super(startX, startY, endY, endX, roadLength, landUse, roadName, direction, speed, amp);
    }

    drawRoad() {
        super.drawRoad(30, color(10, 163, 175)); // Cyan color
    }
}
