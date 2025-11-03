"use client"

import React, { useEffect, useState, useCallback } from 'react'
import CategoryCard from './CategoryCard'
import categories from '@/data/categories'
import { getCategorySkills } from '@/data/skills'

interface CategoryStats {
  slug: string
  progress: number
  avg: number
  total: number
  completed: number
}

function computeCategoryStats(slug: string): CategoryStats {
  try {
    const skills = getCategorySkills(slug)
    const total = skills.length || 0
    const raw = localStorage.getItem(`assessment:${slug}`)
    let entries: { skillId: string; score: number | null }[] = []
    if (raw) {
      try { entries = JSON.parse(raw) } catch { entries = [] }
    }
    const completed = entries.filter(e => e.score != null).length
    const avg = entries.filter(e => e.score != null).reduce((acc, e) => acc + (e.score || 0), 0)
    return {
      slug,
      progress: total ? (completed / total) * 100 : 0,
      avg: completed ? +(avg / completed).toFixed(1) : 0,
      total,
      completed,
    }
  } catch {
    return { slug, progress: 0, avg: 0, total: 0, completed: 0 }
  }
}

export default function CategoryCardsGrid() {
  const [stats, setStats] = useState<Record<string, CategoryStats>>({})

  const refresh = useCallback(() => {
    const next: Record<string, CategoryStats> = {}
    categories.forEach(cat => {
      next[cat.slug] = computeCategoryStats(cat.slug)
    })
    setStats(next)
  }, [])

  useEffect(() => {
    refresh()
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('assessment:')) {
        refresh()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refresh])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-stretch card-grid">
      {categories.map(cat => {
        const s = stats[cat.slug]
        return (
          <CategoryCard
            key={cat.slug}
            title={cat.label}
            slug={cat.slug}
            imageSrc={cat.image}
            description={cat.description}
            score={s?.avg ?? 0}
            progress={s?.progress ?? 0}
            completed={s?.completed ?? 0}
            total={s?.total ?? 0}
          />
        )
      })}
    </div>
  )
}
