<script lang="ts">
  import type EduQuiz from "./index";

  export let extension: EduQuiz;
  export let close: () => void;

  $: session = extension.currentSession;
  $: score = extension.getScore();
  $: maxScore = extension.getMaxScore();
  $: percentage = extension.getScorePercentage();
  $: grade = extension.getGrade();
  $: correctCount = extension.getCorrectCount();
  $: totalQuestions = session?.questions?.length || 0;
  $: feedback = extension.getFeedbackMessage();
  $: timeElapsed = extension.getTimeElapsed();

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }

  function getGradeColor(g: string): string {
    switch (g) {
      case 'A': return '#4CAF50';
      case 'B': return '#8BC34A';
      case 'C': return '#FFC107';
      case 'D': return '#FF9800';
      default: return '#f44336';
    }
  }

  function getBloomsColor(level: string): string {
    const colors: Record<string, string> = {
      Remember: '#90CAF9',
      Understand: '#81C784',
      Apply: '#FFD54F',
      Analyze: '#FFB74D',
      Evaluate: '#FF8A65',
      Create: '#BA68C8',
    };
    return colors[level] || '#e0e0e0';
  }
</script>

<div class="results">
  <header>
    <h2>Quiz Results</h2>
    <button class="close-btn" on:click={close}>X</button>
  </header>

  {#if session}
    <div class="quiz-title">{session.title}</div>

    <div class="score-display">
      <div class="grade" style="background-color: {getGradeColor(grade)}">
        {grade}
      </div>
      <div class="score-details">
        <div class="score-main">{score}/{maxScore}</div>
        <div class="score-percent">{percentage}%</div>
      </div>
    </div>

    <div class="stats">
      <div class="stat">
        <span class="stat-label">Questions Correct</span>
        <span class="stat-value">{correctCount}/{totalQuestions}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Time Taken</span>
        <span class="stat-value">{formatTime(timeElapsed)}</span>
      </div>
    </div>

    <div class="feedback">
      <p>{feedback}</p>
    </div>

    <div class="question-review">
      <h3>Question Review</h3>
      {#each session.questions as q, i}
        {@const userAnswer = session.answers[i]}
        {@const isCorrect = q.type === 'short-answer'
          ? String(userAnswer).toLowerCase().trim() === q.correctAnswer
          : (parseInt(String(userAnswer)) - 1) === q.correctAnswer}
        <div class="review-item" class:correct={isCorrect} class:incorrect={!isCorrect}>
          <div class="review-header">
            <span class="q-number">Q{i + 1}</span>
            <span class="q-status">{isCorrect ? '✓' : '✗'}</span>
            <span class="q-bloom" style="background-color: {getBloomsColor(q.bloomsLevel)}">
              {q.bloomsLevel}
            </span>
          </div>
          <div class="q-text">{q.question}</div>
          {#if !isCorrect}
            <div class="answer-info">
              <span class="your-answer">Your answer: {userAnswer || 'No answer'}</span>
              <span class="correct-answer">
                Correct: {q.options ? q.options[q.correctAnswer] : q.correctAnswer}
              </span>
            </div>
          {/if}
          {#if q.explanation}
            <div class="explanation">{q.explanation}</div>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <div class="no-quiz">
      <p>No quiz results to display.</p>
      <p>Complete a quiz to see your results here.</p>
    </div>
  {/if}
</div>

<style>
  .results {
    font-family: "Helvetica Neue", Arial, sans-serif;
    padding: 16px;
    max-width: 500px;
    background: #fff;
    border-radius: 8px;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #4CAF50;
  }

  h2, h3 {
    margin: 0;
    color: #2E7D32;
  }

  h3 {
    margin: 16px 0 12px;
  }

  .close-btn {
    background: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 10px;
    cursor: pointer;
  }

  .quiz-title {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 16px;
  }

  .score-display {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }

  .grade {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    font-weight: bold;
    color: white;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }

  .score-details {
    text-align: center;
  }

  .score-main {
    font-size: 32px;
    font-weight: bold;
    color: #333;
  }

  .score-percent {
    font-size: 18px;
    color: #666;
  }

  .stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 16px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 8px;
  }

  .stat {
    text-align: center;
  }

  .stat-label {
    display: block;
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
  }

  .stat-value {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }

  .feedback {
    background: #e8f5e9;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 16px;
  }

  .feedback p {
    margin: 0;
    color: #2E7D32;
    font-weight: 500;
  }

  .question-review {
    max-height: 300px;
    overflow-y: auto;
  }

  .review-item {
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 6px;
    border-left: 4px solid #ddd;
    background: #f9f9f9;
  }

  .review-item.correct {
    border-left-color: #4CAF50;
    background: #f1f8e9;
  }

  .review-item.incorrect {
    border-left-color: #f44336;
    background: #ffebee;
  }

  .review-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .q-number {
    font-weight: bold;
    color: #666;
  }

  .q-status {
    font-size: 16px;
  }

  .review-item.correct .q-status {
    color: #4CAF50;
  }

  .review-item.incorrect .q-status {
    color: #f44336;
  }

  .q-bloom {
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 3px;
    color: #333;
  }

  .q-text {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
  }

  .answer-info {
    font-size: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .your-answer {
    color: #c62828;
  }

  .correct-answer {
    color: #2E7D32;
    font-weight: 500;
  }

  .explanation {
    margin-top: 8px;
    padding: 8px;
    background: #fff3e0;
    border-radius: 4px;
    font-size: 12px;
    color: #e65100;
  }

  .no-quiz {
    text-align: center;
    padding: 40px;
    color: #666;
  }
</style>
