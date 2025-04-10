# LLM Compare

A powerful web application for comparing responses from multiple Large Language Models (LLMs). Built with React, TypeScript, and Express.js.

## Features

- 🤖 **Multiple LLM Support**: Compare responses from OpenAI, Cohere, Anthropic, and custom models
- 📝 **Prompt Management**: Input custom prompts or use predefined templates
- 🔄 **Real-time Comparison**: Side-by-side display with model metadata
- 📊 **Performance Analytics**: Track token usage, response times, and other metrics
- ⚙️ **Model Configuration**: Adjust temperature, max tokens, and other parameters
- 💾 **History & Export**: Save comparisons and export results in various formats
- 🌙 **User Preferences**: Dark mode, language settings, and default configurations

## Tech Stack

- **Frontend**: React (TypeScript), Tailwind CSS, Zustand
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (optional)
- **APIs**: OpenAI, Cohere, Anthropic
- **Authentication**: Firebase/Auth0 (optional)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- API keys for the LLM services you want to use

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/llm-compare.git
   cd llm-compare
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```env
   OPENAI_API_KEY=your_openai_key
   COHERE_API_KEY=your_cohere_key
   ANTHROPIC_API_KEY=your_anthropic_key
   ```

4. Start the development servers:
   ```bash
   npm run dev
   ```

   This will start both the frontend (http://localhost:3000) and backend (http://localhost:4000) servers.

## Project Structure

```
/llm-compare
├── /frontend                 # React frontend
├── /backend                  # Express.js backend
├── /config                   # Shared configurations
├── /logs                     # Application logs
└── /tests                    # Test files
```

## Development

- Frontend development server: `npm run dev:frontend`
- Backend development server: `npm run dev:backend`
- Run tests: `npm test`
- Lint code: `npm run lint`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Vercel's AI SDK
- Built with modern web technologies
- Community contributions welcome 