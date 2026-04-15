/**
 * Curriculum Data Module
 * Comprehensive educational standards, subjects, and frameworks
 * Ported from Ignite ICT Educator AI Assistant
 */

// Grade Levels
export const GRADES = [
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "Higher Education / University",
] as const;

export type GradeLevel = typeof GRADES[number];

// Supported Curricula (14 international frameworks)
export const CURRICULUMS = [
  "UK National Curriculum (England)",
  "US State-based (Common Core/State)",
  "CBSE / ICSE (India)",
  "Australian Curriculum",
  "Singapore MOE Curriculum",
  "UAE MOE Curriculum",
  "Cambridge (CAIE - IGCSE/A-Levels)",
  "IB (PYP, MYP, DP)",
  "American Curriculum (International)",
  "Montessori",
  "Reggio Emilia",
  "Waldorf / Steiner",
  "STEAM-based frameworks",
  "Competency-Based Education (CBE)",
] as const;

export type Curriculum = typeof CURRICULUMS[number];

// Subjects with Sub-topics
export const SUBJECTS: Record<string, string[]> = {
  Mathematics: [
    "Number & Operations",
    "Algebra",
    "Geometry",
    "Measurement",
    "Data Handling",
    "Mathematical Reasoning",
  ],
  Science: [
    "Life Science",
    "Physical Science",
    "Earth & Space Science",
    "Scientific Inquiry",
  ],
  "Computer Science / ICT": [
    "Computational Thinking",
    "Programming",
    "Data & AI Basics",
    "Cyber Safety & Ethics",
    "Digital Productivity",
  ],
  "Language Arts": [
    "Reading",
    "Writing",
    "Speaking & Listening",
    "Grammar & Vocabulary",
    "Media Literacy",
  ],
  "Social Studies / Humanities": [
    "History",
    "Geography",
    "Civics",
    "Economics",
    "Global Studies",
  ],
  "STEAM / Design & Innovation": [
    "Design Thinking",
    "Engineering Process",
    "Prototyping",
    "Problem Solving",
    "Interdisciplinary Projects",
  ],
  Arts: ["Visual Arts", "Music", "Drama", "Media Arts"],
  "Physical Education": [
    "Physical Literacy",
    "Health Education",
    "Mental Wellbeing",
  ],
  "Moral / Religious Education": [
    "Islamic Studies",
    "Character Education",
    "Ethics",
    "Values",
  ],
  Other: ["General Standards", "Local Board Standards"],
};

export type Subject = keyof typeof SUBJECTS;

// Standards Frameworks by Subject
export const FRAMEWORKS: Record<string, string[]> = {
  Mathematics: [
    "CCSS-M (Common Core)",
    "UK National Curriculum - Maths",
    "Cambridge Mathematics Framework",
    "IB Mathematics (PYP/MYP/DP)",
    "Singapore Mathematics Framework",
    "NCTM Standards",
  ],
  Science: [
    "NGSS (Next Gen Science Standards)",
    "UK National Curriculum - Science",
    "Cambridge Science Framework",
    "IB Sciences",
    "Australian Science Curriculum",
  ],
  "Computer Science / ICT": [
    "CSTA Standards",
    "UK Computing Curriculum",
    "Cambridge ICT / Computer Science",
    "IB CS / Design Technology",
    "ISTE Standards",
    "UNESCO ICT Competency",
  ],
  "Language Arts": [
    "Common Core ELA",
    "UK National Curriculum - English",
    "Cambridge English Framework",
    "IB Language & Literature",
    "CEFR Framework",
  ],
  "Social Studies / Humanities": [
    "NCSS Framework",
    "UK History & Geography",
    "Cambridge Global Perspectives",
    "IB Individuals & Societies",
    "UNESCO Global Citizenship (GCED)",
  ],
  "STEAM / Design & Innovation": [
    "NGSS Engineering Design",
    "UK Design & Technology",
    "IB Design",
    "Engineering is Elementary (EiE)",
    "UNESCO STEM Framework",
  ],
  Arts: [
    "National Core Arts Standards (US)",
    "UK Arts Curriculum",
    "IB Arts",
    "Cambridge Creative Subjects",
  ],
  "Physical Education": [
    "SHAPE America Standards",
    "UK PE Curriculum",
    "IB Physical & Health Education",
    "WHO School Health Framework",
  ],
  "Moral / Religious Education": [
    "Islamic Studies (MOE)",
    "UAE Moral Education",
    "Character Education Framework",
    "UNESCO Values Education",
  ],
  Other: ["General Standards", "Local Board Standards"],
};

// Student Proficiency Levels
export const STUDENT_LEVELS = [
  "Beginner / Introduction",
  "Intermediate / Developing",
  "Advanced / Mastery",
  "Remedial / Intensive Support",
  "Special Needs (SEN)",
] as const;

export type StudentLevel = typeof STUDENT_LEVELS[number];

// Bloom's Taxonomy Levels (for assessments)
export const BLOOMS_TAXONOMY = {
  Remember: {
    label: "Remember",
    description: "Recall facts and basic concepts",
    verbs: ["define", "list", "name", "recall", "identify", "match"],
  },
  Understand: {
    label: "Understand",
    description: "Explain ideas or concepts",
    verbs: ["explain", "describe", "summarize", "classify", "compare"],
  },
  Apply: {
    label: "Apply",
    description: "Use information in new situations",
    verbs: ["apply", "demonstrate", "solve", "use", "execute"],
  },
  Analyze: {
    label: "Analyze",
    description: "Draw connections among ideas",
    verbs: ["analyze", "differentiate", "organize", "examine", "contrast"],
  },
  Evaluate: {
    label: "Evaluate",
    description: "Justify a decision or course of action",
    verbs: ["evaluate", "critique", "assess", "judge", "defend"],
  },
  Create: {
    label: "Create",
    description: "Produce new or original work",
    verbs: ["create", "design", "develop", "construct", "produce"],
  },
} as const;

export type BloomsLevel = keyof typeof BLOOMS_TAXONOMY;

// Activity Durations
export const DURATIONS = [
  { value: "5min", label: "5 minutes (Quick)" },
  { value: "15min", label: "15 minutes (Starter)" },
  { value: "30min", label: "30 minutes (Half Period)" },
  { value: "45min", label: "45-60 minutes (Full Lesson)" },
  { value: "90min", label: "90 minutes (Extended)" },
  { value: "multiday", label: "Multi-day Project" },
] as const;

// Complexity Levels
export const COMPLEXITIES = [
  "Foundational",
  "Standard",
  "Advanced",
  "Gifted & Talented",
] as const;

export type Complexity = typeof COMPLEXITIES[number];

// Question Types for Quizzes
export const QUESTION_TYPES = [
  { value: "multiple-choice", label: "Multiple Choice" },
  { value: "true-false", label: "True/False" },
  { value: "short-answer", label: "Short Answer" },
  { value: "fill-blank", label: "Fill in the Blank" },
  { value: "matching", label: "Matching" },
] as const;

export type QuestionType = typeof QUESTION_TYPES[number]["value"];

// Rubric Types
export const RUBRIC_TYPES = [
  { value: "analytic", label: "Analytic (Separate scores per criterion)" },
  { value: "holistic", label: "Holistic (Single overall score)" },
  { value: "single-point", label: "Single Point (Standards-based)" },
] as const;

// Performance Levels for Rubrics
export const PERFORMANCE_LEVELS = {
  "3-level": ["Basic", "Proficient", "Advanced"],
  "4-level": ["Beginning", "Developing", "Proficient", "Exemplary"],
  "5-level": ["1 - Novice", "2 - Developing", "3 - Proficient", "4 - Advanced", "5 - Expert"],
} as const;

// Tool Categories (from AI Tools)
export const TOOL_CATEGORIES = [
  { id: "all", label: "All Tools" },
  { id: "planning", label: "Planning" },
  { id: "assessment", label: "Assessment" },
  { id: "instruction", label: "Instruction" },
  { id: "student-support", label: "Student Support" },
  { id: "communication", label: "Communication" },
  { id: "activities", label: "Activities" },
  { id: "language", label: "Language" },
  { id: "creative", label: "Creative" },
] as const;

// Scratch-specific: Coding Concepts mapped to curriculum
export const SCRATCH_CODING_CONCEPTS = {
  "Computational Thinking": [
    "Sequences",
    "Loops",
    "Events",
    "Parallelism",
    "Conditionals",
    "Operators",
    "Data (Variables & Lists)",
  ],
  "Programming Concepts": [
    "Algorithms",
    "Debugging",
    "Abstraction",
    "Pattern Recognition",
    "Decomposition",
  ],
  "Scratch Practices": [
    "Experimenting & Iterating",
    "Testing & Debugging",
    "Reusing & Remixing",
    "Abstracting & Modularizing",
  ],
  "21st Century Skills": [
    "Creativity",
    "Critical Thinking",
    "Collaboration",
    "Communication",
  ],
} as const;

// Helper functions
export function getSubjectTopics(subject: string): string[] {
  return SUBJECTS[subject] || [];
}

export function getFrameworksForSubject(subject: string): string[] {
  return FRAMEWORKS[subject] || FRAMEWORKS.Other;
}

export function getBloomsVerbs(level: BloomsLevel): readonly string[] {
  return BLOOMS_TAXONOMY[level].verbs;
}

export function getGradeIndex(grade: GradeLevel): number {
  return GRADES.indexOf(grade);
}

export function isGradeLevelAppropriate(targetGrade: GradeLevel, studentGrade: GradeLevel): boolean {
  return getGradeIndex(studentGrade) >= getGradeIndex(targetGrade) - 1 &&
         getGradeIndex(studentGrade) <= getGradeIndex(targetGrade) + 1;
}
