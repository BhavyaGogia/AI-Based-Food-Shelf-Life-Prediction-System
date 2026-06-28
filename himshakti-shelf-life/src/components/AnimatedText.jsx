import React from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function AnimatedText({ 
  text, 
  el: Wrapper = 'h1', 
  className,
  delayOffset = 0
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })

  // Split text into words, then words into characters for deep staggering
  const words = text.split(' ')

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.02 * i + delayOffset },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 30,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <Wrapper className={className} ref={ref}>
      <motion.span
        style={{ display: 'inline-flex', flexWrap: 'wrap' }}
        variants={container}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {words.map((word, index) => (
          <span key={index} style={{ overflow: 'hidden', display: 'inline-flex', marginRight: '0.25em' }}>
            <motion.span variants={child} style={{ display: 'inline-block' }}>
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Wrapper>
  )
}
