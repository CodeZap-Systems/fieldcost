import { useState } from "react";

type CsvRow = Record<string, unknown>;

interface CsvExportProps {
  data: CsvRow[];
  filename?: string;
}

export default function CsvExport({ data, filename = "export.csv" }: CsvExportProps) {
  const [downloading, setDownloading] = useState(false);

  function handleExport() {
    if (!data.length) return;
    setDownloading(true);
    const csv = [
      Object.keys(data[0] || {}).join(","),
      ...data.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 1000);
  }

  return (
    <button
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow mt-2"
      onClick={handleExport}
      disabled={downloading || !data.length}
    >
      {downloading ? "Exporting..." : "Export CSV"}
    </button>
  );
}
