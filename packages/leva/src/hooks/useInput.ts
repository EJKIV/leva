import { useState, useCallback, useEffect } from 'react'
import { format } from '../plugin'

type Props<V, Settings> = {
  type: string
  value: V
  settings?: Settings
  set: (v: V) => void
}

export function useInput<V, Settings extends object>({ value, type, settings, set }: Props<V, Settings>) {
  // the value used by the panel vs the value
  const [displayValue, setDisplayValue] = useState(format(type, value, settings))
  const setFormat = useCallback((v) => setDisplayValue(format(type, v, settings)), [type, settings])

  const onUpdate = useCallback(
    (updatedValue: any) => {
      try {
        set(updatedValue)
      } catch ({ previousValue }) {
        setFormat(previousValue)
      }
    },
    [setFormat, set]
  )

  useEffect(() => {
    setFormat(value)
  }, [value, setFormat])

  return { displayValue, onChange: setDisplayValue, onUpdate }
}