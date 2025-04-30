const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  // if () {
  //   redirect('/login')
  // }
  return (
    <main className='flex-1'>
      <section>{children}</section>
    </main>
  )
}
export default AuthLayout
