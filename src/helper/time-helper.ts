function diffMinutes(start: string, end: string, onlyPositive = false): number {
  const toMinutes = (t: string) => {
    const [h, m, s] = t.split(':').map(Number);
    return h * 60 + m + (s ? s / 60 : 0);
  };

  const diff = toMinutes(end) - toMinutes(start);
  return onlyPositive ? Math.max(diff, 0) : diff;
}

function overlapMinutes(
  start: string,
  end: string,
  breakStart = '12:00:00',
  breakEnd = '13:00:00'
): number {
  const toMin = (t: string) => {
    const [h, m, s] = t.split(':').map(Number);
    return h * 60 + m + (s ? s / 60 : 0);
  };

  const s = toMin(start);
  const e = toMin(end);
  const bs = toMin(breakStart);
  const be = toMin(breakEnd);

  return Math.max(0, Math.min(e, be) - Math.max(s, bs));
}

export { diffMinutes, overlapMinutes };