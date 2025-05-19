package unsa.ba.etf.learnway.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentDTO {
    private Long userId;
    private String firstName;
    private String lastName;
    private String username;
    private String phoneNumber;
}
