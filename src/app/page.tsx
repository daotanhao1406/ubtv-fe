'use client';

import {
  Button as NextButton,
  Checkbox,
  CircularProgress,
  Input as NextInput,
  Spacer,
  Tooltip,
} from '@nextui-org/react';
import Head from 'next/head';
import * as React from 'react';
import '@/lib/env';

import { cn } from '@/lib/utils';

import { Button as ShadcnButton, buttonVariants } from '@/components/ui/button';
import { Input as ShadcnInput } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
import Logo from '~/svg/Logo.svg';

export default function HomePage() {
  return (
    <main>
      <Head>
        <title>Hi</title>
      </Head>
      <section>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          <Logo className='w-16' />
          <h1 className='mt-4'>Next.js + Tailwind CSS + TypeScript Starter</h1>
          <p className='mt-2 text-sm'>
            A starter for Next.js, Tailwind CSS, and TypeScript with Absolute
            Import, Seo, Link component, pre-configured with Husky
          </p>
          <div className='mt-5 flex flex-row'>
            <NextButton
              className={cn(buttonVariants())}
              color='primary'
              variant='solid'
            >
              Button
            </NextButton>
            <Spacer x={4} />
            <Checkbox defaultSelected>Checkbox</Checkbox>
            <Spacer x={4} />
            <CircularProgress aria-label='Loading...' />
            <Spacer x={4} />
            <NextInput
              type='email'
              placeholder='Input'
              labelPlacement='outside'
            />
            <Spacer x={4} />
            <Tooltip placement='right' content='I am a tooltip'>
              <NextButton>Hover me</NextButton>
            </Tooltip>
          </div>
          <div className='mt-5 flex flex-row'>
            <ShadcnButton variant='default'>Button</ShadcnButton>
            <Spacer x={4} />
            <ShadcnInput type='email' placeholder='Email' />
            <Spacer x={4} />
            <Select>
              <SelectTrigger className='w-[270px]'>
                <SelectValue placeholder='Select a fruit' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value='apple'>Apple</SelectItem>
                  <SelectItem value='banana'>Banana</SelectItem>
                  <SelectItem value='blueberry'>Blueberry</SelectItem>
                  <SelectItem value='grapes'>Grapes</SelectItem>
                  <SelectItem value='pineapple'>Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <footer className='absolute bottom-2'>
            © {new Date().getFullYear()} By
          </footer>
        </div>
      </section>
    </main>
  );
}
