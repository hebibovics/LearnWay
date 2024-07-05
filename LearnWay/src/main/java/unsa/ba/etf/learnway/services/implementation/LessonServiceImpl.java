package unsa.ba.etf.learnway.services.implementation;

import unsa.ba.etf.learnway.models.Lesson;
import unsa.ba.etf.learnway.repository.LessonRepository;
import unsa.ba.etf.learnway.services.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonServiceImpl implements LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Override
    public Lesson addLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    @Override
    public List<Lesson> getLessons() {
        return lessonRepository.findAll();
    }

    public Lesson getLesson(Long lessonId) {
        return lessonRepository.findById(lessonId).isPresent() ? lessonRepository.findById(lessonId).get() : null;
    }

    @Override
    public Lesson updateLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    @Override
    public void deleteLesson(Long lessonId) {
        lessonRepository.delete(getLesson(lessonId));
    }
}
