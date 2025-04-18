import { Spacer } from '@heroui/react'
import { Facebook, Linkedin, Twitter } from 'lucide-react'

import { Button as ShadcnButton } from '@/components/ui/button'

import { siteConfig } from '@/constant/config/site'

export function SiteFooter() {
  return (
    <footer className='w-full bg-footer border-border/40 py-2 mt-2 dark:border-border md:px-8 md:py-0'>
      <div className='flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row'>
        <p className='text-balance text-center text-sm leading-loose text-muted-foreground md:text-left'>
          Built by{' '}
          <a href={siteConfig.links.twitter} target='_blank' rel='noreferrer'>
            <ShadcnButton variant='linkHover1' className='ml-[2px]'>
              Utopia Bros
            </ShadcnButton>
          </a>
          . All rights reserved.
        </p>
        <div className='flex items-center'>
          <ShadcnButton size='icon' variant='outline'>
            <Facebook size={21} fill='white' strokeWidth={0} />
          </ShadcnButton>
          <Spacer x={3} />
          <ShadcnButton size='icon' variant='outline'>
            <Twitter size={21} fill='white' strokeWidth={0} />
          </ShadcnButton>
          <Spacer x={3} />
          <ShadcnButton size='icon' variant='outline'>
            <Linkedin size={21} fill='white' strokeWidth={0} />
          </ShadcnButton>
        </div>
      </div>
    </footer>
  )
}
