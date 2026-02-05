export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <div className="h-5 w-40 rounded bg-white" />
          <div className="h-5 w-20 rounded bg-white" />
        </header>

        <div className="py-14 text-center">
          <div className="mx-auto h-12 w-72 rounded bg-white md:h-16 md:w-96" />
          <div className="mx-auto mt-4 h-5 w-full max-w-2xl rounded bg-white" />
          <div className="mx-auto mt-2 h-5 w-5/6 max-w-xl rounded bg-white" />

          <div className="mx-auto mt-10 flex flex-wrap justify-center gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-24 rounded-[8px] bg-white" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[400px] w-full max-w-[320px] animate-pulse rounded-[16px] border-2 border-[#D2D2D7] bg-white p-6"
              style={{ boxShadow: "4px 4px 0px #1D1D1F" }}
            >
              <div className="flex h-full flex-col">
                <div className="h-8 w-28 rounded-[8px] border-2 border-[#1D1D1F] bg-[#D2D2D7]" />

                <div className="mt-4 h-7 w-3/4 rounded bg-[#F5F5F7]" />
                <div className="mt-3 h-4 w-full rounded bg-[#F5F5F7]" />
                <div className="mt-2 h-4 w-11/12 rounded bg-[#F5F5F7]" />
                <div className="mt-2 h-4 w-2/3 rounded bg-[#F5F5F7]" />

                <div className="mt-auto">
                  <div className="mb-4 flex gap-2">
                    <div className="h-6 w-16 rounded-[6px] border border-[#D2D2D7] bg-[#F5F5F7]" />
                    <div className="h-6 w-20 rounded-[6px] border border-[#D2D2D7] bg-[#F5F5F7]" />
                    <div className="h-6 w-14 rounded-[6px] border border-[#D2D2D7] bg-[#F5F5F7]" />
                  </div>
                  <div className="h-12 w-full rounded-[8px] bg-[#1D1D1F]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
