export const deletedSymbol = Symbol('deleted')

export function markDeleted(obj: object) {
    Object.defineProperty(obj, deletedSymbol, { value: true })
}
export function isDeleted(obj: object) {
    return !!Reflect.get(obj, deletedSymbol)
}
