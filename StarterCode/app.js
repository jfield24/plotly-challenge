// Function for reading in JSON making the charts and getting the ID's
function charts(id) {
    
    // Read in the data from the samples.json file
    d3.json("samples.json").then((data)=> {
        console.log(data);

        // Filter the samples by ID
        var samples = data.samples.filter(s => s.id.toString() === id)[0];

        console.log(samples);


        // Get top 10 values from the sample
        var top10values= samples.sample_values.slice(0, 10).reverse();

        console.log(`Top 10 Values: ${top10values}`);

        // Get top 10 OTU ids
        var idValues = (samples.otu_ids.slice(0, 10)).reverse();
        
        // Transform the OTU ids to the desired form for the plot
        var top10IDs = idValues.map(d => "OTU " + d);

        console.log(`OTU IDS: ${top10IDs}`);

        // Get the OTU labels for tooltip for the plot
        var labels = (samples.otu_labels.slice(0, 10)).reverse();

        console.log(`Labels: ${labels}`);

        
        // Create trace variable for the bar chart
        var trace1 = {
            x: top10values,
            y: top10IDs,
            text: labels,
            type:"bar",
            orientation: "h",
        };

        // Create the data variable
        var data1 = [trace1];

        // Barchart layout
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 120,
                r: 100,
                t: 30,
                b: 20
            }
        };

        // Use plotly to create the bar chart
        Plotly.newPlot("bar", data1, layout);

        
        // Trace for the bubble chart
        var trace2 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };

        // Layout for bubble chart
        var layout = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1200
        };

        // Create the data variable 
        var data2 = [trace2];

        // Use plotly to plot the bubble chart
        Plotly.newPlot("bubble", data2, layout); 
    });    
}
    
// Metadata table function
function metadataTable(id) {
    
    // Read in the data from the sample.json file
    d3.json("samples.json").then((data)=> {
        
        // Get the metadata from the data
        var metadata = data.metadata;

        console.log(metadata);

        // Filter the meta data by id
        var result = metadata.filter(m => m.id.toString() === id)[0];

        // Select sample-metadata tag to put data in the table
        var table = d3.select("#sample-metadata");
        
        // Empty the table before re-rendering
        table.html("");

        // Append necessary data for the correct ID number to the table
        Object.entries(result).forEach((key) => {   
                table.append("h5").text(key[0].toLowerCase() + ": " + key[1] + "\n");    
        });
    });
}

// Create the function for the optionChanged event
function optionChanged(id) {
    charts(id);
    metadataTable(id);
};

// Create the function for data rendering based on the dropdown selection
function init() {
    
    // Use D3 to select the dropdown
    var dropdown = d3.select("#selDataset");

    // Read in the data from the samples.json file
    d3.json("samples.json").then((data)=> {
        console.log(data);

        // Add ID numbers to the dropdown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // Display the charts and the metadata table
        charts(data.names[0]);
        metadataTable(data.names[0]);
    });
};

init();