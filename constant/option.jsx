export const PracticeOption = [
    {
        name: 'Quiz',
        image: require('./../assets/images/quiz.png'),
        icon: require('./../assets/images/quiz.png'),
        path: '/quiz'
    },
    {
        name: 'Flashcards',
        image: require('./../assets/images/flashcard.png'),
        icon: require('./../assets/images/flashcard.png'),
        path: '/flashcard'
    },
    {
        name: 'Question & Ans',
        image: require('./../assets/images/q&a.png'),
        icon: require('./../assets/images/q&a.png'),
        path: '/questionAnswer'
    }
];

export const imageAssets = {
    '/banner1.png': require('./../assets/images/banner1.png'),
    '/banner2.png': require('./../assets/images/banner2.png'),
    '/banner3.png': require('./../assets/images/banner3.png'),
    '/banner4.png': require('./../assets/images/banner4.png'),
    '/banner5.png': require('./../assets/images/banner5.png'),

};

export const CourseCategory = ["Tech & Coding", "Business & Finance", "Health & Fitness", "Science & Engineering", "Arts & Creativity", "Languages"]

export const ProfileMenu = [
    {
        name: 'Add Course',
        icon: 'add-outline', //Ionic Icons 
        path: '/addCourse'
    },
    {
        name: 'My Course',
        icon: 'book', //Ionic Icons 
        path: '/Mycourse'
    },
    {
        name: 'Course Progress',
        icon: 'analytics-outline', //Ionic Icons 
        path: '/(tabs)/leaderboard'
    },
    {
        name: 'Pet',
        icon: 'paw-outline', //Ionic Icons change
        path: '/(tabs)/pet'
    },
    
    {
        name: 'Logout',
        icon: 'log-out', //Ionic Icons 
        path: '/login'
    }
]