"use client"

import { BraceletCanvas } from "@/components/bracelet-canvas"
import { BeadCatalog } from "@/components/bead-catalog"
import { QuoteSheet } from "@/components/quote-sheet"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { COMFORT_LABEL, WRIST_MAX, WRIST_MIN, formatYuan } from "@/lib/bracelet"
import { useBraceletEditor } from "@/hooks/use-bracelet-editor"
import {
  Copy,
  Redo2,
  RotateCcw,
  Trash2,
  Undo2,
} from "lucide-react"
import { useState, type ReactNode } from "react"

export function BraceletEditor() {
  const editor = useBraceletEditor()
  const [quoteOpen, setQuoteOpen] = useState(false)
  const {
    hydrated,
    quote,
    wristCm,
    setWrist,
    comfort,
    setComfort,
    undo,
    redo,
    canUndo,
    canRedo,
    removeSelected,
    duplicateSelected,
    selectedUid,
    clear,
    clearArmed,
  } = editor

  if (!hydrated) {
    return <div className="h-dvh bg-[#f6edd9]" />
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-6xl flex-col overflow-hidden bg-[#f6edd9]">
      <header className="flex items-center justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-[#8a704c]">ZHUZUO</p>
          <h1 className="font-heading text-xl leading-none text-[#2a1c10]">珠作</h1>
        </div>
        <Button
          type="button"
          variant={clearArmed ? "destructive" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={clear}
          disabled={quote.count === 0}
        >
          {clearArmed ? "再点清空" : "清空"}
        </Button>
      </header>

      <div className="grid grid-cols-3 gap-2 px-4 pb-2">
        <Stat label="手围" value={`${quote.wristCm.toFixed(1)}cm`} />
        <Stat label="珠数" value={`${quote.count} 颗`} />
        <Stat label="小计" value={formatYuan(quote.total)} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[1.15fr_0.95fr] lg:overflow-hidden">
        <div className="flex min-h-0 shrink-0 flex-col lg:min-h-0 lg:flex-1">
          <BraceletCanvas editor={editor} />

          <div className="flex flex-wrap justify-center gap-1.5 px-3 pb-2">
            <ToolButton
              label="撤销"
              onClick={undo}
              disabled={!canUndo}
              icon={<Undo2 className="size-4" />}
            />
            <ToolButton
              label="重做"
              onClick={redo}
              disabled={!canRedo}
              icon={<Redo2 className="size-4" />}
            />
            <ToolButton
              label="复制"
              onClick={duplicateSelected}
              disabled={!selectedUid}
              icon={<Copy className="size-4" />}
            />
            <ToolButton
              label="删除"
              onClick={removeSelected}
              disabled={!selectedUid}
              icon={<Trash2 className="size-4" />}
            />
            <ToolButton
              label="回正"
              onClick={() => editor.setRotation(0)}
              icon={<RotateCcw className="size-4" />}
            />
          </div>

          <div className="space-y-2 px-4 pb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6a5438]">贴合手围</span>
              <span className="tabular-nums text-[#3d2a18]">
                {wristCm.toFixed(1)} cm
              </span>
            </div>
            <Slider
              min={WRIST_MIN}
              max={WRIST_MAX}
              step={0.1}
              value={[wristCm]}
              onValueChange={(value) => {
                const next = Array.isArray(value) ? value[0] : value
                if (typeof next === "number") setWrist(next)
              }}
            />
            <div className="flex gap-1.5">
              {(["snug", "regular", "loose"] as const).map((fit) => (
                <Button
                  key={fit}
                  type="button"
                  size="sm"
                  variant={comfort === fit ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setComfort(fit)}
                >
                  {COMFORT_LABEL[fit]}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <BeadCatalog editor={editor} />
      </div>

      <div className="sticky bottom-0 z-20 border-t border-[#ead9bb] bg-[#fffaf1]/95 px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-[#8a704c]">
              {quote.fitLabel} · 成品 {quote.targetCm.toFixed(1)}cm
            </p>
            <p className="font-heading text-2xl leading-none tabular-nums text-[#2a1c10]">
              {formatYuan(quote.total)}
            </p>
          </div>
          <Button
            size="lg"
            className="h-11 rounded-full px-6"
            disabled={quote.count === 0}
            onClick={() => setQuoteOpen(true)}
          >
            查看报价
          </Button>
        </div>
      </div>

      <QuoteSheet editor={editor} open={quoteOpen} onOpenChange={setQuoteOpen} />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#fff8ec] px-3 py-2">
      <p className="text-[10px] text-[#8a704c]">{label}</p>
      <p className="font-heading text-[15px] tabular-nums text-[#2a1c10]">{value}</p>
    </div>
  )
}

function ToolButton({
  label,
  onClick,
  disabled,
  icon,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  icon: ReactNode
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      className="h-9 rounded-full border-[#e4d2b2] bg-[#fffaf1] px-2.5 text-xs"
    >
      {icon}
      {label}
    </Button>
  )
}
