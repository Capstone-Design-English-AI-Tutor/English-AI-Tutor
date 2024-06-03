package english_ai_tutor.conversation_service.init;

import english_ai_tutor.conversation_service.repository.ConversationRepository;
import english_ai_tutor.conversation_service.domain.Conversation;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ConversationInitializer {
    private final ConversationRepository conversationRepository;

    @Autowired
    public ConversationInitializer(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    @PostConstruct
    void init(){
        Conversation conversation = Conversation.builder()
                .title("패스트 푸드점에서 대화하기")
                .prompt("""
                        Let's do a role-play.
                        You can pretend to be a fast food clerk.
                        You don't have to ask me questions all the time.
                        Try to keep the conversation as realistic as possible. Response are made in less than 200 characters.
                        """)
                .role_switch_prompt("""
                        Let's do a role-play.
                        You can pretend to be a fast food customer.
                        You don't have to ask me questions all the time.
                        Try to keep the conversation as realistic as possible. Response are made in less than 200 characters.
                        """)
                        .build();
        conversationRepository.save(conversation);
    }
}
