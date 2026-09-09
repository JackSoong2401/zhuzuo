import { getBead, type Bead } from "@/data/beads"

export type PlacedBead = {
  uid: string
  beadId: string
}

export type ComfortFit = "snug" | "regular" | "loose"

export const COMFORT_CM: Record<ComfortFit, number> = {
  snug: 0.6,
  regular: 0.9,
  loose: 1.2,
}

export const COMFORT_LABEL: Record<ComfortFit, string> = {
  snug: "贴合",
  regular: "适中",
  loose: "宽松",
}

export const WRIST_MIN = 14
export const WRIST_MAX = 20
export const DEFAULT_WRIST = 16.5
export const CRAFT_FEE = 12

export type FitStatus = "empty" | "short" | "good" | "tight"

export type BraceletQuote = {
  placed: Bead[]
  usedMm: number
  targetMm: number
  remainingMm: number
  usedCm: number
  targetCm: number
  wristCm: number
  comfortCm: number
  count: number
  beadsSubtotal: number
  craftFee: number
  total: number
  fit: FitStatus
  fitLabel: string
  grouped: { bead: Bead; count: number; subtotal: number }[]
}

export function newUid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `b-${Math.random().toString(36).slice(2, 10)}`
}

export function place(beadId: string): PlacedBead {
  return { uid: newUid(), beadId }
}

export function resolveBeads(items: PlacedBead[]): Bead[] {
  return items.map((item) => getBead(item.beadId))
}

export function usedLengthMm(items: PlacedBead[]): number {
  return items.reduce((sum, item) => sum + getBead(item.beadId).sizeMm, 0)
}

export function targetLengthMm(wristCm: number, comfort: ComfortFit): number {
  return Math.round((wristCm + COMFORT_CM[comfort]) * 10)
}

export function quoteBracelet(
  items: PlacedBead[],
  wristCm: number,
  comfort: ComfortFit
): BraceletQuote {
  const placed = resolveBeads(items)
  const usedMm = usedLengthMm(items)
  const targetMm = targetLengthMm(wristCm, comfort)
  const remainingMm = targetMm - usedMm
  const beadsSubtotal = placed.reduce((sum, bead) => sum + bead.price, 0)
  const craftFee = items.length > 0 ? CRAFT_FEE : 0

  let fit: FitStatus = "empty"
  if (items.length === 0) fit = "empty"
  else if (remainingMm > 12) fit = "short"
  else if (remainingMm < -8) fit = "tight"
  else fit = "good"

  const fitLabel =
    fit === "empty"
      ? "还没开始"
      : fit === "short"
        ? "还差一截"
        : fit === "tight"
          ? "略紧"
          : "刚好"

  const groupedMap = new Map<string, { bead: Bead; count: number }>()
  for (const bead of placed) {
    const current = groupedMap.get(bead.id)
    if (current) current.count += 1
    else groupedMap.set(bead.id, { bead, count: 1 })
  }

  const grouped = [...groupedMap.values()].map((entry) => ({
    ...entry,
    subtotal: entry.bead.price * entry.count,
  }))

  return {
    placed,
    usedMm,
    targetMm,
    remainingMm,
    usedCm: usedMm / 10,
    targetCm: targetMm / 10,
    wristCm,
    comfortCm: COMFORT_CM[comfort],
    count: items.length,
    beadsSubtotal,
    craftFee,
    total: beadsSubtotal + craftFee,
    fit,
    fitLabel,
    grouped,
  }
}

export function fillPattern(
  pattern: string[],
  targetMm: number
): PlacedBead[] {
  const result: PlacedBead[] = []
  let used = 0
  let i = 0
  while (i < 120) {
    const beadId = pattern[i % pattern.length]
    const size = getBead(beadId).sizeMm
    if (used + size > targetMm + 1) break
    result.push(place(beadId))
    used += size
    i += 1
  }
  return result
}

export function autoFill(
  items: PlacedBead[],
  beadId: string,
  targetMm: number
): PlacedBead[] {
  const next = [...items]
  let used = usedLengthMm(next)
  const size = getBead(beadId).sizeMm
  let guard = 0
  while (used + size <= targetMm + 1 && guard < 80) {
    next.push(place(beadId))
    used += size
    guard += 1
  }
  return next
}

export function formatYuan(value: number) {
  return `¥${value.toLocaleString("zh-CN")}`
}

export type LaidOutBead = {
  item: PlacedBead
  bead: Bead
  angle: number
  x: number
  y: number
  sizePx: number
  index: number
}

export function layoutBeads(options: {
  items: PlacedBead[]
  wristCm: number
  comfort: ComfortFit
  cx: number
  cy: number
  visualRadius: number
  rotation: number
}): LaidOutBead[] {
  const { items, wristCm, comfort, cx, cy, visualRadius, rotation } = options
  if (items.length === 0) return []

  const usedMm = usedLengthMm(items)
  const targetMm = targetLengthMm(wristCm, comfort)
  const totalMm = Math.max(usedMm, targetMm)
  const circumference = 2 * Math.PI * visualRadius
  const pxPerMm = circumference / totalMm

  let cursor = 0
  return items.map((item, index) => {
    const bead = getBead(item.beadId)
    const midMm = cursor + bead.sizeMm / 2
    const angle = (midMm / totalMm) * Math.PI * 2 - Math.PI / 2 + rotation
    cursor += bead.sizeMm
    return {
      item,
      bead,
      angle,
      x: cx + Math.cos(angle) * visualRadius,
      y: cy + Math.sin(angle) * visualRadius,
      sizePx: Math.max(10, bead.sizeMm * pxPerMm * 0.96),
      index,
    }
  })
}

export function pointerToInsertIndex(
  x: number,
  y: number,
  cx: number,
  cy: number,
  items: PlacedBead[],
  wristCm: number,
  comfort: ComfortFit,
  rotation: number
) {
  if (items.length === 0) return 0
  const usedMm = usedLengthMm(items)
  const targetMm = targetLengthMm(wristCm, comfort)
  const totalMm = Math.max(usedMm, targetMm)
  const angle = Math.atan2(y - cy, x - cx)
  const normalized =
    (angle + Math.PI / 2 - rotation + Math.PI * 4) % (Math.PI * 2)
  const mm = (normalized / (Math.PI * 2)) * totalMm

  let cursor = 0
  for (let i = 0; i < items.length; i += 1) {
    const size = getBead(items[i].beadId).sizeMm
    if (mm < cursor + size / 2) return i
    cursor += size
  }
  return items.length - 1
}
