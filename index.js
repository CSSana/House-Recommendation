let M = 5; // Number of rows
let N = 5; // Number of columns

document.addEventListener("DOMContentLoaded", function () {
  const createButton = document.getElementById("create-button");
  createButton.addEventListener("click", createHousingLayout);

  const recommendButton = document.getElementById("recommend-button");
  recommendButton.addEventListener("click", recommendHouse);
});

function createHousingLayout() {
  const rowsInput = document.getElementById("rows");
  const columnsInput = document.getElementById("columns");

  M = parseInt(rowsInput.value, 10);
  N = parseInt(columnsInput.value, 10);

  const housingLayout = document.getElementById("housing-layout");
  housingLayout.innerHTML = ""; // Clear existing layout

  housingLayout.style.gridTemplateColumns = `repeat(${N}, 1fr)`; // Adjust the number of columns in the grid

  for (let i = 0; i < M * N; i++) {
    const plot = document.createElement("div");
    plot.className = "plot";
    plot.setAttribute("data-row", Math.floor(i / N)); // Calculate the row index based on the plot index
    plot.setAttribute("data-col", i % N); // Calculate the column index based on the plot index
    plot.addEventListener("click", assignService);
    housingLayout.appendChild(plot);
  }
}

// Function to assign services to the plots
function assignService() {
  const plot = this;
  const currentService = plot.getAttribute("data-service");
  let nextService;

  // Determine the next service
  if (!currentService) {
    nextService = "house";
  } else if (currentService === "house") {
    nextService = "restaurant";
  } else if (currentService === "restaurant") {
    nextService = "gym";
  } else if (currentService === "gym") {
    nextService = "hospital";
  } else if (currentService === "hospital") {
    nextService = "airport";
  } else if (currentService === "airport") {
    nextService = "mall";
  } else if (currentService === "mall") {
    nextService = "rail";
  } else if (currentService === "rail") {
    nextService = null;
  }

  // Update the service of the plot
  plot.textContent = nextService ? nextService : "null";
  plot.className = `plot ${nextService}`;

  // Store the service in the data attribute
  plot.setAttribute("data-service", nextService);
}

// Function to calculate the score for a house based on nearby services
function calculateScore(row, col) {
  // Define the radius within which to consider nearby services
  const radius = 1; // 1 unit

  // Get the coordinates of the current house
  const currentRow = parseInt(row, 10);
  const currentCol = parseInt(col, 10);

  // Calculate the boundaries for nearby services
  const startRow = Math.max(currentRow - radius, 0);
  const endRow = Math.min(currentRow + radius, M - 1);
  const startCol = Math.max(currentCol - radius, 0);
  const endCol = Math.min(currentCol + radius, N - 1);

  // Count the nearby services within the boundaries
  let restaurantCount = 0;
  let gymCount = 0;
  let hospitalCount = 0;
  let airportCount = 0;
  let mallCount = 0;
  let railCount = 0;

  for (let i = startRow; i <= endRow; i++) {
    for (let j = startCol; j <= endCol; j++) {
      const plot = document.querySelector(
        `.plot[data-row='${i}'][data-col='${j}']`
      );
      const service = plot.getAttribute("data-service");

      if (service === "restaurant") {
        restaurantCount++;
      } else if (service === "gym") {
        gymCount++;
      } else if (service === "hospital") {
        hospitalCount++;
      } else if (service === "airport") {
        airportCount++;
      } else if (service === "mall") {
        mallCount++;
      } else if (service === "rail") {
        railCount++;
      }
    }
  }

  return (
    restaurantCount +
    gymCount +
    hospitalCount +
    airportCount +
    mallCount +
    railCount
  );
}

// Function to recommend the best house
function recommendHouse() {
  const plots = document.querySelectorAll(".plot[data-service='house']");
  let bestHouse;
  let bestScore = -Infinity;

  plots.forEach((plot) => {
    const row = parseInt(plot.getAttribute("data-row"), 10);
    const col = parseInt(plot.getAttribute("data-col"), 10);
    const score = calculateScore(row, col);

    if (score > bestScore) {
      bestScore = score;
      bestHouse = plot;
    }
  });

  if (bestHouse) {
    bestHouse.classList.add("best-house");
    alert(
      `The best house is at row ${bestHouse.getAttribute(
        "data-row"
      )}, column ${bestHouse.getAttribute("data-col")}.`
    );
  } else {
    alert("No houses found in the layout.");
  }
}

// Call the recommendHouse function initially to remove the unused variable warning
recommendHouse();
