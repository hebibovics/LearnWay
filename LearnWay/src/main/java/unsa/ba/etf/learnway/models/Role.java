package unsa.ba.etf.learnway.models;

import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@ToString
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
    @ManyToMany(mappedBy = "roles")
    private Set<User> users = new HashSet<>();
}
