<script lang="ts">
  import type EduQuiz from "./index";

  export let extension: EduQuiz;
  export let close: () => void;

  let newQuizTitle = "";
  let newQuestion = "";
  let newOptions = "";
  let correctAnswer = 1;
  let questionType: "multiple-choice" | "true-false" | "short-answer" = "multiple-choice";
  let points = 1;
  let bloomsLevel = "Remember";

  function createQuiz() {
    if (newQuizTitle.trim()) {
      extension.createQuiz(newQuizTitle);
      newQuizTitle = "";
    }
  }

  function addQuestion() {
    if (!newQuestion.trim()) return;

    if (questionType === "multiple-choice") {
      extension.addMultipleChoice(newQuestion, newOptions, correctAnswer, points);
    } else if (questionType === "true-false") {
      extension.addTrueFalse(newQuestion, correctAnswer === 1 ? "true" : "false", points);
    } else {
      extension.addShortAnswer(newQuestion, newOptions, points);
    }

    extension.setBloomsLevel(bloomsLevel as any);

    // Reset form
    newQuestion = "";
    newOptions = "";
    correctAnswer = 1;
    points = 1;
  }

  $: questionCount = extension.questions?.length || 0;
  $: quizTitle = extension.currentSession?.title || "No Quiz Created";
</script>

<div class="quiz-manager">
  <header>
    <h2>Quiz Manager</h2>
    <button class="close-btn" on:click={close}>X</button>
  </header>

  <section class="create-quiz">
    <h3>Create New Quiz</h3>
    <div class="form-row">
      <input
        type="text"
        bind:value={newQuizTitle}
        placeholder="Quiz Title"
      />
      <button on:click={createQuiz}>Create Quiz</button>
    </div>
  </section>

  {#if extension.currentSession}
    <section class="current-quiz">
      <h3>Current Quiz: {quizTitle}</h3>
      <p>Questions: {questionCount}</p>
    </section>

    <section class="add-question">
      <h3>Add Question</h3>

      <div class="form-group">
        <label>Question Type</label>
        <select bind:value={questionType}>
          <option value="multiple-choice">Multiple Choice</option>
          <option value="true-false">True/False</option>
          <option value="short-answer">Short Answer</option>
        </select>
      </div>

      <div class="form-group">
        <label>Question</label>
        <textarea bind:value={newQuestion} placeholder="Enter your question..."></textarea>
      </div>

      {#if questionType === "multiple-choice"}
        <div class="form-group">
          <label>Options (comma separated)</label>
          <input
            type="text"
            bind:value={newOptions}
            placeholder="Option 1, Option 2, Option 3, Option 4"
          />
        </div>
        <div class="form-group">
          <label>Correct Answer (1-4)</label>
          <input type="number" bind:value={correctAnswer} min="1" max="4" />
        </div>
      {:else if questionType === "true-false"}
        <div class="form-group">
          <label>Correct Answer</label>
          <select bind:value={correctAnswer}>
            <option value={1}>True</option>
            <option value={2}>False</option>
          </select>
        </div>
      {:else}
        <div class="form-group">
          <label>Correct Answer</label>
          <input type="text" bind:value={newOptions} placeholder="Expected answer" />
        </div>
      {/if}

      <div class="form-group">
        <label>Bloom's Level</label>
        <select bind:value={bloomsLevel}>
          <option value="Remember">Remember - Recall facts</option>
          <option value="Understand">Understand - Explain concepts</option>
          <option value="Apply">Apply - Use in new situations</option>
          <option value="Analyze">Analyze - Break down information</option>
          <option value="Evaluate">Evaluate - Make judgments</option>
          <option value="Create">Create - Produce new work</option>
        </select>
      </div>

      <div class="form-group">
        <label>Points</label>
        <input type="number" bind:value={points} min="1" max="10" />
      </div>

      <button class="add-btn" on:click={addQuestion}>Add Question</button>
    </section>

    <section class="questions-list">
      <h3>Questions ({questionCount})</h3>
      {#each extension.questions as q, i}
        <div class="question-item">
          <span class="q-num">{i + 1}.</span>
          <span class="q-text">{q.question}</span>
          <span class="q-type">{q.type}</span>
          <span class="q-bloom">{q.bloomsLevel}</span>
          <span class="q-points">{q.points}pts</span>
        </div>
      {/each}
    </section>
  {/if}
</div>

<style>
  .quiz-manager {
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

  h2 {
    margin: 0;
    color: #2E7D32;
  }

  h3 {
    color: #333;
    margin: 16px 0 8px;
  }

  .close-btn {
    background: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 10px;
    cursor: pointer;
  }

  section {
    margin-bottom: 16px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 6px;
  }

  .form-row {
    display: flex;
    gap: 8px;
  }

  .form-group {
    margin-bottom: 12px;
  }

  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 4px;
    color: #555;
  }

  input, select, textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
  }

  textarea {
    min-height: 60px;
    resize: vertical;
  }

  button {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }

  button:hover {
    background: #45a049;
  }

  .add-btn {
    width: 100%;
    margin-top: 8px;
  }

  .questions-list {
    max-height: 200px;
    overflow-y: auto;
  }

  .question-item {
    display: flex;
    gap: 8px;
    padding: 8px;
    background: white;
    border-radius: 4px;
    margin-bottom: 4px;
    font-size: 13px;
    align-items: center;
  }

  .q-num {
    font-weight: bold;
    color: #4CAF50;
  }

  .q-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .q-type, .q-bloom, .q-points {
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 3px;
    background: #e0e0e0;
  }

  .q-bloom {
    background: #bbdefb;
  }

  .q-points {
    background: #c8e6c9;
  }
</style>
