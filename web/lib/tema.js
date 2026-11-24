// Regole del tema, indipendenti dal DOM e da localStorage.
export function temaEffettivo(preferenza, sistema) {
  return preferenza === "light" || preferenza === "dark" ? preferenza : sistema;
}

export function temaOpposto(tema) {
  return tema === "dark" ? "light" : "dark";
}
