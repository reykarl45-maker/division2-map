
const STORAGE_KEY = "division2_nemesis_done_v1";

const map = L.map("map").setView([38.8977, -77.0365], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

let features = [];
let doneState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doneState));
}

function loadData() {
  fetch("data.geojson")
    .then(res => res.json())
    .then(data => {
      features = data.features;
      render();
    });
}

function render() {
  map.eachLayer(layer => {
    if (layer instanceof L.CircleMarker) map.removeLayer(layer);
  });

  let total = 0;
  let done = 0;

  features.forEach(f => {
    const id = f.properties.id;
    const coords = f.geometry.coordinates;
    const isDone = doneState[id];

    total++;
    if (isDone) done++;

    const marker = L.circleMarker([coords[1], coords[0]], {
      radius: 8,
      color: isDone ? "#2a3647" : "#ff8800",
      fillColor: isDone ? "#2a3647" : "#ff8800",
      fillOpacity: 0.9
    }).addTo(map);

    marker.bindPopup(`
      <b>${f.properties.nom}</b><br>
      ${f.properties.note || ""}<br><br>
      <button onclick="toggle('${id}')">
        ${isDone ? "Marquer non fait" : "Marquer fait"}
      </button>
    `);
  });

  document.getElementById("stat_done").innerText = "Fait: " + done;
  document.getElementById("stat_total").innerText = "Total: " + total;
  document.getElementById("stat_pct").innerText =
    "Progression: " + Math.round((done / total) * 100) + "%";
}

function toggle(id) {
  doneState[id] = !doneState[id];
  save();
  render();
}

loadData();
