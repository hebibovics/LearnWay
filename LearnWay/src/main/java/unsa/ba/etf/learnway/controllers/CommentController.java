package unsa.ba.etf.learnway.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import unsa.ba.etf.learnway.dtos.CommentResponseDTO;
import unsa.ba.etf.learnway.models.Comment;
import unsa.ba.etf.learnway.services.CommentService;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody Comment comment) {
        return ResponseEntity.ok(commentService.saveComment(comment));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CommentResponseDTO>> getCommentsByCourse(@PathVariable Long courseId) {
        List<CommentResponseDTO> dtos = commentService.getCommentDTOsByCourseId(courseId);
        return ResponseEntity.ok(dtos);
    }
    @PostMapping("/course/{courseId}/user/{userId}")
    public ResponseEntity<Comment> addCommentToCourseByUser(
            @PathVariable Long courseId,
            @PathVariable Long userId,
            @RequestBody Comment comment) {
        return ResponseEntity.ok(commentService.saveCommentForCourseAndUser(comment, courseId, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok("Comment deleted successfully.");
    }

}
