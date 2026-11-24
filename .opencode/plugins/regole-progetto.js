// Plugin di progetto per OpenCode 2.3: trasforma due regole di AGENTS.md in vincoli.
// Copialo in .opencode/plugins/ e OpenCode lo carica da solo (controlla con /plugins).
//   1. L'agente modifica solo web/ (tranne i dati in web/data/), specs/, tests/ (più AGENTS.md, docs/backlog.md e verifica/).
//   2. L'agente non legge i file .env, né con gli strumenti né dalla shell.
import path from "node:path";

const MODIFICABILI = ["web", "specs", "tests", "verifica"];
const FILE_MODIFICABILI = ["AGENTS.md", path.join("docs", "backlog.md")];

export default {
  id: "workshop.regole-progetto",
  async setup(ctx) {
    const radice = path.resolve(ctx?.directory ?? ctx?.project?.directory ?? process.cwd());
    // Percorso relativo alla radice del progetto, dopo aver risolto ./ e ../
    const relativo = (p) => path.relative(radice, path.resolve(radice, String(p)));

    // Gira prima di ogni strumento: se lancia un errore, lo strumento non parte
    // e il modello legge il messaggio.
    await ctx.tool.hook("execute.before", (event) => {
      const input = event.input ?? {};
      const grezzo = input.path ?? input.filePath;
      if (grezzo !== undefined) {
        const rel = relativo(grezzo);
        const fuori = rel.startsWith("..") || path.isAbsolute(rel);
        const dati = rel === path.join("web", "data") || rel.startsWith(path.join("web", "data") + path.sep);
        const consentito = !fuori && !dati && (FILE_MODIFICABILI.includes(rel) || MODIFICABILI.some((d) => rel === d || rel.startsWith(d + path.sep)));
        if (["edit", "write", "patch", "multiedit"].includes(event.tool) && !consentito) {
          throw new Error(`Bloccato dal plugin regole-progetto: in questo progetto si modificano solo web/ (non i dati), specs/ e tests/ (non ${rel}).`);
        }
        if (/^\.env(\..*)?$/.test(path.basename(rel))) {
          throw new Error("Bloccato dal plugin regole-progetto: i file .env non si leggono.");
        }
      }
      if (event.tool === "bash" && /\.env\b|\.en[v*?]|\*env/.test(String(input.command ?? ""))) {
        throw new Error("Bloccato dal plugin regole-progetto: i comandi che toccano file .env non si eseguono.");
      }
    });
  },
};
