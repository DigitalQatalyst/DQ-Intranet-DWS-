import React from 'react';
import type { Perspective } from '@/data/perspectives';

type IllustrationType = Perspective['illustration'];

type GeometricIllustrationProps = {
  type: IllustrationType;
  className?: string;
};

function IllustrationEconomy() {
  return (
    <g>
      <path
        d="M24 116 L74 84 L112 96 L158 56 L216 68"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {[
        { cx: 74, cy: 84 },
        { cx: 112, cy: 96 },
        { cx: 158, cy: 56 },
      ].map((p) => (
        <circle
          key={`${p.cx}-${p.cy}`}
          cx={p.cx}
          cy={p.cy}
          r="7"
          fill="currentColor"
          fillOpacity="0.14"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      ))}
    </g>
  );
}

function IllustrationCognitive() {
  return (
    <g>
      <path
        d="M60 60 L120 34 L180 60 L152 112 L88 112 Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.08"
      />
      {[
        { cx: 60, cy: 60 },
        { cx: 120, cy: 34 },
        { cx: 180, cy: 60 },
        { cx: 152, cy: 112 },
        { cx: 88, cy: 112 },
      ].map((p) => (
        <circle
          key={`${p.cx}-${p.cy}`}
          cx={p.cx}
          cy={p.cy}
          r="6"
          fill="currentColor"
          fillOpacity="0.12"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      ))}
      <path
        d="M40 124 C72 92, 96 92, 120 124"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M120 124 C144 92, 168 92, 200 124"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
  );
}

function IllustrationPlatforms() {
  return (
    <g>
      {[
        { x: 40, y: 44 },
        { x: 86, y: 62 },
        { x: 132, y: 44 },
        { x: 178, y: 62 },
      ].map((p) => (
        <rect
          key={`${p.x}-${p.y}`}
          x={p.x}
          y={p.y}
          width="44"
          height="44"
          rx="12"
          fill="currentColor"
          fillOpacity="0.06"
          stroke="currentColor"
          strokeOpacity="0.9"
          strokeWidth="2.5"
        />
      ))}
      <path
        d="M40 118 H222"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M62 118 V134 M200 118 V134"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
  );
}

function IllustrationTransformation() {
  return (
    <g>
      <path
        d="M54 108 C54 76, 86 50, 124 50 C162 50, 194 76, 194 108"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle
        cx="54"
        cy="108"
        r="7"
        fill="currentColor"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle
        cx="194"
        cy="108"
        r="7"
        fill="currentColor"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M194 108 C194 124, 182 136, 166 136 H130"
        stroke="currentColor"
        strokeOpacity="0.24"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M130 136 L142 126 M130 136 L142 146"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function IllustrationWorkspace() {
  return (
    <g>
      <rect
        x="44"
        y="40"
        width="160"
        height="86"
        rx="18"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path d="M60 64 H188" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60 88 H152" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2.5" strokeLinecap="round" />
      <circle
        cx="176"
        cy="94"
        r="10"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path d="M168 110 C172 104, 180 104, 184 110" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

function IllustrationAccelerators() {
  return (
    <g>
      <path
        d="M128 26 L78 92 H122 L108 134 L178 62 H134 Z"
        fill="currentColor"
        fillOpacity="0.10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M52 124 H88"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M172 124 H208"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
  );
}

export default function GeometricIllustration({ type, className }: GeometricIllustrationProps) {
  return (
    <svg viewBox="0 0 240 160" className={className ?? ''} aria-hidden="true">
      <g className="text-[hsl(var(--accent))]">
        {type === 'economy' ? <IllustrationEconomy /> : null}
        {type === 'cognitive' ? <IllustrationCognitive /> : null}
        {type === 'platforms' ? <IllustrationPlatforms /> : null}
        {type === 'transformation' ? <IllustrationTransformation /> : null}
        {type === 'workspace' ? <IllustrationWorkspace /> : null}
        {type === 'accelerators' ? <IllustrationAccelerators /> : null}
      </g>
    </svg>
  );
}
