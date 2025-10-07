package unsa.ba.etf.learnway.repository;

import unsa.ba.etf.learnway.models.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findBySubmittedBy_UserId(Long userId);
    List<Ticket> findByReceiver_UserId(Long userId);
    List<Ticket> findByDirection(String direction);


}
