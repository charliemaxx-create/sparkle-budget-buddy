// Minimal CSV parser supporting quoted fields and commas inside quotes

export interface CsvParseResult {
  headers: string[];
  rows: string[][];
}

export function parseCsv(content: string): CsvParseResult {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const rows: string[][] = [];
  for (const line of lines) {
    if (line.trim() === "") continue;
    rows.push(splitCsvLine(line));
  }
  if (rows.length === 0) return { headers: [], rows: [] };
  const [headers, ...data] = rows;
  return { headers, rows: data };
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map(v => v.trim());
}




