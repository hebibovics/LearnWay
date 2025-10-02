package unsa.ba.etf.learnway.services.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import unsa.ba.etf.learnway.models.StrategyGoal;
import unsa.ba.etf.learnway.repository.StrategyGoalRepository;
import unsa.ba.etf.learnway.services.StrategyGoalService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StrategyGoalServiceImpl implements StrategyGoalService {

    private final StrategyGoalRepository repository;

    @Override
    public List<StrategyGoal> getAllGoals() {
        return repository.findAll();
    }

    @Override
    public StrategyGoal addGoal(StrategyGoal goal) {
        return repository.save(goal);
    }

    @Override
    public void deleteGoal(Long id) {
        repository.deleteById(id);
    }
}
