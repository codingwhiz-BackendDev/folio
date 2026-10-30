'use client'

import { useState } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, Feather, ImagePlus, Menu, MoreHorizontal, Plus, Search, Sparkles, Upload, X } from 'lucide-react'

const chapters = [
  { number: '01', title: 'The night garden', date: 'Edited 2 min ago', active: true },
  { number: '02', title: 'A house made of weather', date: 'Draft' },
  { number: '03', title: 'What the river remembers', date: 'Draft' },
]

export default function Page() {
  const [activeChapter, setActiveChapter] = useState(0)
  const [showNew, setShowNew] = useState(false)
  const [showReader, setShowReader] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const nextChapter = () => setActiveChapter((current) => Math.min(current + 1, chapters.length - 1))
  const previousChapter = () => setActiveChapter((current) => Math.max(current - 1, 0))

  return (
    <main className="min-h-screen bg-[#f4f1eb] text-[#202525]">
      <header className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-10">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-full bg-[#202525] text-[#f4f1eb]"><Feather size={16} strokeWidth={1.7} /></div>
          <span className="font-serif text-xl tracking-[-0.03em]">folio</span>
        </div>
        <nav className="hidden items-center gap-8 text-[13px] text-[#6d716c] md:flex">
          <a className="font-medium text-[#202525]" href="#workspace">My studio</a>
          <a href="#discover">Discover</a>
          <a href="#notes">Notes</a>
        </nav>
        <div className="flex items-center gap-2">
          <button aria-label="Search" className="grid size-9 place-items-center rounded-full border border-[#d9d6ce] text-[#6d716c] transition hover:bg-white"><Search size={16} /></button>
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu" className="grid size-9 place-items-center rounded-full border border-[#d9d6ce] text-[#6d716c] transition hover:bg-white"><Menu size={16} /></button>
          {menuOpen && <div className="absolute right-5 top-16 z-20 w-44 rounded-xl border border-[#dedbd3] bg-[#fffdf8] p-2 text-sm shadow-lg"><button className="w-full rounded-lg px-3 py-2 text-left hover:bg-[#f4f1eb]">Account settings</button><button className="w-full rounded-lg px-3 py-2 text-left hover:bg-[#f4f1eb]">Export library</button></div>}
        </div>
      </header>

      <section id="workspace" className="mx-auto max-w-[1440px] px-5 pb-16 pt-10 md:px-10 md:pt-16">
        <div className="mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9b604d]">Tuesday, October 14</p>
            <h1 className="max-w-2xl font-serif text-5xl leading-[0.98] tracking-[-0.055em] md:text-7xl">Make room for<br /><em className="font-normal text-[#9b604d]">the story.</em></h1>
          </div>
          <button onClick={() => setShowNew(true)} className="group flex w-fit items-center gap-3 rounded-full bg-[#9b604d] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#814a3b]"><Plus size={16} /> New story <span className="ml-2 opacity-60">⌘ N</span></button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <article className="relative overflow-hidden rounded-[2rem] bg-[#172e33] p-7 text-[#f6f2e9] md:p-10">
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-70"><img src="/images/cover-moth.png" alt="A white moth over midnight flowers" className="h-full w-full object-cover object-center mix-blend-screen" /></div>
            <div className="relative z-10 flex min-h-[430px] flex-col justify-between">
              <div className="flex items-center justify-between"><span className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70">In progress</span><button aria-label="More options" className="text-white/60"><MoreHorizontal size={20} /></button></div>
              <div className="max-w-[380px]"><p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#d5a28d]">A novel by Alex Rowan</p><h2 className="font-serif text-5xl leading-[0.94] tracking-[-0.05em] md:text-6xl">The<br /><em className="font-normal text-[#d5a28d]">night garden</em></h2><p className="mt-5 max-w-xs text-sm leading-6 text-white/60">A quiet story about the places we return to, and the selves we find waiting there.</p></div>
              <div className="flex items-end justify-between"><span className="text-xs text-white/50">34,820 words</span><button onClick={() => setShowReader(true)} className="flex items-center gap-2 rounded-full bg-[#f6f2e9] px-4 py-2 text-xs font-semibold text-[#172e33] transition hover:bg-white">Continue reading <ChevronRight size={14} /></button></div>
            </div>
          </article>

          <div className="flex flex-col gap-6">
            <div className="rounded-[2rem] border border-[#dedbd3] bg-[#fffdf8] p-7 md:p-8"><div className="mb-9 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-[#9b604d]">Your library</p><h2 className="mt-2 font-serif text-3xl tracking-[-0.04em]">Recent stories</h2></div><BookOpen size={21} className="text-[#9b604d]" /></div><div className="space-y-1">{chapters.map((chapter, index) => <button key={chapter.number} onClick={() => setActiveChapter(index)} className={`flex w-full items-center gap-4 rounded-xl p-3 text-left transition ${activeChapter === index ? 'bg-[#f0ece4]' : 'hover:bg-[#f8f5ef]'}`}><span className="font-serif text-lg text-[#aaa69d]">{chapter.number}</span><span className="flex-1"><span className="block text-sm font-medium">{chapter.title}</span><span className="mt-1 block text-[11px] text-[#9c9b94]">{chapter.date}</span></span>{activeChapter === index && <span className="size-2 rounded-full bg-[#9b604d]" />}</button>)}</div><button onClick={() => setShowNew(true)} className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#9b604d]"><Plus size={14} /> Add a new story</button></div>
            <div id="notes" className="flex flex-1 flex-col justify-between rounded-[2rem] bg-[#dce2d7] p-7 md:p-8"><div className="flex items-center justify-between"><Sparkles size={21} className="text-[#526456]" /><span className="text-[11px] uppercase tracking-[0.18em] text-[#687767]">Writing prompt</span></div><div><p className="max-w-sm font-serif text-2xl leading-tight tracking-[-0.03em] text-[#2d4134]">“Describe a room by everything it refuses to reveal.”</p><button className="mt-5 text-xs font-semibold text-[#526456] underline decoration-[#9caf9b] underline-offset-4">Open your notes <ChevronRight size={13} className="ml-1 inline" /></button></div></div>
          </div>
        </div>
      </section>

      <section id="discover" className="border-t border-[#dedbd3] bg-[#eeebe4] px-5 py-12 md:px-10"><div className="mx-auto flex max-w-[1440px] items-center justify-between"><div><p className="text-[11px] uppercase tracking-[0.2em] text-[#9b604d]">A little inspiration</p><h2 className="mt-2 font-serif text-3xl tracking-[-0.04em]">Stories worth getting lost in.</h2></div><button className="hidden items-center gap-2 text-xs font-semibold md:flex">Explore discover <ChevronRight size={14} /></button></div></section>

      {showNew && <div className="fixed inset-0 z-30 grid place-items-center bg-[#172e33]/40 p-5 backdrop-blur-sm"><div className="w-full max-w-lg rounded-[2rem] bg-[#fffdf8] p-7 shadow-2xl md:p-9"><div className="mb-8 flex items-start justify-between"><div><p className="text-[11px] uppercase tracking-[0.2em] text-[#9b604d]">Begin something new</p><h2 className="mt-2 font-serif text-4xl tracking-[-0.05em]">A blank page, waiting.</h2></div><button onClick={() => setShowNew(false)} aria-label="Close dialog" className="text-[#8c8b84]"><X size={20} /></button></div><label className="text-xs font-semibold uppercase tracking-[0.14em] text-[#777970]">Story title<input placeholder="Give it a name" className="mt-2 w-full rounded-xl border border-[#d9d6ce] bg-[#f8f5ef] px-4 py-3 font-serif text-lg outline-none focus:border-[#9b604d]" /></label><div className="mt-5 grid grid-cols-2 gap-3"><button className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#c8c4ba] py-7 text-xs text-[#777970] transition hover:bg-[#f8f5ef]"><ImagePlus size={17} /> Add a cover</button><button className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#c8c4ba] py-7 text-xs text-[#777970] transition hover:bg-[#f8f5ef]"><Upload size={17} /> Import draft</button></div><button onClick={() => setShowNew(false)} className="mt-7 w-full rounded-full bg-[#9b604d] py-3 text-sm font-medium text-white hover:bg-[#814a3b]">Create story</button></div></div>}

      {showReader && <div className="fixed inset-0 z-40 bg-[#172e33] p-4 text-[#f6f2e9] md:p-8"><div className="mx-auto flex h-full max-w-5xl flex-col"><div className="flex items-center justify-between"><button onClick={() => setShowReader(false)} className="flex items-center gap-2 text-sm text-white/60 hover:text-white"><X size={18} /> Close reader</button><span className="font-serif text-lg">folio</span><span className="text-xs text-white/50">{String(activeChapter + 1).padStart(2, '0')} / 03</span></div><div className="flex flex-1 items-center justify-center py-8"><div className="grid max-w-3xl gap-10 md:grid-cols-2 md:gap-20"><div className="border-l border-white/20 pl-6 md:pl-10"><p className="mb-12 text-[10px] uppercase tracking-[0.24em] text-[#d5a28d]">{chapters[activeChapter].number} — {chapters[activeChapter].title}</p><h2 className="font-serif text-5xl leading-[0.95] tracking-[-0.05em] md:text-7xl">The night<br /><em className="font-normal text-[#d5a28d]">garden</em></h2></div><div className="max-w-md self-end font-serif text-lg leading-8 text-white/75"><p>The garden had gone quiet by the time Mara found the key. Not asleep, exactly. It was listening, the way old houses listen when someone they remember comes home.</p><p className="mt-6">She held it in her palm and felt the small, certain weight of a door that had been waiting for her.</p></div></div></div><div className="flex items-center justify-between border-t border-white/15 pt-5"><button onClick={previousChapter} disabled={activeChapter === 0} className="flex items-center gap-2 text-xs text-white/60 disabled:opacity-30"><ChevronLeft size={15} /> Previous</button><span className="text-xs text-white/40">Swipe or use arrow keys to turn the page</span><button onClick={nextChapter} disabled={activeChapter === chapters.length - 1} className="flex items-center gap-2 text-xs text-white/60 disabled:opacity-30">Next <ChevronRight size={15} /></button></div></div></div>}
    </main>
  )
}
