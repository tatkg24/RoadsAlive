//VARIABLES -----------------------------------------------------------------------------------------------
let table;
// the amount of lines being drawn based on the rows in the dataset (dataset has 4163 rows)
let step = 100;
let randStep; // Define randStep as a global variable
// empty array to store objects of type road
let roads = [];


//SETUP + MAIN --------------------------------------------------------------------------------------------
// for loading big stuff.
function preload(){
  // create a table object to store the road data
  table = loadTable('data/Road.csv', 'csv', 'header');
}

// for the setup.
function setup() {
  createCanvas(windowWidth, windowHeight);
  drawRoads();
}

// The "main" method.
function draw() {
  background(255); // Clear the background
  // Update and draw all roads
  for (let i = 0; i < roads.length; i++) {
    roads[i].update(); // Update the animation state
    roads[i].drawRoad(); // Draw the road curve
  }
}


// ensures that the sketch changes when browser width changes
function windowResized() {
  background(255);
  resizeCanvas(windowWidth, windowHeight);
}

// FUNCTIONS ---------------------------------------------------------------------------------------------
// gets the maximum road length from the table
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

    let controlStartX = constrain(random(width), 0, width);
    let controlStartY = constrain(random(height), 0, height);
    let controlEndX = constrain(random(width), 0, width);
    let controlEndY = constrain(random(height), 0, height);

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
        road = new StrataRoad(startX, startY, controlStartX, controlStartY, controlEndX, controlEndY, endX, endY, roadLength, landUse, roadName, 0.001, 10);
        break;
      case 'Local':
        road = new LocalRoad(startX, startY, controlStartX, controlStartY, controlEndX, controlEndY, endX, endY, roadLength, landUse, roadName, 0.005, 10);
        break;
      case 'Collector':
        road = new CollectorRoad(startX, startY, controlStartX, controlStartY, controlEndX, controlEndY, endX, endY, roadLength, landUse, roadName, 0.009, 20);
        break;
      case 'Minor Arterial':
        road = new MinorArterialRoad(startX, startY, controlStartX, controlStartY, controlEndX, controlEndY, endX, endY, roadLength, landUse, roadName, 0.02, 20);
        break;
      case 'Major Arterial':
        road = new MajorArterialRoad(startX, startY, controlStartX, controlStartY, controlEndX, controlEndY, endX, endY, roadLength, landUse, roadName, 0.09, 10);
        break;
      case 'Major Arterial (Multilane)':
        road = new MajorArterialMultilaneRoad(startX, startY, controlStartX, controlStartY, controlEndX, controlEndY, endX, endY, roadLength, landUse, roadName, 0.1, 20);
        break;
      case 'Highway':
        road = new HighwayRoad(startX, startY, controlStartX, controlStartY, controlEndX, controlEndY, endX, endY, roadLength, landUse, roadName, 0.2, 30);
        break;
      default:
        road = new BaseRoad(startX, startY, controlStartX, controlStartY, controlEndX, controlEndY, endX, endY, roadClass, roadLength, landUse, roadName, 0, 10);
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
