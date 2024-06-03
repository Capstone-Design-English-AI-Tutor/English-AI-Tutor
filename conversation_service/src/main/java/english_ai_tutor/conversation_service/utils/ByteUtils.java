package english_ai_tutor.conversation_service.utils;

public class ByteUtils {

    public static Byte[] changePrimitiveByteArrayToByteObjectArray(byte[] byteArray){
        int len = byteArray.length;
        Byte[] byteObjectArray = new Byte[len];

        for (int i = 0; i < len; i++) {
            byteObjectArray[i] = byteArray[i];
        }
        return byteObjectArray;
    }


    public static byte[] changeByteObjectArrayToPrimitiveByteArray(Byte[] byteObjectArray){
        byte[] byteArray = new byte[byteObjectArray.length];
        for (int i = 0; i < byteObjectArray.length; i++) {
            byteArray[i] = byteObjectArray[i];
        }
        return byteArray;
    }
}
