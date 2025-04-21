# Mind-Craft Learning Platform

Mind-Craft is a gamified learning platform designed for any student to master AI and computer science concepts. The platform makes learning interactive, fun, and rewarding through various features like quizzes, flashcards, and a virtual pet system.

## Features

- **Interactive Learning**: Engage with various course materials through different learning methods
- **Virtual Pet System**: Take care of a virtual pet that grows with your learning progress
- **Points & Rewards**: Earn points and cash by completing courses and chapters
- **Progress Tracking**: Monitor your learning progress with detailed statistics
- **Leaderboard System**: Compete with other learners and track your ranking
- **Flashcards**: Practice concepts using interactive flashcards
- **Quiz System**: Test your knowledge through comprehensive quizzes

## Project Structure
- /app - Main application screens and navigation
- /assets - Static assets (images, fonts, animations)
- /components - Reusable React components
- /config - Configuration files (Firebase, AI models)
- /constant - Constants and options
- /context - React Context providers
  
## Technologies Used
- React Native
- Expo
- Firebase (Authentication, Firestore)
- React Navigation
- Expo Router
- React Native Progress
- Lottie Animations

## Features in Detail

### Course System
- Create and manage courses
- Track course progress
- Interactive chapters with points system

### Virtual Pet
- Feed and interact with your pet
- Pet grows based on learning progress
- Earn rewards through pet care

### Points and Rewards
- Earn points by completing chapters
- Convert points to in-app currency
- Use currency for pet care and customisation

### User Profile
- Track personal progress
- View achievements and statistics
- Customise profile picture


## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Expo Go app installed on your mobile device or Android Studio on your computer

## Installation
### Core Dependencies
```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install expo-router expo-constants expo-linking expo-splash-screen expo-status-bar expo
npm install firebase @google/generative-ai
npm install react-native-progress lottie-react-native
npm install react-native-safe-area-context
npm install react-native-screens
npm install expo-image-picker
npm install expo-font
```
### Step 1: Project Setup
1. Clone the repository:
```bash
git clone [https://github.com/Thanesha/Final-Project]
cd Mind-Craft
npm install
 ```

### Step 2: Running on your mobile device:
   1. Start the development server:
```bash
npx expo start
```
  - Install Expo Go from your device's app store:
    - Android Play Store
  - Open Expo Go on your device
  - Scan the QR code shown in your terminal
  - The app will load on your device
3. Alternative methods:
   
   - Press 'a' in the terminal to open on Android emulator
   - Press 'w' in the terminal to open in web browser
