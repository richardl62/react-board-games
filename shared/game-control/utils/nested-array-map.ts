/** map the elements of an array of arrays */
export function nestedArrayMap<T, MappedT>(
    array: Array<Array<T>>,
    func: (elem: T, indices: [number, number]) => MappedT
): Array<Array<MappedT>> {

    const result: Array<Array<MappedT>> = [];

    for (let ind1 = 0; ind1 < array.length; ++ind1) {
        result[ind1] = [];

        for (let ind2 = 0; ind2 < array[ind1].length; ++ind2) {
            const mapped = func(array[ind1][ind2], [ind1, ind2]);
            result[ind1][ind2] = mapped;
        }
    }

    return result;
}
