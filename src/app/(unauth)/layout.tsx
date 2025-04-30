export default function UnAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='flex-1'>
      <section>{children}</section>
    </main>
  )
}
