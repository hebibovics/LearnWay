package unsa.ba.etf.learnway.services.implementation;

import unsa.ba.etf.learnway.models.Question;
import unsa.ba.etf.learnway.models.Quiz;
import unsa.ba.etf.learnway.repository.QuestionRepository;
import unsa.ba.etf.learnway.repository.QuizRepository;
import unsa.ba.etf.learnway.services.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    QuestionRepository questionRepository;

    @Autowired
    QuizRepository quizRepository;

    @Override
    public Question addQuestion(Question question) {
        Long quizId = question.getQuiz().getQuizId();
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));

        question.setQuiz(quiz);

        quiz.setNumOfQuestions(quiz.getNumOfQuestions() + 1);
        quizRepository.save(quiz);

        return questionRepository.save(question);
    }



    @Override
    public List<Question> getQuestions() {
        return questionRepository.findAll();
    }

    @Override
    public Question getQuestion(Long quesId) {
        return questionRepository.findById(quesId).isPresent() ? questionRepository.findById(quesId).get() : null;
    }

    @Override
    public Question updateQuestion(Question question) {
        return questionRepository.save(question);
    }

    @Override
    public void deleteQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));

        Quiz quiz = question.getQuiz();
        if (quiz != null) {
            quiz.getQuestions().remove(question);
            quiz.setNumOfQuestions(quiz.getNumOfQuestions() - 1);
            quizRepository.save(quiz);
        }

        questionRepository.delete(question);
    }




    @Override
    public List<Question> getQuestionsByQuiz(Quiz quiz) {
        return questionRepository.findByQuiz(quiz);
    }

}
