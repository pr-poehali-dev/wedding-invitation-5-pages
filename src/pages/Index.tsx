import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const COUPLE_PHOTO = "https://cdn.poehali.dev/projects/26375c63-33ff-48de-ba54-0d84e6024561/files/66d70b0b-9b0a-4c87-afc8-a130688f84d0.jpg";

const MUSIC_URL = "https://cdn.pixabay.com/download/audio/2022/08/23/audio_d16737dc28.mp3?filename=relaxing-145038.mp3";

const MONTHS = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const DAYS_OF_WEEK = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

function CalendarBlock({ month, year, highlightDay }: { month: number; year: number; highlightDay: number }) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="text-center mb-4 font-cormorant text-2xl text-[var(--c-gold)] tracking-widest uppercase">
        {MONTHS[month]} {year}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className="text-center text-xs font-montserrat font-300 text-[var(--c-muted)] py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => (
          <div
            key={i}
            className={`
              aspect-square flex items-center justify-center text-sm font-montserrat
              ${day === null ? "" : ""}
              ${day === highlightDay
                ? "bg-[var(--c-gold)] text-[var(--c-cream)] rounded-full font-400"
                : "text-[var(--c-text)]"
              }
            `}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

function Leaf({ children, visible }: { children: React.ReactNode; visible: boolean }) {
  return (
    <div
      className={`
        absolute inset-0 flex flex-col items-center justify-center
        transition-all duration-1000 ease-in-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}
      `}
    >
      {children}
    </div>
  );
}

export default function Index() {
  const [page, setPage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const totalPages = 5;

  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const goNext = () => setPage(p => Math.min(p + 1, totalPages - 1));
  const goPrev = () => setPage(p => Math.max(p - 1, 0));

  return (
    <div className="relative w-full min-h-screen bg-[var(--c-cream)] overflow-hidden font-montserrat select-none">

      {/* Background texture */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f5ede0] via-[#faf6f0] to-[#fdf9f5] opacity-80" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px"
          }}
        />
      </div>

      {/* Decorative corner lines */}
      <div className="fixed top-6 left-6 w-16 h-16 border-l border-t border-[var(--c-gold)] opacity-50 z-10 pointer-events-none" />
      <div className="fixed top-6 right-6 w-16 h-16 border-r border-t border-[var(--c-gold)] opacity-50 z-10 pointer-events-none" />
      <div className="fixed bottom-6 left-6 w-16 h-16 border-l border-b border-[var(--c-gold)] opacity-50 z-10 pointer-events-none" />
      <div className="fixed bottom-6 right-6 w-16 h-16 border-r border-b border-[var(--c-gold)] opacity-50 z-10 pointer-events-none" />

      {/* Music button */}
      <button
        onClick={toggleMusic}
        className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 text-[10px] font-montserrat font-300 tracking-[0.2em] uppercase text-[var(--c-muted)] hover:text-[var(--c-gold)] transition-colors duration-300"
      >
        <Icon name={playing ? "Volume2" : "VolumeX"} size={12} />
        {playing ? "музыка" : "включить"}
      </button>

      {/* Page counter */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
              i === page ? "bg-[var(--c-gold)] w-5" : "bg-[var(--c-muted)] opacity-40"
            }`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      {page > 0 && (
        <button
          onClick={goPrev}
          className="fixed left-8 top-1/2 -translate-y-1/2 z-50 text-[var(--c-muted)] hover:text-[var(--c-gold)] transition-colors duration-300"
        >
          <Icon name="ChevronLeft" size={20} />
        </button>
      )}
      {page < totalPages - 1 && (
        <button
          onClick={goNext}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-50 text-[var(--c-muted)] hover:text-[var(--c-gold)] transition-colors duration-300"
        >
          <Icon name="ChevronRight" size={20} />
        </button>
      )}

      {/* Pages */}
      <div className="relative w-full h-screen">

        {/* PAGE 1 — Hero */}
        <Leaf visible={page === 0}>
          <div
            className={`flex flex-col items-center text-center px-8 transition-all duration-1200 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            {/* Photo */}
            <div className="relative mb-10">
              <div className="w-56 h-72 md:w-72 md:h-96 overflow-hidden" style={{ clipPath: "polygon(50% 0%, 100% 12%, 100% 88%, 50% 100%, 0 88%, 0 12%)" }}>
                <img
                  src={COUPLE_PHOTO}
                  alt="Жених и невеста"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -inset-3 border border-[var(--c-gold)] opacity-30" style={{ clipPath: "polygon(50% 0%, 100% 12%, 100% 88%, 50% 100%, 0 88%, 0 12%)" }} />
            </div>

            {/* Ornament */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-[var(--c-gold)] opacity-60" />
              <span className="text-[var(--c-gold)] text-lg">✦</span>
              <div className="h-px w-12 bg-[var(--c-gold)] opacity-60" />
            </div>

            <h1 className="font-cormorant font-300 text-5xl md:text-7xl text-[var(--c-text)] tracking-wide leading-tight mb-2">
              Анна
            </h1>
            <div className="font-cormorant italic text-xl text-[var(--c-muted)] mb-2">&amp;</div>
            <h1 className="font-cormorant font-300 text-5xl md:text-7xl text-[var(--c-text)] tracking-wide leading-tight mb-8">
              Михаил
            </h1>

            <div className="font-montserrat font-200 text-xs tracking-[0.35em] uppercase text-[var(--c-gold)] mb-6">
              14 сентября 2026
            </div>

            <button
              onClick={goNext}
              className="mt-2 font-montserrat font-200 text-[10px] tracking-[0.3em] uppercase text-[var(--c-muted)] hover:text-[var(--c-gold)] transition-colors duration-300 flex items-center gap-2"
            >
              открыть приглашение
              <Icon name="ArrowDown" size={10} />
            </button>
          </div>
        </Leaf>

        {/* PAGE 2 — Calendar + Text */}
        <Leaf visible={page === 1}>
          <div className="flex flex-col items-center text-center px-8 max-w-lg w-full">
            <div className="font-montserrat font-200 text-[9px] tracking-[0.4em] uppercase text-[var(--c-gold)] mb-8">
              Приглашение
            </div>

            <p className="font-cormorant font-300 text-xl md:text-2xl text-[var(--c-text)] leading-relaxed mb-3 italic">
              «Любовь долготерпит, милосердствует,<br/>любовь не завидует»
            </p>
            <p className="font-montserrat font-200 text-[10px] tracking-[0.2em] text-[var(--c-muted)] mb-10">
              1 Коринфянам 13:4
            </p>

            <p className="font-montserrat font-300 text-sm text-[var(--c-text)] leading-loose mb-10 max-w-sm">
              Дорогие друзья и близкие,<br/>
              мы с радостью приглашаем вас<br/>
              разделить с нами самый счастливый день —<br/>
              день нашего бракосочетания.
            </p>

            <div className="w-full border-t border-[var(--c-gold)] border-opacity-20 pt-8">
              <CalendarBlock month={8} year={2026} highlightDay={14} />
            </div>
          </div>
        </Leaf>

        {/* PAGE 3 — Location */}
        <Leaf visible={page === 2}>
          <div className="flex flex-col items-center text-center px-8 max-w-md w-full">
            <div className="font-montserrat font-200 text-[9px] tracking-[0.4em] uppercase text-[var(--c-gold)] mb-10">
              Место проведения
            </div>

            <div className="mb-8">
              <Icon name="MapPin" size={20} className="text-[var(--c-gold)] mx-auto mb-4" />
            </div>

            <h2 className="font-cormorant font-300 text-4xl md:text-5xl text-[var(--c-text)] tracking-wide mb-3">
              Усадьба «Берёзовая»
            </h2>
            <div className="h-px w-16 bg-[var(--c-gold)] opacity-40 mb-6" />

            <p className="font-montserrat font-200 text-xs tracking-[0.2em] uppercase text-[var(--c-muted)] leading-loose">
              Московская область<br/>
              Дмитровский район<br/>
              деревня Степаново, д. 15
            </p>

            <div className="mt-10 w-full rounded-none overflow-hidden border border-[var(--c-gold)] border-opacity-20" style={{ height: "180px" }}>
              <iframe
                title="Карта"
                src="https://yandex.ru/map-widget/v1/?ll=37.522&z=13&pt=37.522,56.352"
                width="100%"
                height="180"
                style={{ border: "none" }}
              />
            </div>

            <p className="font-montserrat font-200 text-[10px] tracking-[0.15em] text-[var(--c-muted)] mt-6">
              40 минут от Москвы · бесплатная парковка
            </p>
          </div>
        </Leaf>

        {/* PAGE 4 — Timeline */}
        <Leaf visible={page === 3}>
          <div className="flex flex-col items-center text-center px-8 max-w-sm w-full">
            <div className="font-montserrat font-200 text-[9px] tracking-[0.4em] uppercase text-[var(--c-gold)] mb-10">
              Расписание дня
            </div>

            <h2 className="font-cormorant font-300 text-3xl text-[var(--c-text)] mb-8">14 сентября</h2>

            <div className="w-full space-y-0 relative">
              <div className="absolute left-[60px] top-3 bottom-3 w-px bg-[var(--c-gold)] opacity-20" />

              {[
                { time: "12:00", event: "Сбор гостей", sub: "банкетный зал" },
                { time: "13:00", event: "Выездная церемония", sub: "сад усадьбы" },
                { time: "14:00", event: "Праздничный обед", sub: "основной зал" },
                { time: "17:00", event: "Торжественная часть", sub: "конкурсы и тосты" },
                { time: "19:00", event: "Танцы", sub: "живая музыка" },
                { time: "23:00", event: "Фейерверк", sub: "финальный аккорд" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-6 py-3 relative">
                  <div className="w-[60px] text-right font-montserrat font-200 text-xs tracking-wider text-[var(--c-gold)] shrink-0 pt-0.5">
                    {item.time}
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--c-gold)] opacity-60 shrink-0 mt-1.5 relative z-10" />
                  <div className="text-left">
                    <div className="font-cormorant font-400 text-lg text-[var(--c-text)] leading-tight">{item.event}</div>
                    <div className="font-montserrat font-200 text-[10px] tracking-wider text-[var(--c-muted)] uppercase mt-0.5">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Leaf>

        {/* PAGE 5 — Finale */}
        <Leaf visible={page === 4}>
          <div className="flex flex-col items-center text-center px-8">
            {/* Photo */}
            <div className="relative mb-8">
              <div
                className="w-40 h-40 rounded-full overflow-hidden border-2 border-[var(--c-gold)] border-opacity-40"
              >
                <img
                  src={COUPLE_PHOTO}
                  alt="Жених и невеста"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -inset-2 rounded-full border border-[var(--c-gold)] opacity-20" />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-10 bg-[var(--c-gold)] opacity-40" />
              <span className="text-[var(--c-gold)] text-sm">✦</span>
              <div className="h-px w-10 bg-[var(--c-gold)] opacity-40" />
            </div>

            <h2 className="font-cormorant font-300 italic text-4xl md:text-5xl text-[var(--c-text)] mb-2">
              Анна &amp; Михаил
            </h2>
            <div className="font-montserrat font-200 text-[9px] tracking-[0.4em] uppercase text-[var(--c-gold)] mb-10">
              14 · 09 · 2026
            </div>

            <p className="font-cormorant font-300 italic text-lg text-[var(--c-muted)] max-w-xs leading-relaxed mb-10">
              Ваше присутствие — лучший подарок.<br/>
              Мы будем счастливы видеть вас.
            </p>

            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-[var(--c-gold)] opacity-30" />
              <span className="font-montserrat font-200 text-[9px] tracking-[0.3em] uppercase text-[var(--c-muted)]">
                с любовью
              </span>
              <div className="h-px w-8 bg-[var(--c-gold)] opacity-30" />
            </div>
          </div>
        </Leaf>

      </div>
    </div>
  );
}
