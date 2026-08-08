🎬 MoviezWiki

<p align="center">
  <strong>A modern movie discovery platform built with Next.js, React & TypeScript.</strong>
</p><p align="center">
  <a href="https://moviez-wiki.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-MoviezWiki-black?style=for-the-badge&logo=vercel" alt="Live Demo">
  </a>
  <a href="https://github.com/KaushikSingha833/MoviezWiki">
    <img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github" alt="GitHub Repository">
  </a>
</p><p align="center">
  <img src="https://img.shields.io/github/stars/KaushikSingha833/MoviezWiki?style=flat-square" alt="GitHub Stars">
  <img src="https://img.shields.io/github/forks/KaushikSingha833/MoviezWiki?style=flat-square" alt="GitHub Forks">
  <img src="https://img.shields.io/github/last-commit/KaushikSingha833/MoviezWiki?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/github/languages/top/KaushikSingha833/MoviezWiki?style=flat-square" alt="Top Language">
</p>---

🌐 Live Demo

🚀 "moviez-wiki.vercel.app" (https://moviez-wiki.vercel.app)

Explore movies through a clean, responsive and modern web experience.

---

📖 About

MoviezWiki is a movie discovery web application designed to provide users with an easy and engaging way to explore movies and their information.

The project was built with modern web technologies, focusing on:

- ⚡ Fast and responsive user experience
- 🎨 Clean and modern interface
- 🔍 Easy movie discovery
- 📱 Responsive design
- 🧩 Reusable components
- 🔐 Secure environment-variable management
- 🚀 Production deployment with Vercel

---

✨ Features

🎬 Movie Discovery

Browse and explore movie content through an intuitive interface.

🔎 Search

Find movies quickly using the search functionality.

📄 Movie Information

Explore detailed information about individual movies.

⭐ Ratings & Information

View available movie ratings and relevant information.

📱 Responsive Design

The application is designed to work across:

- 💻 Desktop
- 💻 Laptop
- 📱 Mobile
- 📲 Tablet

⚡ Modern Web Experience

Built with Next.js and React to provide a smooth and performant application experience.

🌐 Production Deployment

The application is deployed using Vercel and is available publicly.

---

🛠️ Tech Stack

Frontend

<p>
  <img src="https://skillicons.dev/icons?i=nextjs,react,typescript,html,css" alt="Frontend Technologies">
</p>| Technology | Purpose |
| --- | --- |
| Next.js | React framework and application architecture |
| React | UI development |
| TypeScript | Type-safe development |
| HTML5 | Application structure |
| CSS3 | Styling and responsive design |

Development & Deployment

<p>
  <img src="https://skillicons.dev/icons?i=git,github,vscode,vercel" alt="Development Technologies">
</p>- Git
- GitHub
- Visual Studio Code
- Vercel

Data

Movie information is retrieved through the project's configured movie data/API service.

---

🏗️ Application Architecture

```
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Next.js App      │
                         │   React Interface   │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
             Home / Browse       Search        Movie Details
                  │                 │                 │
                  └─────────────────┼─────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Movie Data /     │
                         │      API Layer      │
                         └─────────────────────┘
```

---

📂 Project Structure

```
MoviezWiki/
│
├── public/
│   └── ...
│
├── src/
│   ├── app/
│   │   ├── ...
│   │   └── ...
│   │
│   ├── components/
│   │   └── ...
│   │
│   └── ...
│
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

*The exact structure may evolve as the application grows.*

---

🔐 Environment Variables

MoviezWiki uses environment variables to manage configuration and API credentials.

For production, environment variables are configured securely through Vercel.

### Local Development

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_MOVIE_API_KEY=your_api_key_here
```

⚠️ **Never commit `.env.local` or actual API keys to GitHub.**

### Production

For the deployed application, configure the required variables through:

```
Vercel
   ↓
Project
   ↓
Settings
   ↓
Environment Variables
```

This keeps configuration separate from the source-code repository.

---

🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm
- Git

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/KaushikSingha833/MoviezWiki.git
```

---

### 2️⃣ Navigate to the Project

```bash
cd MoviezWiki
```

---

### 3️⃣ Install Dependencies

```bash
npm install
```

---

### 4️⃣ Configure Environment Variables

Create `.env.local` and add the required environment variables.

Example:

```
NEXT_PUBLIC_MOVIE_API_KEY=your_api_key_here
```

---

### 5️⃣ Start Development Server

```bash
npm run dev
```

The application will run at:

```
http://localhost:3000
```

---

📦 Available Scripts

### Development

```bash
npm run dev
```

Starts the development server.

### Production Build

```bash
npm run build
```

Creates an optimized production build.

### Production Server

```bash
npm run start
```

Starts the application in production mode.

### Linting

```bash
npm run lint
```

Runs the project's linting checks.

---

🎨 Design Philosophy

MoviezWiki focuses on creating a balance between visual appeal and usability.

**Core principles:**

- Minimal and clean interface
- Easy navigation
- Responsive layouts
- Clear movie information
- Reusable UI components
- Fast interactions
- Consistent visual design

---

⚡ Performance

The application benefits from the capabilities of the Next.js ecosystem, including:

- Optimized application rendering
- Component-based architecture
- Production builds
- Responsive layouts
- Vercel deployment infrastructure

Performance can be further improved through caching, image optimization, lazy loading and API optimization as the project evolves.

---

🔒 Security

Sensitive configuration is kept outside the Git repository.

**Security practices:**

- API credentials stored using environment variables
- `.env` files excluded from version control
- Production environment variables managed through Vercel
- No API credentials committed to source code

**Important:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser by Next.js. Do not use that prefix for credentials that must remain strictly server-side.

---

🧪 Future Improvements

The project can be extended with:

- [ ] 👤 User authentication
- [ ] ❤️ Personal watchlist
- [ ] ⭐ User reviews and ratings
- [ ] 🎯 Personalized recommendations
- [ ] 🎞️ Movie trailer integration
- [ ] 🔥 Trending movies
- [ ] 📅 Upcoming movie releases
- [ ] 🎭 Advanced genre filtering
- [ ] 🌙 Dark / Light theme
- [ ] 📱 Progressive Web App support
- [ ] 🔔 Personalized notifications
- [ ] 📊 User profile and activity dashboard
- [ ] ⚡ Advanced caching and performance optimization

---

🚀 Deployment

MoviezWiki is deployed using Vercel.

### Production URL

https://moviez-wiki.vercel.app

### Deploy Your Own Version

1. Fork this repository.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Deploy the application.

---

🤝 Contributing

Contributions and suggestions are welcome.

**Fork the repository:**

```bash
git clone https://github.com/KaushikSingha833/MoviezWiki.git
```

**Create a feature branch:**

```bash
git checkout -b feature/new-feature
```

**Make your changes:**

Implement your feature or improvement.

**Commit your changes:**

```bash
git add .
git commit -m "feat: add new feature"
```

**Push your branch:**

```bash
git push origin feature/new-feature
```

Then open a Pull Request.

---

📌 Project Goals

MoviezWiki was developed to strengthen practical experience with:

- Modern React development
- Next.js application architecture
- TypeScript
- API integration
- Responsive web development
- Component-based UI development
- Environment-variable management
- Git & GitHub workflows
- Production deployment

---

📄 License

This project is created for educational and portfolio purposes.

---

👨‍💻 Author

**Kaushik Singha**

Computer Science Engineering — AI & ML

Interested in:

- 💻 Software Development
- 🌐 Full-Stack Development
- 🤖 Artificial Intelligence & Machine Learning
- 📱 Web Technologies
- 🧩 Problem Solving

**Connect:**

<p>
  <a href="https://github.com/KaushikSingha833">
    <img src="https://img.shields.io/badge/GitHub-KaushikSingha833-black?style=for-the-badge&logo=github" alt="GitHub">
  </a>
</p>

---

⭐ Support the Project

If you like MoviezWiki, consider giving the repository a ⭐.

Your support is appreciated and helps motivate further development.

---

<p align="center">
  🎬 <strong>MoviezWiki</strong><br>
  Discover movies. Explore stories.<br>
  Built with ❤️ using Next.js + React + TypeScript
</p>
