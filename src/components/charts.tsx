"use client";

/**
 * Lightweight dependency-free SVG charts for dashboard overviews.
 * Colours match the shared status palette so charts and badges read as one system.
 */

import { useId } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface Datum {
  label: string;
  value: number;
  color?: string;
}

export function DonutChart({
  data,
  centerLabel,
  centerValue,
  className,
}: {
  data: Datum[];
  centerLabel?: string;
  centerValue?: string | number;
  className?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className={cn("flex flex-col items-center gap-6 sm:flex-row", className)}>
      <div className="relative size-44 shrink-0">
        <svg viewBox="0 0 140 140" className="size-full -rotate-90" role="img" aria-label="Distribution chart">
          <circle cx="70" cy="70" r={r} fill="none" stroke="var(--border)" strokeWidth="18" />
          {total > 0 &&
            data.map((d) => {
              if (d.value === 0) return null;
              const len = (d.value / total) * c;
              const el = (
                <circle
                  key={d.label}
                  cx="70"
                  cy="70"
                  r={r}
                  fill="none"
                  stroke={d.color ?? "var(--foreground)"}
                  strokeWidth="18"
                  strokeDasharray={`${Math.max(len - 2, 0)} ${c - Math.max(len - 2, 0)}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += len;
              return el;
            })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-display text-3xl font-extrabold text-foreground">{centerValue ?? total}</p>
            {centerLabel && <p className="text-xs font-medium text-muted-foreground">{centerLabel}</p>}
          </div>
        </div>
      </div>
      <ul className="w-full space-y-2.5 text-sm">
        {data.map((d) => (
          <li key={d.label} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-foreground/75">
              <span className="size-3 rounded-full" style={{ background: d.color }} />
              {d.label}
            </span>
            <span className="font-bold text-foreground">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BarChart({
  data,
  valuePrefix = "",
  className,
}: {
  data: Datum[];
  valuePrefix?: string;
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const W = 520;
  const H = 220;
  const pad = { t: 16, r: 8, b: 44, l: 8 };
  const bw = (W - pad.l - pad.r) / data.length;
  const gid = useId();

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("w-full", className)} role="img" aria-label="Bar chart">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ee5c14" />
          <stop offset="1" stopColor="#d9480f" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line
          key={g}
          x1={pad.l}
          x2={W - pad.r}
          y1={pad.t + (H - pad.t - pad.b) * (1 - g)}
          y2={pad.t + (H - pad.t - pad.b) * (1 - g)}
          stroke="var(--border)"
          strokeDasharray="3 4"
        />
      ))}
      {data.map((d, i) => {
        const h = ((H - pad.t - pad.b) * d.value) / max;
        const x = pad.l + i * bw + bw * 0.18;
        const w = bw * 0.64;
        const y = H - pad.b - h;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={w} height={Math.max(h, 2)} rx="8" fill={d.color ?? `url(#${gid})`} style={{ transformBox: "fill-box", transformOrigin: "bottom", animation: `fm-bar-up .7s ${i * 70}ms cubic-bezier(.22,1,.36,1) both` }}>
              <title>{`${d.label}: ${valuePrefix}${d.value}`}</title>
            </rect>
            <text x={x + w / 2} y={y - 6} textAnchor="middle" className="fill-ink-700 text-[11px] font-bold">
              {valuePrefix}
              {d.value}
            </text>
            <text x={x + w / 2} y={H - pad.b + 20} textAnchor="middle" className="fill-ink-500 text-[11px] font-medium">
              {d.label.length > 11 ? `${d.label.slice(0, 10)}…` : d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function AreaChart({
  data,
  valuePrefix = "",
  className,
}: {
  data: Datum[];
  valuePrefix?: string;
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const W = 520;
  const H = 220;
  const pad = { t: 24, r: 16, b: 36, l: 16 };
  const gid = useId();
  const step = data.length > 1 ? (W - pad.l - pad.r) / (data.length - 1) : 0;
  const pts = data.map((d, i) => ({
    x: pad.l + i * step,
    y: pad.t + (H - pad.t - pad.b) * (1 - d.value / max),
    d,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1]?.x ?? 0} ${H - pad.b} L${pts[0]?.x ?? 0} ${H - pad.b} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("w-full", className)} role="img" aria-label="Trend chart">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ee5c14" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ee5c14" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line
          key={g}
          x1={pad.l}
          x2={W - pad.r}
          y1={pad.t + (H - pad.t - pad.b) * (1 - g)}
          y2={pad.t + (H - pad.t - pad.b) * (1 - g)}
          stroke="var(--border)"
          strokeDasharray="3 4"
        />
      ))}
      <path d={area} fill={`url(#${gid})`} style={{ animation: "fm-fade-in 1s .3s ease-out both" }} />
      <path d={line} fill="none" stroke="#d9480f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={1} style={{ strokeDasharray: 1, animation: "fm-draw-1 1.1s ease-out both" }} />
      {pts.map((p) => (
        <g key={p.d.label}>
          <circle cx={p.x} cy={p.y} r="5" fill="var(--card)" stroke="#d9480f" strokeWidth="3">
            <title>{`${p.d.label}: ${valuePrefix}${p.d.value}`}</title>
          </circle>
          <text x={p.x} y={H - pad.b + 20} textAnchor="middle" className="fill-ink-500 text-[11px] font-medium">
            {p.d.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("gap-0 p-5 transition-shadow duration-300 hover:shadow-lift sm:p-6", className)}>
      <h2 className="text-lg font-extrabold text-foreground">{title}</h2>
      {subtitle && <p className="mt-0.5 mb-4 text-sm text-muted-foreground">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {children}
    </Card>
  );
}
