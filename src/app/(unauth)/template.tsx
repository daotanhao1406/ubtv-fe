type UnAuthTemplateProps = {
  children: React.ReactNode
  icon?: React.ReactNode
  title?: string
  description?: string
}
const UnAuthTemplate = (props: UnAuthTemplateProps) => {
  return (
    <div className='flex flex-col items-center pt-8 w-full'>
      {props.icon && <div className='p-3 bg-secondary rounded-lg mb-4'>{props.icon}</div>}
      {props.title && <h2 className='scroll-m-20 text-3xl font-bold tracking-tight first:mt-0'>{props.title || 'Forgot password'}</h2>}
      {props.description && <p className='text-muted-foreground [&:not(:first-child)]:mt-4 max-w-screen-md text-center'>{props.description || `No worries, we'll send you reset instructions.`}</p>}
      {props.children}
    </div>
  )
}

export default UnAuthTemplate
