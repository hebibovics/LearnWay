import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

const statusOrder = ["OPEN", "IN_PROGRESS", "RESOLVED"];

const AdminServiceDesk = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("jwtToken")?.replace(/^"|"$/g, '');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await axios.get("http://localhost:8081/api/tickets")
            let ticketsData = res.data;

            // Ako submittedBy bude broj, dohvati usera
            const ticketsWithUsers = await Promise.all(
                ticketsData.map(async (ticket) => {
                    // ako je broj
                    if (typeof ticket.submittedBy === "number") {
                        try {
                            const userRes = await axios.get(
                                `http://localhost:8081/api/users/${ticket.submittedBy}`, {
                                    headers: { Authorization: `Bearer ${token}` },
                                });

                            return { ...ticket, submittedBy: userRes.data };
                        } catch (e) {
                            console.error("Greška pri dohvaćanju korisnika:", e);
                            return ticket;
                        }
                    }

                    if (
                        typeof ticket.submittedBy === "object" &&
                        ticket.submittedBy.userId,
                        console.log("OVO SAD GLEDAM", ticket, ticket.submittedBy, ticket.submittedBy.userId)
                    ) {
                        try {
                            const userRes = await axios.get(
                                `http://localhost:8081/api/users/${ticket.submittedBy.userId}`
                            );
                            return { ...ticket, submittedBy: userRes.data };
                        } catch (e) {
                            console.error("Greška pri dohvaćanju korisnika:", e);
                            return ticket;
                        }
                    }

                    return ticket;
                })
            );

            const sorted = ticketsWithUsers.sort(
                (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
            );

            setTickets(sorted);
        } catch (err) {
            console.error(err);
            swal("Error", "Could not fetch tickets", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            await axios.patch(
                `http://localhost:8081/api/tickets/${ticketId}/status`,
                null,
                { params: { status: newStatus } }
            );
            swal("Success", "Status successfully updated", "success");

            setTickets((prev) =>
                prev
                    .map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
                    .sort(
                        (a, b) =>
                            statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
                    )
            );
        } catch (err) {
            console.error(err);
            swal("Error", "Could not update the status", "error");
        }
    };

    if (loading) return <p>Loading tickets...</p>;

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {tickets.map((ticket) => (
                <div
                    key={ticket.id}
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "15px",
                        width: "300px",
                        backgroundColor: "#ffffff",
                        color: "#000000",
                        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                    }}
                >
                    <h3>{ticket.title}</h3>
                    <p>
                        <strong>Category:</strong> {ticket.category}
                    </p>
                    <p>
                        <strong>Description:</strong> {ticket.description}
                    </p>
                    <p>
                        <strong>Status:</strong> {ticket.status.replace("_", " ")}
                    </p>
                    <p>
                        <strong>Submitted by:</strong>{" "}
                        {ticket.submittedBy && ticket.submittedBy.firstName
                            ? `${ticket.submittedBy.firstName} ${ticket.submittedBy.lastName}`
                            : "N/A"}
                    </p>
                    <div>
                        <label htmlFor={`status-${ticket.id}`}>Change status: </label>
                        <select
                            id={`status-${ticket.id}`}
                            value={ticket.status}
                            onChange={(e) =>
                                handleStatusChange(ticket.id, e.target.value)
                            }
                        >
                            {statusOrder.map((status) => (
                                <option key={status} value={status}>
                                    {status.replace("_", " ")}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminServiceDesk;
