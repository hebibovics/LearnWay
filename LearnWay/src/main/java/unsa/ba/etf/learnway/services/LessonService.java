package unsa.ba.etf.learnway.services;

import unsa.ba.etf.learnway.models.Course;
import unsa.ba.etf.learnway.models.Lesson;

import java.util.List;

public interface LessonService {

    Lesson addLesson(Lesson lesson);
    List<Lesson> getAllLessons();
    Lesson getLessonById(Long id);
    Lesson updateLesson(Long id, Lesson lesson);
    void deleteLesson(Long id);
    List<Lesson> getLessonsByCourse(Course course);
    String getVideoUrlByLessonId(Long lessonId);
    void updateVideoUrl(Long lessonId, String videoUrl);
    void deleteVideoUrl(Long lessonId);

}
