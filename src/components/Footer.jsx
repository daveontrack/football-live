import { footerStyles as s } from "../assets/dummyStyles";

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#0a0a0a] px-3 pt-8 pb-0 sm:px-6 sm:pt-10">
      <div className="relative w-full overflow-hidden">
        {/* Gradient overlay for depth */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
        <p
          className="footer-wordmark animate-marquee pointer-events-none block w-[200%] select-none whitespace-nowrap text-center text-[clamp(3rem,18vw,15rem)] uppercase leading-none sm:text-[clamp(4.5rem,16vw,18rem)]"
        >
          <span className="inline-block pr-8">ዳዊት football</span>
          <span className="inline-block pr-8">ዳዊት football</span>
          <span className="inline-block pr-8">ዳዊት football</span>
          <span className="inline-block pr-8">ዳዊት football</span>
        </p>
      </div>
    </footer>
  );
}
