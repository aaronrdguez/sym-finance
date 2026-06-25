"use client";

import { useEffect, useState } from "react";
import { Plug, Unplug, RefreshCw, Settings, Trash2, Eye, EyeOff, Plus } from "lucide-react";
import { GlassCard } from "../../components/GlassCard";
import { DashboardShell } from "../../components/DashboardShell";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import api from "../../libs/api";

interface IntegrationDef {
  id: string;
  name: string;
  description: string;
  logo: string;
  fields: { key: string; label: string; type: "password" | "text" }[];
}

const SERVICE_STEPS: Record<string, { title: string; steps: string[] }> = {
  iol: {
    title: "Para activar las APIs de IOL:",
    steps: [
      "Ingresá a invertironline.com",
      "Andá a Mi Cuenta → Mensajes",
      'Enviá un mensaje solicitando "activación de APIs"',
      "Esperá la confirmación",
      "Andá a Mi Cuenta → Personalización → APIs",
      "Aceptá los términos y condiciones",
    ],
  },
  binance: {
    title: "Para generar tu API Key de Binance:",
    steps: [
      "Ingresá a Binance → Perfil → Administración de API",
      'Creá una nueva API Key con nombre "SyM Finance"',
      "Activá los permisos de Lectura (Enable Reading)",
      "Copiá la API Key y la Secret Key",
      "Pegalas acá arriba y conectá",
    ],
  },
  degiro: {
    title: "Para conectar DeGiro:",
    steps: [
      "Ingresá a tu cuenta de DeGiro",
      "Andá a Configuración → API / Conexiones",
      'Activá el acceso vía API (si está disponible)',
      "Usá tu usuario y contraseña de DeGiro",
      "Nota: DeGiro puede requerir activación manual de APIs desde su soporte",
    ],
  },
  paypal: {
    title: "Para conectar PayPal (Sandbox):",
    steps: [
      "Ingresá a developer.paypal.com",
      "Andá a Dashboard → Testing Tools → Sandbox Accounts",
      'Creá una cuenta Business de prueba',
      "Andá a Dashboard → My Apps & Credentials",
      'Creá una app (usá la cuenta sandbox que creaste)',
      "Copiá el Client ID y Client Secret de Sandbox",
      "Pegalos acá arriba y conectá",
    ],
  },
  mercadopago: {
    title: "Para obtener tu Access Token de Mercado Pago:",
    steps: [
      "Ingresá a mercadopago.com.ar/developers",
      "Iniciá sesión con tu cuenta de Mercado Pago",
      'Andá a "Tus integraciones" → "Crear aplicación"',
      'Poné un nombre (ej: "SyM Finance")',
      'En "Sitio web" poné cualquier URL válida (ej: http://localhost:3000)',
      "Andá a la solapa **Credenciales**",
      'Copiá el **Access Token** (el de "Producción")',
      "Pegalo acá arriba y conectá",
    ],
  },
  uala: {
    title: "Para conectar Ualá:",
    steps: [
      "Ualá no expone APIs públicas en este momento",
      "Podes agregar tu cuenta manualmente desde Cuentas",
      "Pronto tendremos integración automática",
    ],
  },
  brubank: {
    title: "Para conectar Brubank:",
    steps: [
      "Brubank no expone APIs públicas en este momento",
      "Podes agregar tu cuenta manualmente desde Cuentas",
      "Pronto tendremos integración automática",
    ],
  },
  lemoncash: {
    title: "Para conectar Lemon Cash:",
    steps: [
      "Ingresá a Lemon Cash → Configuración",
      'Buscá la opción "API / Desarrollo"',
      "Generá una API Key con permisos de lectura",
      "Copiala y pegalá acá arriba",
    ],
  },
  belo: {
    title: "Para conectar Belo:",
    steps: [
      "Belo no expone APIs públicas en este momento",
      "Podes agregar tu cuenta manualmente desde Cuentas",
      "Pronto tendremos integración automática",
    ],
  },
  fiwind: {
    title: "Para obtener tus credenciales de Fiwind:",
    steps: [
      "Ingresá a Fiwind → Configuración",
      'Andá a la sección "API Keys"',
      "Generá una nueva API Key con permisos de lectura",
      "Copiá la API Key y Secret Key",
      "Pegalas acá arriba y conectá",
    ],
  },
  cocoscapital: {
    title: "Para conectar Cocos Capital:",
    steps: [
      "Cocos Capital no expone APIs públicas en este momento",
      "Podes agregar tu cuenta manualmente desde Cuentas",
      "Pronto tendremos integración automática",
    ],
  },
  bullmarket: {
    title: "Para conectar Bull Market:",
    steps: [
      "Bull Market no expone APIs públicas en este momento",
      "Podes agregar tu cuenta manualmente desde Cuentas",
      "Pronto tendremos integración automática",
    ],
  },
  ppi: {
    title: "Para conectar PPI (Portfolio Personal Inversiones):",
    steps: [
      "PPI no expone APIs públicas en este momento",
      "Podes agregar tu cuenta manualmente desde Cuentas",
      "Pronto tendremos integración automática",
    ],
  },
}

const INTEGRATIONS: IntegrationDef[] = [
  { id: "degiro", name: "DeGiro", description: "Corretora europea — acciones y ETFs", logo: "/logos/degiro.svg", fields: [{ key: "username", label: "Usuario", type: "text" }, { key: "password", label: "Contraseña", type: "password" }] },
  { id: "binance", name: "Binance", description: "Exchange de criptomonedas", logo: "/logos/binance.png", fields: [{ key: "apiKey", label: "API Key", type: "text" }, { key: "secretKey", label: "Secret Key", type: "password" }] },
  { id: "paypal", name: "PayPal", description: "Billetera digital internacional", logo: "/logos/paypal.png", fields: [{ key: "clientId", label: "Client ID", type: "text" }, { key: "clientSecret", label: "Client Secret", type: "password" }] },
  { id: "mercadopago", name: "Mercado Pago", description: "Cuenta digital Argentina", logo: "/logos/mercadopago.svg", fields: [{ key: "accessToken", label: "Access Token", type: "password" }] },
  { id: "uala", name: "Ualá", description: "Cuenta bancaria y tarjeta", logo: "/logos/uala.svg", fields: [{ key: "apiKey", label: "API Key", type: "password" }] },
  { id: "brubank", name: "Brubank", description: "Banco digital argentino", logo: "/logos/brubank.svg", fields: [{ key: "apiKey", label: "API Key", type: "password" }] },
  { id: "lemoncash", name: "Lemon Cash", description: "Billetera cripto argentina", logo: "/logos/lemoncash.png", fields: [{ key: "apiKey", label: "API Key", type: "password" }] },
  { id: "belo", name: "Belo", description: "Billetera cripto con pesos", logo: "/logos/belo.svg", fields: [{ key: "apiKey", label: "API Key", type: "password" }] },
  { id: "fiwind", name: "Fiwind", description: "Exchange cripto argentino", logo: "/logos/fiwind.svg", fields: [{ key: "apiKey", label: "API Key", type: "text" }, { key: "secretKey", label: "Secret Key", type: "password" }] },
  { id: "cocoscapital", name: "Cocos Capital", description: "Inversiones en Estados Unidos", logo: "/logos/cocoscapital.svg", fields: [{ key: "apiKey", label: "API Key", type: "text" }, { key: "secretKey", label: "Secret Key", type: "password" }] },
  { id: "bullmarket", name: "Bull Market", description: "Plataforma de inversiones argentina", logo: "/logos/bullmarket.svg", fields: [{ key: "apiKey", label: "API Key", type: "password" }] },
  { id: "ppi", name: "PPI", description: "Portfolio Personal Inversiones", logo: "/logos/ppi.svg", fields: [{ key: "apiKey", label: "API Key", type: "text" }, { key: "secretKey", label: "Secret Key", type: "password" }] },
  { id: "iol", name: "IOL", description: "Plataforma de inversión argentina", logo: "/logos/iol.svg", fields: [{ key: "username", label: "Usuario", type: "text" }, { key: "password", label: "Contraseña", type: "password" }] },
];

interface Connection {
  uuid: string;
  service: string;
  label: string;
  enabled: boolean;
  hasCredentials: boolean;
}

export default function ConexionesPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIntg, setEditingIntg] = useState<IntegrationDef | null>(null);
  const [editingConn, setEditingConn] = useState<Connection | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const loadConnections = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/connections");
      setConnections(res.data.connections || []);
    } catch {
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadConnections() }, []);

  const getConn = (serviceId: string) => connections.find(c => c.service === serviceId);

  const openDialog = (intg: IntegrationDef) => {
    const existing = getConn(intg.id);
    setEditingIntg(intg);
    setEditingConn(existing || null);
    setFormValues({});
    setShowSecrets({});
    setSyncError(null);
    setDialogOpen(true);
  };

  const saveConnection = async () => {
    if (!editingIntg) return;
    const hasAnyValue = editingIntg.fields.some(f => formValues[f.key]?.trim());
    if (!hasAnyValue && !editingConn) return;

    setSyncing(true);
    setSyncError(null);

    try {
      let res;
      if (editingConn) {
        if (hasAnyValue) {
          const credentials: Record<string, string> = {};
          editingIntg.fields.forEach(f => { if (formValues[f.key]) credentials[f.key] = formValues[f.key]; });
          res = await api.put(`/api/connections/${editingConn.uuid}`, { credentials, enabled: true });
        } else {
          setSyncing(false);
          setDialogOpen(false);
          loadConnections();
          return;
        }
      } else {
        const credentials: Record<string, string> = {};
        editingIntg.fields.forEach(f => { credentials[f.key] = formValues[f.key] || ""; });
        res = await api.post("/api/connections", { service: editingIntg.id, label: editingIntg.name, credentials, enabled: true });
      }

      const warn = res.data?.connection?.syncWarning || res.data?.syncWarning;
      if (warn) {
        setSyncError(warn);
        setSyncing(false);
        return;
      }

      setDialogOpen(false);
      loadConnections();
    } catch (err: any) {
      setSyncError(err?.response?.data?.message || err?.message || "Error al conectar");
    } finally {
      setSyncing(false);
    }
  };

  const toggleEnabled = async (conn: Connection) => {
    try {
      await api.put(`/api/connections/${conn.uuid}`, { enabled: !conn.enabled });
      loadConnections();
    } catch {}
  };

  const deleteConnection = async (conn: Connection) => {
    try {
      await api.delete(`/api/connections/${conn.uuid}`);
      loadConnections();
    } catch {}
  };

  return (
    <DashboardShell>
      <div className="flex items-center gap-3 mb-8">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Conexiones</h1>
          <p className="text-sm text-label-secondary mt-0.5">Vinculá tus cuentas externas para centralizar tus finanzas</p>
        </div>
        <button onClick={loadConnections} className="ml-auto p-2 rounded-lg text-label-secondary hover:bg-fill transition-colors" disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INTEGRATIONS.map((intg) => {
          const conn = getConn(intg.id);
          const connected = !!conn;
          const enabled = conn?.enabled ?? false;
          return (
            <GlassCard
              key={intg.id}
              className={`p-5 transition-all ${connected && enabled ? 'ring-1 ring-accent/30' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-fill-secondary flex items-center justify-center p-1.5">
                  <img src={intg.logo} alt={intg.name} className="w-full h-full object-contain" />
                </div>
                {connected && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => openDialog(intg)} className="w-7 h-7 rounded-lg flex items-center justify-center text-label-secondary hover:bg-fill transition-colors" title="Configurar">
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteConnection(conn)} className="w-7 h-7 rounded-lg flex items-center justify-center text-label-secondary hover:text-system-red hover:bg-system-red/10 transition-colors" title="Eliminar">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">{intg.name}</h3>
                {connected && (
                  <button
                    onClick={() => toggleEnabled(conn)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${enabled ? 'bg-accent' : 'bg-[#38383A]'}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-[18px]' : 'translate-x-1'}`} />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-label-secondary mb-3">{intg.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {connected && enabled ? (
                    <><Plug className="w-3 h-3 text-system-green" /><span className="text-[10px] font-medium text-system-green">Conectado</span></>
                  ) : connected && !enabled ? (
                    <><Unplug className="w-3 h-3 text-label-secondary" /><span className="text-[10px] font-medium text-label-secondary">Pausado</span></>
                  ) : (
                    <><Unplug className="w-3 h-3 text-label-secondary" /><span className="text-[10px] font-medium text-label-secondary">Desconectado</span></>
                  )}
                </div>
                {!connected && (
                  <button onClick={() => openDialog(intg)} className="w-7 h-7 rounded-lg flex items-center justify-center text-accent hover:bg-accent/10 transition-colors" title="Conectar">
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingConn ? `Configurar ${editingIntg?.name}` : `Conectar ${editingIntg?.name}`}</DialogTitle>
            <DialogDescription>
              {editingConn ? "Actualizá las credenciales o dejá los campos vacíos para mantener las actuales." : "Ingresá las credenciales de tu cuenta para vincularla."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {editingIntg?.fields.map(f => (
              <div key={f.key}>
                <label className="text-[11px] font-medium text-label-secondary block mb-1">{f.label}</label>
                <div className="relative">
                  <input
                    type={showSecrets[f.key] ? "text" : f.type}
                    value={formValues[f.key] || ""}
                    onChange={e => setFormValues(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.type === "password" ? "••••••••" : `Ingresá tu ${f.label.toLowerCase()}`}
                    className="w-full h-9 rounded-lg bg-fill px-3 pr-8 text-sm outline-none placeholder:text-label-secondary/30"
                  />
                  {f.type === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowSecrets(prev => ({ ...prev, [f.key]: !prev[f.key] }))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-label-secondary hover:text-label transition-colors"
                    >
                      {showSecrets[f.key] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {syncError && editingIntg && (
            <div className="rounded-lg bg-system-red/10 border border-system-red/20 p-3 space-y-2">
              <p className="text-xs font-medium text-system-red">{syncError}</p>
              {SERVICE_STEPS[editingIntg.id] && (
                <div className="text-[11px] text-label-secondary space-y-1">
                  <p className="font-medium text-label">{SERVICE_STEPS[editingIntg.id].title}</p>
                  <ol className="list-decimal pl-4 space-y-0.5">
                    {SERVICE_STEPS[editingIntg.id].steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-2 justify-end pt-2">
            <button onClick={() => setDialogOpen(false)} className="px-4 h-9 rounded-lg text-sm font-medium text-label-secondary hover:bg-fill transition-colors">
              Cancelar
            </button>
            <button
              onClick={saveConnection}
              disabled={syncing}
              className="px-4 h-9 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {syncing ? "Conectando..." : editingConn ? "Guardar cambios" : "Conectar"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
