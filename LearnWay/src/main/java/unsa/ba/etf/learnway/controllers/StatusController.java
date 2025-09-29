package unsa.ba.etf.learnway.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
public class StatusController {

    @Autowired
    private DataSource dataSource;
    private final Map<String, Long> activeUsers = new ConcurrentHashMap<>();

    @GetMapping("/status")
    public Map<String, Boolean> getStatus() {
        Map<String, Boolean> status = new HashMap<>();
        status.put("backend", true);

        try (Connection conn = dataSource.getConnection()) {
            status.put("database", true);
        } catch (SQLException e) {
            status.put("database", false);
        }

        return status;
    }

    @PostMapping("/active")
    public void heartbeat(@RequestHeader("user-id") String userId) {
        activeUsers.put(userId, System.currentTimeMillis());
    }

    @GetMapping("/active-count")
    public int getActiveCount() {
        long now = System.currentTimeMillis();
        activeUsers.entrySet().removeIf(entry -> now - entry.getValue() > 30_000);
        return activeUsers.size();
    }


}
