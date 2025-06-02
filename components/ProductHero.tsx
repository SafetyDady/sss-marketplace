'use client';

import { useRef, useEffect, useState } from 'react';

const products = [
  { id: 1, image: '/images/hero-product-left.jpg' },
  { id: 2, image: '/images/hero-product.jpg' },
  { id: 3, image: '/images/product-right.jpg' },
];

const heroText = {
  title: 'สินค้าโปรโมตเด่นเดือนนี้',
  desc: 'พบกับดีลสุดพิเศษ ห้ามพลาด!',
};

export default function ProductHeroCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState(1);

  useEffect(() => {
    scrollToIndex(1, false);
  }, []);

  function scrollToIndex(index: number, smooth = true) {
    if (scrollRef.current) {
      const card = scrollRef.current.children[index] as HTMLElement;
      card.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', inline: 'center', block: 'nearest' });
      setCenterIndex(index);
    }
  }

  return (
    <section className="w-full">
      <div className="w-full lg:max-w-[70vw] mx-auto bg-gradient-to-r from-blue-100 to-blue-200 shadow overflow-x-auto scrollbar-hide h-[130px] md:h-[230px] lg:h-[330px]">
        <div
          ref={scrollRef}
          className="flex gap-2 w-fit h-full scroll-smooth snap-x snap-mandatory justify-center"
        >
          {/* Card ซ้าย */}
          <div className="snap-center flex-shrink-0 h-full w-[30vw] sm:w-[25vw] lg:w-[15vw] bg-white shadow overflow-hidden flex items-center justify-center">
            <img
              src={products[0].image}
              alt="สินค้าเด่นซ้าย"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Card กลาง */}
          <div className="snap-center flex-shrink-0 h-full w-[65vw] sm:w-[60vw] lg:w-[50vw] bg-blue-50 shadow relative flex items-center justify-center overflow-hidden">
            <img
              src={products[1].image}
              alt="สินค้าเด่นกลาง"
              className="object-cover w-full h-full"
            />
            <div className="absolute z-10 bg-white/40 p-1 rounded-md inline-flex flex-col items-start max-w-[220px] sm:left-2 sm:bottom-2 left-3 bottom-3">
              <div className="font-bold text-blue-600 text-xs sm:text-sm md:text-base lg:text-lg mb-0.5 drop-shadow">
                {heroText.title}
              </div>
              <div className="text-gray-700 text-[10px] sm:text-sm md:text-base drop-shadow">
                {heroText.desc}
              </div>
            </div>

            {/* ปุ่ม Prev */}
            <button
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 bg-white/80 shadow p-1 px-2 border border-gray-200 hover:bg-blue-200 transition text-sm sm:text-base"
              onClick={() => scrollToIndex(Math.max(centerIndex - 1, 0))}
              disabled={centerIndex === 0}
            >
              {'<'}
            </button>

            {/* ปุ่ม Next */}
            <button
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 bg-white/80 shadow p-1 px-2 border border-gray-200 hover:bg-blue-200 transition text-sm sm:text-base"
              onClick={() => scrollToIndex(Math.min(centerIndex + 1, 2))}
              disabled={centerIndex === 2}
            >
              {'>'}
            </button>
          </div>

          {/* Card ขวา */}
          <div className="snap-center flex-shrink-0 h-full w-[30vw] sm:w-[25vw] lg:w-[15vw] bg-white shadow overflow-hidden flex items-center justify-center">
            <img
              src={products[2].image}
              alt="สินค้าเด่นขวา"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
