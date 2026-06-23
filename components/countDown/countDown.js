 
export function countDown( ) {
  return /*html */ `
  <div class="countdown-container">
    <div class="countdown"></div>
    </div>
    `  
}

export function removeCountDown( ) {
  const countdownContainer = document.querySelector('.countdown-container');
  if (countdownContainer) {
    countdownContainer.remove();
  }
}