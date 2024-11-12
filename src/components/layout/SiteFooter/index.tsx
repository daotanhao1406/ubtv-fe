import { Button as NextButton, Spacer } from '@nextui-org/react'
import { Facebook, Linkedin, Twitter } from 'lucide-react'

import { Button as ShadcnButton } from '@/components/ui/button'

import { siteConfig } from '@/constant/config/site'

export function SiteFooter() {
  return (
    <footer className='w-full bg-footer border-border/40 py-6 dark:border-border md:px-8 md:py-0'>
      <div className='flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row'>
        <p className='text-balance text-center text-sm leading-loose text-muted-foreground md:text-left'>
          Built by{' '}
          <a href={siteConfig.links.twitter} target='_blank' rel='noreferrer'>
            <ShadcnButton variant='linkHover1' className='px-0 ml-[2px]'>
              Utopia Bros
            </ShadcnButton>
          </a>
          . All rights reserved.
        </p>
        <div className='flex items-center'>
          <NextButton isIconOnly color='secondary'>
            <Facebook size={21} fill='white' strokeWidth={0} />
          </NextButton>
          <Spacer x={3} />
          <NextButton isIconOnly color='secondary'>
            <Twitter size={21} fill='white' strokeWidth={0} />
          </NextButton>
          <Spacer x={3} />
          <NextButton isIconOnly color='secondary'>
            <Linkedin size={21} fill='white' strokeWidth={0} />
          </NextButton>
        </div>
      </div>
    </footer>
  )
}
