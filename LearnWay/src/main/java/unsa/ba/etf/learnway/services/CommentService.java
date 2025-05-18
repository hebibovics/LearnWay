package unsa.ba.etf.learnway.services;

import unsa.ba.etf.learnway.dtos.CommentResponseDTO;
import unsa.ba.etf.learnway.models.Comment;

import java.util.List;

public interface CommentService {
    Comment saveComment(Comment comment);
    List<Comment> getCommentsByCourseId(Long courseId);
    Comment saveCommentForCourseAndUser(Comment comment, Long courseId, Long userId);
    List<CommentResponseDTO> getCommentDTOsByCourseId(Long courseId);

}
