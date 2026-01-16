import getRandomNumber from './getRandomNumber'

// turtle color options
const colorOptions = ['green']

export default () => {
  const index = getRandomNumber(colorOptions.length)
  return colorOptions[index]
}
