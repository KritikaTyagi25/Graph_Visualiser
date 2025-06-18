import {
  drawGraph,
  highlightNode,
  highlightEdge,
  logStep,
  sleep
} from "../utils/Edge_util.js";

export async function runTopologicalSort() {
  const nodeCount = parseInt(document.getElementById("nodeCount").value);
  const edgesText = document.getElementById("edgesInput").value.trim();
  const output = document.getElementById("output");

  output.innerHTML = "";
  window.isStopped = false;

  const edges = [];
  for (const line of edgesText.split("\n")) {
    const [u, v] = line.trim().split(/\s+/).map(Number);
    if (!isNaN(u) && !isNaN(v)) {
      edges.push({ u, v });
    }
  }

  drawGraph(nodeCount, edges);
  await sleep(500);

  const adj = Array.from({ length: nodeCount }, () => []);
  const inDegree = Array(nodeCount).fill(0);

  for (const { u, v } of edges) {
    adj[u].push(v);
    inDegree[v]++;
  }

  const queue = [];
  const result = [];

  for (let i = 0; i < nodeCount; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
      highlightNode(i, "#4CAF50");
      logStep(`Node ${i} has in-degree 0, added to queue`);
    }
  }

  await sleep(500);

  async function waitControl() {
    while (window.isPaused) await sleep(100);
    if (window.isStopped) throw new Error("Stopped");
  }

  try {
    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node);

      highlightNode(node, "#22c55e");
      logStep(`Processing node ${node}`);
      await sleep(500);
      await waitControl();

      for (const neighbor of adj[node]) {
        inDegree[neighbor]--;
        logStep(`Decreased in-degree of ${neighbor} to ${inDegree[neighbor]}`);
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
          highlightNode(neighbor, "#4CAF50");
          logStep(`Node ${neighbor} added to queue`);
        }
        highlightEdge(node, neighbor, "#facc15");
        await sleep(300);
        await waitControl();
      }
    }

    if (result.length !== nodeCount) {
      logStep("❌ Graph contains a cycle! Topological sort not possible.");
    } else {
      output.innerHTML += `<p class="mt-2 text-light font-medium">Topological Order:</p><p>→ ${result.join(" → ")}</p>`;
    }
  } catch (e) {
    logStep("⚠️ Traversal stopped by user.");
  }
}

window.runTopologicalSort = runTopologicalSort;
