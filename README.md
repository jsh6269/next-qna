# Q&A 플랫폼

Next.js로 만든 Q&A 플랫폼입니다.

## Vercel + Supabase
vercel + supabase 배포 시 참고할 만한 사항
### Set Supabase (with local commands)
```
# Set local .env
#   you can find your supabase postgresql url from
#   "Supabase > your_project > connect > Session pooler"
DATABASE_URL="Supabase postgresql: Session pooler URL"

# Push & Set db tables on Supabase
npx prisma generate
npx prisma db push
```
### Set Vercel
```
# Set Project Build Command
#   "Vercel > Settings > Build and Deployment > Build Command"
npm install && npx prisma generate && npm run build

# Please Set: "vercel > Settings > Environment variables"
#   you can find your domain from "vercel > Settings > Domains"
#   you can find your supabase postgresql url from "Supabase > your_project > connect > Session pooler"
NEXTAUTH_SECRET="generate_random_auth_secret"
NEXTAUTH_URL="your_public_domain"
DATABASE_URL="Supabase postgresql: Session pooler URL"
```

## 기능

- 회원가입/로그인
- 질문 작성/수정/삭제
- 답변 작성/수정/삭제
- 태그 기반 필터링
- 좋아요 기능
- 사용자 프로필

## 기술 스택

- Frontend: Next.js, TypeScript, TailwindCSS
- Backend: Next.js API Routes
- Database: SQLite (Prisma ORM)
- Authentication: NextAuth.js

## 개발 환경 설정

1. 저장소 클론

```bash
git clone [repository-url]
cd my-app
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정
   `.env` 파일을 생성하고 다음 변수들을 설정하세요:

```
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Database
DATABASE_URL="file:./dev.db"
```

4. 데이터베이스 설정

```bash
npx prisma generate
npx prisma db push
```

5. 개발 서버 실행

```bash
npm run dev
```

## 배포 (Vercel)

1. [Vercel](https://vercel.com)에 가입하고 GitHub 계정을 연결합니다.

2. Vercel 대시보드에서 "New Project" 버튼을 클릭합니다.

3. 이 저장소를 선택하고 다음 환경 변수를 설정합니다:

   - `NEXTAUTH_SECRET`: 안전한 랜덤 문자열 (예: `openssl rand -base64 32`로 생성)
   - `NEXTAUTH_URL`: 배포된 사이트의 URL (예: `https://your-app.vercel.app`)
   - `DATABASE_URL`: Postgres 데이터베이스 URL (Vercel Postgres 사용 권장)

4. "Deploy" 버튼을 클릭하여 배포를 시작합니다.

### Vercel Postgres 설정

Vercel Postgres를 사용하려면:

1. Vercel 대시보드에서 프로젝트의 "Storage" 탭으로 이동합니다.
2. "Create Database" 버튼을 클릭하여 Postgres 데이터베이스를 생성합니다.
3. 생성된 데이터베이스의 연결 정보를 환경 변수로 자동 설정됩니다.
4. `schema.prisma` 파일의 provider를 "postgresql"로 변경합니다:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

5. 스키마를 데이터베이스에 적용합니다:

```bash
npx prisma db push
```

## 라이선스

MIT
