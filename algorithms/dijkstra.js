import {
  drawGraph,
  highlightNode,
  highlightEdge,
  sleep,
  logStep
} from "../utils/Edge_util.js";

export async function runDijkstra() {
  const nodeCount = parseInt(document.getElementById("nodeCount").value);
  const edgesText = document.getElementById("edgesInput").value.trim();
  const startNode = parseInt(document.getElementById("startNode").value);
  const outputLog = document.getElementById("output");

  outputLog.innerHTML = "";
  window.isStopped = false;

  const edges = [];
  for (let line of edgesText.split('\n')) {
    const [u, v, w] = line.trim().split(/\s+/).map(Number);
    if (!isNaN(u) && !isNaN(v) && !isNaN(w)) {
      edges.push({ u, v, w });
    }
  }

  const adj = Array.from({ length: nodeCount }, () => []);
  for (const { u, v, w } of edges) {
    adj[u].push({ node: v, weight: w });
    // Uncomment this if the graph is undirected:
    // adj[v].push({ node: u, weight: w });
  }

  drawGraph(nodeCount, edges); // ✅ uses Edge_util.js with weights
  await sleep(500);

  const dist = Array(nodeCount).fill(Infinity);
  const visited = Array(nodeCount).fill(false);
  dist[startNode] = 0;

  logStep(`Start Dijkstra from node ${startNode}`);
  outputLog.innerHTML += `<p><strong>Start from Node ${startNode}</strong></p>`;

  async function waitIfPausedOrStopped() {
    while (window.isPaused) await sleep(100);
    if (window.isStopped) throw new Error("Stopped");
  }

  try {
    for (let i = 0; i < nodeCount; i++) {
      let u = -1;
      for (let j = 0; j < nodeCount; j++) {
        if (!visited[j] && (u === -1 || dist[j] < dist[u])) u = j;
      }

      if (dist[u] === Infinity) break;

      visited[u] = true;
      highlightNode(u, "#4CAF50");
      logStep(`Visiting node ${u}, Distance: ${dist[u]}`);
      outputLog.innerHTML += `<p>Visited ${u} → dist: ${dist[u]}</p>`;
      await sleep(600);
      await waitIfPausedOrStopped();

      for (const { node: v, weight } of adj[u]) {
        if (!visited[v] && dist[u] + weight < dist[v]) {
          dist[v] = dist[u] + weight;
          highlightEdge(u, v, "#FFA500");
          logStep(`Updated dist[${v}] to ${dist[v]} via edge ${u} → ${v} (w=${weight})`);
          outputLog.innerHTML += `<p>Update: dist[${v}] = ${dist[v]} (via ${u})</p>`;
          await sleep(400);
          await waitIfPausedOrStopped();
        }
      }

      await sleep(300);
    }

    outputLog.innerHTML += `<br><strong>Final Distances:</strong><br/>` +
      dist.map((d, i) => `Node ${i}: ${d === Infinity ? "∞" : d}`).join("<br>");

  } catch (err) {
    logStep(err.message);
  }
}

window.runDijkstra = runDijkstra;
