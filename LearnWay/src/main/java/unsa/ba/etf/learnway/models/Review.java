package unsa.ba.etf.learnway.models;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@Setter
@ToString
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @Column(name = "comment")
    private String comment;

    @Column(name = "rate")
    private int rate;

    // @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    // @JsonIgnore
    // private List<Quiz> quizzes = new ArrayList<>();
    //umjesto ovog da bude povezano sa lesson
}
