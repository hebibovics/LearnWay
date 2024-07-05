package unsa.ba.etf.learnway.models;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@Setter
@ToString
@Table(name = "lessons")
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lessonId;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    // @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    // @JsonIgnore
    // private List<Quiz> quizzes = new ArrayList<>();
    //umjesto ovog da bude povezano sa lesson
}
