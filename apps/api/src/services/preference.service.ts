import db from '../utils/db'

export async function getPreferences(uuid: string) {
  const user = await db.user.findUnique({
    where: { uuid },
    select: { preferences: true }
  })

  return user?.preferences ?? {}
}

export async function setTheme(uuid: string, theme: 'dark' | 'light') {
  const user = await db.user.findUnique({
    where: { uuid },
    select: { preferences: true }
  })
  const currentPrefs = (user?.preferences ?? {}) as Record<string, unknown>

  await db.user.update({
    where: { uuid },
    data: { preferences: { ...currentPrefs, theme } }
  })
  
  return { ok: true }
}

export async function setWidgetLayout(uuid: string, layout: Record<string, unknown>[]) {
  const user = await db.user.findUnique({
    where: { uuid },
    select: { preferences: true }
  })
  const currentPrefs = (user?.preferences ?? {}) as Record<string, unknown>

  await db.user.update({
    where: { uuid },
    data: { preferences: { ...currentPrefs, widgetLayout: layout as any } }
  })

  return { ok: true }
}

export async function setConnections(uuid: string, connections: Record<string, boolean>) {
  const user = await db.user.findUnique({
    where: { uuid },
    select: { preferences: true }
  })
  const currentPrefs = (user?.preferences ?? {}) as Record<string, unknown>

  await db.user.update({
    where: { uuid },
    data: { preferences: { ...currentPrefs, connections } }
  })

  return { ok: true }
}

export async function setFavorites(uuid: string, key: string, values: string[]) {
  const user = await db.user.findUnique({
    where: { uuid },
    select: { preferences: true }
  })
  const currentPrefs = (user?.preferences ?? {}) as Record<string, unknown>

  const prefs = { ...currentPrefs } as any
  prefs[key] = values

  await db.user.update({
    where: { uuid },
    data: { preferences: prefs }
  })

  return { ok: true }
}
