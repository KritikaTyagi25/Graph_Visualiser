import {
  drawGraph,
  highlightEdge,
  logStep,
  sleep
} from "../utils/Edge_util.js";

export async function runKruskal() {
  const nodeCount = parseInt(document.getElementById("nodeCount").value);
  const edgesText = document.getElementById("edgesInput").value.trim();
  const outputDiv = document.getElementById("output");

  outputDiv.innerHTML = "";
  window.isStopped = false;

  const edges = [];
  for (const line of edgesText.split('\n')) {
    const [u, v, w] = line.trim().split(/\s+/).map(Number);
    if (!isNaN(u) && !isNaN(v) && !isNaN(w)) {
      edges.push({ u, v, w });
    }
  }

  drawGraph(nodeCount, edges); // draw graph with weights
  await sleep(500);

  const parent = Array.from({ length: nodeCount }, (_, i) => i);

  function find(u) {
    if (parent[u] !== u) parent[u] = find(parent[u]);
    return parent[u];
  }

  function union(u, v) {
    const rootU = find(u);
    const rootV = find(v);
    if (rootU !== rootV) {
      parent[rootU] = rootV;
      return true;
    }
    return false;
  }

  edges.sort((a, b) => a.w - b.w);
  logStep("📊 Edges sorted by weight");

  let totalWeight = 0;

  for (const { u, v, w } of edges) {
    if (window.isStopped) {
      logStep("⛔ Traversal stopped by user.");
      break;
    }

    if (union(u, v)) {
      highlightEdge(u, v, "#22c55e"); // green
      logStep(`✅ Added edge ${u} → ${v} (weight ${w}) to MST`);
      totalWeight += w;
    } else {
      logStep(`⚠️ Skipped edge ${u} → ${v} (cycle detected)`);
    }

    await sleep(600);
    while (window.isPaused) await sleep(100);
  }

  outputDiv.innerHTML += `<p class="mt-4 text-light font-semibold">🌐 Total MST Weight: ${totalWeight}</p>`;
}

window.runKruskal = runKruskal;
