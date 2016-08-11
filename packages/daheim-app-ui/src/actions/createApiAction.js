
export default function createApiAction (type) {
  return function (body) {
    return {
      type,
      meta: {
        api: {body}
      }
    }
  }
}
