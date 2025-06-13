package unsa.ba.etf.learnway.models;

import com.fasterxml.jackson.annotation.*;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "lessons")
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lessonId;
    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;
    @Column(name = "video_url")
    private String videoUrl;


    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonBackReference
    private Course course;



}

