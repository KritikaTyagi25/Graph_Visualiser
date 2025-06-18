const nodeMap = {};
const edgeMap = {};

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
} 

export function logStep(text) {
  const output = document.getElementById("output");
  output.innerHTML = `<p>${text}</p>` + output.innerHTML;
}

export function drawGraph(n, edges) {
  const svg = document.getElementById("graphCanvas");
  svg.innerHTML = '';
  Object.keys(nodeMap).forEach(k => delete nodeMap[k]);
  Object.keys(edgeMap).forEach(k => delete edgeMap[k]);

  const centerX = 300;
  const centerY = 200;
  const angleStep = (2 * Math.PI) / n;
  const positions = [];

  for (let i = 0; i < n; i++) {
    const angle = i * angleStep;
    const x = centerX + 150 * Math.cos(angle);
    const y = centerY + 150 * Math.sin(angle);
    positions.push({ x, y });
  }

  // Draw edges and weights
  edges.forEach(({ u, v, w }) => {
    const key = `${Math.min(u, v)}-${Math.max(u, v)}`;
    const x1 = positions[u].x;
    const y1 = positions[u].y;
    const x2 = positions[v].x;
    const y2 = positions[v].y;

    // Edge line
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#aaa");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
    edgeMap[key] = line;

    // Midpoint for weight label
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    // Weight label
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", midX);
    label.setAttribute("y", midY - 8);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("fill", "#ffffff");
    label.setAttribute("font-size", "14");
    label.setAttribute("font-weight", "bold");
    label.setAttribute("stroke", "#000"); // black outline
    label.setAttribute("stroke-width", "0.5");
    label.textContent = w;
    svg.appendChild(label);
  });

  // Draw nodes
  for (let i = 0; i < n; i++) {
    const { x, y } = positions[i];

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 20);
    circle.setAttribute("fill", "#1976D2");
    circle.setAttribute("stroke", "#fff");
    svg.appendChild(circle);
    nodeMap[i] = circle;

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y + 5);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "#fff");
    text.setAttribute("font-size", "14");
    text.setAttribute("font-weight", "600");
    text.textContent = i;
    svg.appendChild(text);
  }
}
export function highlightNode(i, color) {
  if (nodeMap[i]) {
    nodeMap[i].setAttribute("fill", color);
  }
}

export function highlightEdge(u, v, color) {
  const key = `${Math.min(u, v)}-${Math.max(u, v)}`;
  if (edgeMap[key]) {
    edgeMap[key].setAttribute("stroke", color);
  }
}
