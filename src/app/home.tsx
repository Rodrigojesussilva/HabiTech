// src/app/home.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Fingerprint, Stamp, House, Building } from "lucide-react";

type ShortcutItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  to?: string;
};

const FAVORITES_KEY = "dashboard_favorites";

const shortcutItems: ShortcutItem[] = [
  { id: "nova-selagem", title: "Nova Selagem", subtitle: "", icon: <Stamp className="h-6 w-6" />, to: "/create-selagem" },
  { id: "listar-selagens", title: "Selagens", subtitle: "", icon: <Fingerprint className="h-6 w-6" />, to: "/lista-selagens" },
  { id: "residencial", title: "Residencial", subtitle: "", icon: <House className="h-6 w-6" />, to: "/domicilios" },
  { id: "ocupacao-predial", title: "Ocupação Predial", subtitle: "", icon: <Building className="h-6 w-6" />, to: "/edificacoes" },
];

/** Helpers para evitar catch {} vazio e warnings do ESLint */
function safeLocalGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function safeLocalSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota excedida / private mode: ignorar de propósito
  }
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);
  const cardRefs = useRef<HTMLButtonElement[]>([]);

  useEffect(() => {
    setFavorites(safeLocalGet<string[]>(FAVORITES_KEY, []));
    const timer = setTimeout(() => setIsLoading(false), 400);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    safeLocalSet(FAVORITES_KEY, favorites);
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase();
    const base = shortcutItems.filter((item) => {
      if (!q) return true;
      const hay = `${item.title} ${item.subtitle || ""}`.toLowerCase();
      return hay.includes(q);
    });
    return base.sort((a, b) => {
      const af = favorites.includes(a.id) ? 0 : 1;
      const bf = favorites.includes(b.id) ? 0 : 1;
      if (af !== bf) return af - bf;
      return a.title.localeCompare(b.title, "pt-BR");
    });
  }, [query, favorites]);

  const focusCardAt = (index: number) => {
    const btn = cardRefs.current[index];
    if (btn) btn.focus();
  };

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        focusCardAt(Math.min(index + 1, filteredItems.length - 1));
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        focusCardAt(Math.max(index - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        focusCardAt(0);
        break;
      case "End":
        e.preventDefault();
        focusCardAt(filteredItems.length - 1);
        break;
    }
  };

  return (
    <div className="px-3 sm:px-4">
      {/* Cabeçalho da Home */}
      <section className="mx-auto max-w-[1200px] text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
          Bem-vindo ao sistema de Instrumentos de Pesquisa
        </h1>
        <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
          Acompanhe e gerencie formulários para ajudar a melhorar as condições em moradias precárias.
        </p>
        <p className="text-gray-600">Inicie um novo formulário ou revise os dados coletados.</p>
      </section>

      {/* SHORTCUTS */}
      <section className="p-6 md:p-8">
        <div className="mb-6 flex flex-col gap-2 items-center">
          <div className="relative w-full max-w-xl">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar atalhos (pressione / para focar)"
              aria-label="Buscar atalhos do painel"
              aria-controls="shortcuts-grid"
              className="w-full rounded-xl bg-white/90 border border-slate-300 placeholder:text-slate-400 shadow-sm
                         hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20
                         transition pl-3 pr-8 py-2.5"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">/</span>
          </div>
          <div className="text-xs text-slate-500" aria-live="polite">
            {query ? `Resultados: ${filteredItems.length}` : favorites.length ? `Favoritos: ${favorites.length}` : null}
          </div>
        </div>

        <div id="shortcuts-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mx-auto max-w-[1200px]">
          {isLoading &&
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={`s-${idx}`} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="mb-4 h-14 w-14 rounded-full bg-slate-100" />
                <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))}

          {!isLoading &&
            filteredItems.map((item, idx) => {
              const isFav = favorites.includes(item.id);

              const CardContent = (
                <>
                  <div className="mb-4 h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                    <span className="group-hover:text-white text-slate-700 transition-colors">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-slate-900 leading-tight">{item.title}</h3>
                    {item.subtitle && <p className="text-slate-600 leading-tight text-sm mt-0.5">{item.subtitle}</p>}
                  </div>
                </>
              );

              const CardBaseClasses =
                "bg-white rounded-xl border border-slate-200 p-6 w-full flex flex-col items-center text-center " +
                "hover:shadow-lg transition-all duration-200 group focus:outline-none " +
                "focus:ring-2 focus:ring-blue-600/30 hover:-translate-y-0.5";

              return (
                <div key={item.id} className="relative">
                  {item.to ? (
                    <Link to={item.to} className={CardBaseClasses} aria-label={`${item.title} ${item.subtitle || ""}`.trim()}>
                      {CardContent}
                    </Link>
                  ) : (
                    <button
                      ref={(el) => {
                        if (el) cardRefs.current[idx] = el;
                      }}
                      onKeyDown={(e) => handleCardKeyDown(e, idx)}
                      className={CardBaseClasses}
                      aria-label={`${item.title} ${item.subtitle || ""}`.trim()}
                    >
                      {CardContent}
                    </button>
                  )}

                  <button
                    type="button"
                    aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    aria-pressed={isFav}
                    title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    onClick={() => toggleFavorite(item.id)}
                    className={`absolute top-2 right-2 p-2 rounded-full border transition-all duration-200 ${
                      isFav ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={isFav ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9" />
                    </svg>
                  </button>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}
