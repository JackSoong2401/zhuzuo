"use client"

import { cn } from "@/lib/utils"
import type { Bead } from "@/data/beads"

type BeadSphereProps = {
  bead: Bead
  size: number
  className?: string
  selected?: boolean
  interactive?: boolean
}

export function BeadSphere({
  bead,
  size,
  className,
  selected = false,
  interactive = false,
}: BeadSphereProps) {
  return (
    <span
      className={cn(
        "bead-sphere",
        `bead-sheen-${bead.sheen}`,
        selected && "bead-selected",
        interactive && "bead-interactive",
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span className="bead-core" style={{ background: bead.gradient }} />
      {bead.overlay ? (
        <span className="bead-overlay" style={{ background: bead.overlay }} />
      ) : null}
      <span className="bead-light" />
    </span>
  )
}
