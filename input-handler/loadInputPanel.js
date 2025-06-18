document.addEventListener("DOMContentLoaded", () => {
  const inputPanelTarget = document.getElementById("input-panel");

  if (inputPanelTarget) {
    fetch("../input-handler/input-panel.html")
      .then(res => {
        if (!res.ok) throw new Error("Failed to load input panel");
        return res.text();
      })
      .then(html => {
        inputPanelTarget.innerHTML = html;

        // Bind the run button to the dynamic algorithm
        const runBtn = document.getElementById("runButton");
        if (window.runAlgorithm && typeof window.runAlgorithm === "function") {
          runBtn.addEventListener("click", window.runAlgorithm);
        } else {
          console.warn("No runAlgorithm function defined globally.");
        }
        // Load pause/stop logic
        const script = document.createElement("script");
        script.src = "../input-handler/common.js";
        script.type = "module";
        document.body.appendChild(script);
      })
      .catch(err => console.error("Error loading input panel:", err));
  }
});
