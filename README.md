# EduCensusBot

EduCensusBot is an AI-powered assistant designed to help teachers and staff working on the Karnataka Government Census website. It provides support for tasks such as data entry, login issues, portal navigation, deadlines, and troubleshooting.

## Features

- **Multilingual Support**: Responds in English or Kannada based on user preference.
- **Quick Assistance**: Provides predefined quick questions for common issues.
- **Interactive Chat**: Engages users with a chat interface for real-time assistance.
- **Customizable UI Components**: Built with reusable and customizable UI components.

## Project Structure

- `app/`: Contains the main application files, including API routes and pages.
  - `api/ask/`: API endpoint for handling user queries.
  - `globals.css`: Global styles for the application.
  - `layout.tsx`: Root layout for the application.
  - `page.tsx`: Home page with the chat interface.
- `components/`: Reusable UI components and EduCensus-specific components.
  - `educensus/`: Components specific to the EduCensusBot, such as `chat-ui` and `message-bubble`.
  - `ui/`: General-purpose UI components like buttons, sliders, and dialogs.
- `hooks/`: Custom React hooks for managing state and behavior.
- `lib/`: Utility functions used across the application.
- `public/`: Static assets like images and logos.
- `styles/`: Additional global styles.

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Shahsank07/census-chatbot.git
   cd census-chatbot
   ```

2. **Install Dependencies**:
   This project uses `pnpm` for package management. Install dependencies with:
   ```bash
   pnpm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the Development Server**:
   Start the development server with:
   ```bash
   pnpm dev
   ```
   The application will be available at `http://localhost:3000`.

5. **Build for Production**:
   To create a production build, run:
   ```bash
   pnpm build
   ```

## Usage

- Open the application in your browser.
- Use the chat interface to interact with EduCensusBot.
- Select your preferred language (English or Kannada) for communication.
- Ask questions or use the predefined quick questions for assistance.

## Technologies Used

- **Next.js**: React framework for building the application.
- **TypeScript**: Strongly typed programming language for better code quality.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **OpenAI API**: Provides the AI capabilities for the chatbot.
- **Radix UI**: Accessible and customizable UI components.

## Contributing

Contributions are welcome! If you have suggestions or find issues, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.