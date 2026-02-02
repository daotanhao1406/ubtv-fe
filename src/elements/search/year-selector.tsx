'use client'
import { Select, SelectItem } from '@heroui/react'

const currentYear = new Date().getFullYear()

const yearOptions = Array.from({ length: currentYear - 1970 + 1 }, (_, index) => {
  const year = 1970 + index
  return {
    key: year.toString(),
    label: year.toString(),
  }
}).reverse()

export default function YearSelector({ value, onChange }: { value: string; onChange: (year: string) => void }) {
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }
  return (
    <Select selectedKeys={[value]} onChange={handleSelectionChange} className='max-w-80' variant='bordered' placeholder='Select year...'>
      {yearOptions.map((i) => (
        <SelectItem key={i.key}>{i.label}</SelectItem>
      ))}
    </Select>
  )
}
