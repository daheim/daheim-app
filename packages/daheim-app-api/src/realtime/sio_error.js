export default function sioError (code) {
  const error = new Error(code)
  error.sio = code
  return error
}
