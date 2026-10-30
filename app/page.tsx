'use client'

import useSWR from 'swr'
import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, Feather, ImagePlus, Loader2, Menu, MoreHorizontal, Plus, Search, Sparkles, Upload, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Notebook = {
  id: string
  title: string
  subtitle: string | null
  author_name: string
  cover_url: string | null
  status: 'draft' | 'published'
  updated_at: string
}

type Page = { id: string; notebook_id: string; page_number: number; title: string | null; content: string; image_url: string | null }

const getSupabase = () => createClient()
const fetchNotebooks = async () => {
  const { data, error } = await getSupabase().from('notebooks').select('id,title,subtitle,author_name,cover_url,status,updated_at').order('updated_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Notebook[]
}

const formatDate = (value: string) => new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(Math.max(-1, Math.round((new Date(value).getTime() - Date.now()) / 86400000)), 'day')

export default function Page() {
  const { data: notebooks, error, isLoading, mutate } = useSWR('notebooks', fetchNotebooks)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [showReader, setShowReader] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', subtitle: '', author: 'Anonymous writer' })

  const activeNotebook = useMemo(() => notebooks?.find((notebook) => notebook.id === (activeId ?? notebooks?.[0]?.id)), [activeId, notebooks])

  const selectCover = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCoverPreview(String(reader.result))
    reader.readAsDataURL(file)
  }

  const createNotebook = async (event: FormEvent) => {
    event.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    const { data, error: insertError } = await getSupabase().from('notebooks').insert({ title: form.title.trim(), subtitle: form.subtitle.trim() || null, author_name: form.author.trim() || 'Anonymous writer', cover_url: coverPreview }).select().single()
    setSaving(false)
    if (insertError) return
    await getSupabase().from('notebook_pages').insert({ notebook_id: data.id, page_number: 1, title: 'Opening page', content: 'Begin where the light is softest.' })
    setForm({ title: '', subtitle: '', author: 'Anonymous writer' })
    setCoverPreview(null)
    setShowNew(false)
    await mutate()
    setActiveId(data.id)
  }

  const deleteNotebook = async () => {
    if (!activeNotebook) return
    await getSupabase().from('notebooks').delete().eq('id', activeNotebook.id)
    setActiveId(null)
    mutate()
    setMenuOpen(false)
  }

  return (
    <main className="min-h-screen bg-[#f4f1eb] text-[#202525]">
      <header className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-10">
        <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-full bg-[#202525] text-[#f4f1eb]"><Feather size={16} strokeWidth={1.7} /></div><span className="font-serif text-xl tracking-[-0.03em]">folio</span></div>
        <nav className="hidden items-center gap-8 text-[13px] text-[#6d716c] md:flex"><a className="font-medium text-[#202525]" href="#workspace">My studio</a><a href="#discover">Discover</a><a href="#notes">Notes</a></nav>
        <div className="relative flex items-center gap-2"><button aria-label="Search" className="grid size-9 place-items-center rounded-full border border-[#d9d6ce] text-[#6d716c] transition hover:bg-white"><Search size={16} /></button><button onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu" className="grid size-9 place-items-center rounded-full border border-[#d9d6ce] text-[#6d716c] transition hover:bg-white"><Menu size={16} /></button>{menuOpen && <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-[#dedbd3] bg-[#fffdf8] p-2 text-sm shadow-lg"><button onClick={deleteNotebook} className="w-full rounded-lg px-3 py-2 text-left text-[#9b604d] hover:bg-[#f4f1eb]">Delete selected story</button><button className="w-full rounded-lg px-3 py-2 text-left hover:bg-[#f4f1eb]">Export library</button></div>}</div>
      </header>

      <section id="workspace" className="mx-auto max-w-[1440px] px-5 pb-16 pt-10 md:px-10 md:pt-16">
        <div className="mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9b604d]">Your private writing room</p><h1 className="max-w-2xl font-serif text-5xl leading-[0.98] tracking-[-0.055em] md:text-7xl">Make room for<br /><em className="font-normal text-[#9b604d]">the story.</em></h1></div><button onClick={() => setShowNew(true)} className="group flex w-fit items-center gap-3 rounded-full bg-[#9b604d] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#814a3b]"><Plus size={16} /> New story <span className="ml-2 opacity-60">⌘ N</span></button></div>

        {isLoading && <div className="flex min-h-[350px] items-center justify-center rounded-[2rem] border border-[#dedbd3] bg-[#fffdf8] text-[#777970]"><Loader2 className="mr-2 animate-spin" size={18} /> Loading your library</div>}
        {error && <div className="rounded-[2rem] border border-[#e1c5bb] bg-[#fff8f5] p-8 text-[#814a3b]">Your library could not be loaded. Check the Supabase connection and refresh.</div>}
        {!isLoading && !error && !notebooks?.length && <div className="rounded-[2rem] border border-dashed border-[#c8c4ba] bg-[#fffdf8] p-12 text-center"><BookOpen className="mx-auto mb-4 text-[#9b604d]" size={28} /><h2 className="font-serif text-3xl">Your first story starts here.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#777970]">Create a title, add a cover, and turn the blank page into something that feels entirely yours.</p><button onClick={() => setShowNew(true)} className="mt-6 rounded-full bg-[#9b604d] px-5 py-3 text-sm font-medium text-white">Create a story</button></div>}
        {activeNotebook && <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]"><article className="relative overflow-hidden rounded-[2rem] bg-[#172e33] p-7 text-[#f6f2e9] md:p-10">{activeNotebook.cover_url && <div className="absolute right-0 top-0 h-full w-1/2 opacity-70"><img src={activeNotebook.cover_url} alt="Story cover" className="h-full w-full object-cover mix-blend-screen" /></div>}<div className="relative z-10 flex min-h-[430px] flex-col justify-between"><div className="flex items-center justify-between"><span className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70">{activeNotebook.status}</span><button aria-label="More options" onClick={() => setMenuOpen(!menuOpen)} className="text-white/60"><MoreHorizontal size={20} /></button></div><div className="max-w-[380px]"><p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#d5a28d]">{activeNotebook.author_name}</p><h2 className="font-serif text-5xl leading-[0.94] tracking-[-0.05em] md:text-6xl">{activeNotebook.title}</h2>{activeNotebook.subtitle && <p className="mt-5 max-w-xs text-sm leading-6 text-white/60">{activeNotebook.subtitle}</p>}</div><div className="flex items-end justify-between"><span className="text-xs text-white/50">Updated {formatDate(activeNotebook.updated_at)}</span><button onClick={() => setShowReader(true)} className="flex items-center gap-2 rounded-full bg-[#f6f2e9] px-4 py-2 text-xs font-semibold text-[#172e33] transition hover:bg-white">Open reader <ChevronRight size={14} /></button></div></div></article><div className="flex flex-col gap-6"><div className="rounded-[2rem] border border-[#dedbd3] bg-[#fffdf8] p-7 md:p-8"><div className="mb-9 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-[#9b604d]">Your library</p><h2 className="mt-2 font-serif text-3xl tracking-[-0.04em]">Recent stories</h2></div><BookOpen size={21} className="text-[#9b604d]" /></div><div className="flex flex-col gap-1">{notebooks?.map((notebook) => <button key={notebook.id} onClick={() => setActiveId(notebook.id)} className={`flex w-full items-center gap-4 rounded-xl p-3 text-left transition ${activeNotebook.id === notebook.id ? 'bg-[#f0ece4]' : 'hover:bg-[#f8f5ef]'}`}><span className="font-serif text-lg text-[#aaa69d]">{String((notebooks?.indexOf(notebook) ?? 0) + 1).padStart(2, '0')}</span><span className="flex-1"><span className="block text-sm font-medium">{notebook.title}</span><span className="mt-1 block text-[11px] text-[#9c9b94]">{notebook.status} · {formatDate(notebook.updated_at)}</span></span>{activeNotebook.id === notebook.id && <span className="size-2 rounded-full bg-[#9b604d]" />}</button>)}</div><button onClick={() => setShowNew(true)} className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#9b604d]"><Plus size={14} /> Add a new story</button></div><div id="notes" className="flex flex-1 flex-col justify-between rounded-[2rem] bg-[#dce2d7] p-7 md:p-8"><div className="flex items-center justify-between"><Sparkles size={21} className="text-[#526456]" /><span className="text-[11px] uppercase tracking-[0.18em] text-[#687767]">Writing prompt</span></div><div><p className="max-w-sm font-serif text-2xl leading-tight tracking-[-0.03em] text-[#2d4134]">“Describe a room by everything it refuses to reveal.”</p><button className="mt-5 text-xs font-semibold text-[#526456] underline decoration-[#9caf9b] underline-offset-4">Open your notes <ChevronRight size={13} className="ml-1 inline" /></button></div></div></div></div>}
      </section>

      <section id="discover" className="border-t border-[#dedbd3] bg-[#eeebe4] px-5 py-12 md:px-10"><div className="mx-auto flex max-w-[1440px] items-center justify-between"><div><p className="text-[11px] uppercase tracking-[0.2em] text-[#9b604d]">A little inspiration</p><h2 className="mt-2 font-serif text-3xl tracking-[-0.04em]">Stories worth getting lost in.</h2></div><button className="hidden items-center gap-2 text-xs font-semibold md:flex">Explore discover <ChevronRight size={14} /></button></div></section>

      {showNew && <div className="fixed inset-0 z-30 grid place-items-center bg-[#172e33]/40 p-5 backdrop-blur-sm"><form onSubmit={createNotebook} className="w-full max-w-lg rounded-[2rem] bg-[#fffdf8] p-7 shadow-2xl md:p-9"><div className="mb-8 flex items-start justify-between"><div><p className="text-[11px] uppercase tracking-[0.2em] text-[#9b604d]">Begin something new</p><h2 className="mt-2 font-serif text-4xl tracking-[-0.05em]">A blank page, waiting.</h2></div><button type="button" onClick={() => setShowNew(false)} aria-label="Close dialog" className="text-[#8c8b84]"><X size={20} /></button></div><label className="text-xs font-semibold uppercase tracking-[0.14em] text-[#777970]">Story title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Give it a name" className="mt-2 w-full rounded-xl border border-[#d9d6ce] bg-[#f8f5ef] px-4 py-3 font-serif text-lg outline-none focus:border-[#9b604d]" /></label><label className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-[#777970]">Subtitle or premise<input value={form.subtitle} onChange={(event) => setForm({ ...form, subtitle: event.target.value })} placeholder="A line readers will remember" className="mt-2 w-full rounded-xl border border-[#d9d6ce] bg-[#f8f5ef] px-4 py-3 text-sm outline-none focus:border-[#9b604d]" /></label><label className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-[#777970]">Author<input value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} className="mt-2 w-full rounded-xl border border-[#d9d6ce] bg-[#f8f5ef] px-4 py-3 text-sm outline-none focus:border-[#9b604d]" /></label><div className="mt-5"><input id="cover-upload" type="file" accept="image/png,image/jpeg,image/webp" onChange={selectCover} className="sr-only" /><label htmlFor="cover-upload" className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#c8c4ba] py-7 text-xs text-[#777970] transition hover:bg-[#f8f5ef]">{coverPreview ? <img src={coverPreview} alt="Selected cover preview" className="mr-2 size-12 rounded object-cover" /> : <ImagePlus size={17} />} {coverPreview ? 'Cover selected — choose another' : 'Add a cover picture'}</label></div><button disabled={saving} type="submit" className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#9b604d] py-3 text-sm font-medium text-white hover:bg-[#814a3b] disabled:opacity-60">{saving && <Loader2 className="animate-spin" size={16} />} {saving ? 'Saving your story' : 'Create story'}</button></form></div>}

      {showReader && activeNotebook && <Reader notebook={activeNotebook} onClose={() => setShowReader(false)} />}
    </main>
  )
}

function Reader({ notebook, onClose }: { notebook: Notebook; onClose: () => void }) {
  const { data: pages } = useSWR(`pages-${notebook.id}`, async () => { const { data, error } = await getSupabase().from('notebook_pages').select('id,notebook_id,page_number,title,content,image_url').eq('notebook_id', notebook.id).order('page_number'); if (error) throw error; return (data ?? []) as Page[] })
  const [pageIndex, setPageIndex] = useState(0)
  const page = pages?.[pageIndex]
  return <div className="fixed inset-0 z-40 bg-[#172e33] p-4 text-[#f6f2e9] md:p-8"><div className="mx-auto flex h-full max-w-5xl flex-col"><div className="flex items-center justify-between"><button onClick={onClose} className="flex items-center gap-2 text-sm text-white/60 hover:text-white"><X size={18} /> Close reader</button><span className="font-serif text-lg">folio</span><span className="text-xs text-white/50">{page ? String(page.page_number).padStart(2, '0') : '—'} / {pages?.length ?? '…'}</span></div><div className="flex flex-1 items-center justify-center py-8"><div className="grid max-w-3xl gap-10 md:grid-cols-2 md:gap-20"><div className="border-l border-white/20 pl-6 md:pl-10"><p className="mb-12 text-[10px] uppercase tracking-[0.24em] text-[#d5a28d]">{notebook.author_name}</p><h2 className="font-serif text-5xl leading-[0.95] tracking-[-0.05em]">{notebook.title}</h2>{page?.title && <p className="mt-5 text-sm uppercase tracking-[0.2em] text-[#d5a28d]">{page.title}</p>}</div><div className="max-w-md self-end font-serif text-lg leading-8 text-white/75">{page ? page.content.split('\n').map((paragraph) => <p key={paragraph} className="mt-6 first:mt-0">{paragraph}</p>) : <p>Opening your pages…</p>}</div></div></div><div className="flex items-center justify-between border-t border-white/15 pt-5"><button onClick={() => setPageIndex((index) => Math.max(index - 1, 0))} disabled={pageIndex === 0} className="flex items-center gap-2 text-xs text-white/60 disabled:opacity-30"><ChevronLeft size={15} /> Previous</button><span className="text-xs text-white/40">Turn the page</span><button onClick={() => setPageIndex((index) => Math.min(index + 1, (pages?.length ?? 1) - 1))} disabled={!pages || pageIndex >= pages.length - 1} className="flex items-center gap-2 text-xs text-white/60 disabled:opacity-30">Next <ChevronRight size={15} /></button></div></div></div>
}
