export const saveBestScore = (score: number): void => {
  localStorage.setItem('2048-best-score', score.toString());
};

export const loadBestScore = (): number => {
  const savedScore = localStorage.getItem('2048-best-score');
  return savedScore ? parseInt(savedScore, 10) : 0;
};