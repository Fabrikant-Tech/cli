export function levenshteinDistance(a: string, b: string) {
  const matrix = Array.from({ length: a.length + 1 }, () => []) as number[][];

  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}

export function similarityRatio(a: string, b: string) {
  const distance = levenshteinDistance(a, b);
  const maxLength = Math.max(a.length, b.length);
  return (maxLength - distance) / maxLength;
}
