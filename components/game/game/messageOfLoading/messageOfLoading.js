export function gameplay_messageOfLoading(messages) {
  return /*html*/` 

    <div class="loadMessagesContainer"> 
      <h2>Déroulement</h2>
      ${messages &&
        messages.length > 0 &&
        messages.map((message) => /*html */ `<span>${message}</span>`).join("")}
    
    </div>
  `;
}

export function reloadComposant_gameplayMessageOfLoading(selector, messages) {
  const el = document.querySelector(selector);
  if (!el) return;
  const oldComposant = el.querySelector(".loadMessagesContainer");
  if (oldComposant) {
    oldComposant.remove();
  }
  el.insertAdjacentHTML("afterbegin", gameplay_messageOfLoading(messages));
}