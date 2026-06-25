"use client";

import { Plus, Minus } from "lucide-react";
import { WidgetConfig, WidgetType, WIDGET_DEFINITIONS, getWidgetDef, getDefaultWidgets } from "./types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";

interface WidgetSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgets: WidgetConfig[];
  onChange: (widgets: WidgetConfig[]) => void;
}

export function WidgetSettingsDialog({ open, onOpenChange, widgets, onChange }: WidgetSettingsDialogProps) {
  const toggleWidget = (type: WidgetType) => {
    const exists = widgets.find(w => w.type === type);
    if (exists) {
      onChange(widgets.filter(w => w.type !== type));
    } else {
      const def = getWidgetDef(type);
      onChange([...widgets, { type, size: def.defaultSize }]);
    }
  };

  const changeSize = (type: WidgetType, size: 1 | 2 | 3) => {
    onChange(widgets.map(w => w.type === type ? { ...w, size } : w));
  };

  const resetDefaults = () => {
    onChange(getDefaultWidgets());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-[20px]">
        <div className="p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Widgets del Resumen</DialogTitle>
            <DialogDescription className="text-sm text-label-secondary">
              Personalizá los paneles que aparecen en tu pantalla principal.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-label-secondary uppercase tracking-wider">
            {widgets.length} de {WIDGET_DEFINITIONS.length} activos
          </span>
          <button
            onClick={resetDefaults}
            className="text-xs text-accent hover:text-accent/80 font-medium transition-colors"
          >
            Restaurar predeterminados
          </button>
        </div>

        <div className="px-6 pb-6 space-y-2 max-h-[420px] overflow-y-auto">
          {WIDGET_DEFINITIONS.map((def) => {
            const config = widgets.find(w => w.type === def.type);
            const isActive = !!config;
            return (
              <div
                key={def.type}
                className={`rounded-xl border transition-all ${
                  isActive
                    ? 'border-separator bg-card'
                    : 'border-dashed border-separator/40 bg-transparent'
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-lg">{def.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isActive ? '' : 'text-label-secondary'}`}>{def.label}</p>
                    <p className="text-[11px] text-label-secondary truncate">{def.description}</p>
                  </div>
                  <button
                    onClick={() => toggleWidget(def.type)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-system-red/10 text-system-red hover:bg-system-red/20'
                        : 'bg-accent/10 text-accent hover:bg-accent/20'
                    }`}
                  >
                    {isActive ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {isActive && (
                  <div className="px-4 pb-3 flex items-center gap-1.5">
                    {([1, 2, 3] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => changeSize(def.type, s)}
                        className={`flex-1 h-8 rounded-lg text-xs font-medium transition-all ${
                          config.size === s
                            ? 'bg-accent text-white'
                            : 'bg-fill text-label-secondary hover:text-label'
                        }`}
                      >
                        {s === 1 ? 'Chico' : s === 2 ? 'Mediano' : 'Grande'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
