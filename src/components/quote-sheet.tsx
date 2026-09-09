"use client"

import { BeadSphere } from "@/components/bead-sphere"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { COMFORT_LABEL, formatYuan } from "@/lib/bracelet"
import type { BraceletEditorApi } from "@/hooks/use-bracelet-editor"
import { useState } from "react"

type QuoteSheetProps = {
  editor: BraceletEditorApi
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuoteSheet({ editor, open, onOpenChange }: QuoteSheetProps) {
  const { quote, comfort } = editor
  const [locked, setLocked] = useState(false)

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) setLocked(false)
        onOpenChange(next)
      }}
    >
      <SheetContent
        side="bottom"
        className="max-h-[88dvh] rounded-t-3xl bg-[#fffaf1] p-0"
      >
        <SheetHeader className="border-b border-[#ead9bb] px-5 pt-5 pb-3">
          <SheetTitle className="font-heading text-lg">
            {locked ? "这串已经排好了" : "设计报价"}
          </SheetTitle>
          <SheetDescription>
            {locked
              ? "草稿保存在这台设备。截图发给商家即可按这串来做。"
              : `手围 ${quote.wristCm.toFixed(1)}cm · ${COMFORT_LABEL[comfort]}余量 ${quote.comfortCm}cm · 成品内径 ${quote.targetCm.toFixed(1)}cm`}
          </SheetDescription>
        </SheetHeader>

        <div className="overflow-y-auto px-5 py-4">
          {quote.count === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              还没有珠子。回到珠盘先穿一串。
            </p>
          ) : (
            <ul className="space-y-3">
              {quote.grouped.map((row) => (
                <li
                  key={row.bead.id}
                  className="flex items-center gap-3 rounded-2xl bg-[#fcf6ec] px-3 py-2"
                >
                  <BeadSphere bead={row.bead} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {row.bead.name}
                      <span className="ml-1 text-xs text-muted-foreground">
                        {row.bead.sizeMm}mm
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatYuan(row.bead.price)} × {row.count}
                    </p>
                  </div>
                  <p className="text-sm tabular-nums">{formatYuan(row.subtotal)}</p>
                </li>
              ))}
              <li className="flex items-center justify-between px-1 text-sm text-muted-foreground">
                <span>穿串工费</span>
                <span className="tabular-nums">{formatYuan(quote.craftFee)}</span>
              </li>
            </ul>
          )}
        </div>

        <SheetFooter className="border-t border-[#ead9bb] bg-[#fffaf1]">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground">
                {quote.count} 颗 · {quote.fitLabel}
              </p>
              <p className="font-heading text-2xl tabular-nums">
                {formatYuan(quote.total)}
              </p>
            </div>
            <Button
              size="lg"
              className="rounded-full px-5"
              disabled={quote.count === 0}
              onClick={() => {
                if (locked) {
                  onOpenChange(false)
                  return
                }
                setLocked(true)
              }}
            >
              {locked ? "继续调整" : "确认这串"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
