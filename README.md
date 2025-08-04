# Writezilla

A web application for writers to create novels and stories while getting inspiration from playlists, moodboards, graphics, and notes.

## 🚀 Project Overview

Writezilla is a comprehensive writing platform that combines traditional novel writing with modern inspiration tools. Writers can create, edit, and organize their stories while having access to integrated tools for graphics, notes, playlists, and moodboards.

## 🎯 Features

### Core Writing Features
- **Rich Text Editor** with auto-save functionality
- **Chapter Management** with drag-and-drop organization
- **Version History** with Git-like comparison
- **Export Options** (PDF, DOC formats)
- **Word Count Tracking** in real-time

### Inspiration Tools
- **Graphics Integration** - Upload and view maps, character designs, moodboards
- **Notes System** - Story-specific notes with 200-word previews
- **Playlist Integration** - Music inspiration while writing
- **Search & Replace** - Advanced text editing tools
- **Spellcheck & Grammar** - AI-powered writing assistance

### User Experience
- **Focus Mode** - Distraction-free writing environment
- **Responsive Design** - Works on desktop and tablet
- **Real-time Collaboration** - Share and comment on stories
- **Cloud Storage** - AWS-powered secure data storage

## 🛠 Tech Stack

### Frontend
- **React** with TypeScript
- **Material-UI** for components and icons
- **Google Fonts** (Julius Sans One, Antic Didone)
- **Draft.js** for rich text editing

### Backend
- **AWS Amplify** for deployment and scaling
- **AWS Cognito** for authentication
- **AWS AppSync** (GraphQL) for real-time data
- **AWS S3** for file storage
- **AWS DynamoDB** for data persistence

### Development
- **Test-Driven Development (TDD)** approach
- **Document-Driven Design (DDD)** for specifications
- **Jest** for unit and integration testing
- **Cypress** for end-to-end testing

## 🎨 Design System

### Colors
- **Dark Orange**: #DA5812
- **Light Orange**: #DA5812 (74% transparency)
- **Light Grey**: #E3E0DD
- **White**: #E8E8E8

### Typography
- **Logo & Big Text**: Julius Sans One
- **Header Options**: Antic Didone
- **Body Text**: Antic Didone

## 📁 Project Structure

```
writezilla/
├── README/
│   ├── Login-and-Landing-Page-Design.md
│   ├── Google-OAuth-Integration.md
│   ├── Story-Editor-Design.md
│   └── Sidebar-Tools-Design.md
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── editor/
│   │   └── common/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── utils/
├── tests/
├── amplify/
└── docs/
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- AWS Account
- AWS Amplify CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nithyabach/writezilla.git
   cd writezilla
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up AWS Amplify**
   ```bash
   amplify init
   amplify add auth
   amplify add api
   amplify add storage
   ```

4. **Start development server**
   ```bash
   npm start
   ```

## 📋 Development Approach

### Test-Driven Development (TDD)
- Write failing tests first
- Implement minimal code to pass tests
- Refactor while maintaining test coverage
- Repeat for each feature

### Document-Driven Design (DDD)
- Comprehensive design documents before implementation
- Clear specifications and constraints
- Detailed architecture planning
- Success criteria definition

## 📚 Design Documents

- [Login and Landing Page Design](./README/Login-and-Landing-Page-Design.md)
- [Google OAuth Integration](./README/Google-OAuth-Integration.md)
- [Story Editor Design](./README/Story-Editor-Design.md) *(Coming Soon)*
- [Sidebar Tools Design](./README/Sidebar-Tools-Design.md) *(Coming Soon)*

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Test Coverage Goals
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user flows

## 🚀 Deployment

### Development
```bash
amplify push
```

### Production
```bash
amplify publish
```

## 📈 MVP Roadmap

### Phase 1: Authentication & Dashboard ✅
- [x] User authentication (email + Google OAuth)
- [x] Dashboard with saved stories/graphics
- [x] Navigation header
- [ ] Search functionality (placeholder)

### Phase 2: Story Creation & Management 🔄
- [ ] Create new stories
- [ ] Chapter management
- [ ] Rich text editor
- [ ] Auto-save functionality

### Phase 3: Sidebar Tools 🔄
- [ ] Format tools
- [ ] Search & replace
- [ ] Spellcheck & grammar
- [ ] Version history
- [ ] Export functionality

### Phase 4: Inspiration Tools 🔄
- [ ] Notes system
- [ ] Graphics integration
- [ ] Playlist integration
- [ ] Focus mode

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow TDD approach (write tests first)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [README](./README/) folder for detailed design documents
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join the conversation in GitHub Discussions

---

## 🎉 Current Status

**✅ Completed:**
- Document-Driven Design (DDD) implementation
- Test-Driven Development (TDD) approach
- Google OAuth authentication support
- AWS Amplify backend architecture
- React/TypeScript frontend foundation
- Comprehensive test coverage (18 tests passing)
- Material-UI and Google Fonts integration
- ESLint, Prettier, and TypeScript configuration

**🔄 Next Steps:**
- Frontend UI components
- AWS Cognito configuration
- Google Cloud Console setup
- Environment configuration

---

**Writezilla** - Where creativity meets technology for writers.

*Built with ❤️ using React, TypeScript, and AWS Amplify*

[View on GitHub](https://github.com/nithyabach/writezilla) 