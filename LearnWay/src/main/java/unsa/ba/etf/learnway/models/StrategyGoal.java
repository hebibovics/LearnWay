package unsa.ba.etf.learnway.models;

import lombok.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@CrossOrigin(origins = "http://localhost:3000")
public class StrategyGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Naziv ili glavni tekst cilja
    private String title;

    // Detaljniji opis cilja (opcionalno)
    @Column(length = 2000)
    private String description;

    // Potencijalni rizik vezan uz cilj
    @Column(length = 1000)
    private String risk;

    // Planirane mjere mitigacije za navedeni rizik
    @Column(length = 1000)
    private String mitigation;

    // Status cilja (npr. Planirano, U toku, Završeno)
    private String status;

    // Datum kreiranja cilja
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "Planirano";
    }
}
