"use client"

import "swiper/css"
import "swiper/css/navigation"

import { useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { BsChevronLeft, BsChevronRight } from "react-icons/bs"
import Swiper from "swiper"
import { Autoplay, Navigation } from "swiper/modules"
import { Swiper as SwiperReact, SwiperSlide } from "swiper/react"

export function HomeBannerSlider() {
  const [showNavigation, setShowNavigation] = useState(false)
  const swiperRef = useRef<Swiper>()
  return (
    <div
      className="swiper-container relative w-full lg:w-11/12"
      onMouseEnter={() => setShowNavigation(true)}
      onMouseLeave={() => setShowNavigation(false)}
    >
      <SwiperReact
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="h-40 w-full lg:h-80"
        autoplay={{ disableOnInteraction: false }}
        navigation={{ enabled: true, nextEl: "#btn-next", prevEl: "#btn-prev" }}
        modules={[Navigation, Autoplay]}
        loop={true}
        spaceBetween={50}
      >
        <SwiperSlide className="flex h-full w-full items-center justify-center shadow-sm">
          <Image
            src="https://www.static-src.com/siva/asset/06_2023/desktop-25jun-hta-car6.jpeg?w=1920"
            fill
            alt="promo-banner"
            className="rounded-lg"
          />
        </SwiperSlide>
        <SwiperSlide className="flex h-full w-full items-center justify-center shadow-sm">
          <Image
            src="https://www.static-src.com/siva/asset/06_2023/desktop-25jun-bca-car4-2.jpg?w=1920"
            fill
            alt="promo-banner"
            className="rounded-lg"
          />
        </SwiperSlide>
        <SwiperSlide className="flex h-full w-full items-center justify-center shadow-sm">
          <Image
            src="https://www.static-src.com/siva/asset/06_2023/desktop-25jun-huawei-car7.jpg?w=1920"
            fill
            alt="promo-banner"
            className="rounded-lg"
          />
        </SwiperSlide>
      </SwiperReact>
      <SliderNavigation swiperRef={swiperRef} showNavigation={showNavigation} />
    </div>
  )
}

const SliderNavigation = ({
  swiperRef,
  showNavigation,
}: {
  swiperRef: any
  showNavigation: boolean
}) => {
  return (
    <AnimatePresence>
      {showNavigation && (
        <>
          <motion.button
            id="btn-prev"
            onClick={() => swiperRef.current.slidePrev()}
            initial={{ opacity: 0, bottom: "47%" }}
            animate={{ opacity: 1, bottom: "50%" }}
            exit={{ opacity: 0, bottom: "47%" }}
            transition={{ ease: "easeInOut", duration: 0.2, delay: 0.1 }}
            className="btn-prev lg: absolute -left-2 z-[5] flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md disabled:opacity-50 dark:bg-slate-800 lg:-left-4 lg:h-12 lg:w-12"
          >
            <BsChevronLeft className="h-3 w-3 lg:h-5 lg:w-5" />
          </motion.button>
          <motion.button
            id="btn-next"
            onClick={() => swiperRef.current.slideNext()}
            initial={{ opacity: 0, bottom: "47%" }}
            animate={{ opacity: 1, bottom: "50%" }}
            exit={{ opacity: 0, bottom: "47%" }}
            transition={{ ease: "easeInOut", duration: 0.2, delay: 0.1 }}
            className="btn-next absolute -right-2 z-[5] flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md disabled:opacity-50 dark:bg-slate-800 lg:-right-4 lg:h-12 lg:w-12"
          >
            <BsChevronRight className="h-3 w-3 lg:h-5 lg:w-5" />
          </motion.button>
        </>
      )}
    </AnimatePresence>
  )
}
