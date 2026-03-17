import React, { useEffect, useState, useRef } from "react";
import { DiscoverSectionTitle } from "./DiscoverSectionTitle";
import { fetchDna, DqDnaNode, DqDnaCallout } from "../../services/dq";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { supabaseClient } from "../../lib/supabaseClient";
import { knowledgeHubSupabase } from '../../services/knowledgeHubClient'

/* ===== PIXEL-PERFECT CONSTANTS ===== */
const NAVY = "#162862"; // Exact navy from image
const STROKE_WIDTH = 2.5; // Match image border width

/* SVG ViewBox - exact match to reference image dimensions */
const VIEWBOX = "0 0 900 520";

/* Hexagon Geometry - adapted from Lovable positioning system */
const HEX_SIZE = 68; // Hexagon size (radius equivalent)
const CENTER_X = 450; // Center of 900px viewBox
const CENTER_Y = 260; // Adjusted for 520px height

/* Positioning offsets - tight honeycomb where hexagons touch/interlock */
// Inner hexagons (tight cluster with center - touching edges)
const INNER_OFFSET_X = 68; // Horizontal offset for bottom hexagons (touching center)
const INNER_OFFSET_Y = 118; // Vertical offset for bottom hexagons (touching center)

// Outer hexagons (touching inner hexagons)
const OUTER_OFFSET_X = 136; // Horizontal offset for side hexagons (2x inner, touching)
const OUTER_OFFSET_Y = 118; // Vertical offset for top hexagons (touching center)
const TOP_ROW_OFFSET_X = 68; // Horizontal offset for top row (touching center)

/* Hexagon Positions - using Lovable offset system for accuracy */
// Layout structure:
//          [6]        [5]
//     [7]      [1]      [4]
//          [2]        [3]
const HEX_POSITIONS = {
  center: { x: CENTER_X, y: CENTER_Y }, // [1] The Vision - anchor point
  leftTop: {
    x: CENTER_X - TOP_ROW_OFFSET_X,
    y: CENTER_Y - OUTER_OFFSET_Y,
  }, // [6] Agile Flows
  rightTop: {
    x: CENTER_X + TOP_ROW_OFFSET_X,
    y: CENTER_Y - OUTER_OFFSET_Y,
  }, // [5] Agile SOS
  leftMid: {
    x: CENTER_X - OUTER_OFFSET_X,
    y: CENTER_Y,
  }, // [7] Agile 6xD
  rightMid: {
    x: CENTER_X + OUTER_OFFSET_X,
    y: CENTER_Y,
  }, // [4] Agile TMS
  leftBot: {
    x: CENTER_X - INNER_OFFSET_X,
    y: CENTER_Y + INNER_OFFSET_Y,
  }, // [2] The HoV
  rightBot: {
    x: CENTER_X + INNER_OFFSET_X,
    y: CENTER_Y + INNER_OFFSET_Y,
  }, // [3] The Personas
} as const;

type Role = keyof typeof HEX_POSITIONS;

interface Node {
  id: number;
  role: Role;
  title: string;
  subtitle: string;
  fill: "navy" | "outline";
}

interface GrowthDimensionCTA {
  label: string;
  href: string;
}

interface GrowthDimensionContent {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: GrowthDimensionCTA;
  secondaryCTA: GrowthDimensionCTA;
}

const GROWTH_DIMENSIONS_CONTENT: Record<number, GrowthDimensionContent> = {
  1: {
    id: 1,
    title: "The DQ Vision",
    subtitle: "Purpose | Why we exist",
    description: "The DQ Vision defines why DigitalQatalyst exists. It is rooted in the belief that life improves when everyday transactions between people and systems are clear, connected, and intelligently designed. Through Digital Business Platforms, DQ enables organisations to evolve into Digital Cognitive Organisations (DCOs) — capable of learning, adapting, and delivering value at scale. Our aspiration is clear: to perfect life's transactions.",
    primaryCTA: {
      label: "Read the full Vision story",
      href: "https://digital-qatalyst.shorthandstories.com/5d87ac25-6eb5-439e-a861-845787aa8e59/index.html",
    },
    secondaryCTA: {
      label: "Explore Vision in Knowledge Center",
      href: "/knowledge-center/vision",
    },
  },
  2: {
    id: 2,
    title: "The HoV",
    subtitle: "Culture | How we behave",
    description: "The House of Values (HoV) is DQ's cultural operating system. Built on three mantras — Self-Development, Lean Working, and Value Co-Creation — it defines how Qatalysts think, behave, collaborate, and build trust. Culture at DQ is not assumed; it is deliberately engineered.",
    primaryCTA: {
      label: "Explore the House of Values",
      href: "https://digital-qatalyst.shorthandstories.com/ad30db59-9684-4331-921d-2e564f9dfe58/index.html",
    },
    secondaryCTA: {
      label: "Explore Culture in Knowledge Center",
      href: "/knowledge-center/culture",
    },
  },
  3: {
    id: 3,
    title: "The Personas",
    subtitle: "Identity | Who we are",
    description: "The DQ Personas define the human traits and mindsets required to succeed in transformation. They apply across associates, customers, partners, and investors — aligning behaviour, responsibility, and purpose across the ecosystem.",
    primaryCTA: {
      label: "Discover the DQ Personas",
      href: "https://digital-qatalyst.shorthandstories.com/30d7e598-4e7c-4492-b070-8001649b4ee4/index.html",
    },
    secondaryCTA: {
      label: "Explore Personas in Knowledge Center",
      href: "/knowledge-center/personas",
    },
  },
  4: {
    id: 4,
    title: "Agile TMS",
    subtitle: "Tasks | How we work",
    description: "Agile TMS is DQ's execution engine. Guided by the 7S Tenets, it structures work into clear, purposeful tasks aligned to value. It ensures speed without chaos and discipline without rigidity.",
    primaryCTA: {
      label: "Learn how Agile TMS works",
      href: "https://digital-qatalyst.shorthandstories.com/cde3e47f-33f6-47c6-8633-3825276d17dd/index.html",
    },
    secondaryCTA: {
      label: "Explore TMS in Knowledge Center",
      href: "/knowledge-center/tms",
    },
  },
  5: {
    id: 5,
    title: "Agile SoS",
    subtitle: "Governance | How we govern",
    description: "Agile SoS reframes governance as an enabler of agility. Through interconnected systems of Governance, Quality, Value, and Discipline, it ensures alignment, scale, and execution coherence.",
    primaryCTA: {
      label: "Explore Agile System of Systems",
      href: "https://digital-qatalyst.shorthandstories.com/1201a61d-9475-48a1-a228-5342a75e094c/index.html",
    },
    secondaryCTA: {
      label: "Explore Governance in Knowledge Center",
      href: "/knowledge-center/governance",
    },
  },
  6: {
    id: 6,
    title: "Agile Flows",
    subtitle: "Value Streams | How we orchestrate",
    description: "Agile Flows define how value moves through DQ — from insight to impact. It replaces fragmented delivery with connected value streams that ensure every handoff is intentional and every outcome traceable.",
    primaryCTA: {
      label: "View Agile Flows in action",
      href: "https://digital-qatalyst.shorthandstories.com/2e4a63e1-49da-48d1-a292-0e7f77c8636e/index.html",
    },
    secondaryCTA: {
      label: "Explore Value Streams in Knowledge Center",
      href: "/knowledge-center/value-streams",
    },
  },
  7: {
    id: 7,
    title: "Agile DTMF",
    subtitle: "Products | What we offer",
    description: "Agile DTMF represents DQ's productised blueprints — modular thinking systems that make transformation repeatable, scalable, and easier to adopt.",
    primaryCTA: {
      label: "Explore DTMF blueprints",
      href: "#",
    },
    secondaryCTA: {
      label: "Explore Products in Knowledge Center",
      href: "/products",
    },
  },
};

/* ===== Data ===== */
const NODES: Node[] = [
  { id: 6, role: "leftTop", title: "Agile Flows", subtitle: "(Value Streams)", fill: "outline" },
  { id: 5, role: "rightTop", title: "Agile SOS", subtitle: "(Governance)", fill: "outline" },
  { id: 7, role: "leftMid", title: "Agile DTMF", subtitle: "(Products)", fill: "outline" },
  { id: 1, role: "center", title: "The Vision", subtitle: "(Purpose)", fill: "navy" },
  { id: 4, role: "rightMid", title: "Agile TMS", subtitle: "(Tasks)", fill: "outline" },
  { id: 2, role: "leftBot", title: "The HoV", subtitle: "(Culture)", fill: "navy" },
  { id: 3, role: "rightBot", title: "The Personas", subtitle: "(Identity)", fill: "navy" },
];

const CALLOUTS: { role: Role; text: string; side: "left" | "right" | "bottom" }[] = [
  { role: "leftTop", text: "How we orchestrate", side: "left" },
  { role: "rightTop", text: "How we govern", side: "right" },
  { role: "leftMid", text: "What we offer", side: "left" },
  { role: "rightMid", text: "How we work", side: "right" },
  { role: "leftBot", text: "How we behave", side: "left" },
  { role: "rightBot", text: "Who we are", side: "right" },
];

/* Generate flat-top hexagon path - matching reference image */
function hexPath(cx: number, cy: number, size: number): string {
  const points: string[] = [];
  // Start at top flat edge (angle = -π/6), then rotate 60° for each point
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(" ");
}

/* Calculate connector paths - lines start from hex edges, matching reference */
function getConnectorPath(role: Role, side: "left" | "right" | "bottom") {
  const pos = HEX_POSITIONS[role];
  const connectorLength = 110;
  
  // For flat-top hexagons, the horizontal distance from center to edge is HEX_SIZE
  // The vertical distance from center to top/bottom edge is HEX_SIZE * √3 / 2 ≈ HEX_SIZE * 0.866
  
  if (side === "left") {
    // Line extends horizontally left from left edge of hexagon
    const startX = pos.x - HEX_SIZE;
    const startY = pos.y;
    const endX = startX - connectorLength;
    const endY = startY;
    return {
      path: `M ${startX} ${startY} L ${endX} ${endY}`,
      dotX: endX,
      dotY: endY,
      textX: endX - 8,
      textY: endY - 6, // Above the line
      anchor: "end" as const,
    };
  } else if (side === "right") {
    // Line extends horizontally right from right edge of hexagon
    const startX = pos.x + HEX_SIZE;
    const startY = pos.y;
    const endX = startX + connectorLength;
    const endY = startY;
    return {
      path: `M ${startX} ${startY} L ${endX} ${endY}`,
      dotX: endX,
      dotY: endY,
      textX: endX + 8,
      textY: endY - 6, // Above the line
      anchor: "start" as const,
    };
  } else {
    // bottom - not used directly, handled separately
    return {
      path: "",
      dotX: 0,
      dotY: 0,
      textX: 0,
      textY: 0,
      anchor: "middle" as const,
    };
  }
}

interface Discover_DNASectionProps {
  onExploreKnowledgeCenter?: () => void;
}

interface DimensionModalProps {
  dimension: GrowthDimensionContent | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

function DimensionModal({ dimension, isOpen, onClose, onNavigate }: DimensionModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    lastFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    document.body.classList.add("overflow-hidden");
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("overflow-hidden");
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      lastFocusedRef.current?.focus();
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handlePrimaryCTA = (href: string) => {
    if (href.startsWith("http") || href.startsWith("https")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      onNavigate(href);
    }
    onClose();
  };

  const handleSecondaryCTA = (href: string) => {
    onNavigate(href);
    onClose();
  };

  if (!isOpen || !dimension) return null;

  const prefersReducedMotion = typeof window !== "undefined" 
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches 
    : false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 sm:px-6"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dimension-modal-title"
      aria-describedby="dimension-modal-description"
      style={{
        animation: prefersReducedMotion ? "none" : "fadeIn 0.2s ease-out",
      }}
    >
      <div 
        className="absolute inset-0" 
        aria-hidden="true"
        style={{
          backgroundColor: "rgba(22, 40, 98, 0.45)",
          backdropFilter: "blur(4px)",
          animation: prefersReducedMotion ? "none" : "fadeIn 0.2s ease-out",
        }}
      />
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-[720px] overflow-hidden bg-white focus:outline-none"
        style={{
          maxHeight: "72vh",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(16, 24, 64, 0.18)",
          animation: prefersReducedMotion 
            ? "none" 
            : "modalEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex max-h-[72vh] flex-col">
          {/* Header */}
          <div 
            className="flex items-start justify-between flex-shrink-0"
            style={{
              padding: "20px",
              borderBottom: "1px solid rgba(22, 40, 98, 0.08)",
            }}
          >
            <div className="flex-1 pr-4">
              <h2 
                id="dimension-modal-title" 
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#162862",
                  margin: 0,
                  marginBottom: "4px",
                  lineHeight: 1.2,
                }}
              >
                {dimension.title}
              </h2>
              <p 
                style={{
                  fontSize: "14px",
                  color: "#64748B",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {dimension.subtitle}
              </p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close dimension details"
              style={{
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                background: "transparent",
                color: "#162862",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(22, 40, 98, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              className="focus:outline-none focus:ring-2 focus:ring-[#162862]/50"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div 
            className="flex-1 overflow-y-auto"
            style={{
              padding: "18px 20px",
              minHeight: 0,
            }}
          >
            <div 
              id="dimension-modal-description"
              style={{
                maxWidth: "560px",
                marginTop: "0",
                marginBottom: "0",
                borderLeft: "2px solid #162862",
                backgroundColor: "#FAFBFC",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <p 
                style={{
                  fontSize: "17px",
                  lineHeight: 1.7,
                  color: "#334155",
                  margin: 0,
                  maxHeight: "140px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {dimension.description}
              </p>
              <p 
                style={{
                  fontSize: "13px",
                  color: "#94A3B8",
                  margin: "8px 0 0 0",
                  fontStyle: "italic",
                }}
              >
                Read more in full story →
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div 
            className="flex-shrink-0"
            style={{
              padding: "20px",
              borderTop: "1px solid rgba(22, 40, 98, 0.08)",
            }}
          >
            <div 
              className="flex justify-end flex-wrap"
              style={{
                gap: "12px",
              }}
            >
              <button
                onClick={() => handleSecondaryCTA(dimension.secondaryCTA.href)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "12px",
                  border: "1.5px solid #162862",
                  background: "transparent",
                  color: "#162862",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(22, 40, 98, 0.08)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                className="focus:outline-none focus:ring-2 focus:ring-[#162862]/50"
              >
                {dimension.secondaryCTA.label}
              </button>
              <button
                onClick={() => handlePrimaryCTA(dimension.primaryCTA.href)}
                style={{
                  padding: "11px 20px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#162862",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0E1F4A";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#162862";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                className="focus:outline-none focus:ring-2 focus:ring-[#162862]/50"
              >
                {dimension.primaryCTA.label}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalEnter {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

// Map GHC guide slugs to DNA node IDs
const GHC_SLUG_TO_NODE_ID: Record<string, number> = {
  'dq-vision': 1,
  'dq-hov': 2,
  'dq-persona': 3,
  'dq-agile-tms': 4,
  'dq-agile-sos': 5,
  'dq-agile-flows': 6,
  'dq-agile-6xd': 7,
};

const GHC_SLUGS = ['dq-vision', 'dq-hov', 'dq-persona', 'dq-agile-tms', 'dq-agile-sos', 'dq-agile-flows', 'dq-agile-6xd'];

function Discover_DNASection({}: Discover_DNASectionProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [nodesDb, setNodesDb] = useState<DqDnaNode[] | null>(null);
  const [calloutsDb, setCalloutsDb] = useState<DqDnaCallout[] | null>(null);
  const [ghcGuides, setGhcGuides] = useState<Record<string, any>>({});
  const [hasAnimated, setHasAnimated] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<GrowthDimensionContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  // Fetch GHC guides from Supabase
  useEffect(() => {
    async function fetchGHCGuides() {
      try {
        const { data, error } = await knowledgeHubSupabase
          .from('guides')
          .select('slug, title, summary, body, hero_image_url')
          .in('slug', GHC_SLUGS)
          .eq('status', 'Approved');
        
        if (error) {
          console.error('Error fetching GHC guides:', error);
          return;
        }
        
        if (data) {
          const guidesMap: Record<string, any> = {};
          data.forEach(guide => {
            guidesMap[guide.slug] = guide;
          });
          setGhcGuides(guidesMap);
        }
      } catch (err) {
        console.error('Error fetching GHC guides:', err);
      }
    }
    
    fetchGHCGuides();
  }, []);

  useEffect(() => {
    fetchDna()
      .then(({ nodes, callouts }) => {
        setNodesDb(nodes);
        setCalloutsDb(callouts);
      })
      .catch(() => {
        // Fallback to hardcoded data
      });
  }, []);

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    if (!sectionRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasAnimated(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

  const nodes: Node[] = nodesDb
    ? nodesDb.map((n) => {
        // Try to get title from Supabase guide if available
        const slug = Object.entries(GHC_SLUG_TO_NODE_ID).find(([_, id]) => id === n.id)?.[0];
        const guide = slug ? ghcGuides[slug] : null;
        
        return {
          id: n.id,
          role: n.role as Role,
          title: guide?.title || n.title,
          subtitle: n.subtitle,
          fill: n.fill === "navy" ? "navy" : "outline",
        };
      })
    : NODES.map((n) => {
        // Try to get title from Supabase guide if available
        const slug = Object.entries(GHC_SLUG_TO_NODE_ID).find(([_, id]) => id === n.id)?.[0];
        const guide = slug ? ghcGuides[slug] : null;
        
        return {
          ...n,
          title: guide?.title || n.title,
        };
      });

  const callouts = calloutsDb ?? CALLOUTS;

  const handleHexClick = (nodeId: number) => {
    // Try to get data from Supabase guides first, fallback to hardcoded
    const slug = Object.entries(GHC_SLUG_TO_NODE_ID).find(([_, id]) => id === nodeId)?.[0];
    const guide = slug ? ghcGuides[slug] : null;
    
    if (guide) {
      // Use data from Supabase
      const dimension: GrowthDimensionContent = {
        id: nodeId,
        title: guide.title || GROWTH_DIMENSIONS_CONTENT[nodeId]?.title || '',
        subtitle: GROWTH_DIMENSIONS_CONTENT[nodeId]?.subtitle || '',
        description: guide.summary || guide.body?.substring(0, 300) || GROWTH_DIMENSIONS_CONTENT[nodeId]?.description || '',
        primaryCTA: GROWTH_DIMENSIONS_CONTENT[nodeId]?.primaryCTA || { label: 'Read More', href: '#' },
        secondaryCTA: {
          label: 'View in Knowledge Center',
          href: `/marketplace/guides/${slug}`,
        },
      };
      setSelectedDimension(dimension);
      setIsModalOpen(true);
    } else {
      // Fallback to hardcoded content
      const dimension = GROWTH_DIMENSIONS_CONTENT[nodeId];
      if (dimension) {
        setSelectedDimension(dimension);
        setIsModalOpen(true);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Small delay to allow animation to complete
    setTimeout(() => {
      setSelectedDimension(null);
    }, 200);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Animation delays
  const getHexDelay = (nodeId: number) => {
    if (nodeId === 1) return 0; // Center first
    const delays: Record<number, number> = {
      6: 80,  // leftTop
      5: 160, // rightTop
      7: 240, // leftMid
      4: 320, // rightMid
      2: 400, // leftBot
      3: 480, // rightBot
    };
    return delays[nodeId] || 0;
  };

  return (
    <section 
      id="dna" 
      ref={sectionRef}
      style={{ background: "#fff", padding: "48px 0 32px", position: "relative" }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <DiscoverSectionTitle>
            Growth Dimensions
          </DiscoverSectionTitle>
          <p 
            style={{ 
              color: "#64748B", 
              fontSize: "17px",
              margin: 0,
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              lineHeight: 1.5,
            }}
          >
            Seven interconnected dimensions defining how DQ thinks, works, governs, collaborates, and evolves continuously.
          </p>
        </div>

        {/* Complete SVG Diagram - pixel perfect */}
        <div
          style={{
            width: "100%",
            maxWidth: "1400px",
            margin: "0 auto 24px auto",
            position: "relative",
            marginTop: "-8px",
          }}
        >
          <svg
            viewBox={VIEWBOX}
            width="100%"
            preserveAspectRatio="xMidYMid meet"
            style={{ display: "block" }}
          >
            <defs>
              {/* Subtle texture for light hexagons */}
              <pattern id="hex-texture" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <line x1="0" y1="25" x2="50" y2="25" stroke={NAVY} strokeWidth="0.5" opacity="0.04" />
                <line x1="25" y1="0" x2="25" y2="50" stroke={NAVY} strokeWidth="0.5" opacity="0.04" />
                <circle cx="12" cy="12" r="1" fill={NAVY} opacity="0.05" />
                <circle cx="38" cy="38" r="1" fill={NAVY} opacity="0.05" />
              </pattern>
              {/* Hover glow filter */}
              <filter id="hex-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Connector Lines - horizontal connectors from hex edges to labels */}
            {callouts.map((callout, i) => {
                const connector = getConnectorPath(callout.role, callout.side);
                const pathMatch = connector.path.match(/M\s+([\d.]+)\s+([\d.]+)\s+L\s+([\d.]+)\s+([\d.]+)/);
                const pathLength = pathMatch 
                  ? Math.sqrt(Math.pow(parseFloat(pathMatch[3]) - parseFloat(pathMatch[1]), 2) + 
                             Math.pow(parseFloat(pathMatch[4]) - parseFloat(pathMatch[2]), 2))
                  : 110;
                
                return (
                  <g key={i}>
                    <path
                      d={connector.path}
                      stroke={NAVY}
                      strokeWidth={2}
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={pathLength}
                      strokeDashoffset={hasAnimated ? 0 : pathLength}
                      style={{
                        transition: hasAnimated ? "stroke-dashoffset 0.4s ease-out" : "none",
                        transitionDelay: hasAnimated ? `${i * 50 + 200}ms` : "0ms",
                      }}
                    />
                    <circle 
                      cx={connector.dotX} 
                      cy={connector.dotY} 
                      r={3.5} 
                      fill={NAVY}
                      style={{
                        opacity: hasAnimated ? 1 : 0,
                        transition: hasAnimated ? "opacity 0.2s ease-out" : "none",
                        transitionDelay: hasAnimated ? `${i * 50 + 400}ms` : "0ms",
                      }}
                    />
                    <text
                      x={connector.textX}
                      y={connector.textY}
                      textAnchor={connector.anchor}
                      fontSize={12}
                      fontWeight={600}
                      fill={NAVY}
                      fontFamily="ui-sans-serif, system-ui, sans-serif"
                      style={{
                        opacity: hasAnimated ? 1 : 0,
                        transition: hasAnimated ? "opacity 0.2s ease-out" : "none",
                        transitionDelay: hasAnimated ? `${i * 50 + 400}ms` : "0ms",
                      }}
                    >
                      {callout.text}
                    </text>
                  </g>
                );
              })}
            
            {/* Special "Why we exist" connector - only from The Vision (center) */}
            {(() => {
              const centerPos = HEX_POSITIONS.center; // The Vision
              
              // Calculate bottom edge Y position for flat-top hexagons
              // For flat-top hex, bottom edge is at: centerY + (HEX_SIZE * √3 / 2)
              const hexBottomY = HEX_SIZE * 0.866; // √3/2 ≈ 0.866
              
              const centerBottomY = centerPos.y + hexBottomY;
              
              // Final label position - long vertical line from center hex
              const finalY = centerBottomY + 115; // Extended line to match reference
              
              // Path from center hex (The Vision) bottom center straight down
              const centerPath = `M ${centerPos.x} ${centerBottomY} L ${centerPos.x} ${finalY}`;
              
              const pathLength = finalY - centerBottomY;

              return (
                <g>
                  {/* Vertical line - from The Vision (hex 1) bottom center straight down */}
                  <path
                    d={centerPath}
                    stroke={NAVY}
                    strokeWidth={2}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={pathLength}
                    strokeDashoffset={hasAnimated ? 0 : pathLength}
                    style={{
                      transition: "stroke-dashoffset 0.6s ease-out",
                      transitionDelay: "600ms",
                    }}
                  />
                  {/* Dot at end */}
                  <circle 
                    cx={centerPos.x} 
                    cy={finalY} 
                    r={3.5} 
                    fill={NAVY}
                    style={{
                      opacity: hasAnimated ? 1 : 0,
                      transition: "opacity 0.2s ease-out",
                      transitionDelay: "800ms",
                    }}
                  />
                  {/* Label - below the dot */}
                  <text
                    x={centerPos.x}
                    y={finalY + 18}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight={600}
                    fill={NAVY}
                    fontFamily="ui-sans-serif, system-ui, sans-serif"
                    style={{
                      opacity: hasAnimated ? 1 : 0,
                      transition: "opacity 0.2s ease-out",
                      transitionDelay: "800ms",
                    }}
                  >
                    Why we exist
                  </text>
                </g>
              );
            })()}

            {/* Hexagons - using polygon approach from Lovable */}
            {nodes.map((node) => {
              const pos = HEX_POSITIONS[node.role];
              const points = hexPath(pos.x, pos.y, HEX_SIZE);
              const isHovered = hoveredId === node.id;
              const isNavy = node.fill === "navy";
              const isCenter = node.id === 1;
              const delay = getHexDelay(node.id);

              return (
                <g
                  key={node.id}
                  style={{ 
                    cursor: "pointer",
                    transform: isHovered 
                      ? `translate(${pos.x}, ${pos.y}) scale(1.05) translate(${-pos.x}, ${-pos.y})` 
                      : "",
                    transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    transformOrigin: `${pos.x}px ${pos.y}px`,
                    opacity: hasAnimated ? 1 : (isCenter ? 0 : 0),
                    animationDelay: hasAnimated ? `${delay}ms` : "0ms",
                    filter: isHovered ? "url(#hex-glow)" : "none",
                  }}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleHexClick(node.id)}
                >
                  {/* Hexagon shape - using polygon like Lovable */}
                  <polygon
                    points={points}
                    fill={isNavy ? NAVY : "#FFFFFF"}
                    stroke={isHovered ? "#0E1F4A" : NAVY}
                    strokeWidth={isHovered ? STROKE_WIDTH + 0.5 : STROKE_WIDTH}
                    style={{ 
                      transition: "stroke 0.2s ease, stroke-width 0.2s ease",
                    }}
                  />
                  
                  {/* Texture for light hexagons */}
                  {!isNavy && (
                    <polygon
                      points={points}
                      fill="url(#hex-texture)"
                      stroke="none"
                    />
                  )}

                  {/* Number badge - inverted style for core hexes (1,2,3), solid for outer (4,5,6,7) */}
                  {(() => {
                    const badgeCx = pos.x;
                    const badgeCy = pos.y - HEX_SIZE + 18;
                    
                    return node.id <= 3 ? (
                      // Core hexes: white badge with navy border and navy number
                      <>
                        <circle
                          cx={badgeCx}
                          cy={badgeCy}
                          r={13}
                          fill="#FFFFFF"
                          stroke={NAVY}
                          strokeWidth={STROKE_WIDTH}
                        />
                        <text
                          x={badgeCx}
                          y={badgeCy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={12}
                          fontWeight={700}
                          fill={NAVY}
                          fontFamily="ui-sans-serif, system-ui, sans-serif"
                        >
                          {node.id}
                        </text>
                      </>
                    ) : (
                      // Outer hexes: navy badge with white number
                      <>
                        <circle
                          cx={badgeCx}
                          cy={badgeCy}
                          r={13}
                          fill={NAVY}
                        />
                        <text
                          x={badgeCx}
                          y={badgeCy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={12}
                          fontWeight={700}
                          fill="#FFFFFF"
                          fontFamily="ui-sans-serif, system-ui, sans-serif"
                        >
                          {node.id}
                        </text>
                      </>
                    );
                  })()}

                  {/* Title */}
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={16}
                    fontWeight={700}
                    fill={isNavy ? "#FFFFFF" : NAVY}
                    fontFamily="ui-sans-serif, system-ui, sans-serif"
                    style={{ textShadow: isNavy ? "0 1px 2px rgba(0,0,0,0.2)" : "none" }}
                  >
                    {node.title}
                  </text>

                  {/* Subtitle */}
                  <text
                    x={pos.x}
                    y={pos.y + 23}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={11}
                    fontWeight={400}
                    fill={isNavy ? "rgba(255,255,255,0.9)" : "#64748B"}
                    fontFamily="ui-sans-serif, system-ui, sans-serif"
                    style={{ textShadow: isNavy ? "0 1px 2px rgba(0,0,0,0.2)" : "none" }}
                  >
                    {node.subtitle}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Dimension Modal */}
      <DimensionModal
        dimension={selectedDimension}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onNavigate={handleNavigate}
      />

      {/* Animation Styles */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          g[style*="opacity"] {
            animation: hexFadeIn 0.4s ease-out forwards;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          g[style*="opacity"],
          line,
          circle,
          text {
            opacity: 1 !important;
            stroke-dashoffset: 0 !important;
          }
        }
        
        @keyframes hexFadeIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}

/* Support both import styles */
export default Discover_DNASection;
export { Discover_DNASection };
