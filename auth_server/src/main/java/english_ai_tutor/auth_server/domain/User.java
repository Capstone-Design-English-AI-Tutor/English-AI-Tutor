package english_ai_tutor.auth_server.domain;

import english_ai_tutor.auth_server.vo.OAuthProvider;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name="users")
@Getter
@NoArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    @Enumerated(EnumType.STRING)
    private OAuthProvider provider;

    @Builder
    public User(int id, String email, OAuthProvider provider) {
        this.email = email;
        this.provider = provider;
    }
}
