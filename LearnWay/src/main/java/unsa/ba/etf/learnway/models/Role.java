package unsa.ba.etf.learnway.models;

import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "users")
@Setter
@Getter
@Builder
@Entity
@Table(name = "roles")
public class Role {

    @Id
    @Column(name="role_name")
    private String roleName;

    @Column(name="role_description")
    private String roleDescription;

    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<User> users = new HashSet<>();

    public Role(String roleName) {
        this.roleName = roleName;
    }
}
