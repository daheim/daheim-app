
export const LOAD_LESSONS = 'lessons.loadLessons'
export const loadLessons = () => {
  return {
    type: LOAD_LESSONS,
    meta: {
      api: {}
    }
  }
}
