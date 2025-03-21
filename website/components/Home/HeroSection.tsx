import React, { useRef } from "react";
import { heroSlides } from "@/components/Home/HomeData";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { baseUrl } from "@/constants";

type Props = {
  data: {
    id: number;
    type: string;
    sortId: number;
    content: string[];
  };
};

const HeroSection = ({ data }: Props) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  return (
    <section>
      <div className="w-full h-[calc(75vh-92px)] md:h-[calc(100dvh-92px)] relative mb-10">
        <Swiper
          className="mySwiper w-full h-full"
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, Autoplay, Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            if (
              swiper.params.navigation &&
              typeof swiper.params.navigation !== "boolean"
            ) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
        >
          {data?.content?.map((heroImg) => {
            return (
              <SwiperSlide key={heroImg} className="">
                <img
                  className="w-full h-full object-cover md:object-fill"
                  src={`${baseUrl}${heroImg}`}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
        {/* prev */}
        <button
          className="hover:bg-carousel-image-right absolute top-0 left-0 bottom-0 w-16 md:w-32 z-10 cursor-pointer text-white text-xl"
          ref={prevRef}
          type="button"
        >
          <LeftOutlined />
        </button>
        {/* next */}
        <button
          className="hover:bg-carousel-image-left absolute top-0 right-0 bottom-0 w-16 md:w-32 z-10 cursor-pointer text-white text-xl"
          ref={nextRef}
          type="button"
        >
          <RightOutlined />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
