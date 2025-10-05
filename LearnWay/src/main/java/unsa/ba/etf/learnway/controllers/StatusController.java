package unsa.ba.etf.learnway.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.web.bind.annotation.*;
import unsa.ba.etf.learnway.configurations.RequestTimingFilter;

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
    @Autowired
    private RequestTimingFilter requestTimingFilter;
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

    @GetMapping("/performance")
    public Map<String, Object> getPerformanceMetrics() {
        long now = System.currentTimeMillis();

        // izbaci one koji nisu "aktivni" duže od 30 sekundi
        activeUsers.entrySet().removeIf(entry -> now - entry.getValue() > 30_000);

        Map<String, Object> performance = new HashMap<>();
        performance.put("activeUsers", activeUsers.size());
        performance.put("averageResponseTime", requestTimingFilter.getAverageResponseTime());

        return performance;
    }


}
