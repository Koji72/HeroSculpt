# Environment Setup

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

### Supabase Configuration
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### OpenAI Configuration
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## How to Get API Keys

### Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use an existing one
3. Go to Settings > API
4. Copy the URL and anon key

### OpenAI
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in to your account
3. Go to API Keys section
4. Create a new API key
5. Copy the API key

## Features Enabled by Each Service

- **Supabase**: User authentication and session persistence
- **OpenAI**: AI-powered character design generation using GPT-4o-mini

## Notes
- The AI Designer will be disabled if `VITE_OPENAI_API_KEY` is not provided
- Authentication features will be disabled if Supabase variables are not provided
- The AI service uses GPT-4o-mini for optimal performance and cost 