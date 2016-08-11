import {handleActions} from 'redux-actions'

import {LOAD_LESSONS} from '../actions/lessons'

export default handleActions({
  [LOAD_LESSONS]: (state, action) => {
    const now = Date.now()
    const {lessonList, lessons} = action.payload

    const lessonsWithMeta = {}
    for (let x in lessons) {
      lessonsWithMeta[x] = {
        meta: {loaded: now},
        data: lessons[x]
      }
    }

    return {
      ...state,
      lessonList: {
        meta: {loaded: now},
        data: lessonList
      },
      lessons: {
        ...state.lessons,
        ...lessonsWithMeta
      }
    }
  },

  [LOAD_LESSONS + '!error']: (state, action) => {
    const now = Date.now()
    return {
      ...state,
      lessonList: {
        ...state.lessonList,
        meta: {
          ...state.lessonList.meta,
          loading: undefined,
          error: action.payload.message,
          errorDate: now
        }
      }
    }
  },

  [LOAD_LESSONS + '!start']: (state, action) => {
    return {
      ...state,
      lessonList: {
        ...state.lessonList,
        meta: {
          ...state.lessonList.meta,
          loading: true
        }
      }
    }
  }
}, {
  lessons: {},
  lessonList: {meta: {}, data: []}
})
