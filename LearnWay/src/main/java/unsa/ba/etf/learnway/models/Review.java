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

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
}
