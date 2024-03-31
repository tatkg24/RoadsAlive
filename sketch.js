let table;
let step = 100;
let randStep;
let roads = [];
let trafficSlider; // Slider for controlling traffic density
let isDay;


function preload(){
    table = loadTable('data/Road.csv', 'csv', 'header');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    trafficSlider = createSlider(0, 100, 50); // Traffic slider ranges from 0 to 100
    trafficSlider.position(10, 10); // Position the slider
    drawRoads();
}

function draw() {
  console.log(isDay);

  if(trafficSlider.value() >= 50){
    isDay = true;
    background(255, 255, 204); // Yellow background during the day
  }else if(trafficSlider.value()<50){
    isDay = false;
    background(0, 0, 128); // Navy background at night
  }
  for (let i = 0; i < roads.length; i++) {
      roads[i].update(isDay); // Update the animation state
      roads[i].drawRoad(); // Draw the road curve
  }

  drawLegend(); // Draw the legend
}


function windowResized() {
    background(255);
    resizeCanvas(windowWidth, windowHeight);
}

function getRoadLength(){
    let maxRoadLength = 0;
    for (let i = 0; i < table.getRowCount(); i++) {
        let roadLength = table.getNum(i, 'SHAPESTLength');
        if (roadLength > maxRoadLength) {
            maxRoadLength = roadLength;
        }
    }
    return maxRoadLength;
}

// function to store and draw roads based on the table data
function drawRoads() {
  roads = [];
  let maxRoadLength = getRoadLength();
  randStep = floor(random(100, 300)); // Define randStep here

  for (let i = floor(random(0, 300)); i < table.getRowCount(); i += randStep) {
    let startX = constrain(random(width), 0, width);
    let startY = constrain(random(height), 0, height);

    let roadClass = table.getString(i, 'road_class');
    let roadLength = table.getNum(i, 'SHAPESTLength');
    let landUse = table.getString(i, 'land_use');
    // if the landuse is null indicate this.
      if(landUse === ''){
        landUse = "Not Specified";
      }
    let roadName = table.getString(i, 'roadmst_name');

    let endX = constrain(map(roadLength, 0, maxRoadLength, 0, width), 0, width);
    let endY = constrain(map(roadLength, 0, maxRoadLength, 0, height), 0, height);

    let road;

    // Create a new Road object based on road class
    switch (roadClass) {
      case 'Strata':
        road = new StrataRoad(startX, startY, endY, endX, roadLength, landUse, roadName, 0.001, 10);
        break;
      case 'Local':
        road = new LocalRoad(startX, startY, endY, endX, roadLength, landUse, roadName, 0.005, 10);
        break;
      case 'Collector':
        road = new CollectorRoad(startX, startY, endY, endX, roadLength, landUse, roadName, 0.009, 20);
        break;
      case 'Minor Arterial':
        road = new MinorArterialRoad(startX, startY, endY, endX, roadLength, landUse, roadName, 0.02, 20);
        break;
      case 'Major Arterial':
        road = new MajorArterialRoad(startX, startY, endY, endX, roadLength, landUse, roadName, 0.09, 10);
        break;
      case 'Major Arterial (Multilane)':
        road = new MajorArterialMultilaneRoad(startX, startY, endY, endX, roadLength, landUse, roadName, 0.1, 20);
        break;
      case 'Highway':
        road = new HighwayRoad(startX, startY, endY, endX, roadLength, landUse, roadName, 0.2, 30);
        break;
    }

    roads.push(road);
  }
}


function mouseClicked() {
  // Iterate over each road object and check for mouse over
  roads.forEach(road => {
    road.mouseClicked();
  });
}

function drawLegend() {
  noStroke();
  let legendWidth = 200; // Width of the legend box
  let legendHeight = 265; // Height of the legend box
  let padding = 10; // Padding between legend items

  let legendX = windowWidth - legendWidth - padding; // X position of the legend on the right side
  let legendY = padding; // Y position of the legend at the top

  // Draw the legend box
  fill(0); // black fill color
  rect(legendX, legendY, legendWidth, legendHeight);

  // Legend title
  textAlign(LEFT, TOP);
  textSize(30);
  fill(255); // white text color
  textFont("jost");
  text("LEGEND", legendX + padding, legendY + padding);

  // Legend items
  let itemY = legendY + 40; // Starting Y position for legend items

  let roadColors = {
      'Strata': color(223, 109, 38), // Orange color
      'Local': color(0, 94, 223), // Blue color
      'Collector': color(248, 188, 80), // Yellow color
      'Minor Arterial': color(46, 76, 70), // Dark green color
      'Major Arterial': color(85, 76, 158), // Purple color
      'Major Arterial (Multilane)': color(218, 83, 99), // Red color
      'Highway': color(10, 163, 175) // Cyan color
  };

  // Loop through each road class and draw a legend item for it
  Object.keys(roadColors).forEach((roadClass, index) => {
      let color = roadColors[roadClass];
      fill(color); // Use the road class color
      noStroke();
      rect(legendX + padding, itemY, 20, 20); // Draw a colored rectangle
      fill(255); // Black text color
      textAlign(LEFT, CENTER);
      textSize(14);
      text(roadClass, legendX + padding + 25, itemY + 10); // Display the road class name
      itemY += 25; // Move to the next Y position for the next legend item
  });

  text("Switch from day to night", legendX + padding, itemY + padding)

  // Move the slider inside the legend box
  trafficSlider.position(legendX + padding, itemY + padding + 10);
}
