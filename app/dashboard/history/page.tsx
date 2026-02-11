export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HistoryPage() {
  // Placeholder - implement auth and data fetching
  // const supabase = createServerComponentClient<Database>({ cookies })
  // const { data: { session } } = await supabase.auth.getSession()
  // if (!session) redirect('/auth/login')

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            <span className="font-bold text-xl">AI UGC Generator</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-white/70 hover:text-white transition">Dashboard</Link>
            <Link href="/dashboard/history" className="text-white font-semibold">History</Link>
          </div>
        </div>
      </nav>

      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Video History</h1>
            <p className="text-white/60">View and download all your generated videos</p>
          </div>

          <div className="text-center py-20 rounded-2xl border border-dashed border-white/20">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 mb-4">
              <svg className="h-8 w-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
            <p className="text-white/60 max-w-sm mx-auto">
              Create your first AI-generated UGC video from the dashboard
            </p>
            <Link href="/dashboard" className="inline-block mt-4 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold transition">
              Create Video
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}