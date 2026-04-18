'use client'

import { useMemo, useState } from 'react'

type MultiAutocompleteInputProps = {
  name: string
  label: string
  placeholder: string
  options: Array<{ value: string; label: string }>
  selectedValues: string[]
}

export function MultiAutocompleteInput({
  name,
  label,
  placeholder,
  options,
  selectedValues,
}: MultiAutocompleteInputProps) {
  const [values, setValues] = useState<string[]>(selectedValues)
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const normalizedOptions = useMemo(
    () =>
      Array.from(
        new Map(
          options
            .map((option) => ({ value: option.value.trim(), label: option.label.trim() }))
            .filter((option) => option.value.length > 0)
            .map((option) => [option.value, option]),
        ).values(),
      ).sort((a, b) => a.label.localeCompare(b.label)),
    [options],
  )

  const filteredOptions = useMemo(() => {
    const query = inputValue.trim().toLowerCase()
    return normalizedOptions
      .filter((option) => !values.includes(option.value))
      .filter((option) =>
        query.length > 0 ? option.label.toLowerCase().includes(query) || option.value.toLowerCase().includes(query) : true,
      )
      .slice(0, 8)
  }, [normalizedOptions, values, inputValue])

  const addValue = (rawValue: string) => {
    const nextValue = rawValue.trim()
    if (!nextValue) return

    const existingOption = normalizedOptions.find(
      (option) =>
        option.value.toLowerCase() === nextValue.toLowerCase() ||
        option.label.toLowerCase() === nextValue.toLowerCase(),
    )
    const canonical = existingOption?.value || nextValue
    if (values.includes(canonical)) return

    setValues((prev) => [...prev, canonical])
    setInputValue('')
  }

  const removeValue = (value: string) => {
    setValues((prev) => prev.filter((item) => item !== value))
  }

  const getLabel = (value: string): string =>
    normalizedOptions.find((option) => option.value === value)?.label || value

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-700 mb-2">
        {label}
      </label>
      <div className="rounded-md border border-gray-300 bg-white px-2 py-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {values.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
            >
              {getLabel(value)}
              <button
                type="button"
                aria-label={`Remove ${value}`}
                onClick={() => removeValue(value)}
                className="text-gray-500 hover:text-gray-900"
              >
                x
              </button>
            </span>
          ))}
        </div>
        <input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 120)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault()
              addValue(inputValue)
            }
            if (event.key === 'Backspace' && !inputValue && values.length > 0) {
              removeValue(values[values.length - 1])
            }
          }}
          placeholder={placeholder}
          className="w-full border-0 p-0 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />

        {isFocused && filteredOptions.length > 0 && (
          <div className="mt-2 border border-gray-200 rounded-md bg-white shadow-sm overflow-hidden">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault()
                  addValue(option.value)
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {values.map((value) => (
        <input key={`${name}-${value}`} type="hidden" name={name} value={value} />
      ))}
    </div>
  )
}
