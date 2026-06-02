import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const PHOTO_1 = "https://cdn.poehali.dev/projects/26375c63-33ff-48de-ba54-0d84e6024561/bucket/a2cff249-5057-4621-bc79-72e53aa50d74.jpg";
const PHOTO_5 = "https://cdn.poehali.dev/projects/26375c63-33ff-48de-ba54-0d84e6024561/bucket/9734bf4e-c7fa-4ca0-ad0f-7eba134a6743.jpg";

const DAYS_TT = ["ДШ", "СШ", "ЧШ", "ПЖ", "ЖМ", "ШБ", "ЯК"];

function LeafCorners() {
  const LeafSvg = () => (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="28" cy="18" rx="20" ry="9" fill="#7a9a6a" transform="rotate(-35 28 18)" opacity="0.75"/>
      <ellipse cx="58" cy="12" rx="24" ry="10" fill="#5d7a52" transform="rotate(-8 58 12)" opacity="0.65"/>
      <ellipse cx="88" cy="22" rx="22" ry="9" fill="#8aaa78" transform="rotate(18 88 22)" opacity="0.70"/>
      <ellipse cx="18" cy="50" rx="17" ry="7" fill="#6b8c5e" transform="rotate(-55 18 50)" opacity="0.65"/>
      <ellipse cx="48" cy="60" rx="19" ry="8" fill="#4a6b40" transform="rotate(-22 48 60)" opacity="0.60"/>
      <ellipse cx="12" cy="80" rx="14" ry="6" fill="#7a9a6a" transform="rotate(-72 12 80)" opacity="0.55"/>
      <ellipse cx="35" cy="95" rx="16" ry="6" fill="#5d7a52" transform="rotate(-45 35 95)" opacity="0.50"/>
      <line x1="28" y1="18" x2="3" y2="3" stroke="#5d7a52" strokeWidth="1.5" opacity="0.45"/>
      <line x1="58" y1="12" x2="28" y2="3" stroke="#5d7a52" strokeWidth="1.5" opacity="0.45"/>
      <line x1="18" y1="50" x2="3" y2="32" stroke="#5d7a52" strokeWidth="1.5" opacity="0.40"/>
    </svg>
  );
  return (
    <>
      <div className="fixed top-0 left-0 w-40 h-40 pointer-events-none z-20"><LeafSvg /></div>
      <div className="fixed top-0 right-0 w-40 h-40 pointer-events-none z-20" style={{ transform: "scaleX(-1)" }}><LeafSvg /></div>
      <div className="fixed bottom-0 right-0 w-44 h-44 pointer-events-none z-20" style={{ transform: "rotate(180deg)" }}><LeafSvg /></div>
      <div className="fixed bottom-0 left-0 w-44 h-44 pointer-events-none z-20" style={{ transform: "rotate(180deg) scaleX(-1)" }}><LeafSvg /></div>
    </>
  );
}

function GoldSpeckles() {
  const speckles = [
    { top: "38%", left: "11%" }, { top: "52%", left: "7%" },
    { top: "43%", right: "9%" }, { top: "62%", right: "13%" },
    { top: "72%", left: "16%" }, { top: "28%", right: "7%" },
    { top: "80%", right: "20%" }, { top: "20%", left: "20%" },
  ];
  return (
    <>
      {speckles.map((s, i) => (
        <div key={i} className="fixed w-1 h-1 rounded-full pointer-events-none z-10"
          style={{ ...s, background: "#c9a84c", opacity: 0.35 }} />
      ))}
    </>
  );
}

function CalendarTT() {
  // Август 2026: 1-й день недели — суббота (6), offset=5
  const daysInMonth = 31;
  const offset = 5; // 1 авг 2026 = суббота
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="w-full max-w-[280px] mx-auto">
      <div className="grid grid-cols-7 gap-0 mb-3">
        {DAYS_TT.map(d => (
          <div key={d} className="text-center text-[11px] font-cormorant font-500 text-[#2c2416] py-1 tracking-wider">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => (
          <div key={i} className="relative aspect-square flex items-center justify-center">
            {day && (
              <span className={`font-cormorant text-lg ${day === 8 ? "font-600 text-[#1a1a1a]" : "font-400 text-[#2c2416]"}`}>
                {day}
              </span>
            )}
            {day === 8 && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 40 40" fill="none">
                <path d="M20 6 C21 10, 28 13, 28 20 C28 27, 20 34, 20 34 C20 34, 12 27, 12 20 C12 13, 19 10, 20 6Z"
                  stroke="#1a1a1a" strokeWidth="1.2" fill="none" opacity="0.55"/>
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Page({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center overflow-y-auto transition-all duration-700 ease-in-out ${visible ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-6 pointer-events-none"}`}>
      {children}
    </div>
  );
}

export default function Index() {
  const [page, setPage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const totalPages = 5;

  useEffect(() => {
    const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/08/23/audio_d16737dc28.mp3?filename=relaxing-145038.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    return () => { audio.pause(); };
  }, []);

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setPlaying(true); }
  };

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden font-cormorant select-none"
      style={{ background: "linear-gradient(150deg,#f5f1e8 0%,#faf7f0 50%,#f7f2e6 100%)" }}
    >
      {/* Текстура бумаги */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "300px" }} />

      <LeafCorners />
      <GoldSpeckles />

      {/* Музыка */}
      <button onClick={toggleMusic}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 font-montserrat text-[9px] tracking-[0.28em] uppercase text-[#9e8e78] hover:text-[#c9a84c] transition-colors">
        <Icon name={playing ? "Volume2" : "VolumeX"} size={11} />
        музыка
      </button>

      {/* Точки навигации */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2 items-center">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button key={i} onClick={() => setPage(i)}
            className={`rounded-full transition-all duration-500 ${i === page ? "bg-[#c9a84c] w-5 h-1.5" : "bg-[#9e8e78] opacity-35 w-1.5 h-1.5"}`} />
        ))}
      </div>

      {/* Стрелки */}
      {page > 0 && (
        <button onClick={() => setPage(p => p - 1)} className="fixed left-3 top-1/2 -translate-y-1/2 z-50 text-[#9e8e78] hover:text-[#c9a84c] transition-colors">
          <Icon name="ChevronLeft" size={22} />
        </button>
      )}
      {page < totalPages - 1 && (
        <button onClick={() => setPage(p => p + 1)} className="fixed right-3 top-1/2 -translate-y-1/2 z-50 text-[#9e8e78] hover:text-[#c9a84c] transition-colors">
          <Icon name="ChevronRight" size={22} />
        </button>
      )}

      <div className="relative w-full h-screen">

        {/* ── ЛИСТ 1: Имена + фото + дата ── */}
        <Page visible={page === 0}>
          <div className={`flex flex-col items-center text-center px-6 py-14 w-full max-w-sm transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
            <h1 className="font-cormorant font-700 text-[clamp(3rem,15vw,5.5rem)] text-[#1a1a1a] leading-none tracking-wide uppercase">
              ИЛЬНАЗ
            </h1>
            <div className="font-cormorant font-300 text-[clamp(2rem,10vw,3.5rem)] text-[#1a1a1a] leading-none my-1">
              &amp; ЗӘЛИЯ
            </div>

            <div className="w-full mt-6 mb-6" style={{ maxWidth: "300px" }}>
              <div className="w-full overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <img src={PHOTO_1} alt="Ильназ и Зәлия" className="w-full h-full object-cover object-top" />
              </div>
            </div>

            <p className="font-cormorant font-400 text-[clamp(1.1rem,5vw,1.5rem)] text-[#1a1a1a] leading-snug">
              Никах-туена чакыру
            </p>
            <p className="font-cormorant font-400 text-[clamp(1.1rem,5vw,1.5rem)] text-[#1a1a1a] mt-1">
              08/08/2026
            </p>

            <button onClick={() => setPage(1)}
              className="mt-7 font-montserrat text-[9px] tracking-[0.3em] uppercase text-[#9e8e78] hover:text-[#c9a84c] transition-colors flex items-center gap-1">
              ачу <Icon name="ChevronDown" size={10} />
            </button>
          </div>
        </Page>

        {/* ── ЛИСТ 2: Приглашение + Календарь ── */}
        <Page visible={page === 1}>
          <div className="flex flex-col items-center text-center px-7 py-14 w-full max-w-sm">
            <h2 className="font-cormorant font-500 text-[clamp(2rem,9vw,3rem)] text-[#1a1a1a] mb-7 leading-tight">
              Кадерле Кунаклар!
            </h2>

            <p className="font-montserrat font-600 text-[10.5px] tracking-[0.14em] uppercase text-[#2c2416] leading-[1.9] mb-4 max-w-[260px]">
              БЕЗНЕҢ ЙӨРӘКЛӘР ҺӘМ ЯЗМЫШЛАР<br/>
              КУШЫЛАЧАК КӨН ЯКЫНЛАША.<br/>
              СЕЗНЕ БУ БӘХЕТЕБЕЗ БЕЛӘН<br/>
              УРТАКЛАШЫРГА ҺӘМ ТУАЧАК ГАИЛӘБЕЗНЕҢ<br/>
              ШАҺИТЫ БУЛЫРГА ЧАКЫРАБЫЗ
            </p>

            <p className="font-montserrat font-700 text-[10.5px] tracking-[0.2em] uppercase text-[#2c2416] mb-8">
              КӨТЕП КАЛАБЫЗ!
            </p>

            <div className="w-full border-t border-[#c9a84c] border-opacity-25 pt-7">
              <div className="font-cormorant font-400 text-[clamp(1.8rem,8vw,2.6rem)] text-[#1a1a1a] mb-5">
                Август 2026
              </div>
              <CalendarTT />
            </div>
          </div>
        </Page>

        {/* ── ЛИСТ 3: Адрес ── */}
        <Page visible={page === 2}>
          <div className="flex flex-col items-center text-center px-7 py-14 w-full max-w-sm">
            <h2 className="font-cormorant font-500 text-[clamp(2.5rem,12vw,4rem)] text-[#1a1a1a] tracking-widest uppercase mb-5">
              АДРЕС
            </h2>

            <Icon name="MapPin" size={30} className="text-[#1a1a1a] mb-5" />

            {/* Карта Яндекс — статичная */}
            <div className="w-full mb-7 overflow-hidden border border-[#e8e0d0]" style={{ maxWidth: "310px" }}>
              <iframe
                title="Карта"
                src="https://yandex.ru/map-widget/v1/?ll=49.88%2C56.05&z=16&pt=49.88%2C56.05%2Cpm2rdm&l=map"
                width="100%"
                height="200"
                style={{ border: "none", display: "block" }}
                allowFullScreen
              />
            </div>

            <div className="font-cormorant font-400 text-[clamp(1.25rem,5.5vw,1.8rem)] text-[#1a1a1a] leading-snug mb-2">
              Арча, Вагизовлар ур., 3И,<br/>
              «ТЫЛСЫМ»
            </div>
            <p className="font-montserrat font-400 text-[11px] tracking-[0.18em] uppercase text-[#2c2416]">
              БАНКЕТЛАР ЗАЛЫ
            </p>

            <a href="https://yandex.ru/maps/?text=Арча+улица+Вагизовых+3И" target="_blank" rel="noopener noreferrer"
              className="mt-6 font-montserrat text-[9px] tracking-[0.25em] uppercase text-[#9e8e78] hover:text-[#c9a84c] transition-colors border-b border-current pb-0.5">
              Картада карарга
            </a>
          </div>
        </Page>

        {/* ── ЛИСТ 4: Тайминг ── */}
        <Page visible={page === 3}>
          <div className="flex flex-col items-center text-center px-7 py-14 w-full max-w-sm">
            <h2 className="font-cormorant font-400 text-[clamp(2.5rem,12vw,4rem)] text-[#1a1a1a] tracking-widest lowercase mb-5">
              тайминг
            </h2>

            <p className="font-cormorant font-400 text-[clamp(1.4rem,6vw,2rem)] text-[#1a1a1a] mb-7">
              Башлану вакыты — 13:30
            </p>

            {/* Веточка */}
            <div className="mb-8">
              <svg viewBox="0 0 140 55" className="w-32 h-14 mx-auto" fill="none">
                <line x1="70" y1="28" x2="5" y2="28" stroke="#7a9a6a" strokeWidth="1.5" opacity="0.6"/>
                <line x1="70" y1="28" x2="135" y2="28" stroke="#7a9a6a" strokeWidth="1.5" opacity="0.6"/>
                {[15,32,52,88,108,125].map((x, i) => (
                  <ellipse key={i} cx={x} cy={28} rx="10" ry="5" fill="#7a9a6a" opacity="0.55"
                    transform={`rotate(${i < 3 ? -28 + i*7 : 28 - (i-3)*7} ${x} 28)`} />
                ))}
              </svg>
            </div>

            <p className="font-cormorant font-400 text-[clamp(1rem,4.5vw,1.35rem)] text-[#1a1a1a] leading-relaxed max-w-[270px]">
              Балаларыгызны өйдә калдырырга мөмкинлегегез булса, шул мөмкинлекне кулыгыздан ычкындырмагыз! Безнең бәйрәм рухына чумып, рәхәтләнеп ял итә алырсыз дип өметләнеп калабыз.
            </p>
          </div>
        </Page>

        {/* ── ЛИСТ 5: Финал ── */}
        <Page visible={page === 4}>
          <div className="flex flex-col items-center text-center px-6 py-14 w-full max-w-sm">
            <div className="w-full mb-7" style={{ maxWidth: "310px" }}>
              <div className="w-full overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <img src={PHOTO_5} alt="Ильназ и Зәлия" className="w-full h-full object-cover object-top" />
              </div>
            </div>

            <p className="font-montserrat font-400 text-[10px] tracking-[0.22em] uppercase text-[#2c2416] mb-2">
              ИХТИРАМ БЕЛӘН СЕЗНЕ КӨТЕП,
            </p>

            <h2 className="font-cormorant font-700 text-[clamp(2.2rem,10vw,3.5rem)] text-[#1a1a1a] tracking-wide uppercase leading-none">
              ИЛЬНАЗ &amp; ЗӘЛИЯ
            </h2>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px w-10 bg-[#c9a84c] opacity-40" />
              <span className="text-[#c9a84c]">✦</span>
              <div className="h-px w-10 bg-[#c9a84c] opacity-40" />
            </div>
            <p className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-[#9e8e78] mt-2">
              08 · 08 · 2026
            </p>
          </div>
        </Page>

      </div>
    </div>
  );
}