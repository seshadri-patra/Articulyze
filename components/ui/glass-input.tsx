import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-2.5 rounded-lg text-sm text-white bg-white/5 backdrop-blur-md",
          "border border-white/10 placeholder:text-gray-400 focus:placeholder:text-gray-300",
          "focus:outline-none focus:ring-2 focus:ring-primary/70 focus:ring-offset-2",
          "transition-all duration-200 ease-in-out shadow-inner",
          "hover:bg-white/10 focus:bg-white/10",
          className
        )}
        {...props}
      />
    );
  }
);
GlassInput.displayName = "GlassInput";

export { GlassInput };
