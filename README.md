# 🎯 Coaching Intelligence Platform

A comprehensive AI-powered coaching simulation platform designed for aspiring coaches in India to practice with realistic client personas before working with real clients.

## ✨ Key Features

- **🧠 9 Authentic Personas**: Realistic Indian metro professionals with genuine problems
- **💭 Memory Persistence**: Personas remember conversation context and maintain personality consistency
- **📊 Professional Evaluation**: Tony Robbins + ICF coaching methodology assessment
- **🔐 Secure Architecture**: Supabase Edge Functions protect OpenAI API keys
- **📈 Progress Dashboard**: Track coaching skills improvement over time
- **🔑 Simple Authentication**: Demo login system for reviewers

## 🚀 Demo Access

**Live Demo**: [Your deployment URL here]

**Login Credentials**:
- Username: `milind`
- Password: `milind`

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3.4
- **AI**: OpenAI GPT-4 API
- **Backend**: Supabase (Database + Edge Functions)
- **Authentication**: Custom login system
- **Memory**: localStorage + Supabase persistence

## 🏗 Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App     │    │  Supabase Edge   │    │   OpenAI API    │
│                 │───▶│    Functions     │───▶│                 │
│ - PersonaEngine │    │                  │    │   GPT-4 Model   │
│ - MemoryStore   │    │ - Secure API     │    │                 │
│ - UI Components │    │ - Rate Limiting  │    └─────────────────┘
└─────────────────┘    └──────────────────┘              
         │                        │                              
         ▼                        ▼                              
┌─────────────────┐    ┌──────────────────┐                     
│   localStorage  │    │  Supabase DB     │                     
│                 │    │                  │                     
│ - Session Data  │    │ - User Progress  │                     
│ - Conversations │    │ - Session History│                     
└─────────────────┘    └──────────────────┘                     
```

## 🎭 Persona Profiles

### Mumbai Professionals
- **Rahul Sharma** - Senior Software Engineer facing work-life balance crisis
- **Kavya Patel** - Investment Banker questioning career direction
- **Rohan Mehta** - Marketing Manager juggling wedding planning and career

### Delhi Professionals  
- **Priya Gupta** - Startup Founder struggling with scaling challenges
- **Vikram Singh** - Corporate Lawyer questioning life purpose
- **Ishita Sharma** - Management Consultant dealing with travel burnout

### Bangalore Professionals
- **Arjun Rao** - Product Manager at crossroads of career growth
- **Ananya Krishnan** - Data Scientist facing business-side challenges  
- **Aditya Kumar** - Software Architect planning next career steps

## 🎯 Coaching Evaluation Framework

Based on **Tony Robbins methodology** + **ICF standards**:

- **Active Listening** (0-100)
- **Powerful Questioning** (0-100) 
- **Rapport Building** (0-100)
- **Goal Setting** (0-100)
- **Breakthrough Creation** (0-100)
- **Overall Effectiveness** (0-100)

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/coaching-intelligence-platform.git
   cd coaching-intelligence-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your keys:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   ```bash
   # Run the SQL schema in your Supabase SQL Editor
   # Copy content from: supabase-schema.sql
   ```

5. **Deploy Edge Function** (Optional - has fallback)
   ```bash
   # Follow instructions in SUPABASE_SETUP.md
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## 🔒 Security Features

- ✅ **API Key Protection**: OpenAI keys secured in Supabase Edge Functions
- ✅ **CORS Protection**: Proper cross-origin request handling  
- ✅ **Rate Limiting**: Built-in Supabase function limits
- ✅ **Fallback System**: Direct API calls if Edge Function fails
- ✅ **Input Validation**: Comprehensive error handling

## 📊 Database Schema

### `coaching_sessions`
- Session metadata and conversation history
- AI evaluation reports
- User progress tracking

### `user_progress` 
- Individual competency scores
- Progress over time
- Performance analytics

## 🎨 Key Components

- **`PersonaEngine`**: Core AI persona management
- **`MemoryStore`**: Conversation persistence & context
- **`CoachingEvaluator`**: Professional assessment system
- **`SecureOpenAIService`**: Edge Function integration
- **`Dashboard`**: Progress analytics and insights

## 🐛 Known Issues & Limitations

- Memory resets on browser data clear (localStorage)
- Direct OpenAI fallback exposes API key (temporary)
- Rate limiting only on Edge Functions, not fallback
- Demo authentication (not production-ready)

## 🚀 Future Enhancements

- [ ] Real user authentication & profiles
- [ ] Advanced analytics & reporting
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Video coaching sessions
- [ ] Certification pathways

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Supabase for backend infrastructure  
- Tony Robbins coaching methodology
- ICF (International Coaching Federation) standards
- Indian coaching community for persona insights

---

**Built with ❤️ for the Indian coaching community**