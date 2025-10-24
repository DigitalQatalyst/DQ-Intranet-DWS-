export function scrollToReadyMove() {
  if (typeof window === "undefined") {
    return;
  }

  const target = document.getElementById("ready-move");
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.location.hash = "#ready-move";
  }
}

export function scrollToSupport() {
  if (typeof window === "undefined") {
    return;
  }

  const target = document.getElementById("get-support");
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    window.location.hash = "#get-support";
  }
}
