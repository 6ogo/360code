# 360code Timeline

A timeline application that shows daily changes in GitHub repositories.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   - Create a `.env` file in the root directory with the following content:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   ```

3. Run the application:
   ```
   node server.js
   ```

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the `GITHUB_TOKEN` environment variable in Vercel project settings
4. Deploy your application

## Troubleshooting

If you encounter a 500 error on Vercel, check the following:

1. Make sure the `GITHUB_TOKEN` environment variable is set in Vercel
2. Check the Vercel deployment logs for specific error messages
3. Ensure your serverless function isn't exceeding Vercel's memory or timeout limits
