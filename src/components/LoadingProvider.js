import React, { createContext, useState } from 'react'

export const LoadingContext = createContext({})

export const LoadingProvider = ({ children }) => {
  const [loading, setloading] = useState(false)

  const showloading = () => {
    setloading(true)
    setTimeout(() => {
      setloading(false)
    }, 1000)
  }
  const hideloading = () => setloading(false)

  return (
    <LoadingContext.Provider value={{ loading, showloading, hideloading }}>
      {children}
    </LoadingContext.Provider>
  )
}
