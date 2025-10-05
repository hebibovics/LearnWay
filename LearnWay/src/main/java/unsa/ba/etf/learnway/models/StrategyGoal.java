package unsa.ba.etf.learnway.models;

import lombok.*;
import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StrategyGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    @Column(length = 1000)
    private String risk;

    @Column(length = 1000)
    private String mitigation;

    private String status;
    private LocalDate startDate;
    private LocalDate endDate;

    @PrePersist
    public void onCreate() {
        if (status == null) status = "Planned";
    }
}
