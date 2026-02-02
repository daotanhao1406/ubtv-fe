'use client'
import { Accordion, AccordionItem, Button, Checkbox, CheckboxGroup, type Selection, Skeleton } from '@heroui/react'
import { Suspense, useEffect, useState } from 'react'

import CountrySelector from '@/elements/search/country-selector'
import GenresSelector from '@/elements/search/genres-selector'
import YearSelector from '@/elements/search/year-selector'

export interface FilterValues {
  year?: string
  category?: string
  countries?: string
  language?: string
  type?: string
  genres?: string
}

export interface FilterSidebarProps {
  values?: FilterValues
  onFilter?: (values: FilterValues) => void
  loading?: boolean
}

const typeListOptions = [
  { label: 'Phim bộ', value: 'phim-bo' },
  { label: 'Phim lẻ', value: 'phim-le' },
  { label: 'TV Show', value: 'tv-show' },
  { label: 'Hoạt hình', value: 'hoat-hinh' },
]

const languageOptions = [
  { label: 'Phim Vietsub', value: 'vietsub' },
  { label: 'Phim thuyết minh', value: 'thuyet-minh' },
  { label: 'Phim lồng tiếng', value: 'long-tieng' },
]

const parseToSet = (str?: string): Set<string> => {
  if (!str) return new Set()
  return new Set(str.split(',').filter(Boolean))
}

// Helper: Chuyển string "a,b,c" thành Array cho CheckboxGroup
const parseToArray = (str?: string): string[] => {
  if (!str) return []
  return str.split(',').filter(Boolean)
}

export default function FilterSidebar({ values, onFilter, loading }: FilterSidebarProps) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set())

  const [selectedGenres, setSelectedGenres] = useState<Selection>(new Set())
  const [selectedCountries, setSelectedCountries] = useState<Selection>(new Set())
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('')

  const handleSubmit = () => {
    const genres = Array.from(selectedGenres).join(',')
    const countries = Array.from(selectedCountries).join(',')
    const type = selectedTypes.join(',')
    const language = selectedLanguages.join(',')

    if (typeof onFilter === 'function') {
      onFilter({
        genres,
        countries,
        type,
        language,
        year: selectedYear,
      })
    }
  }

  useEffect(() => {
    // Genres & Countries (dùng Set)
    setSelectedGenres(parseToSet(values?.genres))
    setSelectedCountries(parseToSet(values?.countries))

    // Type & Language (dùng Array cho CheckboxGroup)
    setSelectedTypes(parseToArray(values?.type))
    setSelectedLanguages(parseToArray(values?.language))

    setSelectedYear(values?.year || '')

    const keysToExpand = new Set<string>()

    if (values?.year) keysToExpand.add('year')
    if (values?.type) keysToExpand.add('type')
    if (values?.genres) keysToExpand.add('genres')
    if (values?.countries) keysToExpand.add('countries')
    if (values?.language) keysToExpand.add('language')

    setSelectedKeys(keysToExpand)
  }, [values])

  return (
    <div className='flex flex-col gap-4'>
      <Accordion showDivider={false} selectionMode='multiple' itemClasses={{ base: 'mt-0', trigger: 'pb-2' }} selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
        <AccordionItem key='year' aria-label='Year' title='Year'>
          <YearSelector value={selectedYear} onChange={setSelectedYear} />
        </AccordionItem>
        <AccordionItem key='type' aria-label='Type' title='Type'>
          <CheckboxGroup name='type' value={selectedTypes} onValueChange={setSelectedTypes}>
            {typeListOptions.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem>
        <AccordionItem key='genres' aria-label='Genres' title='Genres'>
          <Suspense fallback={<Skeleton className='h-10 w-full rounded-lg' />}>
            <GenresSelector value={selectedGenres} onChange={setSelectedGenres} />
          </Suspense>
        </AccordionItem>
        <AccordionItem key='countries' aria-label='Country' title='Countries'>
          <CountrySelector value={selectedCountries} onChange={setSelectedCountries} />
        </AccordionItem>
        <AccordionItem key='language' aria-label='Language' title='Language'>
          <CheckboxGroup value={selectedLanguages} onValueChange={setSelectedLanguages}>
            {languageOptions.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem>
      </Accordion>
      {/* {filterActionContent} */}
      <Button isLoading={loading} color='primary' onPress={handleSubmit} className='font-semibold'>
        Filter
      </Button>
    </div>
  )
}
