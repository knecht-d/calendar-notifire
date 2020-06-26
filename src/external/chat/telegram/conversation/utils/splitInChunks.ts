// See https://stackoverflow.com/questions/8495687/split-array-into-chunks
export function splitInChunks<T>(input: Array<T>, numberOfItems: number): Array<Array<T>> {
    return input.reduce((splittedArrays, item, index) => {
        const chunkIndex = Math.floor(index / numberOfItems);
        if (!splittedArrays[chunkIndex]) {
            splittedArrays[chunkIndex] = []; // start a new chunk
        }
        splittedArrays[chunkIndex].push(item);
        return splittedArrays;
    }, [] as Array<Array<T>>);
}
