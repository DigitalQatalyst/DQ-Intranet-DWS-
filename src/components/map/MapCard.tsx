import React from "react";
import clsx from "clsx";

import DQMap from "../DQMap";
import type { LocationItem } from "../../api/MAPAPI";

export type MapCardProps = {
  locations: LocationItem[];
  selectedId?: string | null;
  onSelect?: (location: LocationItem) => void;
  onClearFilters?: () => void;
  className?: string;
};

const MapCard: React.FC<MapCardProps> = ({
  locations,
  selectedId,
  onSelect,
  onClearFilters,
  className = "",
}) => {
  return (
    <div
      className={clsx(
        "relative h-full w-full",
        className,
      )}
    >
      {onClearFilters ? (
        <button
          type="button"
          onClick={onClearFilters}
          className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1.5 text-sm ring-1 ring-slate-200 shadow-sm hover:bg-white"
        >
          All locations
        </button>
      ) : null}

      <DQMap className="absolute inset-0" locations={locations} selectedId={selectedId} onSelect={onSelect} />
    </div>
  );
};

export default MapCard;
