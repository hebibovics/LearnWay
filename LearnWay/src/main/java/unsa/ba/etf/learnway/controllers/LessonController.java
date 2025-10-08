package unsa.ba.etf.learnway.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import unsa.ba.etf.learnway.models.Course;
import unsa.ba.etf.learnway.models.Lesson;
import unsa.ba.etf.learnway.services.CourseService;
import unsa.ba.etf.learnway.services.LessonService;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/lesson")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @Autowired
    private CourseService courseService;

    @PostMapping("/api/lesson/{courseId}")
    public ResponseEntity<?> addLesson(@RequestBody Lesson lesson, @PathVariable Long courseId) {
        try {
            Course course = courseService.findCourseById(courseId);
            if (course == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
            }
            lesson.setCourse(course);
            return ResponseEntity.ok(lessonService.addLesson(lesson));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding lesson: " + e.getMessage());
        }
    }

    @GetMapping("/api/lesson/{courseId}")
    public ResponseEntity<List<Lesson>> getLessonsByCourseId(@PathVariable Long courseId) {
        try {
            Course course = courseService.findCourseById(courseId);
            if (course == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            List<Lesson> lessons = lessonService.getLessonsByCourse(course);
            return ResponseEntity.ok(lessons);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }




    @GetMapping("/")
    public ResponseEntity<List<Lesson>> getAllLessons() {
        return ResponseEntity.ok(lessonService.getAllLessons());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLessonById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(lessonService.getLessonById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lesson not found");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLesson(@PathVariable Long id, @RequestBody Lesson lesson) {
        try {
            return ResponseEntity.ok(lessonService.updateLesson(id, lesson));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating lesson: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id) {
        try {
            lessonService.deleteLesson(id);
            return ResponseEntity.ok("Lesson deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting lesson: " + e.getMessage());
        }
    }

    // GET video URL by lessonId
    @GetMapping("/{lessonId}/video")
    public ResponseEntity<String> getVideoUrl(@PathVariable Long lessonId) {
        String videoUrl = lessonService.getVideoUrlByLessonId(lessonId);
        return ResponseEntity.ok(videoUrl);
    }

    @PutMapping("/{lessonId}/video")
    public ResponseEntity<String> updateVideoUrl(@PathVariable Long lessonId,
                                                 @RequestBody String videoUrl) {
        lessonService.updateVideoUrl(lessonId, videoUrl);
        return ResponseEntity.ok("Video URL updated successfully");
    }

    // DELETE video URL
    @DeleteMapping("/{lessonId}/video")
    public ResponseEntity<String> deleteVideoUrl(@PathVariable Long lessonId) {
        lessonService.deleteVideoUrl(lessonId);
        return ResponseEntity.ok("Video URL deleted successfully");
    }
}

