import React from "react";

interface DiscoverSectionTitleProps {
  id?: string;
  as?: "h1" | "h2";
  children: React.ReactNode;
}

export const DiscoverSectionTitle: React.FC<DiscoverSectionTitleProps> = ({
  id,
  as = "h2",
  children,
}) => {
  const Tag = as;

  return (
    <Tag
      id={id}
      className="text-center"
      style={{
        fontFamily:
          '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
        fontSize: "48px",
        fontWeight: 700,
        fontStyle: "normal",
        color: "#000000",
        margin: 0,
        lineHeight: 1.2,
      }}
    >
      {children}
    </Tag>
  );
};


