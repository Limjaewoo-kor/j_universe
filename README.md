1. Malhaejo (말해조)
사용자가 핵심 내용을 입력하면, 정중하고 공손한 비즈니스 문장 또는 민원 문서를 자동으로 생성해주는 AI 문장 생성 도우미입니다.
GPT 기반 자연어 생성 기술을 활용하여 한국어의 높임말, 맞춤법, 상황별 표현 등을 정교하게 적용합니다.

2. Rumble Guide Chatbot
디지몬 슈퍼럼블 게임의 가이드를 위한 LLM 기반 챗봇으로, OpenAI API + LangChain + RAG + Chroma를 활용하여 캐릭터 정보, 공략, 추천 세팅 등의 질문에 실시간 대응합니다.

3. 계산해 (말로 계산하는 AI 계산기)
사용자가 자연어로 입력한 계산 요청(예: "23500원을 30% 할인한 금액을 알려줘")을 이해하고 숫자로 변환하여 계산해주는 AI 계산기입니다.
기본 계산 외에도 이자 계산기, 환율 계산기, 단위 변환기 등 다양한 기능을 탭 형태로 분리하여 제공합니다.


domain = https://www.j-uni.com/
buymeacoffee = https://coff.ee/j.uni

공통 기술 구성
FastAPI + LangChain 백엔드 / React 프론트엔드 / PostgreSQL DB
모바일 대응(반응형 CSS), PWA 적용(웹앱 설치 기능)
Google Analytics 연동
Vercel[ front ] 
Render -> Oracle Cloud Infrastructure(OCI)[ back ] 
Neon[ DB ]로 서비스 배포