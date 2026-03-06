# Untivitti Game App

[DEMO](https://untivitti.ammiratafabiano.dev)

Welcome to Untivitti Game App, an Ionic 5 web application that allows you to play the traditional Sicilian Christmas game "Cucù" (also called "Morto" or "Asso che corre"). The concept for this app originated during the COVID-19 pandemic in 2020 when physical gatherings for Christmas were limited. The name "Untivitti" is a playful phrase in Sicilian dialect, lit. "I couldn't see you", capturing the essence of the game and the spirit of togetherness during the holiday season.

## Features:

- **Play Sicilian "Cucù" Game Remotely:** Enjoy the opportunity to play the traditional Sicilian "cucù" game even when you're apart, keeping the Christmas traditions alive from anywhere.
  
- **Remote Fun with Friends:** Connect and have fun with your friends and family even when you're physically separated, making the gaming experience even more special.

## Architecture

The project is split into two parts:

- **backend/** — Node.js/Express + WebSocket backend (TypeScript)
- **frontend/** — Ionic 5 / Angular frontend (TypeScript)

## Development

### Server

```bash
cd backend
npm install
npm run build   # Compiles TS → dist/
npm start       # Runs dist/server.js
```

Environment variables:
| Variable | Default | Description |
|---|---|---|
| `PORT` | `3442` | Server listen port |
| `TLS_KEY_PATH` | _(none)_ | Path to TLS private key (omit for plain HTTP) |
| `TLS_CERT_PATH` | _(none)_ | Path to TLS certificate (omit for plain HTTP) |
| `ALLOWED_ORIGINS` | `https://untivitti.ammiratafabiano.dev,http://localhost:8100` | Comma-separated CORS origins |

### Frontend

```bash
cd frontend
npm install
npx ng serve    # Dev server on http://localhost:8100
```

## Docker

Both components have multi-stage Dockerfiles. To run locally:

```bash
# Build images
docker build -t untivitti-backend ./backend
docker build -t untivitti-frontend ./frontend

# Run
docker run -d -p 3442:3442 untivitti-backend
docker run -d -p 8081:80 untivitti-frontend
```

### Production deploy

```bash
cd deploy
docker compose up -d
```

## How to Play:

1. **Launch the App:** Open the app in your mobile browser for the best experience.
   
2. **Choose Game Mode in the Lobby:** Select your preferred game mode in the app's lobby.

3. **Invite Friends:** Send invitation links to your friends and family to create a game group. Share the festive spirit and compete with your loved ones!

4. **Follow the Rules:** Once your group is ready, follow the traditional rules of "cucù." The app will guide you through the gameplay.

5. **Enjoy the Festive Spirit:** Have a delightful time playing the game and embracing the Sicilian Christmas tradition with your friends and family!

## Language
- **Italian**
- (English in the future)

## Screenshots
<img src="https://github.com/ammiratafabiano/untivitti/assets/36988217/a92e3cb7-bbd2-46b5-9cbf-a43a770c3e00" alt="drawing" width="200"/>
<img src="https://github.com/ammiratafabiano/untivitti/assets/36988217/d32a8d16-558a-4f51-8798-7f26f89eb79e" alt="drawing" width="200"/>
<img src="https://github.com/ammiratafabiano/untivitti/assets/36988217/aa6b56e6-ae55-4d27-a544-b9495a0aa222" alt="drawing" width="200"/>
<img src="https://github.com/ammiratafabiano/untivitti/assets/36988217/ab1bfd2d-34d5-4c40-a8e4-81248c3762ae" alt="drawing" width="200"/>


