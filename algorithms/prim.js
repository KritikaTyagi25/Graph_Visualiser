import {
  drawGraph,
  highlightNode,
  highlightEdge,
  logStep,
  sleep
} from "../utils/Edge_util.js";

export async function runPrim() {
  const nodeCount = parseInt(document.getElementById("nodeCount").value);
  const edgesText = document.getElementById("edgesInput").value.trim();
  const startNode = parseInt(document.getElementById("startNode").value);
  const output = document.getElementById("output");

  output.innerHTML = "";
  window.isStopped = false;

  const edges = [];
  for (const line of edgesText.split("\n")) {
    const [u, v, w] = line.trim().split(/\s+/).map(Number);
    if (!isNaN(u) && !isNaN(v) && !isNaN(w)) {
      edges.push({ u, v, w });
    }
  }

  drawGraph(nodeCount, edges);
  await sleep(500);

  const adj = Array.from({ length: nodeCount }, () => []);
  for (const { u, v, w } of edges) {
    adj[u].push({ node: v, weight: w });
    adj[v].push({ node: u, weight: w }); // undirected
  }

  const visited = Array(nodeCount).fill(false);
  const dist = Array(nodeCount).fill(Infinity);
  const parent = Array(nodeCount).fill(-1);

  dist[startNode] = 0;

  for (let count = 0; count < nodeCount; count++) {
    let u = -1;
    for (let i = 0; i < nodeCount; i++) {
      if (!visited[i] && (u === -1 || dist[i] < dist[u])) {
        u = i;
      }
    }

    if (dist[u] === Infinity) break;

    visited[u] = true;
    highlightNode(u, "#4CAF50");
    logStep(`Node ${u} included in MST`);
    await sleep(400);

    for (const { node: v, weight: w } of adj[u]) {
      if (!visited[v] && w < dist[v]) {
        dist[v] = w;
        parent[v] = u;
        logStep(`Update: dist[${v}] = ${w} via edge ${u} → ${v}`);
        await sleep(300);
      }
    }

    while (window.isPaused) await sleep(100);
    if (window.isStopped) throw new Error("Stopped");
  }

  let total = 0;
  for (let v = 0; v < nodeCount; v++) {
    if (parent[v] !== -1) {
      highlightEdge(v, parent[v], "#22c55e");
      total += dist[v];
      await sleep(400);
    }
  }

  output.innerHTML += `<p class="mt-3 text-light font-medium">Total MST Weight: ${total}</p>`;
}

window.runPrim = runPrim;
