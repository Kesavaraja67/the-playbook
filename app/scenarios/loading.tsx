export default function Loading() {
  return (
    <div className="min-h-dvh bg-bg-secondary px-6 py-8">
      <main
        className="mx-auto max-w-6xl"
        aria-busy="true"
        role="status"
        aria-label="Loading scenarios"
      >
        <header className="flex items-center justify-between">
          <div className="playbook-skeleton h-5 w-40 rounded" />
          <div className="playbook-skeleton h-5 w-20 rounded" />
        </header>

        <div className="py-14 text-center">
          <div className="playbook-skeleton mx-auto h-12 w-72 rounded md:h-16 md:w-96" />
          <div className="playbook-skeleton mx-auto mt-4 h-5 w-full max-w-2xl rounded" />
          <div className="playbook-skeleton mx-auto mt-2 h-5 w-5/6 max-w-xl rounded" />

          <div className="mx-auto mt-10 flex flex-wrap justify-center gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="playbook-skeleton h-10 w-24 rounded-full" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[408px] w-full max-w-[340px] rounded-xl border border-light bg-tertiary p-6 shadow-md"
            >
              <div className="flex h-full flex-col">
                <div className="playbook-skeleton h-8 w-36 rounded-full" />

                <div className="playbook-skeleton mt-4 h-7 w-3/4 rounded" />
                <div className="playbook-skeleton mt-3 h-4 w-full rounded" />
                <div className="playbook-skeleton mt-2 h-4 w-11/12 rounded" />
                <div className="playbook-skeleton mt-2 h-4 w-2/3 rounded" />

                <div className="mt-auto">
                  <div className="mb-4 flex gap-2">
                    <div className="playbook-skeleton h-6 w-16 rounded-full" />
                    <div className="playbook-skeleton h-6 w-20 rounded-full" />
                    <div className="playbook-skeleton h-6 w-14 rounded-full" />
                  </div>
                  <div className="playbook-skeleton h-12 w-full rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
