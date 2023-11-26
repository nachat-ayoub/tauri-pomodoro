function formatDuration(
  duration: number
  // durationType: 'seconds' | 'minutes' | 'hours' = 'minutes'
) {
  return duration < 1 ? duration * 60 + ' seconds' : duration + ' minutes';
}

export { formatDuration };
