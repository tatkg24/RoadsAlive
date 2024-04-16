// VARIABLE DECLARATION------------------------------------
let table;
let step = 100;
let randStep;
let roads = [];
let trafficSlider; // Slider for controlling traffic density
let isDay;
let soundEffect;
let refreshButton;

// PRELOAD, SETUP, DRAW------------------------------------
function preload(){
    // data table of roads 
    table = loadTable('data/Road.csv', 'csv', 'header');
    //sound effect from the assets folder
    soundEffect = loadSound('assets/clickSound.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  trafficSlider = createSlider(0, 100, 50); // Traffic slider ranges from 0 to 100
  trafficSlider.id('day-night-slider'); //targetted in the css file
  refreshButton = createButton("Generate New Roads");
  refreshButton.id('refresh-button'); //targetted in the css file
  refreshButton.id('refresh-button'); //targetted in the css file
  positionElements(); // Position elements based on window size
  drawRoads();
}

function draw() {
  // Check if the slider value is greater than or equal to 50
  if (trafficSlider && trafficSlider.value() >= 50) {
      isDay = true;
      background(255, 255, 255); // white background during the day
  } else if (trafficSlider && trafficSlider.value() < 50) {
      isDay = false;
      background(0, 0, 0); // black background at night
  }

  // Check if roads array is not empty before updating or drawing
  
      for (let i = 0; i < roads.length; i++) {
        if(roads[i] != null){
          roads[i].update(isDay); // Update the animation state
          roads[i].drawRoad(); // Draw the road curve
        }
      }

  drawLegend(); // Draw the legend
}

// FUNCTION DECLARATION--------------------------------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionElements(); // Reposition elements based on new window size
  drawRoads(); // Ensure roads are redrawn after window resize
}

function positionElements() {
  // Position the slider
  let sliderX = 10; // X position of the slider
  let sliderY = 10; // Y position of the slider
  trafficSlider.position(sliderX, sliderY);

  // Position the legend
  let legendX = windowWidth - 210; // X position of the legend
  let legendY = 10; // Y position of the legend
  // Call drawLegend with updated position
  drawLegend(legendX, legendY);
}

// function to return the maximum road length from the dataset
function getRoadLength(){
    let maxRoadLength = 0;
    for (let i = 0; i < table.getRowCount(); i++) {
        let roadLength = table.getNum(i, 'SHAPESTLength');
        if (roadLength > maxRoadLength) {
            maxRoadLength = roadLength;
        }
    }
    console.log("MAX:" + maxRoadLength);
    return maxRoadLength;
}

// function to store and draw roads based on the table data
// TODO fix line drawing so that roads are drawn accurately and to scale
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
    let direction = table.getString(i, 'directional_tendency');
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
        road = new StrataRoad(startX, startY, endY, endX, roadLength, landUse, roadName, direction, 0.001, 10);
        break;
      case 'Local':
        road = new LocalRoad(startX, startY, endY, endX, roadLength, landUse, roadName, direction, 0.005, 10);
        break;
      case 'Collector':
        road = new CollectorRoad(startX, startY, endY, endX, roadLength, landUse, roadName, direction, 0.009, 20);
        break;
      case 'Minor Arterial':
        road = new MinorArterialRoad(startX, startY, endY, endX, roadLength, landUse, roadName, direction, 0.02, 20);
        break;
      case 'Major Arterial':
        road = new MajorArterialRoad(startX, startY, endY, endX, roadLength, landUse, roadName, direction, 0.09, 10);
        break;
      case 'Major Arterial (Multilane)':
        road = new MajorArterialMultilaneRoad(startX, startY, endY, endX, roadLength, landUse, roadName, direction, 0.1, 20);
        break;
      case 'Highway':
        road = new HighwayRoad(startX, startY, endY, endX, roadLength, landUse, roadName, direction, 0.2, 30);
        break;
    }

    // add the road to the roads array
    roads.push(road);
  }
}

function mouseClicked() {
  // Check if the mouse click is outside the legend area
  const legendX = windowWidth - 210; // X position of the legend
  const legendY = 10; // Y position of the legend
  const legendWidth = 200; // Width of the legend box
  const legendHeight = 295; // Height of the legend box
  if (
    mouseX < legendX ||
    mouseX > legendX + legendWidth ||
    mouseY < legendY ||
    mouseY > legendY + legendHeight
  ) {
    // Iterate over each road object and check for mouse click
    roads.forEach(road => {
      road.mouseClicked();
    });
  }
}


function drawLegend() {
  noStroke();
  const legendWidth = 200; // Width of the legend box
  const legendHeight = 295; // Height of the legend box
  const padding = 10; // Padding between legend items

  const legendX = windowWidth - legendWidth - padding; // X position of the legend on the right side
  const legendY = padding; // Y position of the legend at the top

  // Draw the legend box
  fill(isDay ? 0 : 255); // Black fill color during the day, white fill color at night
  rect(legendX, legendY, legendWidth, legendHeight);

  // Legend title
  textAlign(LEFT, TOP);
  textSize(30);
  fill(isDay ? 255 : 0); // White fill color during the day (text), black fill color at night (text)
  textFont("jost");
  text("LEGEND", legendX + padding, legendY + padding);

  let roadColors = {
    'Strata': color(223, 109, 38), // Orange color
    'Local': color(0, 94, 223), // Blue color
    'Collector': color(248, 188, 80), // Yellow color
    'Minor Arterial': color(46, 76, 70), // Dark green color
    'Major Arterial': color(85, 76, 158), // Purple color
    'Major Arterial (Multilane)': color(218, 83, 99), // Red color
    'Highway': color(10, 163, 175) // Cyan color
  };

  // Legend items
  let legendItemY = legendY + 40; // Starting Y position for legend items
  Object.entries(roadColors).forEach(([roadClass, color], index) => {
    fill(color); // Use the road class color
    noStroke();
    rect(legendX + padding, legendItemY, 20, 20); // Draw a colored rectangle
    fill(isDay ? 255 : 0); // White fill color during the day, black fill color at night
    textAlign(LEFT, CENTER);
    textSize(14);
    text(roadClass, legendX + padding + 25, legendItemY + 10); // Display the road class name
    legendItemY += 25; // Move to the next Y position for the next legend item
  });

  // Switch from day to night text
  text("Switch from day to night", legendX + padding, legendItemY + padding);

  // Move the slider inside the legend box
  trafficSlider.position(legendX + padding, legendItemY + padding + 10);

  refreshButton.position(legendX + padding, legendItemY + padding + 35);
  refreshButton.mouseClicked(drawRoads);
}

