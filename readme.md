## Zara 프로젝트

### 깃허브

github : https://github.com/bini59/Zara

### 팀원 정보 및 메일

- 임유빈 : bean0234@kumoh.ac.kr
- 이근탁 : 

### 특이사항

#### 실행 전 설치 파일

- backend library

```bash
pip install -r ./backend/requirements.txt
```

- mac address library

```bash
pip install redis schedule
```

- frontend package

```bash
cd src/frontend
npm install
```

#### 각 파트별 실행

- backend
```
./run.sh
```

- mac address
```
cd src/mac
./run.sh

```

- frontend
```
cd src/frontend
npm start
```