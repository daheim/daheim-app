export default function restError (opt = {}) {
  const error = new Error(opt.error || opt.code)
  error.rest = opt
  return error
}
