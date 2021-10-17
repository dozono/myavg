function reduce<T, A>(arr: Array<T>, reducer: (acc: A, item: T) => A, init: A): A {
    let acc = init
    for (let item of arr) {
        acc = reducer(acc, item)
    }
    return acc
}


const a = [1, 2, 3, 4, 5]

console.log(reduce(a, (acc, item) => acc + item, 1))


let c = 1
let cc: number[] = []


function map<T, V>(arr: Array<T>, mappa: (e: T) => V): V[] {
    return reduce(arr, (acc, item) => [...acc, mappa(item)], [] as V[])
}

//if()

map(a, (v) => v + 1)

// [2,3,4,5,6]
// [6, ]
// [6,5,3,3,2,1]
//[2]   [3,2]













function filter<T>(arr: Array<T>, filter: (e: T) => boolean): T[] {
    return reduce(arr, (acc, item) => filter(item) ? [...acc, item] : acc, [] as T[])
}