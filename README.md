# NotifyX

A super lightweight notification tool that websites can easily add with a simple JavaScript snippet.

## Features

- Lightweight JavaScript snippet for easy integration
- Customizable notifications with text, colors, images, and CTA buttons
- Multiple trigger options:
  - Show after X seconds
  - Show when the user scrolls X% of the page
  - Show when the user is about to leave (exit-intent)
- Simple UI for creating and customizing notifications
- Basic analytics to track views & clicks

## Getting Started

### For Website Owners

1. Sign up for NotifyX
2. Create and customize your notifications
3. Add the following snippet to your website:

```html
<script src="https://cdn.notifyx.com/notifyx.js" data-id="YOUR_NOTIFICATION_ID"></script>
```

4. Place the script right before the closing `</body>` tag for optimal performance

### For Developers

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/notifyx
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

- `notifyx.js` - The main JavaScript snippet for websites to embed
- `index.html` - The UI for users to create and customize notifications
- `app.js` - Frontend logic for the UI
- `server.js` - Backend to handle notification storage and serving
- `database.js` - Database interface

## License

MIT 