import { createTestSuite } from "$testing";
import Extension from '.';

createTestSuite({ Extension, __dirname }, {
  unitTests: {
    createQuiz: {
      input: "Math Quiz",
      after: ({ extension, testHelper: { expect } }) => {
        expect(extension.currentSession).not.toBeNull();
        expect(extension.currentSession!.title).toBe("Math Quiz");
        expect(extension.currentSession!.questions).toHaveLength(0);
        expect(extension.currentSession!.score).toBe(0);
        expect(extension.currentSession!.completed).toBe(false);
      }
    },
    addMultipleChoice: {
      before: ({ extension }) => {
        extension.createQuiz("Test Quiz");
      },
      input: ["What is 2+2?", "3,4,5,6", 2, 5],
      after: ({ extension, testHelper: { expect } }) => {
        expect(extension.questions).toHaveLength(1);
        expect(extension.questions[0].question).toBe("What is 2+2?");
        expect(extension.questions[0].options).toEqual(["3", "4", "5", "6"]);
        expect(extension.questions[0].correctAnswer).toBe(2);
        expect(extension.questions[0].points).toBe(5);
        expect(extension.questions[0].type).toBe("multiple-choice");
        expect(extension.currentSession!.questions).toHaveLength(1);
      }
    },
    addTrueFalse: {
      before: ({ extension }) => {
        extension.createQuiz("Test Quiz");
      },
      input: ["The sky is blue", "true", 3],
      after: ({ extension, testHelper: { expect } }) => {
        expect(extension.questions).toHaveLength(1);
        expect(extension.questions[0].type).toBe("true-false");
        expect(extension.questions[0].correctAnswer).toBe(0);
        expect(extension.questions[0].points).toBe(3);
      }
    },
    addShortAnswer: {
      before: ({ extension }) => {
        extension.createQuiz("Test Quiz");
      },
      input: ["Capital of France?", "Paris", 2],
      after: ({ extension, testHelper: { expect } }) => {
        expect(extension.questions).toHaveLength(1);
        expect(extension.questions[0].type).toBe("short-answer");
        expect(extension.questions[0].correctAnswer).toBe("paris");
        expect(extension.questions[0].bloomsLevel).toBe("Understand");
      }
    },
    setBloomsLevel: {
      before: ({ extension }) => {
        extension.createQuiz("Test Quiz");
        extension.addMultipleChoice("Q1?", "A,B,C", 1, 1);
      },
      input: "Analyze",
      after: ({ extension, testHelper: { expect } }) => {
        expect(extension.questions[0].bloomsLevel).toBe("Analyze");
      }
    },
    addExplanation: {
      before: ({ extension }) => {
        extension.createQuiz("Test Quiz");
        extension.addMultipleChoice("Q1?", "A,B,C", 1, 1);
      },
      input: "Because B is the right answer",
      after: ({ extension, testHelper: { expect } }) => {
        expect(extension.questions[0].explanation).toBe("Because B is the right answer");
      }
    },
    startQuiz: {
      before: ({ extension }) => {
        extension.createQuiz("Test Quiz");
        extension.addMultipleChoice("Q1?", "A,B,C", 2, 5);
        extension.currentSession!.score = 10;
      },
      after: ({ extension, testHelper: { expect } }) => {
        expect(extension.currentSession!.currentIndex).toBe(0);
        expect(extension.currentSession!.score).toBe(0);
        expect(extension.currentSession!.answers).toHaveLength(0);
        expect(extension.currentSession!.completed).toBe(false);
      }
    },
    getCurrentQuestion: [
      {
        name: "returns question text when quiz active",
        before: ({ extension }) => {
          extension.createQuiz("Test Quiz");
          extension.addMultipleChoice("What is 1+1?", "1,2,3", 2, 1);
          extension.startQuiz();
        },
        expected: "What is 1+1?"
      },
      {
        name: "returns empty string when no session",
        expected: ""
      }
    ],
    getCurrentOptions: {
      before: ({ extension }) => {
        extension.createQuiz("Test Quiz");
        extension.addMultipleChoice("Q?", "Apple,Banana,Cherry", 1, 1);
        extension.startQuiz();
      },
      expected: "1. Apple\n2. Banana\n3. Cherry"
    },
    getCurrentType: {
      before: ({ extension }) => {
        extension.createQuiz("Test Quiz");
        extension.addTrueFalse("True or false?", "true", 1);
        extension.startQuiz();
      },
      expected: "true-false"
    },
    getCurrentIndex: {
      before: ({ extension }) => {
        extension.createQuiz("Test Quiz");
        extension.addMultipleChoice("Q1?", "A,B", 1, 1);
        extension.startQuiz();
      },
      expected: 1
    },
    getTotalQuestions: {
      before: ({ extension }) => {
        extension.createQuiz("Test Quiz");
        extension.addMultipleChoice("Q1?", "A,B", 1, 1);
        extension.addTrueFalse("Q2?", "true", 1);
        extension.startQuiz();
      },
      expected: 2
    },
    submitAnswer: [
      {
        name: "correct multiple choice answer",
        before: ({ extension }) => {
          extension.createQuiz("Test Quiz");
          extension.addMultipleChoice("Q?", "A,B,C", 2, 10);
          extension.startQuiz();
        },
        input: "2",
        after: ({ extension, testHelper: { expect } }) => {
          expect(extension.lastResult).toBe(true);
          expect(extension.currentSession!.score).toBe(10);
        }
      },
      {
        name: "incorrect multiple choice answer",
        before: ({ extension }) => {
          extension.createQuiz("Test Quiz");
          extension.addMultipleChoice("Q?", "A,B,C", 2, 10);
          extension.startQuiz();
        },
        input: "1",
        after: ({ extension, testHelper: { expect } }) => {
          expect(extension.lastResult).toBe(false);
          expect(extension.currentSession!.score).toBe(0);
        }
      },
      {
        name: "correct short answer (case-insensitive)",
        before: ({ extension }) => {
          extension.createQuiz("Test Quiz");
          extension.addShortAnswer("Capital of France?", "Paris", 5);
          extension.startQuiz();
        },
        input: "PARIS",
        after: ({ extension, testHelper: { expect } }) => {
          expect(extension.lastResult).toBe(true);
          expect(extension.currentSession!.score).toBe(5);
        }
      }
    ],
    wasCorrect: {
      before: ({ extension }) => {
        extension.createQuiz("Test Quiz");
        extension.addMultipleChoice("Q?", "A,B", 1, 1);
        extension.startQuiz();
        extension.submitAnswer("1");
      },
      expected: true
    },
    nextQuestion: {
      before: ({ extension }) => {
        extension.createQuiz("Test Quiz");
        extension.addMultipleChoice("Q1?", "A,B", 1, 1);
        extension.addMultipleChoice("Q2?", "C,D", 2, 1);
        extension.startQuiz();
      },
      after: ({ extension, testHelper: { expect } }) => {
        expect(extension.currentSession!.currentIndex).toBe(1);
        expect(extension.currentSession!.completed).toBe(false);
      }
    },
    isQuizCompleted: [
      {
        name: "false when quiz still has questions",
        before: ({ extension }) => {
          extension.createQuiz("Test Quiz");
          extension.addMultipleChoice("Q?", "A,B", 1, 1);
          extension.startQuiz();
        },
        expected: false
      },
      {
        name: "true after completing all questions",
        before: ({ extension }) => {
          extension.createQuiz("Test Quiz");
          extension.addMultipleChoice("Q?", "A,B", 1, 1);
          extension.startQuiz();
          extension.nextQuestion();
        },
        expected: true
      }
    ],
    getScore: {
      before: ({ extension }) => {
        extension.createQuiz("Test Quiz");
        extension.addMultipleChoice("Q?", "A,B,C", 2, 10);
        extension.startQuiz();
        extension.submitAnswer("2");
      },
      expected: 10
    },
    getMaxScore: {
      before: ({ extension }) => {
        extension.createQuiz("Test Quiz");
        extension.addMultipleChoice("Q1?", "A,B", 1, 5);
        extension.addMultipleChoice("Q2?", "C,D", 2, 10);
        extension.startQuiz();
      },
      expected: 15
    },
    getScorePercentage: {
      before: ({ extension }) => {
        extension.createQuiz("Test Quiz");
        extension.addMultipleChoice("Q1?", "A,B", 1, 5);
        extension.addMultipleChoice("Q2?", "C,D", 2, 5);
        extension.startQuiz();
        extension.submitAnswer("1");
      },
      expected: 50
    },
    getGrade: [
      {
        name: "A grade for 90%+",
        before: ({ extension }) => {
          extension.createQuiz("Test");
          extension.addMultipleChoice("Q?", "A,B", 1, 10);
          extension.startQuiz();
          extension.submitAnswer("1");
        },
        expected: "A"
      },
      {
        name: "F grade for 0%",
        before: ({ extension }) => {
          extension.createQuiz("Test");
          extension.addMultipleChoice("Q?", "A,B", 2, 10);
          extension.startQuiz();
          extension.submitAnswer("1");
        },
        expected: "F"
      }
    ],
    getCorrectCount: {
      before: ({ extension }) => {
        extension.createQuiz("Test Quiz");
        extension.addMultipleChoice("Q1?", "A,B", 1, 1);
        extension.addMultipleChoice("Q2?", "C,D", 2, 1);
        extension.startQuiz();
        extension.submitAnswer("1");
        extension.nextQuestion();
        extension.submitAnswer("1");
      },
      expected: 1
    },
    getCurrentBloomsLevel: {
      before: ({ extension }) => {
        extension.createQuiz("Test Quiz");
        extension.addMultipleChoice("Q?", "A,B", 1, 1);
        extension.setBloomsLevel("Evaluate");
        extension.startQuiz();
      },
      expected: "Evaluate"
    },
  },
  integrationTests: {
    fullQuizLifecycle: async ({ extension, testHelper: { expect } }) => {
      // Full quiz lifecycle test
      extension.createQuiz("Integration Test Quiz");

      extension.addMultipleChoice("What is 2+2?", "3,4,5", 2, 10);
      extension.setBloomsLevel("Remember");
      extension.addExplanation("2+2 equals 4");

      extension.addTrueFalse("Water boils at 100C", "true", 5);
      extension.setBloomsLevel("Understand");

      extension.addShortAnswer("Capital of Japan?", "Tokyo", 5);
      extension.setBloomsLevel("Remember");

      expect(extension.questions).toHaveLength(3);
      expect(extension.getTotalQuestions()).toBe(3);

      extension.startQuiz();

      // Q1: correct answer
      expect(extension.getCurrentQuestion()).toBe("What is 2+2?");
      expect(extension.getCurrentType()).toBe("multiple-choice");
      expect(extension.getCurrentBloomsLevel()).toBe("Remember");
      extension.submitAnswer("2");
      expect(extension.wasCorrect()).toBe(true);
      expect(extension.getScore()).toBe(10);
      extension.nextQuestion();

      // Q2: correct answer
      expect(extension.getCurrentQuestion()).toBe("Water boils at 100C");
      extension.submitAnswer("1");
      expect(extension.wasCorrect()).toBe(true);
      expect(extension.getScore()).toBe(15);
      extension.nextQuestion();

      // Q3: wrong answer
      expect(extension.getCurrentQuestion()).toBe("Capital of Japan?");
      extension.submitAnswer("Osaka");
      expect(extension.wasCorrect()).toBe(false);
      expect(extension.getScore()).toBe(15);
      extension.nextQuestion();

      // Quiz complete
      expect(extension.isQuizCompleted()).toBe(true);
      expect(extension.getMaxScore()).toBe(20);
      expect(extension.getScorePercentage()).toBe(75);
      expect(extension.getGrade()).toBe("C");
      expect(extension.getCorrectCount()).toBe(2);
    }
  }
});
