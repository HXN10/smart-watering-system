# Troubleshooting Guide

## "Cannot GET" or "Failed to fetch" Errors

### Quick Fixes:

1. **Log out and log back in**
   - Old tokens may not work with the new system
   - This will get you a new token with your email embedded

2. **Hard refresh your browser**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`
   - This clears cached JavaScript files

3. **Check if backend is running**
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"OK","service":"Smart Watering Backend"}`

4. **Check browser console**
   - Press `F12` to open DevTools
   - Go to Console tab
   - Look for red error messages
   - Share the exact error message

5. **Check Network tab**
   - In DevTools, go to Network tab
   - Try to load plants
   - Click on any failed request (red)
   - Check the error message and status code

### Common Issues:

#### Issue: "Failed to fetch"
**Solution:** Backend might not be running
```bash
cd smart-watering-system/backend
npm run dev
```

#### Issue: CORS errors
**Solution:** Already fixed with enhanced CORS. If still seeing errors, restart backend.

#### Issue: Plants not loading
**Solution:** 
- Make sure you're logged in
- Check browser console for errors
- Verify token is in localStorage: `localStorage.getItem("token")`

#### Issue: "Cannot GET /api/plants"
**Solution:**
- Check backend logs: `tail -f /tmp/backend-server.log`
- Verify route is registered
- Check if MongoDB is connected

### Debug Commands:

```bash
# Check backend status
curl http://localhost:3001/health

# Test plants endpoint
curl http://localhost:3001/api/plants -H "Authorization: token-test@test.com-123"

# Check backend logs
tail -f /tmp/backend-server.log

# Restart backend
cd smart-watering-system/backend
npm run dev
```

### Still having issues?

1. Share the exact error message from browser console
2. Share the Network tab details (status code, response)
3. Check if MongoDB is running: `docker-compose ps mongo`

