import React from "react";
import type { ProductClass } from "@/data/products";

interface ClassFilterProps {
    readonly classes: readonly ProductClass[];
    readonly activeId: string;
    readonly onSelect: (id: string) => void;
}

export function ClassFilter({ classes, activeId, onSelect }: ClassFilterProps) {
    return (
        <div className="w-full overflow-x-auto pb-2" role="tablist" aria-label="Product classes">
            <div className="inline-flex items-center gap-3 min-w-full">
                {classes.map((cls) => {
                    const isActive = cls.id === activeId;
                    return (
                        <button
                            key={cls.id}
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => onSelect(cls.id)}
                            className={[
                                "px-6 py-3 rounded-full text-base font-semibold border transition-colors whitespace-nowrap",
                                isActive
                                    ? "bg-[#0c1a3a] text-white border-[#0c1a3a] shadow-md"
                                    : "bg-white text-gray-800 border-[#e5e9f5] hover:border-[#0c1a3a] hover:text-[#0c1a3a]",
                            ].join(" ")}
                        >
                            {cls.name} ({cls.shortName})
                        </button>
                    );
                })}
            </div>
        </div>
    );
}