import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
type ToasterProps = React.ComponentProps<typeof Sonner>;
const Toaster = ({
  ...props
}: ToasterProps) => {
  const {
    theme = "system"
  } = useTheme();
  return <Sonner theme={theme as ToasterProps["theme"]} className="toaster group" toastOptions={{
    classNames: {
      toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-700 group-[.toaster]:border group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-md",
      description: "group-[.toast]:text-gray-700",
      actionButton: "group-[.toast]:bg-brand-blue group-[.toast]:text-white group-[.toast]:hover:bg-brand-darkBlue",
      cancelButton: "group-[.toast]:bg-white group-[.toast]:border group-[.toast]:border-gray-300 group-[.toast]:text-gray-700 group-[.toast]:hover:bg-gray-50",
      success: "group-[.toast]:bg-brand-lightTeal group-[.toast]:text-brand-darkTeal group-[.toast]:border-l-4 group-[.toast]:border-brand-darkTeal",
      error: "group-[.toast]:bg-red-50 group-[.toast]:text-red-700 group-[.toast]:border-l-4 group-[.toast]:border-red-600",
      warning: "group-[.toast]:bg-brand-lime group-[.toast]:text-gray-900 group-[.toast]:border-l-4 group-[.toast]:border-brand-lime",
      info: "group-[.toast]:bg-brand-lightBlue group-[.toast]:text-brand-blue group-[.toast]:border-l-4 group-[.toast]:border-brand-blue"
    }
  }} {...props} />;
};
export { Toaster, toast };