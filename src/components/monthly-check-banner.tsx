export function MonthlyCheckReminderBanner() {
  return (
    <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
      <div className="font-semibold">Monthly Check Due Today</div>
      <div className="text-sm">
        This unit is scheduled for its monthly check today.{" "}
        <a
          className="font-semibold underline"
          href="https://winchesterfireems.com/images/Monthly%20Ambulance%20Inventory.pdf"
          rel="noopener noreferrer"
          target="_blank"
        >
          Download Monthly Check Form
        </a>
      </div>
    </div>
  );
}
