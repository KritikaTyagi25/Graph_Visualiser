import { drawGraph, highlightNode, highlightEdge, sleep, logStep } from "../utils/Normal.js";

export async function runBFS() {
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
  const queue = [];
  const bfsOrder = [];

  async function waitIfPausedOrStopped() {
    while (window.isPaused) await sleep(100);
    if (window.isStopped) throw new Error("Stopped");
  }

  queue.push(startNode);
  visited[startNode] = true;
  highlightNode(startNode, "#4CAF50");
  logStep(`Start BFS from node ${startNode}`);
  await sleep(600);

  try {
    while (queue.length > 0) {
      const u = queue.shift();
      bfsOrder.push(u);
      highlightNode(u, "#2196F3");
      logStep(`Processing node ${u}`);
      await sleep(600);
      await waitIfPausedOrStopped();

      for (const v of adj[u]) {
        if (!visited[v]) {
          visited[v] = true;
          queue.push(v);
          highlightEdge(u, v, "#FFA500");
          highlightNode(v, "#4CAF50");
          logStep(`Queueing node ${v} from node ${u}`);
          await sleep(500);
          await waitIfPausedOrStopped();
        }
      }

      logStep(`Finished processing node ${u}`);
      await sleep(300);
    }
  } catch (e) {
    if (e.message === "Stopped") {
      logStep("Traversal stopped by user.");
    }
  }

  const outputDiv = document.getElementById("output");
  const result = document.createElement("p");
  result.textContent = "→ " + bfsOrder.join(" → ");
  result.className = "text-sm text-light";
  outputDiv.appendChild(result);
}

window.runBFS = runBFS;
