package english_ai_tutor.conversation_service.dto.openai;


import java.util.Random;

public enum Voice {
    ALLOY,
    ECHO,
    FABLE,
    ONYX,
    NOVA,
    SHIMMER;

    private static final Random RANDOM = new Random();

    public static String getRandomVoice(){
        Voice[] voices = Voice.values();
        return voices[RANDOM.nextInt(voices.length)].name().toLowerCase();
    }
}
