"use client";

import "swiper/css";
import "swiper/css/navigation";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

export function HomeBannerSlider() {
  const [showNavigation, setShowNavigation] = useState(false);
  return (
    <div
      className="swiper-container relative w-full lg:w-5/6"
      onMouseOver={() => setShowNavigation(true)}
      onMouseLeave={() => setShowNavigation(false)}
    >
      <Swiper
        className="h-40 w-full lg:h-80"
        autoplay={{ disableOnInteraction: false }}
        navigation={{ enabled: true, nextEl: ".btn-next", prevEl: ".btn-prev" }}
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
      </Swiper>
      <AnimatePresence>
        {showNavigation && <HomeBannerSliderNavigation />}
      </AnimatePresence>
    </div>
  );
}

const HomeBannerSliderNavigation = () => {
  const swiper = useSwiper();
  return (
    <>
      <motion.button
        onClick={() => swiper.slidePrev()}
        initial={{ opacity: 0, bottom: "47%" }}
        animate={{ opacity: 1, bottom: "50%" }}
        exit={{ opacity: 0, bottom: "47%" }}
        transition={{ ease: "easeInOut", duration: 0.2, delay: 0.1 }}
        className="btn-prev absolute -left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white p-2.5 shadow-md disabled:opacity-50"
      >
        <BsChevronLeft size="20" />
      </motion.button>
      <motion.button
        onClick={() => swiper.slideNext()}
        initial={{ opacity: 0, bottom: "47%" }}
        animate={{ opacity: 1, bottom: "50%" }}
        exit={{ opacity: 0, bottom: "47%" }}
        transition={{ ease: "easeInOut", duration: 0.2, delay: 0.1 }}
        className="btn-next absolute -right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white p-2.5 shadow-md disabled:opacity-50"
      >
        <BsChevronRight size="20" />
      </motion.button>
    </>
  );
};
