export function getTimeAgo(dateString: string): string {
  if (!dateString || typeof dateString !== "string") return "N/A";

  try {
    // Handle ISO strings or any format that Date can parse reliably first
    if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(dateString)) {
      const iso = new Date(dateString);
      if (!Number.isNaN(iso.getTime())) {
        return formatFromDate(iso);
      }
    }

    const parts = dateString.trim().split(",");
    if (parts.length !== 2) {
      const native = new Date(dateString);
      if (!Number.isNaN(native.getTime())) return formatFromDate(native);
      return "N/A";
    }

    const datePart = parts[0].trim();
    const timePart = parts[1].trim();

    const [a, b, yRaw] = datePart.split("/").map((s) => Number(s.trim()));
    if (!a || !b || !yRaw) return "N/A";
    const y = yRaw < 100 ? yRaw + 2000 : yRaw;

    const t = to24HourParts(timePart);
    if (!t) return "N/A";
    
    const now = new Date();
    const candidates = [
      new Date(y, a - 1, b, t.h, t.m, t.s || 0),
      new Date(y, b - 1, a, t.h, t.m, t.s || 0) 
    ];

    const pastOrPresentCandidates = candidates.filter(d => d <= now);

    let parsedDate;

    if (pastOrPresentCandidates.length > 0) {
      // If we have valid past dates, pick the most recent one.
      // We sort by time descending, so the first element is the latest date.
      pastOrPresentCandidates.sort((d1, d2) => d2.getTime() - d1.getTime());
      parsedDate = pastOrPresentCandidates[0];
    } else {
      candidates.sort((d1, d2) => d1.getTime() - d2.getTime());
      parsedDate = candidates[0];
    }

    return formatFromDate(parsedDate);
  } catch {
    return "N/A";
  }
}


function to24HourParts(input: string): { h: number; m: number; s: number } | null {
  if (!input) return null;
  const s = input.replace(/\s+/g, " ").trim().toUpperCase();

  const m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)\b/);
  if (!m) return null;

  let h = Number(m[1]);
  const min = Number(m[2]);
  const sec = m[3] ? Number(m[3]) : 0;
  const mer = m[4];

  if ([h, min, sec].some(Number.isNaN) || min > 59 || sec > 59 || h < 1 || h > 12) return null;
  if (mer === "PM" && h !== 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;

  return { h, m: min, s: sec };
}

function formatFromDate(parsedDate: Date): string {
  const now = new Date();
  let diffMs = now.getTime() - parsedDate.getTime();
  if (diffMs < 0) diffMs = 0;

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffMonth / 12);

  if (diffSec < 3600) return "Added now";
  if (diffHr < 24) return `Added ${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  if (diffDay < 30) return `Added ${diffDay === 1 ? "a" : diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  if (diffMonth < 12) return `Added ${diffMonth} month${diffMonth === 1 ? "" : "s"} ago`;
  return `Added ${diffYear} year${diffYear === 1 ? "" : "s"} ago`;
}