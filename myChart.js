var currentChart;
// An event listener to the HTML element with the id 'renderBtn'
// When the event 'click' - run the function 'fetchData'
document.getElementById("renderBtn").addEventListener("click", fetchData);

// Asynchronous: type of operation when we have to wait for the response;
// Async keyword in front of our function definition: defining that
// this function contains asynchronous parts and will not finish immediately
async function fetchData() {
  var countryCode = document.getElementById("country").value;
  const indicatorCode = "SP.POP.TOTL";
  const baseUrl = "https://api.worldbank.org/v2/country/";
  const url =
    baseUrl + countryCode + "/indicator/" + indicatorCode + "?format=json";
  console.log("Fetching data from URL: " + url);
  // Fetch is a built-in tool for sending HTTP requests
  var response = await fetch(url);

  if (response.status == 200) {
    var fetchedData = await response.json();
    console.log(fetchedData);

    var data = getValues(fetchedData);
    var labels = getLabels(fetchedData);
    var countryName = getCountryName(fetchedData);
    renderChart(data, labels, countryName);
  }
}

function getValues(data) {
  var vals = data[1].sort((a, b) => a.date - b.date).map((item) => item.value);
  return vals;
}

function getLabels(data) {
  var labels = data[1].sort((a, b) => a.date - b.date).map((item) => item.date);
  return labels;
}

function getCountryName(data) {
  var countryName = data[1][0].country.value;
  return countryName;
}

function renderChart(data, labels, countryName) {
  var ctx = document.getElementById("myChart").getContext("2d");

  // Clear the previous chart if it exists
  if (currentChart) {
    currentChart.destroy();
  }
  // Draw new chart
  currentChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Population, " + countryName,
          data: data,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    },
    // by default, Chart.js does not start the y-axis at zero;
    // options: if to start the y-axis at zero
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}
