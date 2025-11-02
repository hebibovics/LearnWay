package unsa.ba.etf.learnway.models;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.time.LocalDateTime;
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String category; // Problem, Prijedlog, Pitanje, Feedback
    @Column(length = 2000)
    private String description;
    private String status = "OPEN";
    private LocalDateTime createdAt = LocalDateTime.now();

    private String direction = "TO_ADMIN"; // TO_ADMIN ili TO_INSTRUCTOR

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "submitted_by_id")
    @JsonIgnoreProperties({"courses", "comments", "role"})
    private User submittedBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receiver_id")
    @JsonIgnoreProperties({"courses", "comments", "role"})
    private User receiver;


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getDirection() { return direction; }
    public void setDirection(String direction) { this.direction = direction; }

    public User getSubmittedBy() { return submittedBy; }
    public void setSubmittedBy(User submittedBy) { this.submittedBy = submittedBy; }

    public User getReceiver() { return receiver; }
    public void setReceiver(User receiver) { this.receiver = receiver; }
}
