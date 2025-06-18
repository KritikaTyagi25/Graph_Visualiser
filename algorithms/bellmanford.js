import {
  drawGraph,
  highlightNode,
  highlightEdge,
  sleep,
  logStep
} from "../utils/Edge_util.js";

export async function runBellmanFord() {
  const nodeCount = parseInt(document.getElementById("nodeCount").value);
  const edgesText = document.getElementById("edgesInput").value.trim();
  const startNode = parseInt(document.getElementById("startNode").value);
  const output = document.getElementById("output");
  output.innerHTML = "";
  window.isStopped = false;

  const edges = [];
  for (let line of edgesText.split("\n")) {
    const [u, v, w] = line.trim().split(/\s+/).map(Number);
    if (!isNaN(u) && !isNaN(v) && !isNaN(w)) {
      edges.push({ u, v, w });
    }
  }

  const dist = Array(nodeCount).fill(Infinity);
  dist[startNode] = 0;

  // Draw graph with weights
  drawGraph(nodeCount, edges); 
  await sleep(500);
  highlightNode(startNode, "#4CAF50");
  logStep(`Start Bellman-Ford from node ${startNode}`);
  await sleep(500);

  async function checkPauseStop() {
    while (window.isPaused) await sleep(100);
    if (window.isStopped) throw new Error("Stopped");
  }

  try {
    for (let i = 0; i < nodeCount - 1; i++) {
      logStep(`Iteration ${i + 1}`);
      let updated = false;
      for (const { u, v, w } of edges) {
        if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          highlightEdge(u, v, "#FFA500");
          logStep(`Updated dist[${v}] to ${dist[v]} via edge ${u} → ${v} (w=${w})`);
          updated = true;
          await sleep(500);
          await checkPauseStop();
        }
      }
      if (!updated) {
        logStep("No updates, terminating early.");
        break;
      }
    }

    // Negative weight cycle detection
    for (const { u, v, w } of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        logStep(`🚨 Negative cycle detected on edge ${u} → ${v}`);
        break;
      }
    }

    output.innerHTML += `<p class="mt-4 text-light font-medium">Final Distances:</p>`;
    for (let i = 0; i < dist.length; i++) {
      output.innerHTML += `<p>Node ${i} → ${dist[i] === Infinity ? '∞' : dist[i]}</p>`;
    }

  } catch (err) {
    logStep(err.message);
  }
}

window.runBellmanFord = runBellmanFord;
