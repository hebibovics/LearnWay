package unsa.ba.etf.learnway.services;

import unsa.ba.etf.learnway.models.Ticket;

import java.util.List;

public interface TicketService {
    Ticket createTicket(Ticket ticket, Long userId);
    List<Ticket> getAllTickets();
    Ticket getTicketById(Long id);
    Ticket updateTicketStatus(Long id, String status);
    List<Ticket> getTicketsByUserId(Long userId);
    Ticket createTicketToInstructor(Ticket ticket, Long adminId, Long instructorId);
    List<Ticket> getTicketsForInstructor(Long instructorId);


}
