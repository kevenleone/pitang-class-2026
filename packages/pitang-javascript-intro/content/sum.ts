function sum(a: number, b: number) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("A or B is not a number");
  }

  return a + b;
}

try {
  sum(1, 1);
} catch (error) {
  if (error instanceof TypeError) {
    /// abc...
  }
}
