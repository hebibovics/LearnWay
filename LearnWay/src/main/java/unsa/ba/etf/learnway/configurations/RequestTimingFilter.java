package unsa.ba.etf.learnway.configurations;

import org.springframework.stereotype.Component;
import javax.servlet.*;
import java.io.IOException;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class RequestTimingFilter implements Filter {

    private final AtomicLong totalTime = new AtomicLong(0);
    private final AtomicLong requestCount = new AtomicLong(0);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        long start = System.currentTimeMillis();
        chain.doFilter(request, response);
        long duration = System.currentTimeMillis() - start;

        totalTime.addAndGet(duration);
        requestCount.incrementAndGet();
    }

    public double getAverageResponseTime() {
        long count = requestCount.get();
        return count == 0 ? 0 : (double) totalTime.get() / count;
    }
}
