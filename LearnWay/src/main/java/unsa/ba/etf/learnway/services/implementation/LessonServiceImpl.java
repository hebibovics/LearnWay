package unsa.ba.etf.learnway.services.implementation;

import unsa.ba.etf.learnway.models.Course;
import unsa.ba.etf.learnway.models.Lesson;
import unsa.ba.etf.learnway.repository.LessonRepository;
import unsa.ba.etf.learnway.repository.CourseRepository;
import unsa.ba.etf.learnway.services.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class LessonServiceImpl implements LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Override
    public Lesson addLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    @Override
    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    @Override
    public Lesson getLessonById(Long id) {
        Optional<Lesson> lesson = lessonRepository.findById(id);
        if (lesson.isPresent()) {
            return lesson.get();
        } else {
            throw new RuntimeException("Lesson not found");
        }
    }

    @Override
    public Lesson updateLesson(Long id, Lesson lesson) {
        Lesson existingLesson = getLessonById(id);
        existingLesson.setTitle(lesson.getTitle());
        existingLesson.setDescription(lesson.getDescription());
        return lessonRepository.save(existingLesson);
    }

    @Override
    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }
    @Override
    public List<Lesson> getLessonsByCourse(Course course) {
        return lessonRepository.findByCourse(course);
    }

}
