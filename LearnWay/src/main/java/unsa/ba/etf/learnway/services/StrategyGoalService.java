package unsa.ba.etf.learnway.services;

import unsa.ba.etf.learnway.models.StrategyGoal;
import java.util.List;

public interface StrategyGoalService {
    List<StrategyGoal> getAllGoals();
    StrategyGoal addGoal(StrategyGoal goal);
    void deleteGoal(Long id);
}
