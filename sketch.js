// VARIABLE DECLARATION------------------------------------
let table;
let step = 100;
let randStep;
let roads = [];
let trafficSlider; // Slider for controlling traffic density
let legend; // Declare legend variable

// PRELOAD, SETUP, DRAW------------------------------------
function preload(){
  // data table of roads 
  table = loadTable('data/Road.csv', 'csv', 'header');
  //sound effect from the assets folder
  soundEffect = loadSound('assets/carHorn.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  legend = new Legend(windowWidth, 'my-legend'); // Create new instance of Legend
  trafficSlider = createSlider(0, 100, 50); // Traffic slider ranges from 0 to 100
  trafficSlider.id('day-night-slider'); //targetted in the css file
  refreshButton = createButton("Generate New Roads");
  refreshButton.id('refresh-button'); //targetted in the css file
  refreshButton.id('refresh-button'); //targetted in the css file
  drawRoads();
}

function draw() {
  positionElements();

    // Check if the slider value is greater than or equal to 50
  if (trafficSlider && trafficSlider.value() >= 50) {
    isDay = true;
    background(255, 255, 255); // white background during the day
  } else if (trafficSlider && trafficSlider.value() < 50) {
    isDay = false;
    background(0, 0, 0); // black background at night
  }

  if(legend.isVisible){
    trafficSlider.style('display', 'block');
    refreshButton.style('display', 'block');
  }else{
    trafficSlider.style('display', 'none');
    refreshButton.style('display', 'none');
  }

  for (let i = 0; i < roads.length; i++) {
    if (roads[i] != null) {
      roads[i].update(isDay); // Update the animation state
      roads[i].drawRoad(); // Draw the road curve
    }
  }

  legend.draw(isDay); // Draw the legend
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

  legend.button.position(legend.legendX + 170, legend.legendY + 10); // Position the button below the legend


  refreshButton.position(legend.legendX + legend.padding, legend.legendItemY + legend.padding + 35);
  // Position the legend
  let legendX = windowWidth - 210; // X position of the legend
  let legendY = 10; // Y position of the legend
  legend.setPosition(legendX, legendY);
}

// function to return the maximum road length from the dataset
function getRoadLength() {
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
function drawRoads() {
  roads = [];
  let maxRoadLength = getRoadLength();
  randStep = floor(random(100, 300));

  for (let i = floor(random(0, 300)); i < table.getRowCount(); i += randStep) {
    let startX = constrain(random(width), 0, width);
    let startY = constrain(random(height), 0, height);

    let roadClass = table.getString(i, 'road_class');
    let roadLength = table.getNum(i, 'SHAPESTLength');
    let landUse = table.getString(i, 'land_use');
    if (landUse === '') {
      landUse = "Not Specified";
    }
    let roadName = table.getString(i, 'roadmst_name');
    let direction = table.getString(i, 'directional_tendency'); // Define direction here

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

    roads.push(road);
  }
}

function mouseClicked() {
  const legendX = windowWidth - 210; // X position of the legend
  const legendY = 10; // Y position of the legend
  const legendWidth = 200; // Width of the legend box
  const legendHeight = 295; // Height of the legend box
  if (legend.isVisible &&
    mouseX < legendX ||
    mouseX > legendX + legendWidth ||
    mouseY < legendY ||
    mouseY > legendY + legendHeight
  ) {
    roads.forEach(road => {
      road.mouseClicked();
    });
  }else if(!legend.isVisible){
    roads.forEach(road => {
      road.mouseClicked();
    });
  }
}