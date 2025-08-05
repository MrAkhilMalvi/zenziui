# OAuth Setup Instructions

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Configure the consent screen
6. Add these redirect URIs:
   - `http://localhost:3001/api/auth/google/callback`
   - `https://your-domain.com/api/auth/google/callback` (for production)

7. Copy the Client ID and Client Secret
8. Update server/.env:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

## GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the form:
   - Application name: ZenZiUI
   - Homepage URL: `http://localhost:8081`
   - Authorization callback URL: `http://localhost:3001/api/auth/github/callback`

4. Copy the Client ID and Client Secret
5. Update server/.env:
   ```
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

## Testing OAuth

1. Start the backend server: `cd server && npm run dev`
2. Start the frontend server: `cd client && npm run dev`
3. Go to login page and click "Continue with Google" or "Continue with GitHub"
4. Complete OAuth flow and you should be redirected back to the app

## Notes

- For development, you can use placeholder values, but OAuth won't work until real credentials are configured
- Make sure your callback URLs match exactly
- The frontend URL in server/.env should match your actual frontend URL (http://localhost:8081)
