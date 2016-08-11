import lessonRegistry from './lesson_registry'
import sioError from './sio_error'

class LessonHandler {

  async '$Lesson.create' (socket, {userId}) {
    // TODO: check if teacher
    // TODO: check if student invited

    const lesson = lessonRegistry.create({
      teacherHandler: socket,
      studentId: userId
    })

    return {id: lesson.id}
  }

  async '$lesson.join' (socket, {id}) {
    const lesson = lessonRegistry.lessons[id]
    if (!lesson) throw sioError('lessonNotFound')

    return lesson.join(socket)
  }

  async '$lesson.relay' (socket, {id, data}) {
    const lesson = lessonRegistry.lessons[id]
    if (!lesson) throw sioError('lessonNotFound')

    return lesson.relay(socket, data)
  }

  async '$lesson.leave' (socket, {id}) {
    const lesson = lessonRegistry.lessons[id]
    if (!lesson) throw sioError('lessonNotFound')

    return lesson.leave(socket)
  }

  async '$lesson.getIceServers' (socket, {id}) {
    const lesson = lessonRegistry.lessons[id]
    if (!lesson) throw sioError('lessonNotFound')

    return lesson.getIceServers(socket)
  }

}

export default new LessonHandler()
