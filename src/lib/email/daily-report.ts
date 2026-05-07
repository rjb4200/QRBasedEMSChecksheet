import type { DailyEmailReport } from "@/lib/daily-report";

function issueLabel(inputType: string) {
  if (inputType === "checkbox") return "Missing";
  if (inputType === "condition") return "Condition issue";
  return "Below par";
}

function exceptionLine(item: DailyEmailReport["exceptions"][number]) {
  return `${item.unitName} | ${item.compartmentName} | ${item.itemName} | ${issueLabel(item.inputType)} (${item.actual}/${item.expected})`;
}

function subjectFor(date: string) {
  const prefix = process.env.DAILY_REPORT_SUBJECT_PREFIX?.trim();
  return `${prefix ? `${prefix} ` : ""}Daily EMS Checksheet Report - ${date}`;
}

export function buildDailyReportEmail(report: DailyEmailReport) {
  const uncheckedLines = report.uncheckedUnits.map((unit) => `${unit.unitName}: ${unit.completedCompartments} of ${unit.totalCompartments} checks complete (${unit.completionPercentage}%)`);
  const exceptionLines = report.exceptions.map(exceptionLine);
  const generated = new Date(report.generatedAt).toLocaleString("en-US", { timeZone: process.env.DAILY_REPORT_TIMEZONE || "America/New_York" });

  const text = [
    "Daily EMS Checksheet Report",
    `Date: ${report.reportDate}`,
    `Generated: ${generated}`,
    "",
    "Unchecked Units:",
    ...(uncheckedLines.length > 0 ? uncheckedLines.map((line) => `- ${line}`) : ["None"]),
    "",
    "Exceptions:",
    ...(exceptionLines.length > 0 ? exceptionLines.map((line) => `- ${line}`) : ["None"]),
    "",
    "Attached:",
    `- daily-checksheets-${report.reportDate}.pdf`,
  ].join("\n");

  const htmlList = (items: string[]) => items.length > 0 ? `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>` : "<p>None</p>";
  const html = [
    `<h1>Daily EMS Checksheet Report</h1>`,
    `<p><strong>Date:</strong> ${report.reportDate}<br/><strong>Generated:</strong> ${generated}</p>`,
    `<h2>Unchecked Units</h2>`,
    htmlList(uncheckedLines),
    `<h2>Exceptions</h2>`,
    htmlList(exceptionLines),
    `<p><strong>Attached:</strong> daily-checksheets-${report.reportDate}.pdf</p>`,
  ].join("\n");

  return {
    subject: subjectFor(report.reportDate),
    text,
    html,
  };
}
