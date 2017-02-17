import uniqueId from 'lodash/uniqueId'

export default function createApiMiddleware (apiClient) {
  return ({dispatch}) => (next) => async (action) => {
    const {meta = {}} = action
    const {api, apiId} = meta
    if (!api || apiId != null) return next(action)

    const newMeta = {...meta, apiId: uniqueId()}

    const {type} = action
    const {body} = api

    dispatch({
      ...action,
      type: type + '!start',
      payload: undefined,
      meta: newMeta
    })
    try {
      const result = await apiClient.post('/actions/' + type, body)
      dispatch({
        ...action,
        payload: result,
        meta: newMeta
      })
      return result
    } catch (err) {
      dispatch({
        ...action,
        type: type + '!error',
        payload: err,
        error: true,
        meta: newMeta
      })
      throw err
    }
  }
}
