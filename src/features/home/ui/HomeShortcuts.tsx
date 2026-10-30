import { Link } from "react-router-dom";

const shortcuts = [
  { title: "Nova sessão", to: "/sessoes/nova", icon: "session" },
  { title: "Adicionar paciente", to: "/pacientes/novo", icon: "patient" },
  { title: "Criar relatório", to: "/relatorios/novo", icon: "report" },
  { title: "Ver sessões", to: "/sessoes", icon: "calendar" },
] as const;

const glyph = (name: (typeof shortcuts)[number]["icon"]) => {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true as const,
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "session") {
    return (
      <svg {...common}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }
  if (name === "patient") {
    return (
      <svg {...common}>
        <circle cx="9" cy="8" r="3" />
        <path d="M4 19c.6-3 2.6-4.5 5-4.5S13.4 16 14 19M17 11v5M14.5 13.5h5" />
      </svg>
    );
  }
  if (name === "calendar") {
    return (
      <svg {...common}>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3.5V7M16 3.5V7M4 10h16" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 3.5 13.8 8l4.7.4-3.6 3.1 1.1 4.6L12 13.8 7.9 16.1 9 11.5 5.5 8.4 10.2 8 12 3.5Z" />
    </svg>
  );
};

export const HomeShortcuts = () => (
  <nav aria-label="Atalhos">
    <ul className="flex flex-wrap gap-3">
      {shortcuts.map((item) => (
        <li key={item.to}>
          <Link
            to={item.to}
            className="flex size-28 flex-col items-start justify-between rounded-2xl border border-grey-2 bg-white p-2.5 text-left text-xs font-medium leading-normal text-ink transition-colors duration-150 hover:border-brand active:bg-surface"
          >
            <span className="text-brand">{glyph(item.icon)}</span>
            <span className="w-full text-balance">{item.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);
