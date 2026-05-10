export function serializeParams(params) { 
  if (params !== null && typeof params === 'object') {
    return JSON.stringify(params).replace(/"/g, '&quot;');
  }
   
  return typeof params === 'string' 
    ? `'${params.replace(/'/g, "\\'")}'` 
    : params;
}