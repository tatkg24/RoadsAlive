//VARIABLES -----------------------------------------------------------------------------------------------
let table;
// the amount of lines being drawn based on the rows in the dataset (dataset has 4163 rows)
let step = 100;
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
  noLoop();
}

// The "main" method.
function draw() {
  background(255); // Clear the background
  drawRoads();
  
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
  let maxRoadLength = getRoadLength();
  let randStep = floor(random(100, 300));
  

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

    // Create a new Road object and add it to the roads array
    let road = new Road(startX, startY, controlStartX, controlStartY, controlEndX, controlEndY, endX, endY, roadClass, roadLength, landUse, roadName);
    roads.push(road);
  }

  // Draw all roads using the drawRoad() function inside of the road.js class
  roads.forEach(road => {
    road.drawRoad();
  });

}

function mouseClicked() {
  // Iterate over each road object and check for mouse over
  roads.forEach(road => {
    road.mouseClicked();
  });
}

