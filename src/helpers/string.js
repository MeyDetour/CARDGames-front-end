export function getGainIdOfGainString(gainString) {
    let regex = /{gain#(\d+)}/;
    let match = gainString.match(regex);    
    if (match) {
        return match[1]; 
    }
    return null;
}
export function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}