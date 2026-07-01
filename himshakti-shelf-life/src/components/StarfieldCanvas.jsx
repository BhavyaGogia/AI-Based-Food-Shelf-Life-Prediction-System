import React, { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function StarfieldCanvas() {
  const { theme } = useTheme()
  const iframeRef = useRef(null)

  // Send current theme to iframe when theme changes
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'setMode', mode: theme }, '*')
    }
  }, [theme])

  // Forward scroll and pointer events to the iframe
  useEffect(() => {
    const handleScroll = () => {
      if (iframeRef.current?.contentWindow) {
        const scrollHeight = document.documentElement.scrollHeight
        const innerHeight = window.innerHeight
        const maxScroll = scrollHeight - innerHeight
        const scroll = maxScroll <= 0 ? 0 : window.scrollY / maxScroll
        iframeRef.current.contentWindow.postMessage({ type: 'setScroll', scroll }, '*')
      }
    }

    const handleMouseMove = (e) => {
      if (iframeRef.current?.contentWindow) {
        const x = (e.clientX / window.innerWidth) * 2 - 1
        const y = -(e.clientY / window.innerHeight) * 2 + 1
        iframeRef.current.contentWindow.postMessage({ type: 'setPointer', x, y }, '*')
      }
    }

    const handleMouseLeave = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'pointerLeave' }, '*')
      }
    }

    const handleLoad = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'setMode', mode: theme }, '*')
        handleScroll()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    const iframe = iframeRef.current
    if (iframe) {
      iframe.addEventListener('load', handleLoad)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (iframe) {
        iframe.removeEventListener('load', handleLoad)
      }
    }
  }, [theme])

  return (
    <iframe
      ref={iframeRef}
      src={`/starfield.html?mode=${theme}`}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        display: 'block',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      title="Starfield Close Background"
    />
  )
}
