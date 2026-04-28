function sum(...values: number[]) {
    return values.reduce((acc, value) => acc + value, 0);
}

const sum2 = (a: number, b: number): number => a + b;

console.log(sum(1, 2, 3));
