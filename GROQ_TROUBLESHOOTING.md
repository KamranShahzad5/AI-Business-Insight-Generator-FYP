# 🔧 Groq API Error Troubleshooting

This guide helps fix all Groq API related errors.

## Quick Diagnosis

Run this in your terminal to check your setup:

```bash
# Check if backend environment is set up correctly
cd server
npm run dev
```

You should see:
```
✅ Groq API key loaded.
✅ Connected to MongoDB
🚀 Server running on port 5000
```

If you see ❌ errors, follow the appropriate section below.

---

## Error 1: "GROQ_API_KEY is missing or still set to the placeholder"

### What This Means
Your backend doesn't have a valid Groq API key.

### How to Fix

**Step 1: Get Your Groq API Key**
1. Visit https://console.groq.com/
2. Sign up or log in (FREE)
3. Go to **API Keys** section
4. Click **Create API Key**
5. Copy the key (looks like `gsk_xxxxxxxxxxxxx`)

**Step 2: Create `.env` file in server folder**

Create `server/.env` with:
```env
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/insightify
GROQ_API_KEY=gsk_YOUR_KEY_HERE
JWT_SECRET=my_secret_key_change_this
CLIENT_URL=http://localhost:5173
```

⚠️ **IMPORTANT**:
- Replace `gsk_YOUR_KEY_HERE` with your actual key
- NO QUOTES around the key
- NO spaces before or after the key

**Step 3: Restart Backend**
```bash
Ctrl + C  # Stop current server
npm run dev  # Start again
```

---

## Error 2: "Invalid Groq API Key"

### What This Means
Your API key is invalid or doesn't have permission.

### How to Fix

1. **Verify your key is correct**:
   - Go to https://console.groq.com/
   - Check that you have an active API key
   - Copy the key again carefully

2. **Check for copy-paste errors**:
   - Make sure there are NO spaces at the beginning or end
   - Make sure the key starts with `gsk_`
   - Make sure you didn't accidentally add quotes

3. **Update your `.env` file**:
   ```env
   GROQ_API_KEY=gsk_xxxxxxxxxxxxx
   ```
   (Without quotes, without spaces)

4. **Restart backend**:
   ```bash
   npm run dev
   ```

5. **Test it**:
   ```bash
   curl http://localhost:5000/api/health
   ```

   You should see:
   ```json
   {"status":"ok","groqKeySet":true,"jwtSecretSet":true,"mongoUri":"set"}
   ```

---

## Error 3: "403 Forbidden" or "Access Denied"

### What This Means
Your Groq API key is valid but doesn't have permission to use the model.

### How to Fix

1. **Check your Groq account**:
   - Visit https://console.groq.com/
   - Make sure you're using the FREE tier
   - Check if there are any restrictions on your account

2. **Check API usage**:
   - Go to https://console.groq.com/ → **Usage**
   - Make sure you haven't exceeded rate limits
   - Free tier has limits, wait a moment and try again

3. **Verify model name**:
   - Backend uses: `llama-3.1-8b-instant`
   - This model should be available on free tier
   - Check https://console.groq.com/docs/models

4. **Regenerate API key**:
   - Go to https://console.groq.com/ → **API Keys**
   - Delete old key
   - Create a new one
   - Update `.env` file with new key

---

## Error 4: "429 Too Many Requests" or "Rate limit exceeded"

### What This Means
You've hit the rate limit for your API key.

### How to Fix

**Short term**:
1. Wait 1-5 minutes
2. Try again

**Long term**:
1. Upgrade to Groq paid plan
2. Or cache responses (don't regenerate same plan twice)
3. Space out your requests

---

## Error 5: "Cannot connect to Groq API"

### What This Means
Your backend can't reach Groq servers (network issue).

### How to Fix

1. **Check your internet connection**:
   ```bash
   ping console.groq.com
   ```

2. **Check firewall settings**:
   - Windows Defender might be blocking the connection
   - Try disabling it temporarily
   - Or add Node.js to firewall whitelist

3. **Check proxy settings**:
   - If you're behind a corporate proxy, configure it
   - Ask your IT department for proxy settings

4. **Try in a different network**:
   - Sometimes ISP blocks certain connections
   - Try using mobile hotspot or different WiFi

---

## Error 6: "Empty response from Groq API"

### What This Means
Groq returned an empty response (API error).

### How to Fix

1. **Try again** - Sometimes it's a temporary glitch
   ```bash
   npm run dev  # Restart and try generating a plan again
   ```

2. **Check your prompt** - Make sure business idea is valid:
   - Minimum 10 characters
   - Not just gibberish
   - Valid business concept

3. **Check API status**:
   - Visit https://status.groq.com/
   - Make sure Groq services are operational

---

## Verification Checklist

Before deploying, make sure:

- [ ] `GROQ_API_KEY` starts with `gsk_`
- [ ] `GROQ_API_KEY` has NO quotes around it
- [ ] `GROQ_API_KEY` has NO spaces before/after
- [ ] `.env` file is in the `server/` folder (not client/)
- [ ] Backend shows ✅ Groq API key loaded
- [ ] You can run `npm run dev` without errors
- [ ] You can generate a plan successfully

---

## Testing Steps

### Test 1: Check Environment

```bash
cd server
npm run dev
```

Look for:
```
✅ Groq API key loaded.
```

### Test 2: Health Check

```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "ok",
  "groqKeySet": true,
  "jwtSecretSet": true,
  "mongoUri": "set"
}
```

### Test 3: Generate a Plan

1. Register at http://localhost:5173
2. Go to "Generate New Plan"
3. Enter a business idea (minimum 20 characters)
4. Click "Generate"
5. Wait 5-10 seconds

Should show: "Business plan generated! 🚀"

### Test 4: Check Logs

In terminal where backend is running, look for:
```
--- Calling Groq API ---
--- Groq API Success ---
```

---

## Common Mistakes

❌ **Mistake 1: Using old Gemini key**
- ❌ Trying to use Google Gemini API key
- ✅ Use Groq API key from console.groq.com

❌ **Mistake 2: Quotes around key**
- ❌ `GROQ_API_KEY="gsk_..."`
- ✅ `GROQ_API_KEY=gsk_...`

❌ **Mistake 3: Extra spaces**
- ❌ `GROQ_API_KEY = gsk_...` (spaces around =)
- ✅ `GROQ_API_KEY=gsk_...`

❌ **Mistake 4: .env in wrong folder**
- ❌ Creating `.env` in `client/` folder
- ✅ Creating `.env` in `server/` folder

❌ **Mistake 5: Not restarting backend**
- ❌ Changing .env and not restarting server
- ✅ Always restart: `Ctrl+C` then `npm run dev`

---

## Still Not Working?

1. **Check the exact error message** in terminal
2. **Google the error** - Often has solutions
3. **Check Groq status page** - https://status.groq.com/
4. **Try a different business idea** - Make sure it's valid
5. **Restart everything**:
   ```bash
   # Kill all Node processes
   taskkill /F /IM node.exe
   
   # Start fresh
   cd server
   npm run dev
   ```

---

## Need More Help?

Resources:
- Groq Documentation: https://console.groq.com/docs
- Groq Models: https://console.groq.com/docs/models
- Discord/Community: Check Groq official channels

Good luck! 🚀