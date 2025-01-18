## Apex Mindset App

Test of my skills. (my skills are good)

This is used to learn React Native, no previous React Native experience.

### Approach to the Assignment

I approached this project by focusing on building a functional and user-friendly application using React Native. Starting with setting up the development environment, I implemented key features such as viewing, editing, and organizing notes. I employed an iterative development process, consistently testing and refining features to enhance the user experience.

Overall I took a one thing a time approach as developed more and more skill with react native, ie basic ui > core functionality > Cleaning up edge cases and errors > Clean UI > animate.
For the most part this was a learning experince overall dev time well under 10 hours. Going from 0 react native or mobile app dev experince to a functioning app.

### Tools and Libraries Used

- **React Native**: For building the cross-platform mobile application.
- **React Navigation**: To handle navigation between different screens.
- **Redux**: For state management across the app.
- **AsyncStorage**: For persistent storage of user data.
- **Axios**: For handling API requests if needed in future enhancements.

### Project Structure

my-new-app/
├── src/
│ ├── components/

│ │ ├── AudioPlayerModal.js

│ │ ├── LessonCard.js
│ │ └── SwipeableLessonCard.js
│ ├── screens/
│ │ ├── EditNoteScreen.js
│ │ ├── LandingScreen.js
│ │ ├── TodayScreen.js
│ │ └── ViewNoteScreen.js
│ ├── constants/
│ │ ├── audioFiles.js
│ ├── App.js
│ └── index.js
│ └── Other Misc files
├── README.md
└── package.json

(might be off but basic idea)

### Next steps

Overall my next approach with this app would be first of all to get some user feedback to see what areas are most in need of some love. In my mind something that i was working on was a swipe featuie where the user could swipe the lesson cards and have it animate with some haptic feedback as completed. I ran into some issues with this and since i didnt have a lot of time in the 48 hours to actually work on things, i opted for simler checkboxes to functions as a MVP. You can see the attempted implementation in SwipeableLessonCard. Other than this I think a feature to have the user be able to pull up a actual caladar and plan their days, meetings, daily tasks and other things could be of great value. Also adding the functionality of the backend to store all of the audios and tasks on a day by day basis. As always I would also touch up any UI to keep things looking as good as possible.

Link to demo vid.
https://drive.google.com/drive/folders/1DA0gNwVqlmcvUbZen7Lo2joTQYZFLUFD?usp=drive_link 
