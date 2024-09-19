# Rooms
A real-time chat application built using MERN stack, enabling user-to-user and user-to-group messaging with text, images, and file sharing capabilities.

<img src="./Rooms.gif" />

## Features
- Real-time messaging for individuals and groups
- Support for text, image, and file sharing
- Built using MERN stack (MongoDB, Express.js, React.js, Node.js)
- Utilizes Material UI for a seamless user interface
## Project Structure
The project consists of two main folders:
- client: Contains the React.js frontend code, built with Material UI components
- server: Houses the Node.js and Express.js backend code, with MongoDB integration
## Setup and Installation
- Clone the repository: git clone https://github.com/Ishan2608/Rooms.git
- Navigate to the project directory: cd rooms
- Install dependencies:
  - cd client && npm install
  - cd server && npm install
- Create the .env files in both the directories.
- Keys of client env files (in case you are using Firebase)
  - REACT_APP_FIREBASE_API_KEY
  - REACT_APP_FIREBASE_AUTHDOMAIN
  - REACT_APP_FIREBASE_PROJECT_ID
  - REACT_APP_FIREBASE_STORAGE_BUCKET
  - REACT_APP_FIREBASE_MESSAGE_SENDER_ID
  - REACT_APP_FIREBASE_APP_ID
  - REACT_APP_FIREBASE_MEASUREMENT_ID
- Keys of server env files:
  - PORT=8747
  - JWT_KEY="your_secret_key"
  - ORIGIN="http://localhost:5173"
  - MONGODB_ATLAS_PASSWORD="your password"
  - MONGODB_CONNECTION_STRING="your MongoDB Atlas connection string"
- Start the server: cd server && npm run dev
- Start the client: cd client && npm run dev
- Make sure the substitute the "npm run dev" with node start in package.json in production.
## Usage
- Register or login to access the chat interface
- Create or join groups for group messaging
- Send text, image, or file messages to individuals or groups
## Contributing
Contributions are welcome! Please fork the repository, make changes, and submit a pull request.
License.
I have a few tasks for you:
- Change theme from boring to an Elegant Design.
- Improve Profile Page Design.
- In the group info box, clicking on a member should allow you to start messaging him.
This project is licensed under the MIT License. See LICENSE for details.
Acknowledgments
Special thanks to the Material UI team for their excellent component library
Note: Replace https://github.com/Ishan2608/Rooms.git with your actual GitHub repository URL.
