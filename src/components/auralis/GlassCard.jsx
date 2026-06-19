import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GlassCard({ children, className, animate = true, ...props }) {
  const Wrapper = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  } : {};

  return (
    <Wrapper
      className={cn("glass rounded-2xl p-5", className)}
      {...animationProps}
      {...props}
    >
      {children}
    </Wrapper>
  );
}