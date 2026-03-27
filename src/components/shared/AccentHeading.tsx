interface AccentHeadingProps {
  text: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

/** Heading block with left coloured accent bar — blue accent for service detail pages */
export const AccentHeading = ({ text, level = 2, className = "" }: AccentHeadingProps) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const baseClasses = "flex items-center gap-3 font-semibold text-gray-900";
  const sizeClasses = {
    1: "text-3xl",
    2: "text-xl", 
    3: "text-lg",
    4: "text-base",
    5: "text-sm",
    6: "text-xs"
  };

  return (
    <HeadingTag className={`${baseClasses} ${sizeClasses[level]} ${className}`}>
      <span className="h-6 w-1 rounded-full flex-shrink-0" style={{ backgroundColor: '#030E31' }} />
      {text}
    </HeadingTag>
  );
};