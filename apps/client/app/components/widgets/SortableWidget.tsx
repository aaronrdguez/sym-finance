"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { ReactNode } from "react";

interface SortableWidgetProps {
  id: string;
  spanClass: string;
  children: ReactNode;
}

export function SortableWidget({ id, spanClass, children }: SortableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
    zIndex: isDragging ? 50 : undefined,
    position: (isDragging ? "relative" : undefined) as React.CSSProperties["position"],
  };

  return (
    <div ref={setNodeRef} style={style} className={spanClass}>
      <div className="relative group">
        <div
          {...attributes}
          {...listeners}
          className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing bg-fill/80 hover:bg-fill"
          aria-label="Arrastrar para reordenar"
        >
          <GripVertical className="w-3.5 h-3.5 text-label-secondary" />
        </div>
        {children}
      </div>
    </div>
  );
}
