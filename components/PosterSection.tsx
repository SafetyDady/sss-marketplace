'use client';

type PosterLink = {
  imgSrc: string;
  alt: string;
  href: string;
};

const posterData: PosterLink[] = [
  {
    imgSrc: '/images/poster-left.jpg',
    alt: 'Poster Left',
    href: 'https://www.partner1.com',
  },
  {
    imgSrc: '/images/poster-right.jpg',
    alt: 'Poster Right',
    href: 'https://www.partner2.com',
  },
];

export default function PosterSection() {
  return (
    <section className="w-full px-4 sm:px-0">
      {/* ✅ Mobile: โปสเตอร์เดียวแบบเต็มจอจริง */}
      <div className="block sm:hidden w-screen -ml-[50vw] left-1/2 relative">
        <a
          href={posterData[0].href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-[128px] overflow-hidden shadow border border-gray-300 bg-[#236186] flex items-center justify-center"
        >
          <img
            src={posterData[0].imgSrc}
            alt={posterData[0].alt}
            className="w-full h-full object-cover"
          />
        </a>
      </div>

      {/* ✅ Tablet & Desktop: โปสเตอร์ 2 ชิ้น อยู่ใน 70vw */}
      <div className="hidden sm:flex w-full lg:max-w-[70vw] mx-auto gap-2">
        {/* Poster ซ้าย */}
        <a
          href={posterData[0].href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-[3] h-[176px] overflow-hidden shadow border border-gray-300 bg-[#236186] flex items-center justify-center"
        >
          <img
            src={posterData[0].imgSrc}
            alt={posterData[0].alt}
            className="w-full h-full object-cover"
          />
        </a>

        {/* Poster ขวา */}
        <a
          href={posterData[1].href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-[2] h-[176px] overflow-hidden shadow border border-gray-300 bg-[#236186] flex items-center justify-center"
        >
          <img
            src={posterData[1].imgSrc}
            alt={posterData[1].alt}
            className="w-full h-full object-cover"
          />
        </a>
      </div>
    </section>
  );
}
