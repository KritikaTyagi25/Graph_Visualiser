import {
  drawGraph,
  sleep,
  logStep
} from "../utils/Edge_util.js"; // 🟢 Centralized utility

export async function runFloydWarshall() {
  const nodeCount = parseInt(document.getElementById("nodeCount").value);
  const edgesText = document.getElementById("edgesInput").value.trim();
  const logDiv = document.getElementById("log");
  const outputDiv = document.getElementById("output");

  logDiv.innerHTML = "";
  outputDiv.innerHTML = "";
  window.isStopped = false;

  const edges = [];
  for (let line of edgesText.split('\n')) {
    const [u, v, w] = line.trim().split(/\s+/).map(Number);
    if (!isNaN(u) && !isNaN(v) && !isNaN(w)) {
      edges.push({ u, v, w });
    }
  }

  drawGraph(nodeCount, edges); // 🟢 Uses Edge_util's weighted graph renderer
  await sleep(500);

  const INF = Infinity;
  const dist = Array.from({ length: nodeCount }, (_, i) =>
    Array.from({ length: nodeCount }, (_, j) =>
      i === j ? 0 : INF
    )
  );

  for (const { u, v, w } of edges) {
    dist[u][v] = w;
  }

  function log(msg) {
    logDiv.innerHTML += `<p>${msg}</p>`;
  }

  try {
    for (let k = 0; k < nodeCount; k++) {
      logStep(`🔁 Intermediate Node: ${k}`);
      for (let i = 0; i < nodeCount; i++) {
        for (let j = 0; j < nodeCount; j++) {
          if (dist[i][k] !== INF && dist[k][j] !== INF) {
            const newDist = dist[i][k] + dist[k][j];
            if (newDist < dist[i][j]) {
              log(`Updating dist[${i}][${j}] from ${dist[i][j]} to ${newDist} via ${k}`);
              dist[i][j] = newDist;
              await sleep(250);

              while (window.isPaused) await sleep(100);
              if (window.isStopped) throw new Error("Stopped");
            }
          }
        }
      }
    }
  } catch (e) {
    log("⛔ Traversal stopped by user.");
    return;
  }

  // 🧮 Create Matrix Table
  const table = document.createElement("table");
  table.className = "table-auto border-collapse border border-slate-500 mx-auto text-sm";

  const headerRow = document.createElement("tr");
  headerRow.innerHTML =
    `<th class="border px-2 py-1">From \\ To</th>` +
    Array.from({ length: nodeCount }, (_, j) =>
      `<th class="border px-2 py-1">${j}</th>`
    ).join("");
  table.appendChild(headerRow);

  for (let i = 0; i < nodeCount; i++) {
    const row = document.createElement("tr");
    row.innerHTML =
      `<td class="border px-2 py-1 font-semibold">${i}</td>` +
      dist[i].map(d => `<td class="border px-2 py-1">${d === INF ? "∞" : d}</td>`).join("");
    table.appendChild(row);
  }

  outputDiv.appendChild(table);
}

window.runFloydWarshall = runFloydWarshall;
