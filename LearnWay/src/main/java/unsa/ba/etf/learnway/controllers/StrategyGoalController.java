package unsa.ba.etf.learnway.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import unsa.ba.etf.learnway.models.StrategyGoal;
import unsa.ba.etf.learnway.services.StrategyGoalService;

import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RestController
@RequestMapping("/api/strategy-goals")
@RequiredArgsConstructor
public class StrategyGoalController {

    private final StrategyGoalService service;

    @GetMapping
    public List<StrategyGoal> getAll() {
        return service.getAllGoals();
    }

    @PostMapping
    public StrategyGoal add(@RequestBody StrategyGoal goal) {
        return service.addGoal(goal);
    }

    @PutMapping("/{id}")
    public StrategyGoal update(@PathVariable Long id, @RequestBody StrategyGoal goal) {
        return service.updateGoal(id, goal);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteGoal(id);
    }
}
