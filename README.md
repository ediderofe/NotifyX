# NotifyX

A lightweight, customizable notification system for websites. Create beautiful, engaging notifications without any coding knowledge.

## Features

- 🪶 Lightweight and fast
- 🎨 Fully customizable design
- 📱 Mobile responsive
- 🎯 Smart triggers (time, scroll, exit intent)
- 📊 Built-in analytics
- 🔌 Easy integration

## Quick Start

1. Create your notification in the [NotifyX Dashboard](https://ediderofe.github.io/NotifyX)
2. Copy the generated code snippet
3. Paste it into your website's HTML

## Example Code

```html
<script src="https://ediderofe.github.io/NotifyX/public/notifyx.js" data-id="your-notification-id"></script>
```

## Live Demo

Visit [https://ediderofe.github.io/NotifyX](https://ediderofe.github.io/NotifyX) to see NotifyX in action!

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