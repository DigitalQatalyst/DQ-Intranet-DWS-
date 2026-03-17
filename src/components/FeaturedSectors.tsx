import type { FC, ReactNode, SVGProps } from "react";

type SectorId = "finance" | "hra" | "inteldev" | "prodev" | "soldev";

export type Sector = {
  id: SectorId;
  label: string;
  description: string;
  href: string;
  icon: FC<SVGProps<SVGSVGElement>>;
};

const Hex: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="relative mx-auto h-20 w-20 md:h-24 md:w-24">
    <div className="absolute inset-0 [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)] bg-[linear-gradient(90deg,#FB5535_0%,#1A2E6E_100%)]" />
    <div className="absolute inset-[3px] flex items-center justify-center drop-shadow-sm [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)] bg-dqNavy">
      {children}
    </div>
  </div>
);

const iconBaseProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const FinanceIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path {...iconBaseProps} d="M4 16.5l5.25-5.25 3.5 3.5L20 7.5" />
    <path {...iconBaseProps} d="M15.5 7.5H20V12" />
  </svg>
);

const PeopleIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path {...iconBaseProps} d="M8.5 11.5a3 3 0 1 0 0-5.999 3 3 0 0 0 0 5.999z" />
    <path {...iconBaseProps} d="M15.75 10.25a2.5 2.5 0 1 0 0-5.001 2.5 2.5 0 0 0 0 5.001z" />
    <path
      {...iconBaseProps}
      d="M4.75 19.25v-.75a4 4 0 0 1 4-4h1.5a4 4 0 0 1 4 4v.75"
    />
    <path
      {...iconBaseProps}
      d="M13.5 15.25a3.25 3.25 0 0 1 3.25 3.25v.75"
    />
  </svg>
);

const BrainChipIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      {...iconBaseProps}
      d="M12 5.25c-1.2-1.6-4-.8-4 1.5v.75h-.5c-1.2 0-1.75.85-1.75 1.9 0 .75.35 1.35.95 1.6-.6.25-.95.85-.95 1.6 0 1.05.55 1.9 1.75 1.9H8v.75c0 2.3 2.8 3.1 4 1.5"
    />
    <path
      {...iconBaseProps}
      d="M12 5.25c1.2-1.6 4-.8 4 1.5v.75h.5c1.2 0 1.75.85 1.75 1.9 0 .75-.35 1.35-.95 1.6.6.25.95.85.95 1.6 0 1.05-.55 1.9-1.75 1.9H16v.75c0 2.3-2.8 3.1-4 1.5"
    />
    <rect
      {...iconBaseProps}
      x={9.5}
      y={9.5}
      width={5}
      height={5}
      rx={1}
    />
    <path {...iconBaseProps} d="M12 9.5V7.75M12 16.25V14.5M9.5 12H7.75M16.25 12H14.5" />
  </svg>
);

const CubeIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path {...iconBaseProps} d="M12 3.75l7.25 4.25v8L12 20.25l-7.25-4.25v-8L12 3.75z" />
    <path {...iconBaseProps} d="M12 20.25v-8" />
    <path {...iconBaseProps} d="M19.25 8l-7.25 4.25L4.75 8" />
  </svg>
);

const StackIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path {...iconBaseProps} d="M4.75 8.5L12 4.75l7.25 3.75L12 12.25 4.75 8.5z" />
    <path {...iconBaseProps} d="M4.75 12.5L12 8.75l7.25 3.75L12 16.25 4.75 12.5z" />
    <path {...iconBaseProps} d="M4.75 16.5L12 12.75l7.25 3.75L12 20.25 4.75 16.5z" />
  </svg>
);

export const SECTORS: Sector[] = [
  {
    id: "finance",
    label: "Finance",
    description: "Smart budgeting, approvals, and performance.",
    href: "/guidelines/finance",
    icon: FinanceIcon,
  },
  {
    id: "hra",
    label: "HRA",
    description: "Connecting people, culture, and performance.",
    href: "/guidelines/hra",
    icon: PeopleIcon,
  },
  {
    id: "inteldev",
    label: "IntelDev",
    description: "Data-driven insights for digital growth.",
    href: "/guidelines/inteldev",
    icon: BrainChipIcon,
  },
  {
    id: "prodev",
    label: "ProDev",
    description: "Professional learning and capability building.",
    href: "/guidelines/prodev",
    icon: CubeIcon,
  },
  {
    id: "soldev",
    label: "SolDev",
    description: "Developing solutions that scale.",
    href: "/guidelines/soldev",
    icon: StackIcon,
  },
];

type FeaturedSectorsProps = {
  sectors?: Sector[];
};

const getTooltipId = (id: SectorId) => `featured-sector-${id}-tooltip`;

const Tile: FC<{ sector: Sector }> = ({ sector }) => {
  const { icon: Icon } = sector;

  return (
    <a
      href={sector.href}
      aria-label={`Explore ${sector.label} sector`}
      aria-describedby={getTooltipId(sector.id)}
      className="group relative flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm transition-all duration-300 transform-gpu focus:outline-none focus-visible:ring-2 focus-visible:ring-dqBlue focus-visible:ring-offset-2 focus-visible:ring-offset-dqWhite md:p-5 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 hover:shadow-lg after:absolute after:inset-0 after:-z-10 after:rounded-2xl after:opacity-0 after:transition after:duration-300 after:content-[''] after:bg-[radial-gradient(circle,rgba(251,85,53,0.32)_0%,rgba(26,46,110,0.15)_45%,transparent_75%)] group-hover:after:opacity-100 group-focus-within:after:opacity-100"
      role="button"
    >
      <div className="relative z-10 flex w-full flex-col items-center">
        <Hex>
          <Icon className="h-8 w-8 text-white md:h-10 md:w-10" />
        </Hex>
        <div className="mt-4 text-center">
          <div className="text-sm font-medium text-dqNavy md:text-base">
            {sector.label}
          </div>
          <div className="mt-1 hidden text-xs text-gray-500 md:block">
            {sector.description}
          </div>
        </div>
      </div>
      <div
        id={getTooltipId(sector.id)}
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-10 w-48 -translate-x-1/2 translate-y-2 rounded-xl border border-white/40 bg-dqNavy/95 px-3 py-2 text-center text-xs text-dqWhite shadow-lg opacity-0 transition-all duration-300 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-4 md:group-hover:opacity-100 md:group-focus-within:translate-y-4 md:group-focus-within:opacity-100"
      >
        {sector.description}
      </div>
    </a>
  );
};

const SectorGrid: FC<{ sectors: Sector[] }> = ({ sectors }) => (
  <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:gap-8 lg:grid-cols-5">
    {sectors.map((sector) => (
      <Tile key={sector.id} sector={sector} />
    ))}
  </div>
);

const FeaturedSectors: FC<FeaturedSectorsProps> = ({ sectors = SECTORS }) => {
  return (
    <section
      aria-labelledby="featured-sectors"
      className="bg-white py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="featured-sectors"
          className="text-center text-2xl font-bold text-dqNavy md:text-3xl"
        >
          Featured Sectors
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-600 md:text-base">
          Trusted core factories and streams across DQ
        </p>
        <SectorGrid sectors={sectors} />
      </div>
    </section>
  );
};

export default FeaturedSectors;
