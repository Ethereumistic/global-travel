"use client"
import { motion, AnimatePresence } from "motion/react"
import { useEffect, useState } from "react"
import { ImagesSlider } from "./images-slider"
import { DestinationSearch } from "../layout/destination-search"

export function Hero() {
  const images = [
    "https://cdn.jsdelivr.net/gh/Ethereumistic/rossa-travel-assets/destinations/dubai.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/rossa-travel-assets/destinations/abu-dhabi.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/rossa-travel-assets/destinations/antalya.webp",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/rossa-travel-assets/destinations/izmir.webp",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/rossa-travel-assets/destinations/morroco.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/rossa-travel-assets/destinations/hurghada.webp",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/rossa-travel-assets/destinations/sharm-el-sheih.jpg",
  ]

  const slides = [
    {
      text: "Дубай",
      buttonText: "Join now →",
    },
    {
      text: "Абу Даби",
      buttonText: "Learn more →",
    },
    {
      text: "Анталия",
      buttonText: "Get started →",
    },
    {
      text: "Измир",
      buttonText: "Join now →",
    },
    {
      text: "Мароко",
      buttonText: "Learn more →",
    },
    {
      text: "Хургада",
      buttonText: "Get started →",
    },
    {
      text: "Шарм ел Шейх",
      buttonText: "Get started →",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ImagesSlider className="h-screen" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4"
          >
            {slides[currentIndex].text}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.button
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4"
          >
            <span>{slides[currentIndex].buttonText}</span>
            <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
          </motion.button>
        </AnimatePresence>

        <DestinationSearch />

      </motion.div>
    </ImagesSlider>
  )
}
