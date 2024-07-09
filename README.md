## 💬 생성형 AI를 이용한 영어 AI 튜터

### 📝 프로젝트 소개
**다양한 영어 학습 서비스 제공**
- 영어 퀴즈 서비스, 영어 단어장 서비스, 영어 작문 서비스, 영어 회화 서비스를 지원합니다.
  
**단어 OCR 및 테스트 기능**
-	갤러리에 있는 사진을 첨부하거나, 책에 적힌 단어를 카메라로 촬영하면 OCR이 즉시 진행되어 간편하고 빠르게 테스트할 수 있습니다.  
- 3가지 테스트 유형이 있습니다.
  
**문법 피드백 기능**
-	코사인 유사도와 문법 교정 API를 활용하여 사용자의 문법 오류에 대한 피드백을 제공합니다.
  
**자연스러운 회화 시스템 구현**
-	LLM 모델을 적용하여 사용자의 발화를 이해하고, 적절한 피드백을 제공합니다.

<br>

### 🔨 시스템 아키텍처
![image3](https://github.com/komg00/English-AI-Tutor/assets/103225693/39fcb77c-4e47-40aa-b4eb-53210bfa57e2)

<br>

### 🔧 기술 스택
**Frontend(Mobile)**
- **Language** : JavaScript
- **Library & Framework** : Expo CLI, expo-image-picker, expo-camera, expo-file-system, expo-av
<br>

**Backend**
- **Language** : Java 
- **Library & Framework** : Spring Boot
- **Database** : MySQL
- **ORM** : JPA
- **Deploy**: AWS(S3), Docker
- **Genrate AI Model**: GPT-4o(OpenAI), Gemini Pro 1.5(Google)
- **LLM Model**: GPT-4o(OpenAI)
- **Conversation Service**: WebSocket

<br>

### 🙋‍♂️ 구성원
- 김현원 : khw7385@khu.ac.kr
  
- 김운경 : splguyjr@khu.ac.kr
  
- 고민경 : komg00@khu.ac.kr
