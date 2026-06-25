const TONES = [
  "bg-primary/15 text-primary",
  "bg-accent/15 text-accent",
  "bg-navy/15 text-navy",
  "bg-emergency/15 text-emergency",
]

export function InitialsAvatar({ name, size = 44 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()

  // Deterministic tone based on name length to stay hydration-safe.
  const tone = TONES[name.length % TONES.length]

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-bold ${tone}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden
    >
      {initials}
    </span>
  )
}
