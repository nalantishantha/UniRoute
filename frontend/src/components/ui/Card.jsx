import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export function Card({ children, className, hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, shadow: "0 20px 40px rgba(0,0,0,0.1)" } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "bg-white rounded-xl border-2 border-neutral-silver/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "px-6 py-5 border-b-2 border-neutral-silver/30 bg-gradient-to-r from-neutral-light-grey/20 to-neutral-silver/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("px-6 py-5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      className={cn("text-lg font-bold text-neutral-black", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p
      className={cn("text-sm text-neutral-grey mt-2 font-medium", className)}
      {...props}
    >
      {children}
    </p>
  );
}
