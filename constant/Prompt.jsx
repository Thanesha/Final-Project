import dedent from "dedent";

export default {
  IDEA: dedent`:As your are coaching teacher
    - User want to learn about the topic
    - Generate 5-7 Course title for study (Short)
    - Make sure it is related to description
    - Output will be ARRAY of String in JSON FORMAT only
    - Do not add any plain text in output,
    `,
  
COURSE: dedent`: As you are coaching teacher
    - User wants to learn about all topics.
    - Create 2 Courses with Course Name, Description, and 5-8 Chapters in each course.
    - Ensure to add a minimum of 5 and a maximum of 8 chapters.
    - List content in each chapter along with a description in 5 to 8 lines.
    - Do not just explain what the chapter is about; explain in detail with examples.
    - Create Easy, Moderate, and Advanced courses depending on topics.
    - Add a Course Banner Image from ('/banner1.png','/banner2.png','/banner3.png','/banner4.png','/banner5.png','/banner6.png'), selecting it randomly.
    - Explain the chapter content as a detailed tutorial with a list of content.
    - Generate 10 Quiz questions, 10 Flashcards, and 10 Q&A pairs.
    - Implement a random distribution of points across the chapters for each course to make it a total of between 50 to 100 points and to help the user to track their progress.
    - Tag each course to one of the categories from: ["Tech & Coding", "Business & Finance", "Health & Fitness", "Science & Engineering", "Arts & Creativity", "Languages"].
    - Output in JSON format only:
    {
      "courses": [
        {
          "courseTitle": "<Intro to Python>",
          "description": "",
          "banner_image": "/banner1.png",
          "category": "",
          "chapters": [
            {
              "chapterName": "",
              "points": <random_points_value>, // Randomly assigned between 50 to 100
              "content": [
                {
                  "topic": "<Topic Name in 2 to 4 words>",
                  "explain": "<Detailed explanation in 5 to 8 lines if required>",
                  "code": "<Code example if required, else null>",
                  "example": "<Example if required, else null>"
                }
              ]
            }
          ],
          "quiz": [
            {
              "question": "",
              "options": ["a", "b", "c", "d"],
              "correctAns": ""
            }
          ],
          "flashcards": [
            {
              "front": "",
              "back": ""
            }
          ],
          "qa": [
            {
              "question": "",
              "answer": ""
            }
          ]
        }
      ]
    }
`
}



