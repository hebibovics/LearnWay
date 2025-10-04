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
    public StrategyGoal updateGoal(Long id, StrategyGoal goal) {
        StrategyGoal existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + id));

        existing.setTitle(goal.getTitle());
        existing.setDescription(goal.getDescription());
        existing.setRisk(goal.getRisk());
        existing.setMitigation(goal.getMitigation());
        existing.setStatus(goal.getStatus());

        return repository.save(existing);
    }

    @Override
    public void deleteGoal(Long id) {
        repository.deleteById(id);
    }
}
