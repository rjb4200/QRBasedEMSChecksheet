import type { DailyEmailReport } from "@/lib/daily-report";

function subjectFor(date: string) {
  const prefix = process.env.DAILY_REPORT_SUBJECT_PREFIX?.trim();
  return `${prefix ? `${prefix} ` : ""}Daily EMS Checksheet Report - ${date}`;
}

function progressColor(percentage: number) {
  if (percentage >= 85) return "#16a34a";
  if (percentage >= 50) return "#f59e0b";
  return "#b91c1c";
}

function statusBadge(unit: DailyEmailReport["allUnits"][number]) {
  if (unit.completionPercentage >= 100) {
    return `<span style="background:#dcfce7;color:#166534;padding:2px 8px;border-radius:999px;font-size:12px;font-weight:bold">Complete</span>`;
  }
  if (unit.completionPercentage >= 85) {
    return `<span style="background:#dcfce7;color:#166534;padding:2px 8px;border-radius:999px;font-size:12px;font-weight:bold">Near Complete</span>`;
  }
  if (unit.completionPercentage > 0) {
    return `<span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:999px;font-size:12px;font-weight:bold">In Progress</span>`;
  }
  return `<span style="background:#fee2e2;color:#991b1b;padding:2px 8px;border-radius:999px;font-size:12px;font-weight:bold">Not Started</span>`;
}

function unitCard(unit: DailyEmailReport["allUnits"][number], exceptionCount: number, generalComment: string | null, sectionComments: string[]) {
  const color = progressColor(unit.completionPercentage);
  let commentsHtml = "";
  const hasComments = generalComment || sectionComments.length > 0;

  if (hasComments) {
    commentsHtml = '<div style="border-top:1px solid #e2e8f0;padding-top:8px;margin-top:12px">';
    if (generalComment) {
      commentsHtml += `<p style="margin:2px 0;font-size:14px"><strong>General:</strong> ${generalComment}</p>`;
    }
    for (const sc of sectionComments) {
      commentsHtml += `<p style="margin:2px 0;font-size:14px">${sc}</p>`;
    }
    commentsHtml += "</div>";
  }

  return `
<div style="border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:16px;background:#fff">
  <h2 style="margin:0 0 8px;font-size:18px;color:#0f172a">${unit.unitName}</h2>
  <table style="width:100%;margin-bottom:12px">
    <tr>
      <td style="font-weight:bold;color:#475569;width:100px">Status</td>
      <td>${statusBadge(unit)}</td>
    </tr>
    <tr>
      <td style="font-weight:bold;color:#475569">Checks</td>
      <td style="font-size:14px">${unit.completedCompartments} of ${unit.totalCompartments} complete (${unit.completionPercentage}%)</td>
    </tr>
    <tr>
      <td style="font-weight:bold;color:#475569">Exceptions</td>
      <td>${exceptionCount > 0 ? `<span style="background:#fee2e2;color:#991b1b;padding:2px 8px;border-radius:999px;font-size:12px;font-weight:bold">${exceptionCount}</span>` : '<span style="color:#475569;font-size:14px">None</span>'}</td>
    </tr>
  </table>
  <div style="height:8px;background:#e2e8f0;border-radius:4px;margin-bottom:4px">
    <div style="width:${unit.completionPercentage}%;height:8px;background:${color};border-radius:4px"></div>
  </div>
  ${commentsHtml}
</div>`;
}

function completeCard(unitName: string) {
  return `
<div style="border:1px solid #bbf7d0;border-radius:12px;padding:12px 16px;margin-bottom:16px;background:#f0fdf4">
  <span style="font-size:16px;font-weight:bold;color:#166534">${unitName} ✓</span>
  <span style="font-size:13px;color:#475569;margin-left:8px">Complete — no exceptions</span>
</div>`;
}

export function buildDailyReportEmail(report: DailyEmailReport) {
  const generated = new Date(report.generatedAt).toLocaleString("en-US", { timeZone: process.env.DAILY_REPORT_TIMEZONE || "America/New_York" });

  const completeCards: string[] = [];
  const incompleteCards: string[] = [];

  for (const unit of report.allUnits) {
    const excCount = report.exceptionCounts[unit.unitName] ?? 0;
    if (unit.completionPercentage >= 100) {
      completeCards.push(completeCard(unit.unitName));
      continue;
    }
    const general = report.generalComments.find((c) => c.unitName === unit.unitName);
    const sections = report.sectionComments
      .filter((sc) => sc.unitName === unit.unitName)
      .map((sc) => `<strong>${sc.sourceName}:</strong> ${sc.comment}`);
    incompleteCards.push(unitCard(unit, excCount, general?.comment ?? null, sections));
  }

  const exceptionTotal = Object.values(report.exceptionCounts).reduce((sum, c) => sum + c, 0);
  const openCount = report.allUnits.filter((u) => u.completionPercentage < 100).length;

  const html = [
    `<h1>Daily EMS Checksheet Report</h1>`,
    `<p style="color:#475569;font-size:14px"><strong>${report.reportDate}</strong> — ${report.allUnits.length} units, ${openCount} open, ${exceptionTotal} exceptions<br/>Generated: ${generated}</p>`,
    ...incompleteCards,
    ...completeCards,
    `<p style="margin-top:24px"><strong>Attached:</strong> daily-checksheets-${report.reportDate}.pdf</p>`,
  ].join("\n");

  const text = [
    "Daily EMS Checksheet Report",
    `Date: ${report.reportDate}`,
    `Generated: ${generated}`,
    "",
    `${report.allUnits.length} units, ${openCount} open, ${exceptionTotal} exceptions`,
    "",
    "Units:",
    ...report.allUnits.flatMap((unit) => {
      const excCount = report.exceptionCounts[unit.unitName] ?? 0;
      const general = report.generalComments.find((c) => c.unitName === unit.unitName);
      const prefix = unit.completionPercentage >= 100 ? "✓" : " ";
      const lines = [
        `${prefix} ${unit.unitName}: ${unit.completedCompartments}/${unit.totalCompartments} (${unit.completionPercentage}%) - ${excCount} exceptions`,
      ];
      if (general) lines.push(`    General: ${general.comment}`);
      for (const sc of report.sectionComments.filter((c) => c.unitName === unit.unitName)) {
        lines.push(`    ${sc.sourceName}: ${sc.comment}`);
      }
      return lines;
    }),
    "",
    "Attached:",
    `- daily-checksheets-${report.reportDate}.pdf`,
  ].join("\n");

  return {
    subject: subjectFor(report.reportDate),
    text,
    html,
  };
}
