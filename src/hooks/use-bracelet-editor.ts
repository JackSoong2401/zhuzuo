"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { BEADS, TEMPLATES, getBead } from "@/data/beads"
import {
  autoFill,
  fillPattern,
  place,
  quoteBracelet,
  type ComfortFit,
  type PlacedBead,
} from "@/lib/bracelet"

const STORAGE_KEY = "zhuzuo-bracelet-draft-v1"

export type EditorSnapshot = {
  items: PlacedBead[]
  wristCm: number
  comfort: ComfortFit
}

type HistoryState = {
  past: EditorSnapshot[]
  present: EditorSnapshot
  future: EditorSnapshot[]
}

const emptySnapshot = (): EditorSnapshot => ({
  items: [],
  wristCm: 16.5,
  comfort: "regular",
})

function cloneSnapshot(snapshot: EditorSnapshot): EditorSnapshot {
  return {
    wristCm: snapshot.wristCm,
    comfort: snapshot.comfort,
    items: snapshot.items.map((item) => ({ ...item })),
  }
}

export function useBraceletEditor() {
  const [hydrated, setHydrated] = useState(false)
  const [selectedUid, setSelectedUid] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const [activeCategory, setActiveCategory] = useState<"all" | string>("all")
  const [clearArmed, setClearArmed] = useState(false)
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: emptySnapshot(),
    future: [],
  })

  const present = history.present

  const commit = useCallback((next: EditorSnapshot) => {
    setHistory((current) => ({
      past: [...current.past, current.present].slice(-50),
      present: next,
      future: [],
    }))
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<EditorSnapshot>
        if (Array.isArray(parsed.items)) {
          // Restore the last draft after mount so SSR and the first client paint stay empty.
          // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage hydrate
          setHistory({
            past: [],
            present: {
              items: parsed.items.filter((item) =>
                BEADS.some((bead) => bead.id === item.beadId)
              ),
              wristCm:
                typeof parsed.wristCm === "number" ? parsed.wristCm : 16.5,
              comfort:
                parsed.comfort === "snug" ||
                parsed.comfort === "loose" ||
                parsed.comfort === "regular"
                  ? parsed.comfort
                  : "regular",
            },
            future: [],
          })
        }
      }
    } catch {
      // Keep empty draft if storage is corrupt.
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(present))
  }, [hydrated, present])

  useEffect(() => {
    if (!clearArmed) return
    const timer = window.setTimeout(() => setClearArmed(false), 2500)
    return () => window.clearTimeout(timer)
  }, [clearArmed])

  const quote = useMemo(
    () => quoteBracelet(present.items, present.wristCm, present.comfort),
    [present]
  )

  const selectedItem = present.items.find((item) => item.uid === selectedUid)
  const selectedBead = selectedItem ? getBead(selectedItem.beadId) : null

  const addOrReplace = useCallback(
    (beadId: string) => {
      const snapshot = cloneSnapshot(present)
      if (selectedUid) {
        const index = snapshot.items.findIndex((item) => item.uid === selectedUid)
        if (index >= 0) {
          const current = snapshot.items[index]
          if (current.beadId === beadId) {
            snapshot.items.splice(index + 1, 0, place(beadId))
          } else {
            snapshot.items[index] = { uid: current.uid, beadId }
          }
          commit(snapshot)
          return
        }
      }
      snapshot.items.push(place(beadId))
      commit(snapshot)
    },
    [commit, present, selectedUid]
  )

  const removeSelected = useCallback(() => {
    if (!selectedUid) return
    const snapshot = cloneSnapshot(present)
    const index = snapshot.items.findIndex((item) => item.uid === selectedUid)
    snapshot.items = snapshot.items.filter((item) => item.uid !== selectedUid)
    commit(snapshot)
    const neighbor =
      snapshot.items[index] ?? snapshot.items[index - 1] ?? null
    setSelectedUid(neighbor?.uid ?? null)
  }, [commit, present, selectedUid])

  const duplicateSelected = useCallback(() => {
    if (!selectedUid) return
    const snapshot = cloneSnapshot(present)
    const index = snapshot.items.findIndex((item) => item.uid === selectedUid)
    if (index < 0) return
    const copy = place(snapshot.items[index].beadId)
    snapshot.items.splice(index + 1, 0, copy)
    commit(snapshot)
    setSelectedUid(copy.uid)
  }, [commit, present, selectedUid])

  const moveItem = useCallback(
    (from: number, to: number) => {
      if (from === to) return
      const snapshot = cloneSnapshot(present)
      const [item] = snapshot.items.splice(from, 1)
      snapshot.items.splice(to, 0, item)
      commit(snapshot)
    },
    [commit, present]
  )

  const checkpoint = useCallback(() => {
    setHistory((current) => ({
      past: [...current.past, current.present].slice(-50),
      present: current.present,
      future: [],
    }))
  }, [])

  const reorderLive = useCallback((from: number, to: number) => {
    if (from === to) return
    setHistory((current) => {
      const items = [...current.present.items]
      const [item] = items.splice(from, 1)
      items.splice(to, 0, item)
      return {
        ...current,
        present: { ...current.present, items },
      }
    })
  }, [])

  const clear = useCallback(() => {
    if (present.items.length === 0) return
    if (!clearArmed) {
      setClearArmed(true)
      return
    }
    commit({ ...cloneSnapshot(present), items: [] })
    setSelectedUid(null)
    setClearArmed(false)
  }, [clearArmed, commit, present])

  const applyTemplate = useCallback(
    (pattern: string[]) => {
      const target = quoteBracelet([], present.wristCm, present.comfort).targetMm
      commit({
        ...cloneSnapshot(present),
        items: fillPattern(pattern, target),
      })
      setSelectedUid(null)
    },
    [commit, present]
  )

  const fillRemaining = useCallback(
    (beadId: string) => {
      const nextItems = autoFill(present.items, beadId, quote.targetMm)
      if (nextItems.length === present.items.length) return
      commit({ ...cloneSnapshot(present), items: nextItems })
    },
    [commit, present, quote.targetMm]
  )

  const setWrist = useCallback((wristCm: number) => {
    setHistory((current) => ({
      ...current,
      present: { ...current.present, wristCm },
    }))
  }, [])

  const setComfort = useCallback((comfort: ComfortFit) => {
    setHistory((current) => ({
      ...current,
      present: { ...current.present, comfort },
    }))
  }, [])

  const undo = useCallback(() => {
    setHistory((current) => {
      const previous = current.past[current.past.length - 1]
      if (!previous) return current
      return {
        past: current.past.slice(0, -1),
        present: previous,
        future: [current.present, ...current.future],
      }
    })
    setSelectedUid(null)
  }, [])

  const redo = useCallback(() => {
    setHistory((current) => {
      const next = current.future[0]
      if (!next) return current
      return {
        past: [...current.past, current.present],
        present: next,
        future: current.future.slice(1),
      }
    })
    setSelectedUid(null)
  }, [])

  const catalogBeads = useMemo(() => {
    if (activeCategory === "all") return BEADS
    return BEADS.filter((bead) => bead.category === activeCategory)
  }, [activeCategory])

  const lastBeadId =
    selectedItem?.beadId ??
    present.items[present.items.length - 1]?.beadId ??
    TEMPLATES[0].pattern[0]

  return {
    hydrated,
    items: present.items,
    wristCm: present.wristCm,
    comfort: present.comfort,
    selectedUid,
    setSelectedUid,
    selectedBead,
    rotation,
    setRotation,
    activeCategory,
    setActiveCategory,
    catalogBeads,
    quote,
    addOrReplace,
    removeSelected,
    duplicateSelected,
    moveItem,
    checkpoint,
    reorderLive,
    clear,
    clearArmed,
    applyTemplate,
    fillRemaining,
    lastBeadId,
    setWrist,
    setComfort,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  }
}

export type BraceletEditorApi = ReturnType<typeof useBraceletEditor>
