"use client";

import AvailabilityCalendar, {
  useBlockedDates,
} from "@/components/AvailabilityCalendar";

export default function ManageCalendar() {
  const [blocked, setBlocked] = useBlockedDates();

  const toggle = async (date: string, nowBlocked: boolean) => {
    // optimistic
    setBlocked((prev) =>
      nowBlocked ? [...prev, date].sort() : prev.filter((d) => d !== date),
    );
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, blocked: nowBlocked }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error();
    } catch {
      // revert on failure
      setBlocked((prev) =>
        nowBlocked ? prev.filter((d) => d !== date) : [...prev, date].sort(),
      );
    }
  };

  return (
    <AvailabilityCalendar mode="manage" blocked={blocked} onToggle={toggle} />
  );
}
