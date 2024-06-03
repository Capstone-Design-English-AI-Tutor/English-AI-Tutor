package english_ai_tutor.conversation_service.service;

import english_ai_tutor.conversation_service.dto.conversation.ConversationPromptDto;
import english_ai_tutor.conversation_service.repository.ConversationRepository;
import english_ai_tutor.conversation_service.domain.Conversation;
import english_ai_tutor.conversation_service.dto.conversation.ConversationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository conversationRepository;

    @Transactional(readOnly = true)
    public List<ConversationResponse> findConversationAll(){
        List<ConversationResponse> conversationList = new ArrayList<>();

        List<Conversation> conversations = conversationRepository.findAll();

       conversations.stream()
               .forEach(conversation -> conversationList.add(
                       ConversationResponse.builder()
                               .id(conversation.getId())
                               .title(conversation.getTitle())
                               .build()
               ));

       return conversationList;
    }
    @Transactional(readOnly = true)
    public ConversationPromptDto findConversationPrompt(Long id){
        Conversation conversation = conversationRepository.findById(id).get();

        return ConversationPromptDto.builder()
                .prompt(conversation.getPrompt())
                .roleSwitchPrompt(conversation.getRole_switch_prompt())
                .build();
    }
}
