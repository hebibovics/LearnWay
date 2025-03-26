package unsa.ba.etf.learnway.controllers;

import unsa.ba.etf.learnway.models.Course;
import unsa.ba.etf.learnway.services.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/course")

public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping("/")
    public ResponseEntity<?> addCourse(@RequestBody Course course) {
        return ResponseEntity.ok(courseService.addCourse(course));
    }

    @GetMapping("/")
    public ResponseEntity<?> getCourses() {
        return ResponseEntity.ok(courseService.getCourses());
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<?> getCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(courseService.getCourse(courseId));
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<?> updateCourse(@PathVariable Long courseId, @RequestBody Course course) {
        if (courseService.getCourse(courseId) != null) {
            return ResponseEntity.ok(courseService.updateCourse(course));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Course with id : " + String.valueOf(courseId) + ", doesn't exists");
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long courseId) {
        courseService.deleteCourse(courseId);
        return ResponseEntity.ok(true);
    }
    @GetMapping("/by-instructor/{instructorId}")
    public ResponseEntity<?> getCoursesByInstructor(@PathVariable Long instructorId) {
        List<Course> courses = courseService.getCoursesByInstructor(instructorId);
        if (courses != null && !courses.isEmpty()) {
            return ResponseEntity.ok(courses);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No courses found for instructor with ID: " + instructorId);
        }
    }


    @PostMapping("/by-instructor/{instructorId}")
    public ResponseEntity<?> addCourseForInstructor(@PathVariable Long instructorId, @RequestBody Course course) {
        try {
            Course createdCourse = courseService.addCourseForInstructor(instructorId, course);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating course: " + e.getMessage());
        }
    }



}