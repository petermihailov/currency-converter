// @ts-expect-error -- recursive
export type StorageValue = string | number | boolean | Record<string, StorageValue> | StorageValue[]

const PREFIX = 'xc'

export interface IStorage<T = unknown> {
  clear: () => boolean
  get: () => T
  set: (value: T) => boolean
  update: <V extends T extends object ? Partial<T> : never>(value: V) => boolean
  watch: (cb: (value: T) => void) => () => void
}

export class Storage<T extends StorageValue> implements IStorage<T> {
  private readonly key: string
  private readonly defaultValue: T

  constructor(key: string, defaultValue: T) {
    this.key = `${PREFIX}.${key}`
    this.defaultValue = defaultValue

    // Если ещё нет значения — записываем дефолт
    if (window.localStorage.getItem(this.key) === null) {
      this.set(this.defaultValue)
    }
  }

  clear(): boolean {
    localStorage.removeItem(this.key)
    return true
  }

  get(): T {
    const json = window.localStorage.getItem(this.key)
    if (!json) return this.defaultValue
    try {
      return JSON.parse(json) as T
    } catch {
      return this.defaultValue
    }
  }

  set(value: T) {
    try {
      localStorage.setItem(this.key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  }

  update<V extends Partial<T>>(value: V) {
    const current = this.get()
    const merged = { ...current, ...value }
    return this.set(merged)
  }

  watch(cb: (value: T) => void) {
    const handler = (e: StorageEvent) => {
      if (e.storageArea === localStorage && e.key === this.key) {
        if (e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue) as T
            cb(parsed)
          } catch {
            // empty
          }
        }
      }
    }
    window.addEventListener('storage', handler)

    return () => window.removeEventListener('storage', handler)
  }
}
