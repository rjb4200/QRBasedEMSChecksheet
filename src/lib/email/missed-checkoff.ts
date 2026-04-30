import { type CheckoffDiscrepancy } from "@/lib/discrepancies";

type IncompleteUnit = {
  unitName: string;
  completedCompartments: number;
  totalCompartments: number;
  completionPercentage: number;
};

export function buildMissedCheckoffEmail(units: IncompleteUnit[], discrepancies: CheckoffDiscrepancy[] = []) {
  const lines = units.map((unit) => `${unit.unitName}: ${unit.completedCompartments} of ${unit.totalCompartments} compartments completed (${unit.completionPercentage}%)`);
  const discrepancyLines = discrepancies.map((item) => {
    const issue = item.inputType === "checkbox" ? "missing" : `below par (${item.actual}/${item.expected})`;
    return `${item.unitName} - ${item.compartmentName} - ${item.itemName}: ${issue}`;
  });

  return {
    subject: `EMS Checkoff Alert: ${units.length} incomplete unit${units.length === 1 ? "" : "s"}, ${discrepancies.length} exception${discrepancies.length === 1 ? "" : "s"}`,
    text: [
      "Incomplete in-service units:",
      "",
      ...(lines.length > 0 ? lines : ["None"]),
      "",
      "Submitted missing or below-par items:",
      "",
      ...(discrepancyLines.length > 0 ? discrepancyLines : ["None"]),
      "",
      "Open the EMS Checkoff admin dashboard for details.",
    ].join("\n"),
  };
}
