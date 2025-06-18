// input-handler/backgroundEffects.js
export function renderBackgroundEffects() {
  const body = document.body;

  const createDiv = (className, style = {}) => {
    const div = document.createElement("div");
    div.className = className;
    Object.assign(div.style, style);
    body.appendChild(div);
  };

  // Blobs
  createDiv("blob", {
    width: "20rem", height: "20rem", background: "#22d3ee", top: "2.5rem", left: "2.5rem",
    animationDelay: "0.2s"
  });
  createDiv("blob", {
    width: "16rem", height: "16rem", background: "#818cf8", bottom: "5rem", right: "2.5rem",
    animationDelay: "0.7s"
  });
  createDiv("blob", {
    width: "14rem", height: "14rem", background: "#c084fc", top: "50%", left: "33%",
    animationDelay: "1s"
  });

  // Sparkles
  createDiv("sparkle", {
    top: "10%", left: "15%", animationDelay: "0.3s"
  });
  createDiv("sparkle", {
    top: "40%", right: "10%", animationDelay: "0.7s"
  });
}
