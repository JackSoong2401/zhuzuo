"use client"

import { useRef, useState } from "react"
import { BeadSphere } from "@/components/bead-sphere"
import {
  layoutBeads,
  pointerToInsertIndex,
} from "@/lib/bracelet"
import type { BraceletEditorApi } from "@/hooks/use-bracelet-editor"
import { formatYuan } from "@/lib/bracelet"

type BraceletCanvasProps = {
  editor: BraceletEditorApi
}

export function BraceletCanvas({ editor }: BraceletCanvasProps) {
  const {
    items,
    wristCm,
    comfort,
    selectedUid,
    setSelectedUid,
    rotation,
    setRotation,
    quote,
    selectedBead,
    reorderLive,
    checkpoint,
  } = editor

  const rootRef = useRef<HTMLDivElement>(null)
  const [draggingUid, setDraggingUid] = useState<string | null>(null)
  const pointerRef = useRef<{
    pointerId: number
    mode: "pending" | "rotate" | "reorder" | "scroll"
    startX: number
    startY: number
    startClientX: number
    startClientY: number
    lastAngle: number
    fromIndex: number
    checkpointed: boolean
  } | null>(null)

  const size = 360
  const cx = size / 2
  const cy = size / 2
  const visualRadius = size * 0.36

  const laidOut = layoutBeads({
    items,
    wristCm,
    comfort,
    cx,
    cy,
    visualRadius,
    rotation,
  })

  function angleAt(x: number, y: number) {
    return Math.atan2(y - cy, x - cx)
  }

  function localPoint(event: React.PointerEvent<HTMLDivElement>) {
    const rect = rootRef.current?.getBoundingClientRect()
    if (!rect) return { x: cx, y: cy }
    const scaleX = size / rect.width
    const scaleY = size / rect.height
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    }
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement
    const uid = target.closest("[data-bead-uid]")?.getAttribute("data-bead-uid")
    const { x, y } = localPoint(event)
    pointerRef.current = {
      pointerId: event.pointerId,
      mode: "pending",
      startX: x,
      startY: y,
      startClientX: event.clientX,
      startClientY: event.clientY,
      lastAngle: angleAt(x, y),
      fromIndex: uid ? items.findIndex((item) => item.uid === uid) : -1,
      checkpointed: false,
    }
    if (uid) setSelectedUid(uid)
    else setSelectedUid(null)
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const pointer = pointerRef.current
    if (!pointer || pointer.pointerId !== event.pointerId) return
    if (pointer.mode === "scroll") return
    const { x, y } = localPoint(event)

    if (pointer.mode === "pending") {
      const clientDx = event.clientX - pointer.startClientX
      const clientDy = event.clientY - pointer.startClientY
      const dist = Math.hypot(clientDx, clientDy)
      if (dist < 12) return
      // Vertical swipe should scroll the page, not spin the bracelet.
      if (Math.abs(clientDy) > Math.abs(clientDx) * 1.15) {
        pointer.mode = "scroll"
        return
      }
      pointer.mode = pointer.fromIndex >= 0 ? "reorder" : "rotate"
      if (pointer.mode === "reorder") {
        setDraggingUid(items[pointer.fromIndex]?.uid ?? null)
      }
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    if (pointer.mode === "rotate") {
      const next = angleAt(x, y)
      const delta = next - pointer.lastAngle
      pointer.lastAngle = next
      setRotation((value) => value + delta)
      return
    }

    if (pointer.mode === "reorder" && pointer.fromIndex >= 0) {
      if (!pointer.checkpointed) {
        checkpoint()
        pointer.checkpointed = true
      }
      const to = pointerToInsertIndex(
        x,
        y,
        cx,
        cy,
        items,
        wristCm,
        comfort,
        rotation
      )
      if (to !== pointer.fromIndex) {
        reorderLive(pointer.fromIndex, to)
        pointer.fromIndex = to
      }
    }
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const pointer = pointerRef.current
    if (!pointer || pointer.pointerId !== event.pointerId) return
    pointerRef.current = null
    setDraggingUid(null)
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      // Capture may already be released.
    }
  }

  const progress = Math.min(1, quote.usedMm / Math.max(quote.targetMm, 1))

  return (
    <div className="relative flex min-h-0 flex-col items-center justify-center px-3 py-1 lg:flex-1 lg:py-2">
      <div
        ref={rootRef}
        className="bracelet-stage relative aspect-square w-[min(100%,38dvh,340px)] touch-pan-y select-none lg:w-[min(100%,52dvh,420px)]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="application"
        aria-label="手串预览，左右滑动旋转，上下滑动查看珠盘，拖动珠子可换位"
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <radialGradient id="felt" cx="50%" cy="42%" r="62%">
              <stop offset="0%" stopColor="#6b5340" />
              <stop offset="55%" stopColor="#3d2c20" />
              <stop offset="100%" stopColor="#24160f" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={visualRadius + 28} fill="url(#felt)" />
          <circle
            cx={cx}
            cy={cy}
            r={visualRadius}
            fill="none"
            stroke="rgba(232, 208, 150, 0.35)"
            strokeWidth="2.4"
            strokeDasharray={items.length === 0 ? "5 7" : undefined}
          />
          <circle
            cx={cx}
            cy={cy}
            r={visualRadius - 18}
            fill="none"
            stroke="rgba(255, 236, 196, 0.08)"
            strokeWidth="22"
          />
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {items.length === 0 ? (
            <>
              <p className="font-heading text-[15px] text-[#f3e6cc]">点选珠子开始穿串</p>
              <p className="mt-1 max-w-[11rem] text-[11px] leading-5 text-[#cbb896]">
                先量手围，再把珠子一颗颗排上去
              </p>
            </>
          ) : selectedBead ? (
            <>
              <p className="font-heading text-[15px] text-[#f6ead2]">
                {selectedBead.name}
              </p>
              <p className="mt-0.5 text-[11px] text-[#d4b37a]">
                {selectedBead.sizeMm}mm · {formatYuan(selectedBead.price)}
              </p>
              <p className="mt-1 text-[10px] text-[#b79a72]">点选珠盘可替换这颗</p>
            </>
          ) : (
            <>
              <p className="font-heading text-lg tabular-nums text-[#f6ead2]">
                {formatYuan(quote.total)}
              </p>
              <p className="mt-0.5 text-[11px] text-[#d4b37a]">
                {quote.count} 颗 · {quote.fitLabel}
              </p>
            </>
          )}
        </div>

        {laidOut.map((entry) => {
          const isSelected = entry.item.uid === selectedUid
          const isDragging = entry.item.uid === draggingUid
          return (
            <button
              key={entry.item.uid}
              type="button"
              data-bead-uid={entry.item.uid}
              className="absolute -translate-x-1/2 -translate-y-1/2 touch-pan-y rounded-full"
              style={{
                left: `${(entry.x / size) * 100}%`,
                top: `${(entry.y / size) * 100}%`,
                zIndex: isDragging ? 20 : isSelected ? 15 : 5,
                width: entry.sizePx,
                height: entry.sizePx,
              }}
              aria-label={`${entry.bead.name} ${entry.bead.sizeMm}毫米`}
              aria-pressed={isSelected}
            >
              <BeadSphere
                bead={entry.bead}
                size={entry.sizePx}
                selected={isSelected}
                interactive
              />
            </button>
          )
        })}
      </div>

      <div className="mt-1 flex w-[min(100%,38dvh,340px)] items-center gap-3 px-1 text-[11px] text-muted-foreground lg:w-[min(100%,52dvh,420px)]">
        <span className="w-12 shrink-0 tabular-nums">
          {quote.usedCm.toFixed(1)}cm
        </span>
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[#e6d8c0]">
          <div
            className="h-full rounded-full bg-[#8a5a28] transition-[width]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="w-16 shrink-0 text-right tabular-nums">
          目标 {quote.targetCm.toFixed(1)}
        </span>
      </div>
    </div>
  )
}
