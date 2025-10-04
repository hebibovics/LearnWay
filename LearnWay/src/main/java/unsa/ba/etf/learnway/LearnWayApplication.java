package unsa.ba.etf.learnway;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import unsa.ba.etf.learnway.models.*;
import unsa.ba.etf.learnway.repository.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Logger;

@SpringBootApplication
public class LearnWayApplication {

    public static void main(String[] args) {
        SpringApplication.run(LearnWayApplication.class, args);
    }

    @Bean
    public ApplicationRunner initializer(PasswordEncoder passwordEncoder, RoleRepository roleRepository, CategoryRepository categoryRepository, CourseRepository courseRepository, UserRepository userRepository, LessonRepository lessonRepository) {
        return args -> {
            System.out.println("Running initializer...");

            String[] roles = {"USER", "ADMIN", "INSTRUCTOR"};

            for (String roleName : roles) {
                boolean exists = roleRepository.existsById(roleName);
                System.out.println("Role " + roleName + " exists? " + exists);

                if (!exists) {
                    Role newRole = Role.builder()
                            .roleName(roleName)
                            .roleDescription(
                                    switch (roleName) {
                                        case "USER" -> "Default Role provided to each user - STUDENT";
                                        case "ADMIN" -> "Superuser, who has access for all functionality";
                                        case "INSTRUCTOR" -> "User, who creates courses, adds lessons and tracks students progress";
                                        default -> "Role description";
                                    }
                            )
                            .build();
                    System.out.println("Saving role: " + newRole);
                    roleRepository.save(newRole);
                }
            }

            Role adminRole = roleRepository.findById("ADMIN")
                    .orElseThrow(() -> new RuntimeException("Role ADMIN not found"));

            User adminUser = userRepository.findByUsername("admin");
            System.out.println("Admin user exists? " + (adminUser != null));

            if (adminUser == null) {
                User admin = User.builder()
                        .firstName("Admin")
                        .lastName("Admin")
                        .username("admin@learnway.com")
                        .password(passwordEncoder.encode("admin123"))
                        .isActive(true)
                        .role(adminRole)
                        .build();
                System.out.println("Saving admin user: " + admin);
                userRepository.save(admin);
            }


            categoryRepository.saveAll(Arrays.asList(
                    Category.builder().title("Web Development").description("All about web development").build(),
                    Category.builder().title("Web Design").description("All about web design").build(),
                    Category.builder().title("Soft Skills").description("Courses to improve your soft skills").build(),
                    Category.builder().title("Design Tools").description("Learn to use various design tools").build(),
                    Category.builder().title("Programming Languages").description("Courses on different programming languages").build(),
                    Category.builder().title("Data Science").description("All about data science").build(),
                    Category.builder().title("Project Management").description("Learn project management skills").build(),
                    Category.builder().title("Digital Marketing").description("Courses on digital marketing").build(),
                    Category.builder().title("Other Courses").description("Miscellaneous courses").build()
            ));


            // Fetch all categories
            Category webDevelopment = categoryRepository.findByTitle("Web Development");
            Category webDesign = categoryRepository.findByTitle("Web Design");
            Category softSkills = categoryRepository.findByTitle("Soft Skills");
            Category designTools = categoryRepository.findByTitle("Design Tools");
            Category programmingLanguages = categoryRepository.findByTitle("Programming Languages");
            Category dataScience = categoryRepository.findByTitle("Data Science");
            Category projectManagement = categoryRepository.findByTitle("Project Management");
            Category digitalMarketing = categoryRepository.findByTitle("Digital Marketing");
            Category otherCourses = categoryRepository.findByTitle("Other Courses");

            // Add courses to each category
          /*  courseRepository.saveAll(Arrays.asList(
                    // Web Development
                    Course.builder().title("Basic CSS and HTML").description("Learn the basics of CSS and HTML.").category(webDevelopment).build(),
                    Course.builder().title("Advanced JavaScript").description("Deep dive into JavaScript advanced topics.").category(webDevelopment).build(),
                    Course.builder().title("Advanced HTML").description("Advanced techniques in HTML.").category(webDevelopment).build(),
                    Course.builder().title("React for Beginners").description("Get started with React.js").category(webDevelopment).build(),
                    Course.builder().title("Node.js Essentials").description("Learn the essentials of Node.js").category(webDevelopment).build(),
                    Course.builder().title("Full-Stack Development").description("Learn full-stack web development").category(webDevelopment).build(),

                    // Web Design
                    Course.builder().title("Introduction to UX/UI").description("Learn the basics of user experience and user interface design.").category(webDesign).build(),
                    Course.builder().title("Advanced Web Design").description("Advanced techniques in web design.").category(webDesign).build(),
                    Course.builder().title("Responsive Web Design").description("Create responsive web designs.").category(webDesign).build(),
                    Course.builder().title("Design Thinking").description("Learn design thinking processes.").category(webDesign).build(),
                    Course.builder().title("Graphic Design Basics").description("Learn the basics of graphic design.").category(webDesign).build(),
                    Course.builder().title("Web Animation Techniques").description("Learn to create web animations.").category(webDesign).build(),

                    // Soft Skills
                    Course.builder().title("Effective Communication").description("Improve your communication skills.").category(softSkills).build(),
                    Course.builder().title("Leadership Skills").description("Develop your leadership skills.").category(softSkills).build(),
                    Course.builder().title("Time Management").description("Learn how to manage your time effectively.").category(softSkills).build(),
                    Course.builder().title("Conflict Resolution").description("Techniques for resolving conflicts.").category(softSkills).build(),
                    Course.builder().title("Critical Thinking").description("Enhance your critical thinking abilities.").category(softSkills).build(),
                    Course.builder().title("Public Speaking").description("Become a better public speaker.").category(softSkills).build(),

                    // Design Tools
                    Course.builder().title("Photoshop Basics").description("Learn the basics of Adobe Photoshop.").category(designTools).build(),
                    Course.builder().title("Advanced Photoshop").description("Advanced techniques in Photoshop.").category(designTools).build(),
                    Course.builder().title("Illustrator for Beginners").description("Get started with Adobe Illustrator.").category(designTools).build(),
                    Course.builder().title("InDesign Essentials").description("Learn the essentials of Adobe InDesign.").category(designTools).build(),
                    Course.builder().title("Figma for Beginners").description("Introduction to Figma design tool.").category(designTools).build(),
                    Course.builder().title("Sketch Basics").description("Learn the basics of Sketch.").category(designTools).build(),

                    // Programming Languages
                    Course.builder().title("Python for Beginners").description("Learn the basics of Python programming.").category(programmingLanguages).build(),
                    Course.builder().title("Java Essentials").description("Learn the essentials of Java.").category(programmingLanguages).build(),
                    Course.builder().title("C++ Fundamentals").description("Fundamentals of C++ programming.").category(programmingLanguages).build(),
                    Course.builder().title("Introduction to Ruby").description("Get started with Ruby programming.").category(programmingLanguages).build(),
                    Course.builder().title("Advanced JavaScript").description("Advanced topics in JavaScript.").category(programmingLanguages).build(),
                    Course.builder().title("Kotlin for Android").description("Learn Kotlin for Android development.").category(programmingLanguages).build(),

                    // Data Science
                    Course.builder().title("Data Analysis with Python").description("Analyze data using Python.").category(dataScience).build(),
                    Course.builder().title("Machine Learning Basics").description("Introduction to machine learning.").category(dataScience).build(),
                    Course.builder().title("Statistics for Data Science").description("Learn statistics for data science.").category(dataScience).build(),
                    Course.builder().title("R for Data Science").description("Get started with R for data science.").category(dataScience).build(),
                    Course.builder().title("Big Data Essentials").description("Learn the essentials of big data.").category(dataScience).build(),
                    Course.builder().title("Data Visualization").description("Techniques for data visualization.").category(dataScience).build(),

                    // Project Management
                    Course.builder().title("Project Management Basics").description("Learn the basics of project management.").category(projectManagement).build(),
                    Course.builder().title("Agile Methodologies").description("Introduction to agile methodologies.").category(projectManagement).build(),
                    Course.builder().title("Scrum Master Certification").description("Prepare for Scrum Master certification.").category(projectManagement).build(),
                    Course.builder().title("Risk Management").description("Techniques for risk management.").category(projectManagement).build(),
                    Course.builder().title("Project Planning").description("Learn how to plan projects effectively.").category(projectManagement).build(),
                    Course.builder().title("Resource Management").description("Manage project resources effectively.").category(projectManagement).build(),

                    // Digital Marketing
                    Course.builder().title("SEO Basics").description("Learn the basics of SEO.").category(digitalMarketing).build(),
                    Course.builder().title("Content Marketing").description("Introduction to content marketing.").category(digitalMarketing).build(),
                    Course.builder().title("Social Media Marketing").description("Learn social media marketing strategies.").category(digitalMarketing).build(),
                    Course.builder().title("Email Marketing").description("Techniques for effective email marketing.").category(digitalMarketing).build(),
                    Course.builder().title("Digital Advertising").description("Learn about digital advertising.").category(digitalMarketing).build(),
                    Course.builder().title("Marketing Analytics").description("Analyze marketing data effectively.").category(digitalMarketing).build(),

                    // Other Courses
                    Course.builder().title("Introduction to Blockchain").description("Learn the basics of blockchain technology.").category(otherCourses).build(),
                    Course.builder().title("Ethical Hacking").description("Introduction to ethical hacking.").category(otherCourses).build(),
                    Course.builder().title("Cyber Security Essentials").description("Learn the essentials of cybersecurity.").category(otherCourses).build(),
                    Course.builder().title("Cloud Computing Basics").description("Learn the basics of cloud computing.").category(otherCourses).build(),
                    Course.builder().title("IoT Fundamentals").description("Introduction to Internet of Things.").category(otherCourses).build(),
                    Course.builder().title("AR/VR Basics").description("Learn the basics of augmented and virtual reality.").category(otherCourses).build()
            ));*/

        };
    }
}