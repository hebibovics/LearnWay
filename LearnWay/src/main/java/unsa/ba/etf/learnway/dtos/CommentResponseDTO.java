package unsa.ba.etf.learnway.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CommentResponseDTO {
    private String content;
    private String username;
    private LocalDateTime createdAt;
}
