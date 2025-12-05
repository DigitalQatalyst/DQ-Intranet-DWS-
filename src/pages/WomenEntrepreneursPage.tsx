import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  Layers,
  MapPin,
  MessageCircle,
  Send,
  Users,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  assistantData,
  campaignsData,
  connectLearnGrowData,
  featuredPrograms,
  featuredStories,
  footerData,
  impactData,
  impactStats,
  partnersData,
  regionalHighlights,
  storyCategories,
  emiratesData,
  getAllOrganizations,
  getEmirateOrganizations,
  getAllPrograms,
  getEmiratePrograms,
  categoryMapping,
} from "./womenEntrepreneurs/data";
import { PillFilters } from "../components/PillFilters";
import { MediaCard } from "../components/Cards/MediaCard";
import { CommunityCard } from "../communities/components/Cards/CommunityCard";
import { ServiceCard } from "../components/Cards/ServiceCard";
import EnquiryModal from "../communities/components/Enquiry/EnquiryModal";

// Fix Leaflet icon imports for bundlers
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Configure default marker icon
const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const TABS_SIMPLE_BASE_CLASSES =
  "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all";

interface TabSection {
  id: string;
  title: string;
}

const TabsSimple = ({
  sections,
  activeTabIndex,
  onTabChange,
}: {
  sections: TabSection[];
  activeTabIndex: number;
  onTabChange: (index: number) => void;
}) => (
  <div className="flex flex-wrap gap-2 justify-center">
    {sections.map((section, index) => {
      const isActive = index === activeTabIndex;
      return (
        <button
          key={section.id}
          className={`${TABS_SIMPLE_BASE_CLASSES} ${
            isActive
              ? "bg-primary text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => onTabChange(index)}
        >
          {section.title}
        </button>
      );
    })}
  </div>
);

const WomenHeroSection = ({ onExplore }: { onExplore: () => void }) => (
  <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-purple-800/80 to-primary-dark text-white">
    <div
      className="absolute inset-0 opacity-60"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=2000&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 lg:py-32">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 bg-white/15 text-white/90 rounded-full px-4 py-1 text-sm mb-6">
          <Layers size={16} />
          UAE Women Entrepreneurs Ecosystem
        </span>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Discover, partner, and scale with the UAE&apos;s women-led innovation
          movement.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/85">
          Access curated programs, funding pathways, and communities designed to
          help women entrepreneurs accelerate their impact across the Emirates
          and beyond.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-primary font-semibold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
          >
            Join the movement
            <ArrowRight size={18} />
          </Link>
          <button
            onClick={onExplore}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/70 text-white font-semibold hover:bg-white/10 transition-all"
          >
            Explore programs
            <Users size={18} />
          </button>
        </div>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-transparent to-primary/20" />
  </section>
);

const CampaignsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = campaignsData.length;
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  return (
    <section className="bg-gradient-to-r from-primary/5 via-white to-teal/5 py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
            Awareness <span className="text-teal-600">Campaigns</span>
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Upcoming events and initiatives to support women entrepreneurs across
            the Emirates.
          </p>
        </div>
        <div
          className="relative h-[420px] rounded-2xl overflow-hidden shadow-xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {campaignsData.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                zIndex: currentSlide === index ? 10 : 0,
              }}
              transition={{ duration: 0.6 }}
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.7) 90%),url(${campaign.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white">
                {campaign.active && (
                  <span className="bg-white/25 px-3 py-1 rounded-full text-xs uppercase tracking-wide mb-4">
                    Active campaign
                  </span>
                )}
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-3">
                  {campaign.title}
                </h3>
                <p className="text-white/85 text-lg max-w-2xl mb-6">
                  {campaign.tagline}
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-white/80">
                  <span>
                    {formatDate(campaign.date)} • In partnership with{" "}
                    {campaign.partner}
                  </span>
                  <button className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors">
                    Register now
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 text-white p-3 rounded-full hover:bg-white/50 transition-colors"
            onClick={() =>
              setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
            }
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 text-white p-3 rounded-full hover:bg-white/50 transition-colors"
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % totalSlides)
            }
            aria-label="Next slide"
          >
            <ChevronRight />
          </button>
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index ? "bg-white w-10" : "bg-white/50 w-2"
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ImpactStatsBar = () => {
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    countersRef.current.forEach((element, index) => {
      if (!element) return;
      const targetValue = impactStats[index];
      if (!targetValue) return;
      const numericValue = parseInt(targetValue.value.replace(/[^0-9]/g, ""), 10);
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              let start: number | null = null;
              const duration = 1500;
              const animate = (timestamp: number) => {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                const current = Math.floor(progress * numericValue);
                const formatted = new Intl.NumberFormat("en-US").format(current);
                element.textContent = formatted;
                if (progress < 1) {
                  requestAnimationFrame(animate);
                } else {
                  element.textContent = targetValue.value;
                }
              };
              requestAnimationFrame(animate);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(element);
      observers.push(observer);
    });
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);
  return (
    <section className="py-16 bg-primary text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {impactStats.map((stat, index) => {
            const IconComponent = (() => {
              switch (stat.iconName) {
                case "Users":
                  return Users;
                case "DollarSign":
                  return ({ ...props }) => <span {...props}>د.إ</span>;
                case "Briefcase":
                  return ({ ...props }) => <span {...props}>💼</span>;
                case "UserPlus":
                  return ({ ...props }) => <span {...props}>🤝</span>;
                default:
                  return Users;
              }
            })();
            return (
              <div
                key={stat.id}
                className="relative overflow-hidden rounded-2xl bg-white/10 border border-white/15 p-6 backdrop-blur"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${stat.iconBgColor} ${stat.iconColor}`}>
                    {typeof IconComponent === "function" ? (
                      <IconComponent className="text-xl" />
                    ) : (
                      <IconComponent />
                    )}
                  </div>
                  <p className="text-sm text-white/70">{stat.label}</p>
                </div>
                <span
                  ref={(el) => (countersRef.current[index] = el)}
                  className="text-3xl font-display font-bold"
                >
                  0
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const EcosystemMap = () => {
  const [selectedEmirate, setSelectedEmirate] = useState<string | null>(null);
  const organizations = selectedEmirate
    ? getEmirateOrganizations(selectedEmirate)
    : getAllOrganizations();
  const programs = selectedEmirate
    ? getEmiratePrograms(selectedEmirate)
    : getAllPrograms();
  const center = useMemo(() => {
    if (selectedEmirate) {
      const emirate = emiratesData.find((item) => item.id === selectedEmirate);
      return emirate ? emirate.coordinates : [24.4539, 54.3773];
    }
    return [24.4539, 54.3773];
  }, [selectedEmirate]);
  return (
    <section className="bg-gray-50 py-16 md:py-20" id="ecosystem-map">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
            Ecosystem Map
          </h2>
          <p className="mt-3 text-gray-600">
            Discover the organizations, institutions, and initiatives supporting
            women entrepreneurs across the UAE.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-100 p-4">
            <PillFilters
              options={[
                { label: "All Emirates", value: "all" },
                ...emiratesData.map((emirate) => ({
                  label: emirate.emirate,
                  value: emirate.id,
                })),
              ]}
              currentValue={selectedEmirate ?? "all"}
              onFilterChange={(value) =>
                setSelectedEmirate(value === "all" ? null : value)
              }
            />
          </div>
          <div className="grid lg:grid-cols-[2fr,1fr]">
            <div className="h-[420px] lg:h-[480px]">
              <MapContainer
                center={center as L.LatLngTuple}
                zoom={selectedEmirate ? 10 : 7}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {organizations.map((org) => {
                  const category = categoryMapping[org.category];
                  return (
                    <Marker
                      key={org.id}
                      position={org.coordinates as L.LatLngTuple}
                    >
                      <Popup>
                        <div className="space-y-1">
                          <p className="font-semibold text-primary">
                            {org.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {category?.label}
                          </p>
                          <a
                            href={org.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            Visit website
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
            <div className="border-t lg:border-t-0 lg:border-l border-gray-100 p-5 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">
                  Key Organizations
                </h3>
                <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {organizations.map((org) => (
                    <li
                      key={org.id}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <p className="font-medium text-gray-800">{org.name}</p>
                      <p className="text-sm text-gray-600">
                        {categoryMapping[org.category]?.label}
                      </p>
                    </li>
                  ))}
                  {organizations.length === 0 && (
                    <li className="text-sm text-gray-500">
                      No organizations listed yet.
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">
                  Programs & Initiatives
                </h3>
                <ul className="space-y-3 max-h-32 overflow-y-auto pr-2">
                  {programs.map((program) => (
                    <li key={program.program_name}>
                      <a
                        href={program.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-sm text-primary hover:underline"
                      >
                        <span>{program.program_name}</span>
                        <ExternalLink size={14} />
                      </a>
                    </li>
                  ))}
                  {programs.length === 0 && (
                    <li className="text-sm text-gray-500">
                      No programs announced yet.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CommunitiesResources = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const sections = connectLearnGrowData.tabs.map((tab) => ({
    id: tab.id,
    title: tab.title,
  }));
  const activeItems = connectLearnGrowData.tabs[activeTabIndex]?.items ?? [];
  const getEmirateColor = (emirate: string) => {
    switch (emirate) {
      case "Abu Dhabi":
        return "bg-primary text-white";
      case "Dubai":
        return "bg-teal-500 text-white";
      case "Sharjah":
        return "bg-purple-500 text-white";
      case "Nationwide":
        return "bg-amber-400 text-amber-900";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
            Connect · Learn · <span className="text-teal-600">Grow</span>
          </h2>
          <p className="mt-3 text-gray-600 max-w-3xl mx-auto">
            Discover communities, resources, and programs built to help women-led
            ventures scale from the UAE to the world.
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-inner">
          <TabsSimple
            sections={sections}
            activeTabIndex={activeTabIndex}
            onTabChange={setActiveTabIndex}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeItems.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.womenFocused ? "Women-focused" : "Inclusive"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${getEmirateColor(
                      item.emirate
                    )}`}
                  >
                    {item.emirate}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {item.description}
                </p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  Learn more
                  <ExternalLink size={14} />
                </a>
              </motion.div>
            ))}
            {activeItems.length === 0 && (
              <p className="text-sm text-gray-500 text-center col-span-full">
                More resources coming soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const PlatformOfferings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs: TabSection[] = [
    { id: "communities", title: "Communities" },
    { id: "resources", title: "Resources" },
    { id: "services", title: "Services" },
    { id: "events", title: "Events & Workshops" },
    { id: "mentorship", title: "Mentorship" },
  ];
  const filteredData = useMemo(() => {
    switch (tabs[activeTab]?.id) {
      case "communities":
        return connectLearnGrowData.tabs
          .find((tab) => tab.id === "networks")
          ?.items.map((item) => ({
            id: item.id,
            name: item.title,
            description: item.description,
            memberCount: 200,
            category: item.emirate,
            tags: ["Networking", "Support"],
            imageUrl:
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
            activityLevel: "high",
            link: item.link,
            womenFocused: item.womenFocused,
          }));
      case "resources":
        return connectLearnGrowData.tabs
          .find((tab) => tab.id === "resources")
          ?.items.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            organization: item.emirate,
            link: item.link,
            category: item.icon,
          }));
      case "services":
        return connectLearnGrowData.tabs
          .find((tab) => tab.id === "programs")
          ?.items.map((item) => ({
            id: item.id,
            title: item.title,
            provider: item.emirate,
            description: item.description,
            tags: ["Application", "Support"],
            providerLogoUrl:
              "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=400&q=80",
            link: item.link,
          }));
      case "events":
        return campaignsData.map((campaign) => ({
          id: campaign.id,
          title: campaign.title,
          description: campaign.tagline,
          image: campaign.image,
          badges: [campaign.partner, campaign.active ? "Active" : "Upcoming"],
          ctaLabel: "Register",
          ctaLink: "#campaigns",
        }));
      case "mentorship":
        return featuredStories.map((story) => ({
          id: story.id,
          title: story.name,
          description: story.story,
          image: story.image,
          badges: [story.category, story.region],
          ctaLabel: "Request mentorship",
          ctaLink: "#mentorship",
        }));
      default:
        return [];
    }
  }, [activeTab]);
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
            Platform Offerings at a Glance
          </h2>
          <p className="mt-3 text-gray-600 max-w-3xl mx-auto">
            Explore the communities to join, resources to download, and services
            to apply for on the Enterprise Journey platform.
          </p>
        </div>
        <TabsSimple
          sections={tabs}
          activeTabIndex={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredData?.map((item: any) => {
            if (tabs[activeTab]?.id === "communities") {
              return (
                <CommunityCard
                  key={item.id}
                  item={item}
                  onJoin={() => window.open(item.link, "_blank")}
                  onViewDetails={() => window.open(item.link, "_blank")}
                />
              );
            }
            if (tabs[activeTab]?.id === "services") {
              return (
                <ServiceCard
                  key={item.id}
                  item={item}
                  onApply={() => window.open(item.link, "_blank")}
                  onLearnMore={() => window.open(item.link, "_blank")}
                />
              );
            }
            return (
              <MediaCard
                key={item.id}
                type="report"
                title={item.title}
                description={item.description}
                image={item.image}
                badges={item.badges}
                cta={{ label: item.ctaLabel ?? "Explore", href: item.ctaLink }}
              />
            );
          })}
          {!filteredData?.length && (
            <p className="text-sm text-gray-500 col-span-full text-center">
              More content coming soon.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

const FeaturedStoriesSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const filteredStories =
    activeCategory === "all"
      ? featuredStories
      : featuredStories.filter(
          (story) =>
            story.category.toLowerCase() === activeCategory.toLowerCase()
        );
  return (
    <section className="py-16 md:py-20 bg-white" id="stories">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
              Featured Entrepreneur Stories
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Inspiring journeys of women leaders transforming industries across
              the UAE.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {storyCategories.map((category) => (
              <button
                key={category.id}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  activeCategory === category.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${story.image})` }}
              />
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {story.category}
                  </span>
                  <span className="text-sm text-gray-500">{story.region}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {story.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-4">
                  {story.story}
                </p>
                <button className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline">
                  Read full story
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProgramsAndPartnersSection = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState<"networks" | "hubs">(
    "networks"
  );
  const sections: TabSection[] = [
    { id: "programs", title: "Programs" },
    { id: "councils", title: "Councils & Enablers" },
    { id: "networks", title: "Networks & Hubs" },
  ];
  const councils = partnersData.map((partner) => ({
    title: partner.name,
    organization: "Partner",
    region: "UAE",
    description: partner.headline,
    link: partner.link,
  }));
  const networks = connectLearnGrowData.tabs
    .find((tab) => tab.id === "networks")
    ?.items.map((item) => ({
      title: item.title,
      organization: item.emirate,
      region: item.emirate,
      description: item.description,
      link: item.link,
    }));
  const hubs = regionalHighlights.map((region) => ({
    title: `${region.name} Innovation Hub`,
    organization: region.featuredFounder,
    region: region.name,
    description: `Focus on ${region.sector.toLowerCase()}.`,
    link: "#",
  }));
  const programs = featuredPrograms.map((program) => ({
    title: program.title,
    organization: program.provider,
    region: program.emirate,
    description: program.description,
    link: program.ctaLink,
  }));
  const activeContent = (() => {
    switch (activeTabIndex) {
      case 0:
        return programs;
      case 1:
        return councils;
      case 2:
        return activeSubTab === "networks" ? networks : hubs;
      default:
        return [];
    }
  })();
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
            Programs & Partners Empowering Women Entrepreneurs
          </h2>
          <p className="mt-3 text-gray-600 max-w-3xl mx-auto">
            Discover the organizations and initiatives dedicated to supporting
            women-led businesses across the UAE.
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-inner">
          <TabsSimple
            sections={sections}
            activeTabIndex={activeTabIndex}
            onTabChange={(index) => {
              setActiveTabIndex(index);
              if (index !== 2) setActiveSubTab("networks");
            }}
          />
          {activeTabIndex === 2 && (
            <div className="flex justify-center gap-3 mt-4">
              <button
                className={`px-3 py-1.5 text-sm rounded-full ${
                  activeSubTab === "networks"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setActiveSubTab("networks")}
              >
                Networks
              </button>
              <button
                className={`px-3 py-1.5 text-sm rounded-full ${
                  activeSubTab === "hubs"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setActiveSubTab("hubs")}
              >
                Innovation Hubs
              </button>
            </div>
          )}
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {activeContent?.map((item, index) => (
              <motion.div
                key={`${item?.title}-${index}`}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h3 className="font-semibold text-gray-900">{item?.title}</h3>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {item?.region}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-4 mb-4">
                  {item?.description}
                </p>
                <a
                  href={item?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  Learn more
                  <ExternalLink size={14} />
                </a>
              </motion.div>
            ))}
            {!activeContent?.length && (
              <p className="text-sm text-gray-500 col-span-full text-center">
                More entries coming soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProgramsInitiativesSection = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visiblePrograms = featuredPrograms.slice(startIndex, startIndex + 3);
  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + 3 < featuredPrograms.length;
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
            Featured Programs & Initiatives
          </h2>
          <p className="mt-3 text-gray-600 max-w-3xl mx-auto">
            Flagship programs and partnerships empowering women founders across
            the UAE.
          </p>
        </div>
        <div className="relative">
          <button
            className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md border border-gray-100 text-primary hover:bg-primary hover:text-white transition-colors ${
              canGoPrev ? "" : "opacity-40 cursor-not-allowed"
            }`}
            onClick={() => canGoPrev && setStartIndex((prev) => prev - 1)}
            disabled={!canGoPrev}
            aria-label="Previous programs"
          >
            <ChevronLeft />
          </button>
          <div className="grid md:grid-cols-3 gap-5 px-12">
            {visiblePrograms.map((program) => (
              <MediaCard
                key={program.id}
                type="report"
                title={program.title}
                description={`${program.provider} • ${program.emirate} • ${program.description}`}
                image={program.image}
                badges={program.keyInitiatives}
                cta={{ label: program.ctaLabel, href: program.ctaLink }}
                secondaryCta={{
                  label: "View details",
                  href: program.ctaLink,
                  icon: <ArrowRight size={16} />,
                }}
              />
            ))}
          </div>
          <button
            className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md border border-gray-100 text-primary hover:bg-primary hover:text-white transition-colors ${
              canGoNext ? "" : "opacity-40 cursor-not-allowed"
            }`}
            onClick={() => canGoNext && setStartIndex((prev) => prev + 1)}
            disabled={!canGoNext}
            aria-label="Next programs"
          >
            <ChevronRight />
          </button>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({
            length: Math.max(1, featuredPrograms.length - 2),
          }).map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full ${
                index === startIndex ? "bg-primary" : "bg-gray-300"
              }`}
              onClick={() => setStartIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const PartnerTicker = () => {
  const duplicatedPartners = [...partnersData, ...partnersData];
  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center mb-10">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
          Our Partners
        </h2>
        <p className="mt-3 text-gray-600">
          Working together with leading UAE organizations to support women
          entrepreneurs.
        </p>
      </div>
      <div className="relative">
        <motion.div
          className="flex items-center gap-10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex-shrink-0 w-56 bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex flex-col items-center gap-3"
            >
              <div
                className="h-16 w-full bg-cover bg-center rounded-md"
                style={{ backgroundImage: `url(${partner.logo})` }}
              />
              <p className="font-semibold text-gray-800 text-sm">
                {partner.name}
              </p>
              <p className="text-xs text-gray-500 text-center">
                {partner.headline}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const ImpactPulseWidget = () => (
  <section className="py-16 bg-white">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
          Impact Pulse
        </h2>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Real-time metrics showing the growth and impact of women entrepreneurs
          across the UAE.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {impactData.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{metric.label}</p>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  metric.trend >= 0
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {metric.trend >= 0 ? "+" : "-"}
                {Math.abs(metric.trend)}%
              </span>
            </div>
            <p className="text-3xl font-display font-bold text-primary mb-3">
              {new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(metric.value)}
            </p>
            <p className="text-sm text-gray-600">{metric.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const JoinCommunitySection = () => {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  return (
    <>
      <section className="py-16 bg-gradient-to-b from-white to-primary/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-teal/10 pointer-events-none" />
            <div className="relative p-10 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-3xl">
                <Users size={32} />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
                Join the UAE&apos;s Women Entrepreneurship Movement
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Be part of a connected network of founders, mentors, and partners
                shaping the UAE&apos;s global entrepreneurship story. Share your
                journey, learn from others, and contribute to the growing
                ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-white font-semibold shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Share your story
                  <ArrowRight size={16} />
                </Link>
                <button
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all"
                  onClick={() => setIsEnquiryModalOpen(true)}
                >
                  Partner with us
                  <Users size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        data-id="women-entrepreneurs-partner"
      />
    </>
  );
};

const FooterCTASection = () => (
  <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
    <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
      <h2 className="font-display text-4xl font-bold">{footerData.title}</h2>
      <p className="text-lg text-white/80">{footerData.subtitle}</p>
      <Link
        to="/signup"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-primary font-semibold shadow-lg hover:-translate-y-0.5 transition-all"
      >
        {footerData.buttonText}
        <ArrowRight size={18} />
      </Link>
    </div>
  </section>
);

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

const SmartAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! How can I help you with your entrepreneurship journey today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputValue.trim()) return;
    const userMessage: ChatMessage = {
      role: "user",
      content: inputValue,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    const answer =
      assistantData.find((item) =>
        item.question.toLowerCase().includes(userMessage.content.toLowerCase())
      )?.answer ??
      "I don't have specific information on that topic yet. Try asking about funding, mentorship, networking, tech startups, or export assistance.";
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };
  return (
    <>
      <motion.button
        className={`fixed bottom-6 right-6 z-40 rounded-full p-4 shadow-lg transition-all ${
          isOpen ? "bg-red-500" : "bg-primary"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
          >
            <div className="bg-primary text-white p-4">
              <h3 className="font-semibold">Entrepreneurship Assistant</h3>
              <p className="text-xs text-white/80">
                Ask me about resources, funding, and support.
              </p>
            </div>
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      message.role === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-white text-gray-800 shadow rounded-tl-none"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg px-3 py-2 shadow text-gray-600">
                    <div className="flex gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={handleSubmit}
              className="border-t border-gray-100 p-3 flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ask a question..."
              />
              <button
                type="submit"
                className="bg-primary text-white p-2 rounded-lg disabled:opacity-40"
                disabled={!inputValue.trim()}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const RegionalHighlightsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.6;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };
  return (
    <section className="py-16 bg-primary/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
              Regional Highlights
            </h2>
            <p className="mt-2 text-gray-600 max-w-xl">
              Explore women entrepreneur communities across the seven emirates of
              the UAE.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              className="p-2 rounded-full bg-white border border-gray-200 text-primary hover:bg-primary hover:text-white transition-colors"
              onClick={() => scroll("left")}
            >
              <ChevronLeft />
            </button>
            <button
              className="p-2 rounded-full bg-white border border-gray-200 text-primary hover:bg-primary hover:text-white transition-colors"
              onClick={() => scroll("right")}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {regionalHighlights.map((region) => (
              <motion.div
                key={region.id}
                className="flex-none w-[280px] md:w-[320px] snap-start bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${region.image})` }}
                />
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <MapPin size={16} />
                    <h3 className="font-semibold text-lg">{region.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {region.foundersCount.toLocaleString()} founders • Focus on{" "}
                    {region.sector.toLowerCase()}
                  </p>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <Info size={14} />
                    Featured founder: {region.featuredFounder}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const WomenEntrepreneursPage = () => {
  const programsSectionRef = useRef<HTMLDivElement>(null);
  const handleExploreClick = () => {
    programsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="bg-white text-gray-900">
      <WomenHeroSection onExplore={handleExploreClick} />
      <CampaignsCarousel />
      <ImpactStatsBar />
      <EcosystemMap />
      <CommunitiesResources />
      <section ref={programsSectionRef}>
        <PlatformOfferings />
      </section>
      <ImpactPulseWidget />
      <FeaturedStoriesSection />
      <ProgramsAndPartnersSection />
      <ProgramsInitiativesSection />
      <RegionalHighlightsSection />
      <PartnerTicker />
      <JoinCommunitySection />
      <FooterCTASection />
      <SmartAssistant />
    </div>
  );
};

export default WomenEntrepreneursPage;

