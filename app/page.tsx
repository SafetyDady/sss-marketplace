import PosterSection from '../components/PosterSection';
import ProductHero from '../components/ProductHero';
import ProductSection from '../components/ProductSection';

export default function Home() {
  return (
    <main className="pt-[68px] w-full max-w-full lg:max-w-[70vw] mx-auto px-4 lg:px-0">
      <PosterSection />
      <ProductHero />
      <ProductSection />
    </main>
  );
}
