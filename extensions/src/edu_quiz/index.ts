/**
 * Educational Quiz & Assessment Extension
 * Interactive quiz blocks for learning games and assessments
 * Ported from Ignite ICT Educator AI Assistant
 */

import {
  extension,
  scratch,
  SaveDataHandler,
  copyTo,
  MenuItem,
  Language,
  ExtensionMenuDisplayDetails,
} from "$common";

import {
  GRADES,
  SUBJECTS,
  BLOOMS_TAXONOMY,
  QUESTION_TYPES,
  STUDENT_LEVELS,
  type BloomsLevel,
  type QuestionType,
} from "$common/curriculum";

// Quiz Question Interface
interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string | number;
  bloomsLevel: BloomsLevel;
  points: number;
  explanation?: string;
  subject?: string;
  topic?: string;
}

// Quiz Session Interface
interface QuizSession {
  id: string;
  title: string;
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  answers: (string | number)[];
  startTime: number;
  completed: boolean;
}

// Extension Details
const details: ExtensionMenuDisplayDetails = {
  name: "EduQuiz - Interactive Assessments",
  description: "Create and run interactive quizzes with Bloom's taxonomy support",
  implementationLanguage: Language.English,
  [Language.Español]: {
    name: "EduQuiz - Evaluaciones Interactivas",
    description: "Crea y ejecuta cuestionarios interactivos con soporte de taxonomía de Bloom"
  },
  blockColor: "#4CAF50",
  menuColor: "#2E7D32",
  menuSelectColor: "#1B5E20",
  tags: ["Education", "Assessment", "Quiz"],
};

// Generate unique ID
function generateId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default class EduQuiz extends extension(details, "ui", "customSaveData") {
  // Quiz state
  questions: QuizQuestion[] = [];
  currentSession: QuizSession | null = null;
  lastAnswer: string = "";
  lastResult: boolean = false;

  // Menu options
  gradeOptions: MenuItem<string>[];
  subjectOptions: MenuItem<string>[];
  bloomsOptions: MenuItem<BloomsLevel>[];
  questionTypeOptions: MenuItem<QuestionType>[];
  difficultyOptions: MenuItem<string>[];

  // Save/Load handler
  override saveDataHandler = new SaveDataHandler({
    Extension: EduQuiz,
    onSave: ({ questions, currentSession }) => ({
      questions,
      currentSession
    }),
    onLoad: (target, source) => copyTo({ target, source })
  });

  init() {
    // Initialize menu options
    this.gradeOptions = GRADES.map(g => ({ value: g, text: g }));

    this.subjectOptions = Object.keys(SUBJECTS).map(s => ({
      value: s,
      text: s
    }));

    this.bloomsOptions = Object.keys(BLOOMS_TAXONOMY).map(level => ({
      value: level as BloomsLevel,
      text: `${level} - ${BLOOMS_TAXONOMY[level as BloomsLevel].description}`
    }));

    this.questionTypeOptions = QUESTION_TYPES.map(qt => ({
      value: qt.value,
      text: qt.label
    }));

    this.difficultyOptions = [
      { value: "easy", text: "Easy (Remember/Understand)" },
      { value: "medium", text: "Medium (Apply/Analyze)" },
      { value: "hard", text: "Hard (Evaluate/Create)" },
    ];
  }

  // ==================== QUIZ CREATION BLOCKS ====================

  @(scratch.command`Create new quiz titled ${"string"}`)
  createQuiz(title: string) {
    this.currentSession = {
      id: generateId(),
      title: title || "Untitled Quiz",
      questions: [],
      currentIndex: 0,
      score: 0,
      answers: [],
      startTime: Date.now(),
      completed: false,
    };
    this.questions = [];
  }

  @(scratch.command`Add multiple choice question: ${"string"} with options ${"string"} correct answer ${"number"} points ${"number"}`)
  addMultipleChoice(question: string, optionsStr: string, correctIndex: number, points: number) {
    const options = optionsStr.split(",").map(o => o.trim());
    const newQuestion: QuizQuestion = {
      id: generateId(),
      question,
      type: "multiple-choice",
      options,
      correctAnswer: correctIndex,
      bloomsLevel: "Remember",
      points: points || 1,
    };
    this.questions.push(newQuestion);
    if (this.currentSession) {
      this.currentSession.questions.push(newQuestion);
    }
  }

  @(scratch.command`Add true/false question: ${"string"} answer is ${{ type: "string", options: [{ value: "true", text: "True" }, { value: "false", text: "False" }] }} points ${"number"}`)
  addTrueFalse(question: string, answer: string, points: number) {
    const newQuestion: QuizQuestion = {
      id: generateId(),
      question,
      type: "true-false",
      options: ["True", "False"],
      correctAnswer: answer === "true" ? 0 : 1,
      bloomsLevel: "Remember",
      points: points || 1,
    };
    this.questions.push(newQuestion);
    if (this.currentSession) {
      this.currentSession.questions.push(newQuestion);
    }
  }

  @(scratch.command`Add short answer question: ${"string"} answer ${"string"} points ${"number"}`)
  addShortAnswer(question: string, answer: string, points: number) {
    const newQuestion: QuizQuestion = {
      id: generateId(),
      question,
      type: "short-answer",
      correctAnswer: answer.toLowerCase().trim(),
      bloomsLevel: "Understand",
      points: points || 1,
    };
    this.questions.push(newQuestion);
    if (this.currentSession) {
      this.currentSession.questions.push(newQuestion);
    }
  }

  @(scratch.command`Set Bloom's level for last question to ${{ type: "string", options: [
    { value: "Remember", text: "Remember" },
    { value: "Understand", text: "Understand" },
    { value: "Apply", text: "Apply" },
    { value: "Analyze", text: "Analyze" },
    { value: "Evaluate", text: "Evaluate" },
    { value: "Create", text: "Create" },
  ] }}`)
  setBloomsLevel(level: BloomsLevel) {
    if (this.questions.length > 0) {
      this.questions[this.questions.length - 1].bloomsLevel = level;
    }
  }

  @(scratch.command`Add explanation to last question: ${"string"}`)
  addExplanation(explanation: string) {
    if (this.questions.length > 0) {
      this.questions[this.questions.length - 1].explanation = explanation;
    }
  }

  // ==================== QUIZ RUNNING BLOCKS ====================

  @(scratch.command`Start quiz`)
  startQuiz() {
    if (this.currentSession) {
      this.currentSession.currentIndex = 0;
      this.currentSession.score = 0;
      this.currentSession.answers = [];
      this.currentSession.startTime = Date.now();
      this.currentSession.completed = false;
    }
  }

  @(scratch.reporter`Current question text`)
  getCurrentQuestion(): string {
    if (!this.currentSession || this.currentSession.completed) return "";
    const idx = this.currentSession.currentIndex;
    if (idx >= this.currentSession.questions.length) return "";
    return this.currentSession.questions[idx].question;
  }

  @(scratch.reporter`Current question options`)
  getCurrentOptions(): string {
    if (!this.currentSession || this.currentSession.completed) return "";
    const idx = this.currentSession.currentIndex;
    if (idx >= this.currentSession.questions.length) return "";
    const q = this.currentSession.questions[idx];
    if (q.options) {
      return q.options.map((opt, i) => `${i + 1}. ${opt}`).join("\n");
    }
    return "";
  }

  @(scratch.reporter`Current question type`)
  getCurrentType(): string {
    if (!this.currentSession) return "";
    const idx = this.currentSession.currentIndex;
    if (idx >= this.currentSession.questions.length) return "";
    return this.currentSession.questions[idx].type;
  }

  @(scratch.reporter`Current question number`)
  getCurrentIndex(): number {
    if (!this.currentSession) return 0;
    return this.currentSession.currentIndex + 1;
  }

  @(scratch.reporter`Total questions`)
  getTotalQuestions(): number {
    if (!this.currentSession) return 0;
    return this.currentSession.questions.length;
  }

  @(scratch.command`Submit answer ${"string"}`)
  submitAnswer(answer: string) {
    if (!this.currentSession || this.currentSession.completed) return;

    const idx = this.currentSession.currentIndex;
    if (idx >= this.currentSession.questions.length) return;

    const question = this.currentSession.questions[idx];
    this.lastAnswer = answer;

    // Check answer
    let isCorrect = false;
    if (question.type === "multiple-choice" || question.type === "true-false") {
      const answerIndex = parseInt(answer) - 1;
      isCorrect = answerIndex === question.correctAnswer;
    } else if (question.type === "short-answer") {
      isCorrect = answer.toLowerCase().trim() === question.correctAnswer;
    }

    this.lastResult = isCorrect;
    this.currentSession.answers.push(answer);

    if (isCorrect) {
      this.currentSession.score += question.points;
    }
  }

  @(scratch.reporter`Was last answer correct?`)
  wasCorrect(): boolean {
    return this.lastResult;
  }

  @(scratch.reporter`Correct answer for current question`)
  getCorrectAnswer(): string {
    if (!this.currentSession) return "";
    const idx = this.currentSession.currentIndex;
    if (idx >= this.currentSession.questions.length) return "";
    const q = this.currentSession.questions[idx];

    if (q.type === "multiple-choice" || q.type === "true-false") {
      const correctIdx = q.correctAnswer as number;
      return q.options ? q.options[correctIdx] : String(correctIdx + 1);
    }
    return String(q.correctAnswer);
  }

  @(scratch.reporter`Explanation for current question`)
  getExplanation(): string {
    if (!this.currentSession) return "";
    const idx = this.currentSession.currentIndex;
    if (idx >= this.currentSession.questions.length) return "";
    return this.currentSession.questions[idx].explanation || "";
  }

  @(scratch.command`Go to next question`)
  nextQuestion() {
    if (!this.currentSession) return;
    if (this.currentSession.currentIndex < this.currentSession.questions.length - 1) {
      this.currentSession.currentIndex++;
    } else {
      this.currentSession.completed = true;
    }
  }

  @(scratch.reporter`Quiz completed?`)
  isQuizCompleted(): boolean {
    return this.currentSession?.completed ?? false;
  }

  // ==================== SCORING BLOCKS ====================

  @(scratch.reporter`Current score`)
  getScore(): number {
    return this.currentSession?.score ?? 0;
  }

  @(scratch.reporter`Maximum possible score`)
  getMaxScore(): number {
    if (!this.currentSession) return 0;
    return this.currentSession.questions.reduce((sum, q) => sum + q.points, 0);
  }

  @(scratch.reporter`Score percentage`)
  getScorePercentage(): number {
    const max = this.getMaxScore();
    if (max === 0) return 0;
    return Math.round((this.getScore() / max) * 100);
  }

  @(scratch.reporter`Quiz grade`)
  getGrade(): string {
    const pct = this.getScorePercentage();
    if (pct >= 90) return "A";
    if (pct >= 80) return "B";
    if (pct >= 70) return "C";
    if (pct >= 60) return "D";
    return "F";
  }

  @(scratch.reporter`Questions correct`)
  getCorrectCount(): number {
    if (!this.currentSession) return 0;
    let correct = 0;
    this.currentSession.questions.forEach((q, i) => {
      const answer = this.currentSession!.answers[i];
      if (q.type === "multiple-choice" || q.type === "true-false") {
        if (parseInt(String(answer)) - 1 === q.correctAnswer) correct++;
      } else if (q.type === "short-answer") {
        if (String(answer).toLowerCase().trim() === q.correctAnswer) correct++;
      }
    });
    return correct;
  }

  @(scratch.reporter`Time elapsed in seconds`)
  getTimeElapsed(): number {
    if (!this.currentSession) return 0;
    return Math.floor((Date.now() - this.currentSession.startTime) / 1000);
  }

  // ==================== BLOOM'S TAXONOMY BLOCKS ====================

  @(scratch.reporter`Bloom's level for current question`)
  getCurrentBloomsLevel(): string {
    if (!this.currentSession) return "";
    const idx = this.currentSession.currentIndex;
    if (idx >= this.currentSession.questions.length) return "";
    return this.currentSession.questions[idx].bloomsLevel;
  }

  @(scratch.reporter`Description for Bloom's level ${{ type: "string", options: [
    { value: "Remember", text: "Remember" },
    { value: "Understand", text: "Understand" },
    { value: "Apply", text: "Apply" },
    { value: "Analyze", text: "Analyze" },
    { value: "Evaluate", text: "Evaluate" },
    { value: "Create", text: "Create" },
  ] }}`)
  getBloomsDescription(level: BloomsLevel): string {
    return BLOOMS_TAXONOMY[level]?.description || "";
  }

  @(scratch.reporter`Action verbs for Bloom's level ${{ type: "string", options: [
    { value: "Remember", text: "Remember" },
    { value: "Understand", text: "Understand" },
    { value: "Apply", text: "Apply" },
    { value: "Analyze", text: "Analyze" },
    { value: "Evaluate", text: "Evaluate" },
    { value: "Create", text: "Create" },
  ] }}`)
  getBloomsVerbs(level: BloomsLevel): string {
    return BLOOMS_TAXONOMY[level]?.verbs.join(", ") || "";
  }

  // ==================== FEEDBACK BLOCKS ====================

  @(scratch.reporter`Feedback message for score`)
  getFeedbackMessage(): string {
    const pct = this.getScorePercentage();
    if (pct >= 90) return "Excellent work! You've mastered this material!";
    if (pct >= 80) return "Great job! You have a strong understanding.";
    if (pct >= 70) return "Good effort! Review the topics you missed.";
    if (pct >= 60) return "Keep practicing! You're getting there.";
    return "Don't give up! Review the material and try again.";
  }

  @(scratch.reporter`Quiz summary`)
  getQuizSummary(): string {
    if (!this.currentSession) return "";
    const correct = this.getCorrectCount();
    const total = this.currentSession.questions.length;
    const pct = this.getScorePercentage();
    const time = this.getTimeElapsed();
    const mins = Math.floor(time / 60);
    const secs = time % 60;

    return `Quiz: ${this.currentSession.title}\n` +
           `Score: ${this.getScore()}/${this.getMaxScore()} (${pct}%)\n` +
           `Questions: ${correct}/${total} correct\n` +
           `Grade: ${this.getGrade()}\n` +
           `Time: ${mins}m ${secs}s`;
  }

  // ==================== UI BUTTONS ====================

  @(scratch.button`Open Quiz Manager`)
  openQuizManager() {
    this.openUI("QuizManager", "Manage your quizzes");
  }

  @(scratch.button`View Results`)
  viewResults() {
    this.openUI("Results", "Quiz Results");
  }
}
