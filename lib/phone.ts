export function normalizeIndianPhone(value: unknown) {
  const digits = String(value || '').replace(/\D/g, '');
  const local = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  if (!/^\d{10}$/.test(local)) return null;

  return {
    local,
    e164: `91${local}`,
    candidates: [local, `91${local}`, `+91${local}`],
  };
}
