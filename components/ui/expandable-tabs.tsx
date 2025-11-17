"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  title: string;
  icon: LucideIcon;
  href: string;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
  href?: never;
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-primary",
  onChange,
}: ExpandableTabsProps) {
  const pathname = usePathname();
  const [selected, setSelected] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Find active tab based on current pathname
  const activeTabIndex = React.useMemo(() => {
    return tabs.findIndex((tab) => {
      if (tab.type === "separator") return false;
      if (tab.href === "/" && pathname === "/") return true;
      if (tab.href !== "/" && pathname?.startsWith(tab.href)) return true;
      return false;
    });
  }, [pathname, tabs]);

  // Auto-expand active tab when page changes
  React.useEffect(() => {
    if (activeTabIndex >= 0) {
      setSelected(activeTabIndex);
    }
  }, [activeTabIndex]);

  // Handle click outside to collapse (only if not on active page)
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Only collapse if we're not on an active page
        if (activeTabIndex < 0) {
          setSelected(null);
          onChange?.(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeTabIndex, onChange]);

  const handleSelect = (index: number) => {
    // If clicking the same tab, toggle it
    // If clicking a different tab, expand it
    const newSelected = selected === index ? null : index;
    setSelected(newSelected);
    onChange?.(newSelected);
  };

  const Separator = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-border" aria-hidden="true" />
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-2xl border bg-background/95 backdrop-blur border-border/50 p-1.5 shadow-sm",
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }

        const Icon = tab.icon;
        const isActive = activeTabIndex === index;
        // Active tab is always expanded, or if manually selected
        const isExpanded = isActive || selected === index;

        return (
          <Link 
            key={tab.title} 
            href={tab.href} 
            className="no-underline"
            onClick={() => {
              // Expand/collapse on click
              handleSelect(index);
            }}
          >
            <motion.div
              variants={buttonVariants}
              initial={false}
              animate="animate"
              custom={isExpanded}
              transition={transition}
              className={cn(
                "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer",
                isActive
                  ? cn("bg-primary text-primary-foreground shadow-sm", activeColor)
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.span
                    variants={spanVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={transition}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {tab.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}

