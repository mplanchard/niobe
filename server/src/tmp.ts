import R from "ramda";
import { resolve } from "url";
import { AsyncResource } from "async_hooks";

interface Items {
    [x: string]: () => void;
}

interface ToCreate {
    [x: number]: Items
}

const toCreate: Items[] = [
    {
        foo: () => {console.log('foo exc')},
        bar: () => {console.log('bar exc')},
    },
    {
        baz: () => {console.log('baz exc')},
    }
]

const toDo = {
    foo: () => {console.log('foo exc')},
    bar: () => {console.log('bar exc')},
}


// const prom = R.reduce(
//     (a, b) => (a.then(b)),
//     Promise.resolve(async () => {}),
//     R.map(
//         (mapping) => Promise.all(R.map(
//             async ([name, func]) => {console.log(name); func()},
//             Object.entries(mapping),
//         )),
//         Object.values(toCreate)
//     )
// )

// const proms = R.map(
//     (items) => Promise.all(
//         R.map(
//             async ([name, func]) => {console.log(name); func()},
//             Object.entries(items)
//         )
//     ),
//     toCreate
// )

// const proms = R.map(
//     ([name, func]) => async () => {console.log(name); func()},
//     Object.entries(toDo)
// )

const promFunc = async () => {
    return R.reduce(
        // @ts-ignore
        (p1, p2)  => p1.then(p2),
        Promise.resolve('empty'),
        R.map(
            (item) => Promise.all(
                R.map(
                    ([name, func]) => (async () => {
                        {console.log(name), func()};
                    })(),
                    Object.entries(item)
                )
            ) ,
            R.reverse(Object.values(toCreate))
        )
    )
}

promFunc().then(() => {console.log('done')})

// for (const prom of proms) {
//     console.log(prom);
//     prom().then(() => {console.log('done')})
// }