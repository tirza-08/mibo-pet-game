export default (date: number) => {
  const hour = 1000 * 60 * 60
  const timePassed = Date.now() - date

  return timePassed / hour
}
