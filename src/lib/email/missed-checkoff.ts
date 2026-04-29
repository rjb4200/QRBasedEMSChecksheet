type IncompleteUnit = {
  unitName: string;
  completedCompartments: number;
  totalCompartments: number;
  completionPercentage: number;
};

export function buildMissedCheckoffEmail(units: IncompleteUnit[]) {
  const lines = units.map((unit) => `${unit.unitName}: ${unit.completedCompartments} of ${unit.totalCompartments} compartments completed (${unit.completionPercentage}%)`);

  return {
    subject: `EMS Missed Checkoff Alert: ${units.length} incomplete unit${units.length === 1 ? "" : "s"}`,
    text: [
      "The following in-service units are not 100% complete:",
      "",
      ...lines,
      "",
      "Open the EMS Checkoff admin dashboard for details.",
    ].join("\n"),
  };
}
