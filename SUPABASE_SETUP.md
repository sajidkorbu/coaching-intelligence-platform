# Supabase Edge Function Setup

This guide will help you deploy the secure Edge Function to handle OpenAI API calls.

## Prerequisites

1. **Install Supabase CLI**:
   ```bash
   npm install -g @supabase/cli
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

## Setup Steps

### 1. Initialize Supabase in your project
```bash
cd /Users/sajidkorbu/Documents/CoachApp
supabase init
```

### 2. Link to your existing project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### 3. Set the OpenAI API key as a secret
```bash
supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Deploy the Edge Function
```bash
supabase functions deploy generate-response
```

### 5. Verify deployment
```bash
supabase functions list
```

## Testing the Edge Function

You can test the function using:

```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/generate-response' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "personaId": "test-persona",
    "coachMessage": "Hello, how are you feeling today?",
    "conversationHistory": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello, how are you feeling today?"}
    ]
  }'
```

## Security Benefits

✅ **OpenAI API Key is now secure** - stored as a Supabase secret, not in frontend code
✅ **Rate limiting** - Supabase Edge Functions have built-in rate limiting
✅ **CORS protection** - Properly configured CORS headers
✅ **Error handling** - Comprehensive error handling and logging

## Next Steps

After deployment:
1. Remove the old OpenAI service from frontend
2. Update environment variables
3. Test the application end-to-end

## Troubleshooting

- **Function not found**: Make sure you've deployed with `supabase functions deploy`
- **API key errors**: Verify the secret was set correctly with `supabase secrets list`
- **CORS errors**: Check that the function includes proper CORS headers