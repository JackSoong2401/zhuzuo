"use client"

import { BeadSphere } from "@/components/bead-sphere"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CATEGORIES, TEMPLATES } from "@/data/beads"
import { formatYuan } from "@/lib/bracelet"
import type { BraceletEditorApi } from "@/hooks/use-bracelet-editor"
import { Sparkles } from "lucide-react"

type BeadCatalogProps = {
  editor: BraceletEditorApi
}

export function BeadCatalog({ editor }: BeadCatalogProps) {
  const {
    catalogBeads,
    activeCategory,
    setActiveCategory,
    addOrReplace,
    applyTemplate,
    fillRemaining,
    lastBeadId,
    selectedBead,
    quote,
  } = editor

  return (
    <section className="flex min-w-0 flex-1 flex-col border-t border-[#ead9bb] bg-[#fffaf1] lg:min-h-0 lg:border-t-0 lg:border-l">
      <div className="flex gap-2 overflow-x-auto px-3 pt-3 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => applyTemplate(template.pattern)}
            className="shrink-0 rounded-full border border-[#e2d0ae] bg-[#fbf3e4] px-3 py-1.5 text-left"
          >
            <span className="block text-[12px] font-medium text-[#3d2a18]">
              {template.name}
            </span>
            <span className="block text-[10px] text-[#8a704c]">{template.hint}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 overflow-x-auto px-3 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((category) => {
          const active = activeCategory === category.id
          return (
            <Button
              key={category.id}
              type="button"
              size="sm"
              variant={active ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={
                active
                  ? "rounded-full"
                  : "rounded-full border-[#e4d2b2] bg-transparent"
              }
            >
              {category.label}
            </Button>
          )
        })}
      </div>

      <div className="px-3 pb-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4">
          {catalogBeads.map((bead) => {
            const isReplaceTarget = Boolean(
              selectedBead && selectedBead.id !== bead.id
            )
            const isSameAsSelected = selectedBead?.id === bead.id
            return (
              <button
                key={bead.id}
                type="button"
                onClick={() => addOrReplace(bead.id)}
                className="flex flex-col items-center rounded-2xl border border-transparent bg-[#fcf6ec] px-1.5 py-2 text-center transition-colors hover:border-[#e0c98a] active:bg-[#f4e6cc]"
              >
                <BeadSphere bead={bead} size={44} />
                <span className="mt-1.5 line-clamp-1 text-[11px] font-medium text-[#3a2716]">
                  {bead.name}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-[10px] text-[#8a704c]">
                  {bead.sizeMm}mm
                  <span className="text-[#9a4a24]">{formatYuan(bead.price)}</span>
                </span>
                {isReplaceTarget ? (
                  <Badge variant="outline" className="mt-1 h-4 text-[9px]">
                    替换
                  </Badge>
                ) : isSameAsSelected ? (
                  <Badge variant="secondary" className="mt-1 h-4 text-[9px]">
                    再加一颗
                  </Badge>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-[#ead9bb] px-3 py-2">
        <p className="min-w-0 flex-1 text-[11px] leading-4 text-[#8a704c]">
          {quote.remainingMm > 0
            ? `还差 ${quote.remainingMm}mm，可用当前珠补齐`
            : quote.remainingMm < 0
              ? `超出 ${Math.abs(quote.remainingMm)}mm，可删几颗或换小珠`
              : itemsHint(quote.count)}
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="rounded-full border-[#e0c98a]"
          onClick={() => fillRemaining(lastBeadId)}
          disabled={quote.remainingMm < 4}
        >
          <Sparkles className="size-3.5" />
          自动补齐
        </Button>
      </div>
    </section>
  )
}

function itemsHint(count: number) {
  if (count === 0) return "点一颗珠子，开始你的手串"
  return "圈口刚好。可再微调顺序或替换材质"
}
