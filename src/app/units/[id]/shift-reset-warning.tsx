"use client";

import { useEffect, useState } from "react";

function isWarningWindow(date = new Date()) {
  const hour = date.getHours();
  const minute = date.getMinutes();
  return (hour === 5 && minute >= 55) || (hour === 17 && minute >= 55);
}

export function ShiftResetWarning() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () => setShow(isWarningWindow());
    update();
    const interval = window.setInterval(update, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <div className="rounded-3xl border border-yellow-300 bg-yellow-100 p-4 font-bold text-yellow-950">
      Shift reset is less than 5 minutes away. Submit any open compartments before the reset.
    </div>
  );
}
