import R from 'ramda';

/**
 * Create a chain of promises to be sequentially evaluated
 * @param promiseList an iterable of promises to be executed in order
 */
export const promiseChain = async (promiseList: Promise<any>[]): Promise<any> => (
    R.reduce(
        // @ts-ignore: it's wrong
        (p1, p2) => p1.then(p2),
        Promise.resolve('start'),
        promiseList
    )
)
