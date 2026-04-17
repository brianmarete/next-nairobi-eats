'use client'

import { GoogleMapsEmbed } from '@next/third-parties/google'
import { FieldLabel, useField } from '@payloadcms/ui'
import { useEffect, useRef, useState } from 'react'

type LocationPickerProps = {
  field?: {
    label?: string
    required?: boolean
  }
  path: string
}

type GooglePlaceResult = {
  place_id?: string
  name?: string
}

type GoogleAutocomplete = {
  addListener: (eventName: 'place_changed', handler: () => void) => unknown
  getPlace: () => GooglePlaceResult
}

declare global {
  interface Window {
    google?: {
      maps?: {
        event?: {
          removeListener: (listener: unknown) => void
        }
        places?: {
          Autocomplete: new (
            inputField: HTMLInputElement,
            options: {
              fields: string[]
              types: string[]
            },
          ) => GoogleAutocomplete
        }
      }
    }
  }
}

const SCRIPT_ID = 'google-maps-places-script'

export const LocationPickerField = ({ field, path }: LocationPickerProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const { value, setValue } = useField<string>({ path })
  const [searchTerm, setSearchTerm] = useState('')
  const [placesLoaded, setPlacesLoaded] = useState(
    () => typeof window !== 'undefined' && !!window.google?.maps?.places,
  )
  const [loadError, setLoadError] = useState<string | null>(
    apiKey ? null : 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing.',
  )
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!apiKey) {
      return
    }

    if (window.google?.maps?.places) {
      return
    }

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null

    if (existingScript) {
      const onReady = () => setPlacesLoaded(true)
      const onError = () => setLoadError('Failed to load Google Places script.')

      existingScript.addEventListener('load', onReady)
      existingScript.addEventListener('error', onError)

      return () => {
        existingScript.removeEventListener('load', onReady)
        existingScript.removeEventListener('error', onError)
      }
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true

    script.onload = () => setPlacesLoaded(true)
    script.onerror = () => setLoadError('Failed to load Google Places script.')

    document.head.appendChild(script)
  }, [apiKey])

  useEffect(() => {
    if (!placesLoaded || !inputRef.current || !window.google?.maps?.places) {
      return
    }

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ['place_id', 'name'],
      types: ['establishment'],
    })

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()

      if (place?.place_id) {
        setValue(place.place_id)
        setSearchTerm(place.name || '')
      }
    })

    return () => {
      if (listener) {
        window.google?.maps?.event?.removeListener(listener)
      }
    }
  }, [placesLoaded, setValue])

  return (
    <div className="field-type text">
      <FieldLabel label={field?.label || 'Restaurant Location'} required={field?.required} />
      <input
        ref={inputRef}
        type="text"
        className="field-type__input"
        placeholder="Search for a restaurant..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      {/* Keep Payload form state source-of-truth as place_id string. */}
      <input type="hidden" value={value || ''} readOnly />

      {value && <p style={{ marginTop: '0.5rem' }}>Selected place ID: {value}</p>}
      {loadError && <p style={{ color: '#c62828', marginTop: '0.5rem' }}>{loadError}</p>}

      {value && apiKey && (
        <div style={{ marginTop: '1rem' }}>
          <GoogleMapsEmbed
            apiKey={apiKey}
            height={280}
            width="100%"
            mode="place"
            q={`place_id:${value}`}
            zoom="17"
          />
        </div>
      )}
    </div>
  )
}
