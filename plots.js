// Do the initial setup of the website so a user has an idea of what to expect
function init() {
    var selector = d3.select("#selDataset");
  
    // Load the drop down menue with the user IDs
    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
                selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Now that it is loaded, take the first id in the list and display the results
        var initalID = d3.select("#selDataset").node().value;
        optionChanged(initalID)
    })
};

// Function to setup both the metadata display and the build the charts
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample) {
    
    // Once a user ID is selected, load the appropriate metadata
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var userInfo = resultArray[0];
        var PANEL = d3.select("#sample-metadata");
    
        // Display the data in the panel for each item of meta data for the user
        PANEL.html("");
        Object.entries(userInfo).forEach(([key, value]) =>
            {PANEL.append("h6").text((key + ': ' + value))});

        // Gauge Chart of Belly button washing frequency
        console.log(userInfo)
        var colors = [
            "rgb(68, 159, 54)",
            "rgba(68, 159, 54, 0.9)",
            "rgba(68, 159, 54, 0.8)",
            "rgba(68, 159, 54, 0.7)",
            "rgba(68, 159, 54, 0.6)",
            "rgba(68, 159, 54, 0.5)",
            "rgba(68, 159, 54, 0.4)",
            "rgba(68, 159, 54, 0.3)",
            "rgba(68, 159, 54, 0.2)",
            "rgba(68, 159, 54, 0.1)"
          ]
        var frequency = userInfo.wfreq;
        var traceGauge = {
            domain: { x: [0, 1], y: [0, 1] },
            value: frequency,
            title: { text: "Belly Button Washing Frequency <br> Scrubs per Week", 
                font: { size: 14 }},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [0, 9]},
                bar: { color: "black"},
                steps: [   
                    { range: [0, 1], color: colors[9] },
                    { range: [1, 2], color: colors[8] },
                    { range: [2, 3], color: colors[7] },
                    { range: [3, 4], color: colors[6] },
                    { range: [4, 5], color: colors[5] },
                    { range: [5, 6], color: colors[4] },
                    { range: [6, 7], color: colors[3] },
                    { range: [7, 8], color: colors[2] },
                    { range: [8, 9], color: colors[1] },
                ]
            }
        }
        var layout = { width: 400, height: 400 };
        Plotly.newPlot('gauge', [traceGauge], layout);
    });
}


function buildCharts(sampleID) {
    d3.json("samples.json").then(function(data) {

        // load the user specific sample data
        var samples = data.samples;
        var sample = samples.filter(sample => sample.id == sampleID);
        var otu_ids = sample[0].otu_ids
        var otu_labels = sample[0].otu_labels
        var sample_values = sample[0].sample_values
        var speciesStats = []
        for ( var j = 0; j < otu_ids.length; j++)
            speciesStats.push({
                "otu_ids": otu_ids[j], 
                "otu_labels": otu_labels[j], 
                "sample_values": sample_values[j]});

        // Sort the sample data by sample values for each species, from highest to lowest
        speciesStats.sort((a,b) => b.sample_values - a.sample_values);
        
        // Box plot of top 10 species by count for the user
        var topSpecies = speciesStats.slice(0,10);
        var otus = topSpecies.map(species => "OTU " + species.otu_ids);
        var values = topSpecies.map(species => species.sample_values);
        var traceBar = {
            type: "bar",
            y: otus,
            x: values.sort((a,b) => a - b), 
            orientation: 'h'
        };
        var Layout = {
            title: "Most Prevelent Species Found",
            xaxis: { title: "Species Count"},
            yaxis: { title: "Species ID"},
            width: 400, height: 500 
        };
        Plotly.newPlot("bar", [traceBar], Layout);

        // Bubble Chart of OTU ids vs sample values
        var otusAll = speciesStats.map(species => species.otu_ids);
        var valuesAll = speciesStats.map(species => species.sample_values);
        var labelsAll = speciesStats.map(species => species.otu_labels);
        var traceBubble = {
            x: otusAll,
            y: valuesAll,
            text: labelsAll,
            mode: 'markers',
            marker: {
                colorscale: 'Jet',
                color: otusAll,
                size: valuesAll}
        }
        var layout = {
            yaxis: { title: "Species Count"},
            xaxis: { title: "Species ID"},
            showlegend: false,
            width: 1200, height: 500 
        }
        Plotly.newPlot('bubble', [traceBubble], layout)
        console.log(otusAll)

    });
}


init();