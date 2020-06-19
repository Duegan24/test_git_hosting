// let city = 'Chicago'
// let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`

function buildTable(dates, temps, humidities, pressures, windSpeeds, windDirections) {
  var table = d3.select("#summary-table");
  var tbody = table.select("tbody");
  var trow;
  for (var i = 0; i < 12; i++) {
    trow = tbody.append("tr");
    trow.append("td").text(dates[i]);
    trow.append("td").text(temps[i] + '°');
    trow.append("td").text(humidities[i] + '%');
    trow.append("td").text(pressures[i]);
    trow.append("td").text(windSpeeds[i]);
    trow.append("td").text(windDirections[i] + '°');
  }
}

d3.json('data/forecast.json').then(function(data) { 
  console.log(data);

  d3.select("title").text(`${data.city.name} 5-day Forecast`)
  d3.select("#title").text(`${data.city.name} 5-day Forecast`)
  
  var dates = data.list.map(x => x.dt_txt);
  var temps = data.list.map(x => x.main.temp);
  var humidities = data.list.map(x => x.main.humidity);
  var pressures = data.list.map(x => x.main.pressure);
  var windSpeeds = data.list.map(x => x.wind.speed);
  var windDirections = data.list.map(x => x.wind.deg);

  var maxTemp = d3.max(data.list, d => d.main.temp_max);
  var minTemp = d3.min(data.list, d => d.main.temp_min);

  var latitudeFormatted = data.city.coord.lat > 0 ? `${data.city.coord.lat}°&nbsp;N` : `${-data.city.coord.lat}°&nbsp;S`;
  var longitudeFormatted = data.city.coord.lon > 0 ? `${data.city.coord.lat}°&nbsp;E` : `${-data.city.coord.lat}°&nbsp;W`;

  d3.select("#summary-title").text(`${data.city.name} Summary`)
  d3.select("#summary-text").html(`${data.city.name}, ${data.city.country} (${latitudeFormatted} ${longitudeFormatted}) 
    has a forecasted high of ${maxTemp.toFixed(1)}°&nbsp;F and a low of ${minTemp.toFixed(1)}°&nbsp;F over the next 5 days. `)

  var trace = {
    type: "scatter",
    mode: "lines",
    // name: name,
    x: dates,
    y: temps,
    line: {
      color: "#17BECF"
    }
  };

  var plotData = [trace];

  var layout = {
    xaxis: {
      type: "date"
    },
    yaxis: {
      type: "linear"
    },
    showlegend: false
  };

  Plotly.newPlot("plot", plotData, layout);

  buildTable(dates, temps, humidities, pressures, windSpeeds, windDirections);
})
