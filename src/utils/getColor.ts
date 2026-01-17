import getRandomNumber from './getRandomNumber'

// turtle color options
const colorOptions = ['green', 'green', 'purple', 'pink']

export default () => {
  const index = getRandomNumber(colorOptions.length)
  return colorOptions[index]
}
