import React, { useMemo, useRef, useState } from "react";
import { PRODUCT_CLASSES, PRODUCTS } from "@/data/products";
import { ClassFilter } from "./ClassFilter";
import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export function ProductShowcase() {
    const [activeClass, setActiveClass] = useState<string>("all");
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    const classes = useMemo(
        () => [{ id: "all", label: "All Products", name: "All Products", shortName: "ALL", color: "indigo" }, ...PRODUCT_CLASSES],
        []
    );

    const filtered = useMemo(
        () => (activeClass === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.classId === activeClass)),
        [activeClass]
    );

    const classById = useMemo(() => Object.fromEntries(PRODUCT_CLASSES.map((c) => [c.id, c])), []);

    const scroll = (dir: "prev" | "next") => {
        const node = scrollerRef.current;
        if (!node) return;
        const firstCard = node.querySelector<HTMLElement>("article");
        const width = firstCard ? firstCard.getBoundingClientRect().width + 24 : 360;
        node.scrollBy({ left: dir === "next" ? width * 2 : -width * 2, behavior: "smooth" });
    };

    return (
        <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">DQ Products, grouped by execution class</h2>
                        <p className="text-lg text-gray-600 mt-1">Ten products. Four classes. One execution portfolio—built for real delivery.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => scroll("prev")}
                            className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-100"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="h-5 w-5 mx-auto" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scroll("next")}
                            className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="h-5 w-5 mx-auto" />
                        </button>
                    </div>
                </div>

                <ClassFilter
                    classes={classes}
                    activeId={activeClass}
                    onSelect={(id) => setActiveClass(id)}
                />

                <div
                    ref={scrollerRef}
                    className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
                >
                    <AnimatePresence mode="popLayout">
                        {filtered.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                productClass={classById[product.classId] ?? PRODUCT_CLASSES[0]}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}