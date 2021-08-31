
// Connect json data to dashboard to build plots

function getData(sample) {

   // use d3 to connect to json file
   d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];

      // connect to the html id where the data should land
      var panel = d3.select("#sample-metadata");

      // append key value pairs using object.entries
      Object.entries(result).forEach(([key, value]) => {
         panel.append("panel").text(`${key}: ${value}`);
      });
      // console.log(result)
   });
}

// Build Charts

// pull the data for the bar chart; establish ids, labels, values
function charts(sample) {
   d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];

      var ids = result.otu_ids;
      var labels = result.otu_labels;
      var values = result.sample_values;

   // create the trace for the bar chart
   var bar_trace = [
      {
         x: values.slice(0,10).reverse(),
         y: ids.slice(0,10).reverse(),
         text: labels.slice(0,10).reverse(),
         type: "bar",
         orientation: "h"
      }
   ];

   // create the layout for the bar chart
   var bar_layout = {
      title = "Top 10 Bacteria Found",
      xaxis = { title: 'OTU Values' },
      yaxis = { title: 'OTU IDs' }
   };

   // plot the bar chart
   Plotly.newPlot("bar", bar_trace, bar_layout);
   
   });

   // Bubble Chart trace
   var bubble_trace = [
      {
         x: ids,
         y: values,
         text: labels,
         mode: "markers",
         marker: {
         color: ids,
         size: values,
         }
      }
   ];

   // bubble chart layout
   var bubble_layout = {
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
   };

   // plot bubble chart
   Plotly.newPlot("bubble", bubble_trace, bubble_layout);

}

// connect to the dropdown element in html

function init() {
   var selector = d3.select("#selDataset");
   d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
         selector.append("option").text(sample).property("value", sample);
      });
   
      // this uses the first sample data to build initial plots
      const initSample = sampleNames[0];
      charts(initSample);
      getData(initSample);
   });
}

// Function to change the plots when new sample data is selected

function changeData(newSample) {
   charts(newSample);
   getData(newSample);
}

// initialize

init();