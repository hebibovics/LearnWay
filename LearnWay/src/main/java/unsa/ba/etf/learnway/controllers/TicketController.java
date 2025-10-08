package unsa.ba.etf.learnway.controllers;

import unsa.ba.etf.learnway.models.Ticket;
import unsa.ba.etf.learnway.services.TicketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping("/{userId}")
    public Ticket createTicket(@PathVariable Long userId, @RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket, userId);
    }

    // Svi ticketi (samo admin bi ovo trebao zvati)
    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/{id}")
    public Ticket getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id);
    }

    @PatchMapping("/{id}/status")
    public Ticket updateTicketStatus(@PathVariable Long id, @RequestParam String status) {
        return ticketService.updateTicketStatus(id, status);
    }

    @GetMapping("/user/{userId}")
    public List<Ticket> getTicketsByUser(@PathVariable Long userId) {
        return ticketService.getTicketsByUserId(userId);
    }

    //  Admin salje ticket instruktoru
    @PostMapping("/admin/{adminId}/to-instructor/{instructorId}")
    public Ticket createTicketToInstructor(@PathVariable Long adminId,
                                           @PathVariable Long instructorId,
                                           @RequestBody Ticket ticket) {
        return ticketService.createTicketToInstructor(ticket, adminId, instructorId);
    }

    // Instruktor vidi tickete koje je primio od admina
    @GetMapping("/instructor/{instructorId}/received")
    public List<Ticket> getTicketsForInstructor(@PathVariable Long instructorId) {
        return ticketService.getTicketsForInstructor(instructorId);
    }



}
