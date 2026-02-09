export function isHashUsed(hash: string): boolean {
  return localStorage.getItem(`used_${hash}`) === "true";
}

export function markHashUsed(hash: string) {
  localStorage.setItem(`used_${hash}`, "true");
}
