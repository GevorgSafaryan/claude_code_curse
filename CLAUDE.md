# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server on :3000 (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run test         # Vitest (all tests)
npx vitest run src/lib/__tests__/file-system.test.ts  # Single test file
npm run setup        # Install deps + prisma generate + migrate
npm run db:reset     # Reset SQLite database
```

**Windows note:** Scripts use `cross-env` for setting `NODE_OPTIONS` — required because Windows doesn't support inline Unix env vars.

## Architecture

UIGen is an AI-powered React component generator. Users chat with Claude to generate/edit UI components, which are rendered in a live preview iframe.

### Core Flow

1. User sends a message via the chat interface
2. `POST /api/chat` streams a response from Claude (claude-haiku-4-5) using Vercel AI SDK
3. Claude uses tools (`str_replace_editor`, `file_manager`) to create/edit files in a virtual file system
4. Tool results update the in-memory VirtualFileSystem, triggering UI refresh
5. The preview panel transforms JSX via Babel, generates import maps (esm.sh for third-party packages), and renders in a sandboxed iframe

### Key Layers

- **Virtual File System** (`src/lib/file-system.ts`): In-memory Map-based tree. Serialized to JSON for Prisma storage. No disk I/O — all files live in memory and are passed as request body to the API.

- **AI Provider** (`src/lib/provider.ts`): Wraps `@ai-sdk/anthropic`. Falls back to `MockLanguageModel` with canned responses if `ANTHROPIC_API_KEY` is not set.

- **Tool System** (`src/lib/tools/`): AI tools operate on VirtualFileSystem. Tool calls from the AI stream are processed in `ChatContext`, executed via `FileSystemContext`, and results trigger UI updates.

- **JSX Transform** (`src/lib/transform/jsx-transformer.ts`): Babel compiles JSX/TSX, generates blob URLs for local files, creates import maps pointing third-party packages to esm.sh CDN, and produces an HTML document for the preview iframe.

- **Auth** (`src/lib/auth.ts`): JWT in HTTP-only cookies, bcrypt passwords, 7-day expiry. Optional — anonymous users can use the app.

### State Management

Two React contexts drive the app:

- **ChatContext** (`src/lib/contexts/chat-context.tsx`): Wraps Vercel AI SDK `useChat`. Manages messages, streaming, and tool call processing.
- **FileSystemContext** (`src/lib/contexts/file-system-context.tsx`): Holds VirtualFileSystem instance, selected file, and file operations. Handles tool execution from AI responses.

### Layout

Resizable panels via `react-resizable-panels`:
- Left (35%): Chat interface
- Right (65%): Toggle between live preview iframe and code editor (Monaco + file tree)

### Database

SQLite via Prisma. The database schema is defined in `prisma/schema.prisma` — reference it anytime you need to understand the structure of data stored in the database. Two models:
- `User`: email, hashed password
- `Project`: name, optional userId, `messages` (JSON string of chat history), `data` (JSON string of serialized virtual file system)

### Environment Variables

- `ANTHROPIC_API_KEY` — optional; mock provider used if absent
- `JWT_SECRET` — auto-generated in dev if missing

## Testing

Vitest with jsdom + @testing-library/react. Tests live in `__tests__` directories adjacent to source files.
