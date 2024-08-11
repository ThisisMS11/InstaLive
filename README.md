# InstaLive

## 1. Project Overview

**Project Name**: InstaLive

**Purpose**: InstaLive is designed to offer a seamless and fast platform for users to stream live to their YouTube channels with minimal setup. It is tailored for individuals who want to start streaming with just a few clicks.

**Target Audience**: Anyone who wishes to stream live to their YouTube channel.

## 2. Architecture

**Technology Stack**:
- **Frontend**: Next.js 14
- **Backend**: Node.js (handling WebSockets)
- **Database**: PostgreSQL (managed with Prisma)
- **APIs**: YouTube Livestreaming and Data API, FFmpeg
- **Cloud Services**: Cloudinary for overlay image uploads

**System Design**: 
InstaLive interacts with the YouTube API to manage live broadcasts, streams, and live chat. The platform utilizes WebSockets for real-time communication and data streaming, with FFmpeg handling video processing. PostgreSQL is used for data storage, with Prisma as the ORM.

**Data Flow**:
To be added.

## 3. Features

- **Live Streaming**: Stream directly to your YouTube channel.
- **Custom Overlays**: Add personalized overlays to your stream without extra cost.
- **Live Chat Integration**: Engage with your audience in real-time using the integrated live chat feature.
- **Spam Detection**: Utilize a machine learning model to block spam users in live chat automatically.

**Unique Selling Points**:
Unlike other platforms like StreamYard that charge for customizable overlays, InstaLive offers this feature for free, making it a cost-effective solution for streamers.

## 4. Setup Instructions

**Installation Steps**:
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install all dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see below).
4. Navigate to the server directory:
   ```bash
   cd server
   ```
5. Install server dependencies:
   ```bash
   npm install
   ```

**Env Configuration**:
For Next.js server, add the following environment variables in a `.env` file:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_FFMPEG_SERVER=
GOOGLE_REDIRECT_URI=
NEXT_PUBLIC_URL=
DATABASE_URL=
NEXTAUTH_SECRET=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=
```

**Dependencies**:
- YouTube Data API v3
- People API

## 5. API Documentation

To be added later.

## 6. User Guide

To be added later.

## 7. Deployment

**Deployment Strategy**:
- **Next.js Server**: Deployed on Vercel
- **WebSocket Server**: Deployed on Render

**CI/CD**:
InstaLive uses GitHub Actions for continuous integration and deployment. Below is an example of the CI/CD workflow:

```yaml
name: CI/CD for InstaLive

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '21.x'

      - name: Install dependencies
        run: npm install --force

      - name: Generate Prisma client
        run: npx prisma generate

      - name: Run linting
        run: npm run lint
```

## 8. Contributing

To be added later.

## 9. FAQs & Troubleshooting

To be added later.

## 10. License

To be added later.
