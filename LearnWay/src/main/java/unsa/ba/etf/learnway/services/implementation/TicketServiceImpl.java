package unsa.ba.etf.learnway.services.implementation;

import unsa.ba.etf.learnway.models.Ticket;
import unsa.ba.etf.learnway.models.User;
import unsa.ba.etf.learnway.repository.TicketRepository;
import unsa.ba.etf.learnway.repository.UserRepository;
import unsa.ba.etf.learnway.services.TicketService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public TicketServiceImpl(TicketRepository ticketRepository, UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Ticket createTicket(Ticket ticket, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        ticket.setSubmittedBy(user);
        return ticketRepository.save(ticket);
    }

    @Override
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @Override
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    @Override
    public Ticket updateTicketStatus(Long id, String status) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus(status.toUpperCase());
        return ticketRepository.save(ticket);
    }

    @Override
    public List<Ticket> getTicketsByUserId(Long userId) {
        return ticketRepository.findBySubmittedBy_UserId(userId);
    }

    @Override
    public Ticket createTicketToInstructor(Ticket ticket, Long adminId, Long instructorId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        ticket.setSubmittedBy(admin);
        ticket.setReceiver(instructor);
        ticket.setDirection("TO_INSTRUCTOR");
        return ticketRepository.save(ticket);
    }

    @Override
    public List<Ticket> getTicketsForInstructor(Long instructorId) {
        return ticketRepository.findByReceiver_UserId(instructorId);
    }


}
