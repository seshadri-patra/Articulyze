import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  glow?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, asChild = false, glow = true, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition duration-300 ease-in-out",
          "bg-white/5 text-white backdrop-blur-lg border border-white/10 shadow-lg hover:bg-white/10",
          glow &&
            "hover:shadow-[0_0_12px_rgba(99,102,241,0.8),0_0_32px_rgba(139,92,246,0.6)]",
          "focus:outline-none focus:ring-2 focus:ring-primary/80 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton };
