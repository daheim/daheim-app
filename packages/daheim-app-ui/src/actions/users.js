
export const LOAD_USER = 'users.loadUser'
export const loadUser = ({id}) => {
  return {
    type: LOAD_USER,
    meta: {
      api: {
        body: {id}
      }
    }
  }
}

export const SEND_REVIEW = 'users.sendReview'
export const sendReview = (body) => {
  return {
    type: SEND_REVIEW,
    meta: {
      api: {body}
    }
  }
}
