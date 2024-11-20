This is a simple chat application built with Next.js, MongoDB, and tRPC.

## Getting Started

1. Clone the repository
2. Install dependencies: `yarn install`
3. Copy `.env.example` and rename the copy to `.env`
4. Start the development server: `yarn dev`

## Notes
- Features implemented:
  - Login
  - Send message
  - View chat history
  - Realtime updates

- Features not implemented:
  - Reactions
  - Paginated chat history (infinite scroll)
  - User presence
  - Notifications
  - Typing indicators
  - Message search
  - Rich text messages

- Technical decisions:
  - I used tRPC to generate the API types for the client. This way, if the API changes, the client will break at compile time.

- Known limitations:
  - The messages are not paginated. The API returns all messages for a chat room. This is fine for now, but if the app grows, we will need to paginate the messages.
  - The shown messages are not virtualized which will make the app slow if we have a lot of messages
