import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-primary-200/50",
  secondary:
    "bg-gradient-to-r from-secondary to-warning hover:from-yellow-400 hover:to-yellow-500 text-neutral-black shadow-secondary/30",
  success:
    "bg-gradient-to-r from-success to-green-500 hover:from-green-500 hover:to-green-600 text-white shadow-success/30",
  error:
    "bg-gradient-to-r from-error to-red-500 hover:from-red-500 hover:to-red-600 text-white shadow-error/30",
  warning:
    "bg-gradient-to-r from-warning to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-neutral-black shadow-warning/30",
  outline:
    "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 bg-transparent",
  ghost:
    "text-neutral-dark-grey hover:bg-neutral-silver hover:text-neutral-black bg-transparent",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  loading = false,
  ...props
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 shadow-lg",
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        loading && "cursor-wait",
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}
