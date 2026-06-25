"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  DndContext, closestCenter,
  MouseSensor, TouchSensor, KeyboardSensor, useSensor, useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Plus } from "lucide-react";
import { WidgetBalance } from "./WidgetBalance";
import { WidgetReserves } from "./WidgetReserves";
import { WidgetInvestments } from "./WidgetInvestments";
import { WidgetNews } from "./WidgetNews";
import { WidgetQuickStats } from "./WidgetQuickStats";
import { WidgetExchangeRates } from "./WidgetExchangeRates";
import { WidgetMarket } from "./WidgetMarket";
import { WidgetCrypto } from "./WidgetCrypto";
import type { WidgetConfig, WidgetType, ResolvedWidgetData } from "./types";
import { WIDGET_DEFINITIONS, getWidgetDef, getDefaultWidgets } from "./types";

interface ClientWidgetGridProps {
  widgets: WidgetConfig[];
  widgetData: ResolvedWidgetData;
  monthlyIncome: number;
  monthlyExpenses: number;
  onReorder: (widgets: WidgetConfig[]) => void;
  editing: boolean;
  onWidgetsChange: (widgets: WidgetConfig[]) => void;
}

function WidgetShell({ w, editing, onRemove, onSizeChange, children }: { w: WidgetConfig; editing: boolean; onRemove: () => void; onSizeChange: (size: 1 | 2 | 3) => void; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: w.type, disabled: !editing });

  return (
    <div
      ref={setNodeRef}
      style={{
        gridColumn: `span ${w.size}`,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 50 : undefined,
        position: isDragging ? "relative" : undefined,
      }}
    >
      <div className="relative">
        {editing && (
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-separator/30">
            <button
              onClick={onRemove}
              className="w-7 h-7 rounded-md flex items-center justify-center bg-system-red/20 text-system-red hover:bg-system-red/30 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1 ml-1">
              {([1, 2, 3] as const).map(s => (
                <button
                  key={s}
                  onClick={() => onSizeChange(s)}
                  className={`px-2.5 h-7 rounded-md text-[11px] font-semibold ${w.size === s ? "bg-accent text-white" : "bg-fill text-label-secondary hover:bg-fill/80"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div
              className="ml-auto w-7 h-7 flex items-center justify-center rounded-md cursor-grab active:cursor-grabbing text-label-secondary hover:bg-fill/80"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-3.5 h-3.5" />
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function ClientWidgetGrid({ widgets, widgetData, monthlyIncome, monthlyExpenses, onReorder, editing, onWidgetsChange }: ClientWidgetGridProps) {
  const [mounted, setMounted] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true) }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = widgets.findIndex(w => w.type === active.id);
    const newIndex = widgets.findIndex(w => w.type === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const r = [...widgets];
    const [m] = r.splice(oldIndex, 1);
    r.splice(newIndex, 0, m);
    onReorder(r);
  }, [widgets, onReorder]);

  const setSize = useCallback((type: WidgetType, size: 1 | 2 | 3) => {
    onWidgetsChange(widgets.map(w => w.type === type ? { ...w, size } : w));
  }, [widgets, onWidgetsChange]);

  const toggleWidget = useCallback((type: WidgetType) => {
    const exists = widgets.find(w => w.type === type);
    if (exists) {
      onWidgetsChange(widgets.filter(w => w.type !== type));
    } else {
      const def = getWidgetDef(type);
      onWidgetsChange([...widgets, { type, size: def.defaultSize }]);
    }
  }, [widgets, onWidgetsChange]);

  const removeWidget = useCallback((type: WidgetType) => {
    onWidgetsChange(widgets.filter(w => w.type !== type));
  }, [widgets, onWidgetsChange]);

  if (widgets.length === 0 && !editing) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-fill flex items-center justify-center mb-4">
          <LayoutIcon />
        </div>
        <p className="text-sm text-label-secondary mb-1">Panel vacío</p>
        <button
          onClick={() => onWidgetsChange(getDefaultWidgets())}
          className="h-10 px-6 rounded-xl bg-accent text-white text-sm font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar widgets
        </button>
      </div>
    );
  }

  const content = (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={widgets.map(w => w.type)} strategy={verticalListSortingStrategy}>
        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min">
          {widgets.map((w) => (
            <WidgetShell key={w.type} w={w} editing={editing} onRemove={() => removeWidget(w.type)} onSizeChange={(s) => setSize(w.type, s)}>
              {renderStaticWidget(w, widgetData, monthlyIncome, monthlyExpenses)}
            </WidgetShell>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min">
        {widgets.map((w) => (
          <div key={w.type} style={{ gridColumn: `span ${w.size}` }}>
            {renderStaticWidget(w, widgetData, monthlyIncome, monthlyExpenses)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {content}
      {editing && (
        <div className="rounded-2xl border border-dashed border-separator/40 p-5">
          <p className="text-xs font-semibold text-label-secondary uppercase tracking-wider mb-3">Agregar widgets</p>
          <div className="flex flex-wrap gap-2">
            {WIDGET_DEFINITIONS.filter(def => !widgets.find(w => w.type === def.type)).map(def => (
              <button
                key={def.type}
                onClick={() => toggleWidget(def.type)}
                className="flex items-center gap-2 h-9 px-3 rounded-xl bg-fill hover:bg-fill/80 text-sm font-medium text-label-secondary hover:text-label"
              >
                {def.icon} {def.label}
                <Plus className="w-3.5 h-3.5 text-accent" />
              </button>
            ))}
            {WIDGET_DEFINITIONS.filter(def => !widgets.find(w => w.type === def.type)).length === 0 && (
              <p className="text-sm text-label-secondary/60 py-2">Todos los widgets están activos</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LayoutIcon() {
  return (
    <svg className="w-7 h-7 text-label-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function renderStaticWidget(w: WidgetConfig, widgetData: ResolvedWidgetData, monthlyIncome: number, monthlyExpenses: number) {
  switch (w.type) {
    case 'balance':
      return <WidgetBalance {...widgetData} monthlyIncome={monthlyIncome} monthlyExpenses={monthlyExpenses} />;
    case 'reserves':
      return <WidgetReserves {...widgetData} />;
    case 'investments':
      return <WidgetInvestments />;
    case 'news':
      return <WidgetNews />;
    case 'quick_stats':
      return <WidgetQuickStats {...widgetData} />;
    case 'exchange_rates':
      return <WidgetExchangeRates />;
    case 'market':
      return <WidgetMarket />;
    case 'crypto':
      return <WidgetCrypto />;
    default:
      return null;
  }
}
