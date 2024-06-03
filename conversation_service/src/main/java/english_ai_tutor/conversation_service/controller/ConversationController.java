package english_ai_tutor.conversation_service.controller;

import english_ai_tutor.conversation_service.service.ChatMessageService;
import english_ai_tutor.conversation_service.service.ConversationService;
import english_ai_tutor.conversation_service.service.RoleSwitchChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/conversation")
@RequiredArgsConstructor
public class ConversationController {
    private final ConversationService conversationService;
    private final ChatMessageService chatMessageService;
    private final RoleSwitchChatMessageService roleSwitchChatMessageService;

    @GetMapping("/list")
    public ResponseEntity<?> conversationList(){
        return ResponseEntity.ok().body(conversationService.findConversationAll());
    }

    @GetMapping("/result")
    public ResponseEntity<?> chatMessagesList(@RequestParam String channelId){
        return ResponseEntity.ok().body(chatMessageService.findAll(channelId));
    }

    @PostMapping("/help")
    public ResponseEntity<?> generateUserResponseExample(@RequestParam String channelId){
        return ResponseEntity.ok().body(roleSwitchChatMessageService.help(channelId));
    }
}
