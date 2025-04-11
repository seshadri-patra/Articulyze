"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center group",
      className
    )}
    {...props}
  >
    {/* Track (full bar) */}
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-white/10 backdrop-blur-md shadow-inner group-hover:bg-white/20 transition-all">
      {/* Active range (filled part) */}
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all" />
    </SliderPrimitive.Track>

    {/* Draggable thumb */}
    <SliderPrimitive.Thumb
      className="block h-5 w-5 rounded-full border border-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg ring-1 ring-white/20 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:ring-offset-2"
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
