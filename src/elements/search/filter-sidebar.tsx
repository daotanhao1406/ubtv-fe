'use client'
import { Accordion, AccordionItem, type Selection } from '@heroui/react'
import { useState } from 'react'

interface FilterValues {
  year?: number
  category?: string
  country?: string
  language?: string
  type?: string
}

export interface FilterSidebarProps {
  values?: FilterValues
  onFilter?: (values: FilterValues) => void
}

export default function FilterSidebar() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['1']))
  const defaultContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
  return (
    <Accordion selectionMode='multiple' itemClasses={{ base: 'mt-3' }} dividerProps={{ style: { background: '#202020', marginTop: -2 } }} selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
      <AccordionItem key='1' aria-label='Year' title={<div className='font-semibold'>Year</div>}>
        {defaultContent}
      </AccordionItem>
      <AccordionItem key='type' aria-label='Type' title={<div className='font-semibold'>Type</div>}>
        {defaultContent}
      </AccordionItem>
      <AccordionItem key='2' aria-label='Genres' title={<div className='font-semibold'>Genres</div>}>
        {defaultContent}
      </AccordionItem>
      <AccordionItem key='3' aria-label='Country' title={<div className='font-semibold'>Country</div>}>
        {defaultContent}
      </AccordionItem>
      <AccordionItem key='4' aria-label='Language' title={<div className='font-semibold'>Language</div>}>
        {defaultContent}
      </AccordionItem>
    </Accordion>
  )
}
