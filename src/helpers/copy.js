
export function copy(text) {
  navigator.clipboard.writeText(text).then(
    () => {
      console.log("copied");
      let elt = document.querySelector(".linkToCopy");
      let content = elt ? elt.textContent : "";
      if (elt) {
        elt.style.background = "#dff3df";
        elt.textContent = "Copié !";
        setTimeout(() => {
          elt.style.background = "#fff";
          elt.textContent = content;
        }, 1500);
      }
    },
    () => {
      /* clipboard write failed */
    },
  );
}
window.copy = copy;