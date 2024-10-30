



# Campus Connect 🎓

**Campus Connect** is a collaborative learning platform designed for college students. Inspired by Stack Overflow, Campus Connect allows students to engage in meaningful discussions, ask questions, and get AI-generated insights alongside peer responses. With mentorship programs, live sessions, and easy-to-use interfaces, it’s the ultimate hub for collaborative learning and academic growth.

---

## 🌟 Features

- **Question & Answer Forum**: Post questions, get answers from peers, and benefit from AI-generated responses for instant insights.
- **AI Assistance**: Powered by OpenAI API, Campus Connect provides automated responses, helping students access immediate guidance.
- **Mentorship Program**: Connect with mentors through scheduled live sessions using Google Meet or Zoom integration.
- **User Authentication**: Secure login and registration with Firebase Authentication, supporting email/password and third-party options.
- **Modern, Responsive UI**: A seamless and mobile-friendly user experience built with React.js and Tailwind CSS.

---

## 🚀 Tech Stack

- **Frontend**: React.js with Tailwind CSS for styling.
- **Backend**: NestJS with Prisma ORM for database management.
- **Database**: PostgreSQL for secure and scalable data storage.
- **Authentication**: Firebase for easy and secure user sign-up and login.
- **AI Integration**: OpenAI API for generating intelligent, automated answers to questions.
- **Mentorship Live Sessions**: Google Meet or Zoom integration to facilitate real-time mentorship interactions.
- **Dependency Management**: PNPM workspace to manage multiple services efficiently in a monorepo.

---

## 📋 Installation and Setup

### Prerequisites
- **Node.js** and **PNPM** installed
- **PostgreSQL** setup and running
- **Firebase** and **OpenAI API** accounts (for authentication and AI integration)

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/campus-connect.git
   cd campus-connect
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure environment variables**: Add your configuration in `.env` for Firebase, PostgreSQL, and OpenAI API keys.

4. **Database Migration**:
   ```bash
   pnpm prisma migrate dev
   ```

5. **Run the application**:
   ```bash
   pnpm run start
   ```

---

## 📂 Project Structure

```
campus-connect/
├── client/                     # React frontend
├── server/                     # NestJS backend
├── prisma/                     # Prisma schemas and migrations
├── .env                        # Environment variables
└── README.md                   # Project README
```

---

## 🗂️ Usage

1. **Sign Up / Log In**: Register using email/password or via Google.
2. **Ask Questions**: Post questions and receive answers from peers or the AI assistant.
3. **Mentorship Program**: Join live sessions or view session schedules in the Mentorship section.
4. **View Responses**: Interact with AI-generated and peer-provided responses.

---

## 🛠️ Development Process

### Week 1-3: Planning & Requirements
- Define objectives, gather requirements, and finalize tech stack.

### Week 4-6: Design Phase
- System architecture and UI/UX design.

### Week 7-12: Development Phase
- Frontend and backend development, API creation, and database setup.

### Week 13-16: AI Integration and Mentorship Program
- Integrate OpenAI API and set up mentorship live session features.

### Week 17-20: Testing, Deployment & Final Review
- Testing, debugging, deployment, and optimization.

---

## 📈 Future Scope

- **Mobile App Integration**: Launch a mobile version for wider accessibility.
- **Additional AI Capabilities**: Enhance AI responses with more contextual data.
- **Resource Recommendations**: Suggest learning materials or resources based on student queries.

---

## 📚 References

1. [NestJS Documentation](https://docs.nestjs.com/)
2. [React Documentation](https://reactjs.org/docs/getting-started.html)
3. [Prisma Documentation](https://www.prisma.io/docs/)
4. [OpenAI API](https://beta.openai.com/docs/)
5. [Firebase Authentication](https://firebase.google.com/docs/auth)

---

## 📞 Contact

For any questions, please reach out to the Campus Connect team at **[your email]**. 

--- 

Enjoy collaborating and connecting on **Campus Connect**! 🎓
