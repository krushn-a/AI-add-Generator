# Add Generator - AI-Powered Product Image & Video Generator

A modern web application that leverages cutting-edge AI to generate stunning product images and marketing videos from simple product photos. Built with Next.js, Firebase, and advanced AI APIs.

## 🚀 Features

- **AI-Powered Image Generation**: Upload a product photo and let AI generate professional marketing images using Gemini 2.5 Flash and Clipdrop
- **Smart Video Creation**: Automatically generate cinematic product videos with motion effects and atmospheric elements
- **Intelligent Prompt Engineering**: Uses advanced AI to analyze product images and generate contextually relevant creation prompts
- **User Authentication**: Secure Google OAuth login via Firebase Authentication
- **Real-time Generation Status**: Track your image and video generation progress with live Firestore updates
- **Image Gallery**: Browse and download all your generated products
- **One-Click Download**: Easily download generated images for immediate use
- **Responsive Design**: Beautiful UI built with Tailwind CSS and shadcn/ui components

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Image Optimization**: Next.js Image component with ImageKit integration

### Backend & APIs
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Database**: 
  - [Firebase Firestore](https://firebase.google.com/docs/firestore) - User data & generation tracking
  - [Neon PostgreSQL](https://neon.tech) with [Drizzle ORM](https://orm.drizzle.team)
- **AI/ML Services**:
  - [Google Gemini 2.5 Flash](https://ai.google.dev) - Multimodal AI for prompt generation
  - [Clipdrop API](https://clipdrop.co) - Text-to-image generation
  - [OpenAI GPT-4](https://openai.com) - Advanced text processing
- **Image Management**: [ImageKit](https://imagekit.io)
- **Environment**: Node.js with TypeScript

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18.x or higher
- npm or yarn package manager
- API keys for:
  - Google Gemini API
  - Clipdrop API
  - OpenAI API
  - ImageKit account
  - Firebase project
  - Neon PostgreSQL database

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/add-generator.git
cd add-generator
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory:

```env
# Firebase Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MESURMENT_ID=your_measurement_id

# Database (Server-side only)
DATABASE_URL=your_neon_postgresql_connection_string

# API Keys (Server-side only)
GEMINI_KEY=your_google_gemini_api_key
OPENAI_KEY=your_openai_api_key
OPENROUTER_KEY=your_openrouter_api_key
CLIPDROPAPI_KEY=your_clipdrop_api_key
CLIPDROPAPI_USER_ID=your_clipdrop_user_id

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_URL=your_imagekit_private_url
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

### 4. Configure Firebase Firestore Rules
Update your Firestore security rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /ads/{adId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 Project Structure

```
add-generator/
├── app/
│   ├── _components/          # Shared components (Header, Sidebar, Auth)
│   ├── (routes)/             # Dashboard routes
│   ├── api/                  # API routes (image generation, user management)
│   ├── login/                # Authentication page
│   └── layout.tsx            # Root layout
├── components/               # Reusable UI components
├── configs/                  # Configuration files (Firebase, Database)
├── context/                  # React Context (AuthContext)
├── hooks/                    # Custom React hooks
├── lib/                      # Utility libraries (ImageKit, OpenAI)
├── public/                   # Static assets
└── next.config.ts            # Next.js configuration
```

## 🎯 Key Features Breakdown

### 1. **Image Upload & Analysis**
- Upload product images
- Powered by Gemini 2.5 Flash for intelligent analysis

### 2. **Prompt Generation**
- Automatic generation of professional image prompts
- Creation of cinematic video motion prompts

### 3. **Image & Video Generation**
- Generate high-quality product images via Clipdrop
- Create motion-enhanced product videos

### 4. **User Dashboard**
- View generation history
- Track status in real-time
- Download generated assets

## 🔐 Security Features

- Server-side only API keys (never exposed to client)
- Firebase Authentication with Google OAuth
- Firestore security rules for user data protection
- CORS and COOP header configuration for secure popup authentication

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

```bash
vercel
```

### Environment Variables for Production
Ensure all environment variables are set in Vercel dashboard before deployment.

## 📝 API Endpoints

- `POST /api/generate-product-image` - Generate product images
- `POST /api/user` - User management and credit tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Google Gemini API](https://ai.google.dev)
- [Clipdrop](https://clipdrop.co)
- [OpenAI](https://openai.com)
- [Firebase](https://firebase.google.com)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)

## 📧 Support

For support, email codeofkrushna@gmail.com or open an issue on GitHub.

---

**Happy Creating! 🎨✨**