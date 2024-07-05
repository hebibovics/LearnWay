package unsa.ba.etf.learnway.services;

import unsa.ba.etf.learnway.models.Lesson;

import java.util.List;

public interface LessonService {

    Lesson addLesson(Lesson lesson);

    List<Lesson> getLessons();

    Lesson getLesson(Long lessonId);

    Lesson updateLesson(Lesson lesson);

    void deleteLesson(Long lessonId);
}
