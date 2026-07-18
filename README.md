# Sangam Backend

Spring Boot REST API that receives sangam member registration submissions
from the HTML form and stores them in PostgreSQL.

## Project structure

```
sangam-backend/
├── pom.xml
├── src/main/java/com/sangam/backend/
│   ├── SangamBackendApplication.java   → main entry point
│   ├── model/Member.java               → JPA entity (maps to `members` table)
│   ├── dto/MemberRequest.java          → validated request body shape
│   ├── repository/MemberRepository.java→ JPA repository
│   ├── service/MemberService.java      → business logic
│   ├── controller/MemberController.java→ REST endpoints
│   └── config/CorsConfig.java          → allows your frontend domain to call the API
└── src/main/resources/application.properties
```

## Endpoints

| Method | Path            | Purpose                          |
|--------|-----------------|-----------------------------------|
| POST   | `/api/members`  | Save a new form submission        |
| GET    | `/api/members`  | List all submissions (admin use)  |

### Sample POST body
```json
{
  "fullName": "Karthik R",
  "age": 28,
  "mobile": "9876543210",
  "area": "Tambaram",
  "occupation": "Teacher",
  "interest": "events",
  "message": "Happy to help with event planning",
  "agreedToPrinciples": true
}
```

## Run locally

1. Install PostgreSQL locally, or run one via Docker:
   ```
   docker run --name sangam-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=sangam_db -p 5432:5432 -d postgres
   ```
2. `mvn spring-boot:run`
3. Test it:
   ```
   curl -X POST http://localhost:8080/api/members -H "Content-Type: application/json" -d '{"fullName":"Test","mobile":"9876543210","agreedToPrinciples":true}'
   ```

## Deploy (free/cheap tier)

1. **Database**: create a free Postgres instance on [Neon](https://neon.tech) or [Supabase](https://supabase.com). Copy the connection URL, username, password.
2. **Backend**: push this project to GitHub, then deploy on [Render](https://render.com) (Web Service → connect repo → it auto-detects Maven/Spring Boot).
3. In Render's dashboard, set environment variables:
   - `DB_URL` → your Neon/Supabase JDBC URL (format: `jdbc:postgresql://<host>:5432/<db>`)
   - `DB_USERNAME`
   - `DB_PASSWORD`
4. Once deployed, note your API's public URL (e.g. `https://sangam-backend.onrender.com`).
5. In `CorsConfig.java`, replace the placeholder with your real frontend URL (Netlify/Cloudflare Pages domain), then redeploy.

## Connect the HTML form

In `sangam-interest-form.html`, replace the `submit` handler with a `fetch` call
to `https://<your-render-url>/api/members`. Ask me and I'll wire this up in the
HTML file directly.

## Before going live — things to tighten

- The `GET /api/members` endpoint is currently open. Add basic auth or an admin-only
  API key before deploying, so submitted member data (phone numbers etc.) isn't public.
- Consider rate-limiting `/api/members` (POST) to avoid spam submissions.
- Add a unique constraint or check on `mobile` if you don't want duplicate sign-ups.
