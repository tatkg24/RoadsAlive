//VARIABLES ---------------------------
let table;
// the amount of lines being drawn based on the rows in the dataset
let step = 100;
// set of road types
let roadTypes = new Set();


// for loading big stuff.
function preload(){
  // create a table object to store the road data
  table = loadTable('data/Road.csv', 'csv', 'header');
}

// for the setup.
function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  getRoadClasses();
}

// The "main" method.
function draw() {
  background(255); // Clear the background
  drawRoads();
}

// FUNCTIONS ---------------------------------------------------------------------------------------------

// function to get the class names of varios roads in the data file. 
function getRoadClasses(){
  
  // Iterate over the rows of the CSV file
    for (let i = 0; i < table.getRowCount(); i++) {
        // Get the road class from the 'road_class' column
        let roadClass = table.getString(i, 'road_class');
        // Add the road class to the Set
        roadTypes.add(roadClass);
    }
  
    // Convert the Set to an array
    let roadTypesArray = Array.from(roadTypes);
    // Log the unique road types
    console.log(roadTypesArray);
      
    /*
    The contents of the Array:
    ---------------------------------
    ["Local", "Collector", Minor Arterial, Major Aterial, Major Arterial (Multilane), "Highway", "SEE TMP", "Strata", ""]
    (ignore indexes 6 and 8)
    */
}

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


function drawRoads() {
  let maxRoadLength = getRoadLength();

  for (let i = 0; i < table.getRowCount(); i+=step) {
    // define random X and Y start positions, but constrain them to the canvas size. 
    let startX = constrain(random(width), 0, width);
    let startY = constrain(random(height), 0, height);

    // define random X and Y control positions, but constrain them to the canvas size. 
    let controlStartX = constrain(random(width), 0, width);
    let controlStartY = constrain(random(height), 0, height);
    let controlEndX = constrain(random(width), 0, width);
    let controlEndY = constrain(random(height), 0, height);


    let roadClass = table.getString(i, 'road_class');
    let roadLength = table.getNum(i, 'SHAPESTLength');

    // default line width
    let lineWidth = 1;

    // Set line width based on road class
    switch (roadClass) {
      case 'Strata':
        lineWidth = 2;
        break;
      case 'Local':
        lineWidth = 4;
        break;
      case 'Collector':
        lineWidth = 6;
        break;
      case 'Minor Arterial':
        lineWidth = 8;
        break;
      case 'Major Arterial':
        lineWidth = 10;
        break;
      case 'Major Arterial (Multilane)':
        lineWidth = 12;
        break;
      case 'Highway':
        lineWidth = 14;
        break;
    }

    // Set the stroke weight
    strokeWeight(lineWidth);
    stroke(0);
    noFill();

    // create the end point based on the roadlength in the table
    // set the x and y to be the same and constrain to the canvas size
    let endX = constrain(map(roadLength, 0, maxRoadLength, 0, width), 0, width);
    let endY = endX;

    // create the curve based on the above information
    curve(startX, startY, controlStartX, controlStartY, controlEndX, controlEndY, endX, endY);

  }
}

// ensures that the sketch changes when browser width changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


