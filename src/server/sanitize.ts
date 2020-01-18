export default (input: any) => {
  if (input instanceof Object) {
    Object.keys(input).forEach(key => {
      if (/^\$/.test(key)) delete input[key]
    })
  }
  return input
}
