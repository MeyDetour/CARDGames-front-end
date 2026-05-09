export function gameplay_globalValues(data) {
 
  return /*html */ `
    <div class="gameplayGlobalValues">
    ${Object.keys(data)
      .map((key) => {
        if (data[key] == undefined || !data[key].display) {
          return "";
        }
        return /*html */ `
            <span>${key}: ${data[key].value ?? data[key]}</span>
            `;
      })
      .join("")}
    </div>
    `;
}

export function reloadComposant_gameplayGlobalValues(selector, data) {
  const el = document.querySelector(selector);
  if (!el) return;
  const globalValuesContainer = el.querySelector(".gameplayGlobalValues");
  if (globalValuesContainer) {
    globalValuesContainer.remove();
  }
  const center = el.querySelector(".center");
  if (center) {
    center.insertAdjacentHTML("beforebegin", gameplay_globalValues(data));
  } else {
    el.insertAdjacentHTML("beforeend", gameplay_globalValues(data));
  }
}
