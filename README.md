## 💬 생성형 AI를 이용한 영어 AI 튜터

### 📝 프로젝트 소개
**✔️ 영어 퀴즈 서비스**
- OCR 기술을 이용하여 영단어 텍스트 추출
- 3가지의 테스트 유형 제공
  
**✔️ 영어 단어장 서비스**  
- 저장한 단어 열람

**✔️ 영어 작문 서비스**  
- 기사를 선택하고 영작
-	코사인 유사도와 문법 교정 API를 활용한 피드백 제공

**✔️ 영어 회화 서비스**  
- LLM 모델 & 웹소켓 기반
- 주어진 상황에 따라 free talking 진행
<hr>

## 🔎 주요 기능

### [단어 OCR]

#### 1. 사용자가 카메라로 촬영한 사진에 대해 OCR하기
<img src="https://github.com/komg00/English-AI-Tutor/assets/103225693/e2af3f58-a8a5-4bac-a762-7c6cd9782d1e" height="400" width="170"/>
<img src="https://github.com/komg00/English-AI-Tutor/assets/103225693/8e0513e1-834f-4a45-8233-cbd2c8acc0c3" height="400" width="170"/>
<img src="https://github.com/komg00/English-AI-Tutor/assets/103225693/d6d56673-1af7-45ee-8afb-b33298b635dd" height="400" width="170"/>

- 사진을 촬영하고, 단어 텍스트를 추출합니다.


#### 2. 사용자 갤러리에서 선택한 사진에 대해 OCR하기
<img src="https://github.com/komg00/English-AI-Tutor/assets/103225693/44f90d6e-f038-4b45-a789-324b64540b93" height="400" width="170"/>
<img src="https://github.com/komg00/English-AI-Tutor/assets/103225693/b715e3aa-96d8-4a76-8bb0-76afe52d6842" height="400" width="170"/>
<img src="https://github.com/komg00/English-AI-Tutor/assets/103225693/020d218c-3880-4f7e-8eed-cda8ee33c106" height="400" width="170"/>

- 갤러리에서 사진을 선택하고, 단어 텍스트를 추출합니다. 
<br>

### [단어 테스트]

#### 1. 영단어 맞추기 테스트
<img src="https://github.com/user-attachments/assets/3cc1d7ae-281f-47fa-9ebd-4fac0126e3db" height="400" width="170"/>  
<img src="https://github.com/user-attachments/assets/b74cc15c-3be1-4fe8-bbe4-390550844148" height="400" width="170"/>

- 사용자가 답을 입력했을 때 정답이면 초록색 토스트 팝업이, 오답이면 주황색 토스트 팝업이 표시됩니다. 

#### 2. 한글 뜻 맞추기 테스트
<img src="https://github.com/user-attachments/assets/865fdf51-37e4-4398-b12b-df54f2c0a75f" height="400" width="170"/>
<img src="https://github.com/user-attachments/assets/bf2c7c2a-0473-436f-9b79-5106bc4f4f79" height="400" width="170"/> 

- 사용자가 답을 입력하면 정답과 사용자가 입력한 답이 표시됩니다.
  
#### 3. 문장 속에 들어갈 영단어 맞추기 테스트
<img src="https://github.com/user-attachments/assets/6a3d51c9-e0ea-44e2-854d-2a849e35bcd1" height="400" width="170"/>
<img src="https://github.com/user-attachments/assets/e2cf0888-02c9-4fd3-9b09-9e0f22a01ad7" height="400" width="170"/>  

- 괄호 속에 들어갈 영단어를 입력합니다.

#### 4. 테스트 결과 조회 & 단어 저장
<img src="https://github.com/user-attachments/assets/c0951cff-1a4e-4c49-8a19-c19f319f8258" height="400" width="170"/>
<img src="https://github.com/user-attachments/assets/a2519991-794b-475b-8d4f-5219fb782061" height="400" width="170"/>
<img src="https://github.com/user-attachments/assets/c856407b-086d-45e3-b25e-4976b2829acd" height="400" width="170"/>

- 테스트 결과 조회 화면에서 저장할 단어를 선택하고 폴더 이름을 입력합니다.
<br>

### [영어 기사 작문]
<img src="https://github.com/user-attachments/assets/ac2d0fcf-8e85-4532-af76-4bdd0999df58" height="400" width="170"/>

- 먼저 레벨을 선택하고, 영작하고자 하는 기사를 선택합니다. 

<img src="https://github.com/user-attachments/assets/dcd9c3ac-84ba-4936-85d9-5aab2e5a25a9" height="400" width="170" />
  
- 사용자는 한글 번역을 보면서 영작합니다.

<img src="https://github.com/user-attachments/assets/f43c140e-0efd-4336-b472-9a3513d1a4aa" height="400" width="170" />
<img src="https://github.com/user-attachments/assets/20c14c76-cbcd-4896-9ad6-2341706a8d18" height="400" width="170" />

- 영작 결과 조회 화면에서 유사성 점수, 원문, 사용자가 입력한 답변, 피드백을 확인합니다.  
- 오류가 있는 부분은 빨간색 밑줄이 표시됩니다.
  
<br>

### [테마별 영어 회화]
<img src="https://github.com/user-attachments/assets/c577d4bc-bbc6-4d6e-82bf-07670df644e5" height="400" width="170" />

- 테마를 선택하고 영어 회화를 진행합니다.
  
<img src="https://github.com/user-attachments/assets/aa82e422-f5ba-4050-8d4a-5ee0cb148efe" height="400" width="170" />
<img src="https://github.com/user-attachments/assets/bef12828-8419-48d7-ae0e-4980db4352b8" height="400" width="170" />

- 앱 하단에 있는 마이크 모양의 버튼을 눌러 녹음을 하고 웹소켓 서버에 전송합니다.  
- 사용자가 전송한 음성에 따라 웹소켓 서버에서 응답이 오기 때문에 자유롭게 대화할 수 있다.
- 힌트 보기 버튼을 터치하면 답변 가이드를 볼 수 있습니다.
  
<img src="https://github.com/user-attachments/assets/59d6fc88-9dc9-4bdd-a92a-6acbc9139f95" height="400" width="170" />

- 회화를 종료하면 종료 직전까지 나눈 대화들을 확인할 수 있습니다.
<hr>

### 🔨 시스템 아키텍처
![image3](https://github.com/komg00/English-AI-Tutor/assets/103225693/39fcb77c-4e47-40aa-b4eb-53210bfa57e2)

<hr>

### 🔧 기술 스택
🔸 **Frontend(Mobile)**
- **Language** : JavaScript
- **Library & Framework** : Expo CLI, expo-image-picker, expo-camera, expo-file-system, expo-av

🔸 **Backend**
- **Language** : Java 
- **Library & Framework** : Spring Boot
- **Database** : MySQL
- **Deploy**: AWS(S3), Docker
- **Genrate AI Model**: GPT-4o(OpenAI), Gemini Pro 1.5(Google)
- **LLM Model**: GPT-4o(OpenAI)
- **Conversation Service**: WebSocket
<hr>

### 🙋‍♂️ 구성원
- 김현원 : khw7385@khu.ac.kr
- 김운경 : splguyjr@khu.ac.kr
- 고민경 : komg00@khu.ac.kr
