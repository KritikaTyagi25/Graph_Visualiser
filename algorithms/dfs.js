import { drawGraph, highlightNode, highlightEdge, sleep, logStep } from "../utils/Normal.js";

export async function runDFS() {
  const nodeCount = parseInt(document.getElementById("nodeCount").value);
  const edgesText = document.getElementById("edgesInput").value.trim();
  const startNode = parseInt(document.getElementById("startNode").value);
  const edges = [];

  document.getElementById("output").innerHTML = ""; // clear on each run
  window.isStopped = false; // reset stop flag

  for (let line of edgesText.split('\n')) {
    const [u, v] = line.trim().split(/\s+/).map(Number);
    if (!isNaN(u) && !isNaN(v)) edges.push({ u, v });
  }

  const adj = Array.from({ length: nodeCount }, () => []);
  for (const { u, v } of edges) {
    adj[u].push(v);
    adj[v].push(u); // undirected
  }

  drawGraph(nodeCount, edges);
  await sleep(500);

  const visited = Array(nodeCount).fill(false);
  const dfsOrder = [];

  async function waitIfPausedOrStopped() {
    while (window.isPaused) await sleep(100);
    if (window.isStopped) throw new Error("Stopped");
  }

  async function dfs(u) {
    await waitIfPausedOrStopped();
    visited[u] = true;
    dfsOrder.push(u);
    highlightNode(u, "#4CAF50");
    logStep(`Visited node ${u}`);
    await sleep(600);

    for (const v of adj[u]) {
      if (!visited[v]) {
        highlightEdge(u, v, "#FFA500");
        logStep(`Exploring edge ${u} → ${v}`);
        await sleep(600);
        await waitIfPausedOrStopped();
        await dfs(v);
      }
    }

    logStep(`Backtracking from node ${u}`);
    await sleep(400);
  }

  try {
    await dfs(startNode);
  } catch (e) {
    if (e.message === "Stopped") {
      logStep("Traversal stopped by user.");
    }
  }

  const outputDiv = document.getElementById("output");
  const result = document.createElement("p");
  result.textContent = "→ " + dfsOrder.join(" → ");
  result.className = "text-sm text-light";
  outputDiv.appendChild(result);
}

window.runDFS = runDFS;
