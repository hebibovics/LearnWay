package unsa.ba.etf.learnway.controllers;

import unsa.ba.etf.learnway.models.Lesson;
import unsa.ba.etf.learnway.services.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/api/lesson")

public class LessonController {

    @Autowired
    private LessonService lessonService;

    @PostMapping("/")
    public ResponseEntity<?> addLesson(@RequestBody Lesson lesson) {
        return ResponseEntity.ok(lessonService.addLesson(lesson));
    }

    @GetMapping("/")
    public ResponseEntity<?> getLessons() {
        return ResponseEntity.ok(lessonService.getLessons());
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<?> getLesson(@PathVariable Long lessonId) {
        return ResponseEntity.ok(lessonService.getLesson(lessonId));
    }

    @PutMapping("/{lessonId}")
    public ResponseEntity<?> updateLesson(@PathVariable Long lessonId, @RequestBody Lesson lesson) {
        if (lessonService.getLesson(lessonId) != null) {
            return ResponseEntity.ok(lessonService.updateLesson(lesson));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lesson with id : " + String.valueOf(lessonId) + ", doesn't exists");
    }

    @DeleteMapping("/{lessonId}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long lessonId) {
        lessonService.deleteLesson(lessonId);
        return ResponseEntity.ok(true);
    }
}
