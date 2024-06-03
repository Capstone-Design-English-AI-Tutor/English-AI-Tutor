package english_ai_tutor.conversation_service.service;

import english_ai_tutor.conversation_service.dto.ChatMessageDto;
import english_ai_tutor.conversation_service.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    @Transactional
    public void save(String channelId, ChatMessageDto.Command command) {
        chatMessageRepository.save(channelId, command);
    }

    @Transactional
    public List<ChatMessageDto.Response> findAll(String channelId){
        return chatMessageRepository.findAll(channelId);
    }

    @Transactional
    public void removeAll(String channelId){chatMessageRepository.removeAll(channelId);}
}
