# RoadsAlive
Roads Alive is a data visualization project which utilizes open data from the City of Kelowna. Specifically, it incorporates data about the numerous roads in the city employing their unique characteristics such as name, bounds, perceived traffic, and classification to create a visualization that explores the complexity and beauty of urban road networks. Using P5.js, this project visualizes roadways as squiggly lines that vary in thickness based on road class, move in accordance with perceived traffic flow and are represented with different colours for the various types of roads. When a user clicks on a line, they can see information about the road it represents.

# Simulation Logic
1. **Movement:** Movement of the roads is calculated based on the perceived traffic flow of a particular road class as a sine wave. For example, a highway would likely experience greater traffic flow than a residential (strata) road on average. As such, this is accounted for in the visualization by altering the amplitude and speed of the curve based on the class. Highways have a greater amplitude and lower speed, whereas, strata roads have a smaller amplitude and slower speed.
2. **Colour and Thickness:** Colour and thickness are determined based on the road classes in the data set (Strata, Local, Collector, Minor Arterial, Major Arterial, Major Arterial (Multilane), Highways).
3. **Directional Tendency:** Roads that are North/South in directional tendency are drawn vertically in the sketch. Contrastively, roads that are East/West in directional tendency are horizontally in the sketch.
4. **Length:** The length of each road in the sketch is determined and scaled based on the real road length, the max road length in the set and the width of the browser. 

# Usage
- Click on a road to see information about it.
- Resize or refresh the browser window to generate new roads.
- Toggle the slider to change the perceived traffic flow during the day Vs. at night.
- Consider the implications of traffic patterns and road types on urban planning and infrastructure development.

**Data Source:**
The data used in this project is sourced from [https://opendata.kelowna.ca/datasets/c5a9895698944b85ad0b9a7e4294573b_5/explore?showTable=true]. It includes information about road locations, types, traffic volumes, and other relevant factors.

# Credits
This project was created by tatkg24 as part of MDST 330.


