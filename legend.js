class Legend {
    constructor(windowWidth, id) {
      this.id = id;
      this.legendWidth = 200; // Width of the legend box
      this.legendHeight = 295; // Height of the legend box
      this.padding = 10; // Padding between legend items
      this.legendX = windowWidth - this.legendWidth - this.padding; // X position of the legend on the right side
      this.legendY = this.padding; // Y position of the legend at the top
      this.roadColors = {
        'Strata': color(223, 109, 38), // Orange color
        'Local': color(0, 94, 223), // Blue color
        'Collector': color(248, 188, 80), // Yellow color
        'Minor Arterial': color(46, 76, 70), // Dark green color
        'Major Arterial': color(85, 76, 158), // Purple color
        'Major Arterial (Multilane)': color(218, 83, 99), // Red color
        'Highway': color(10, 163, 175) // Cyan color
      };

      this.button = createButton('-'); // Create a button
      this.button.position(this.legendX + 170, this.legendY + 10); // Position the button below the legend
      this.button.id('hide-legend');
      this.button.mousePressed(() => { // Add a mousePressed event handler to toggle visibility
        this.isVisible = !this.isVisible;
      });

    }
  
    setPosition(x, y) {
      this.legendX = x;
      this.legendY = y;
    }
  
    draw(isDay) {
      if(!this.isVisible) return;  
      noStroke();
      fill(isDay ? 0 : 255); // Black fill color during the day, white fill color at night
      rect(this.legendX, this.legendY, this.legendWidth, this.legendHeight);
  
      textAlign(LEFT, TOP);
      textSize(30);
      fill(isDay ? 255 : 0); // White fill color during the day (text), black fill color at night (text)
      textFont("jost");
      text("LEGEND", this.legendX + this.padding, this.legendY + this.padding);
  
      let legendItemY = this.legendY + 40; // Starting Y position for legend items
      Object.entries(this.roadColors).forEach(([roadClass, color], index) => {
        fill(color); // Use the road class color
        noStroke();
        rect(this.legendX + this.padding, legendItemY, 20, 20); // Draw a colored rectangle
        fill(isDay ? 255 : 0); // White fill color during the day, black fill color at night
        textAlign(LEFT, CENTER);
        textSize(14);
        text(roadClass, this.legendX + this.padding + 25, legendItemY + 10); // Display the road class name
        legendItemY += 25; // Move to the next Y position for the next legend item
      });
  
      text("Switch from day to night", this.legendX + this.padding, legendItemY + this.padding);
      trafficSlider.position(this.legendX + this.padding, legendItemY + this.padding + 10);
      refreshButton.position(this.legendX + this.padding, legendItemY + this.padding + 35);
      refreshButton.mouseClicked(drawRoads);
    }
  }