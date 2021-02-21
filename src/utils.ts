import * as R from 'ramda'

const properHandles = ['n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw']

const filterProperHandles = (handlesArray: string[]): string[] => {
  return R.intersection(properHandles, handlesArray)
}

/**
 * convert string to array
 *
 * @example
 * convertHandles('e, s, w') => ['e', 's', 'w']
 */
const convertHandles = (handlesString: string | undefined): string[] => {
  return (R.compose as any)(
    filterProperHandles,
    R.uniq,
    R.map(R.trim),
    R.split(','),
    R.ifElse(R.compose(R.equals('String'), R.type), R.identity, () => {
      throw Error('inappropriate handle input!')
    })
  )(handlesString)
}
const getTrimedHandles = (handlesString: string | undefined): string[] => {
  return (R.compose as any)(convertHandles, R.defaultTo('e, s, se'))(handlesString)
}

export { filterProperHandles, getTrimedHandles }
