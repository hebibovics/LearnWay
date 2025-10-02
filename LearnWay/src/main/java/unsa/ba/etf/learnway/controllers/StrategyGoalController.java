package unsa.ba.etf.learnway.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import unsa.ba.etf.learnway.models.StrategyGoal;
import unsa.ba.etf.learnway.services.StrategyGoalService;

import java.util.List;

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

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteGoal(id);
    }
}
