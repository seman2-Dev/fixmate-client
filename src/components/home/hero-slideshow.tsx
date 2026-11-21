import Image from "next/image";

const SLIDES = [
  { src: "/hero/1.jpg", origin: "20% 30%" }, // https://ibb.co/WNtwzcsG
  { src: "/hero/2.jpg", origin: "80% 40%" }, // https://ibb.co/5g3nptGz
  { src: "/hero/3.jpg", origin: "30% 80%" }, // https://ibb.co/MysjvJb5
  { src: "/hero/4.jpg", origin: "70% 70%" }, // https://ibb.co/nqmmS5dQ
  { src: "/hero/5.jpg", origin: "50% 50%" }, // https://ibb.co/p6mnfRkL
];
const SLIDE_SECONDS = 6; // time each photo stays on screen

/** Crossfading background slideshow with a Ken Burns zoom. Pure CSS, no JS timer. */
export function HeroSlideshow() {
  const total = SLIDES.length * SLIDE_SECONDS;
  return (
    <div aria-hidden className="absolute inset-0 -z-30 overflow-hidden bg-ink-900">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className="hero-slide absolute inset-0"
          style={{
            transformOrigin: slide.origin,
            animationDuration: `${total}s`,
            animationDelay: `${i * SLIDE_SECONDS}s`,
          }}
        >
          <Image src={slide.src} alt="" fill sizes="100vw" priority={i === 0} className="object-cover" />
        </div>
      ))}
      {/* dark gradient keeps the white text readable on any photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-900/95 via-ink-900/80 to-ink-900/55" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-900 to-transparent" />
    </div>
  );
}