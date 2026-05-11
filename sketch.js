//COD208A ELIF OZENLI FINAL PROJECT
// AI usage declaration:
// The concept, idea development, and visual design of this project were entirely created by me. I developed the festival alter-ego concept, designed the personas, and created all visual elements including layouts, color palettes, and mask designs. During the coding process, I used ChatGPT as a support tool to help me better understand programming concepts, improve the structure of my code, and write more readable and organized logic. My intention was to create a more complete and well-functioning final project. While doing this, I sometimes needed to use more advanced or unfamiliar coding concepts such as state management, conditional logic for scene transitions, dynamic rendering, array-based data handling, and responsive layout calculations. Instead of avoiding these, I chose to learn and apply them. For example, I received support in structuring the quiz flow, managing user interactions (such as button clicks and option selection), and implementing scoring logic that maps answers to personas. I also improved parts of my code related to reusable functions, hover states, and proportional image scaling. Additionally, when I encountered errors or unexpected behavior (such as incorrect button states, misaligned layouts, or result calculation issues), I used AI to debug and understand the problem. Rather than simply copying solutions, I focused on understanding why the issue occurred and how to fix it correctly. To support my own learning process, I added detailed comments throughout the code. Especially in sections where I used concepts I was not previously familiar with, I included explanations of what each part does and why it is used. Overall, AI was used as a learning and guidance tool throughout the development process. The idea, design decisions, and final implementation of the project are my own, and the use of AI contributed to both improving the project and expanding my understanding of coding.

// Global image variables
// These variables will store the images used in the project.
let introImg;
let introStartTime;
let startBg; 
let maskImg; 
let scaleFactor = 1;

let baseW = 1440;

let baseH = 1024;

// Persona mask image variables
// Each variable stores the mask image that belongs to a specific persona.
// These images will later be displayed on the result screen depending on the user's quiz answers.
let chromeSpiritMask;
let moonNomadMask;
let sunsetDreamerMask;
let neonRebelMask;
let desertOracleMask;

// Scene and quiz state variables
let scene = "intro"; 
let currentQuestion = 0; 
let selectedOption = -1; 

// Button objects
// These objects will store button properties such as position, size, and clickable area. They are defined globally so the mouse interaction functions can access them easily.
let startButton = {};
let nextButton = {}; 
let backButton = {}; 
let playAgainButton = {}; 
let printButton = {}; 

// Quiz questions array
// This array contains all the questions shown to the user.
// The answers are designed to reveal the user's festival persona
// through mood, color, energy, movement, and texture preferences.
let questions = [
  {
    question: "How do you want to be perceived in a crowd?",
    options: ["Mysterious", "Bold", "Calm", "Energetic"]
  },
  {
    question: "What energy do you bring to the festival?",
    options: ["Soft and dreamy", "Intense and powerful", "Playful and chaotic", "Rebellious and wild"]
  },
  {
    question: "Choose a color palette:",
    options: ["Warm sunset tones", "Neon & vibrant", "Earthy & natural", "Monochrome"]
  },
  {
    question: "What time of day represents you best?",
    options: ["Sunrise", "Sunset", "Midnight", "Midday"]
  },
  {
    question: "How do you move through a crowd?",
    options: ["I observe quietly", "I stand out naturally", "I lead the energy", "I blend in but stay present"]
  },
  {
    question: "Pick a texture that feels like you:",
    options: ["Flowing fabric", "Metallic surface", "Dust & sand", "Liquid / glowing"]
  }
];

// User answers array
// This array stores the user's selected answer for each question.
// At the beginning, every value is set to null because the user has not answered any question yet.
let answers = new Array(questions.length).fill(null);

// Result data object
// This object stores the final result information after the quiz is completed. It will be updated based on the user's answers:
let resultData = {
  persona: "",
  description: "",
  vibes: [],
  palette: []
};

// Persona profile database
// This works like a small database for the quiz results.
// Each persona has its own description, mood keywords, and color palette.
const personaProfiles = {
  "Desert Oracle": {
    description:
      "You are intuitive, grounded, and mysterious. You trust your inner voice and move through the world with quiet presence.",
    vibes: ["Intuitive", "Calm", "Mystical"],
    palette: ["#a39481", "#b89c71", "#f4e0c6", "#fff1e2", "#d7c4a7"]
  },

  "Neon Rebel": {
    description:
      "You are bold, expressive, and impossible to ignore. You bring fearless energy into every space and turn attention into power.",
    vibes: ["Bold", "Electric", "Rebellious"],
    palette: ["#9f237c", "#f4ee7b", "#f42a94", "#ffc0d2", "#b0c436"]
  },

  "Sunset Dreamer": {
    description:
      "You are soft, emotional, and imaginative. You carry a romantic glow and create a sense of warmth wherever you go.",
    vibes: ["Dreamy", "Gentle", "Romantic"],
    palette: ["#5b3cce", "#f257e4", "#f2578b", "#f29657", "#fee1c7"]
  },

  "Moon Nomad": {
    description:
      "You are quiet, observant, and deeply magnetic. You belong to the night and reveal yourself slowly, with mystery and grace.",
    vibes: ["Quiet", "Mysterious", "Nocturnal"],
    palette: ["#010101", "#e0e6ed", "#00366b", "#00478e", "#004bb7"]
  },

  "Chrome Spirit": {
    description:
      "You are futuristic, experimental, and sharply defined. Your presence feels modern, bold, and slightly untouchable.",
    vibes: ["Sharp", "Modern", "Abstract"],
    palette: ["#8a949d", "#505b64", "#9baeba", "#aacce5", "#b7c7cf"]
  }
};

// Preload function
// Used to load external assets such as images, fonts, and sounds. This ensures that all assets are fully loaded before the sketch starts, preventing visual glitches or missing elements.
function preload() {
  introImg = loadImage("giris.png");
  startBg = loadImage("startpage.png"); 
  maskImg = loadImage("mask.png"); 

// Load mask images for each persona result
  chromeSpiritMask = loadImage("chromespirit.png");
  moonNomadMask = loadImage("moonnomad.png");
  sunsetDreamerMask = loadImage("sunsetdreamer.png");
  neonRebelMask = loadImage("neonrebel.png");
  desertOracleMask = loadImage("desertoracle.png");
}

// Setup function
// Runs once when the program starts.
// It initializes the canvas and sets global drawing properties.
function setup() {
  createCanvas(windowWidth, windowHeight);

  textFont("Georgia");
  rectMode(CORNER);
  imageMode(CORNER);

  updateScale();
  introStartTime = millis();
}
function updateScale() {
  scaleFactor = min(windowWidth / baseW, windowHeight / baseH);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateScale();
}

// Draw function
// Runs continuously in a loop.
// It acts as the main controller of the application by switching between different scenes.
function draw() {
  background(255);

  push();

  translate(
    (windowWidth - baseW * scaleFactor) / 2,
    (windowHeight - baseH * scaleFactor) / 2
  );

  scale(scaleFactor);

if (scene === "intro") {
  drawIntroScreen();
} else if (scene === "start") {
  drawStartScreen();
} else if (scene === "quiz") {
  drawQuizScreen();
} else if (scene === "result") {
  drawResultScreen();
}
  pop();
}
function drawIntroScreen() {
  drawCoverImage(introImg);

  if (millis() - introStartTime > 4000) {
    scene = "start";
  }
}

function drawCoverImage(img) {
  let imgRatio = img.width / img.height;
  let canvasRatio = baseW / baseH;

  let drawW, drawH, drawX, drawY;

  if (imgRatio > canvasRatio) {
    drawH = baseH;
    drawW = baseH * imgRatio;
    drawX = (baseW - drawW) / 2;
    drawY = 0;
  } else {
    drawW = baseW;
    drawH = baseW / imgRatio;
    drawX = 0;
    drawY = (baseH - drawH) / 2;
  }

  image(img, drawX, drawY, drawW, drawH);
}

function drawSoftOverlay() {
  noStroke();

  for (let y = 0; y < baseH; y++) {
    let alpha = map(y, 0, baseH, 235, 175);
    fill(250, 248, 245, alpha);
    rect(0, y, baseW, 1);
  }
}

// Start screen function
// Rendering the opening screen of the experience. It introduces the concept, visual identity, allows the user to begin the quiz.
function drawStartScreen() {
 drawCoverImage(startBg);

  fill(244, 237, 228, 50);
  rect(0, 0, baseW, baseH);
  // Draw a symbolic sun element
 drawSunSymbol(baseW / 2, 130, 55);

  // Main title
  fill("#2F2326");
  textAlign(CENTER, CENTER);

  textSize(86);
  textStyle(BOLD);
  text("FESTIVAL", baseW/ 2, 230);
  text("ALTER EGO", baseW/ 2, 330);

  // Subtitle
  textSize(34);
  fill("#7F8460");
  textStyle(NORMAL);
  text("G E N E R A T O R", baseW / 2, 415);

  // Supporting description text
  fill("#3B2F2F");
  textSize(28);
  text("DISCOVER YOUR FESTIVAL ALTER EGO", baseW / 2, 500);
  text("AND REVEAL YOUR MASK.", baseW / 2, 545);

  // Center mask visual
  let maskW = 500;
  let maskH = (maskImg.height / maskImg.width) * maskW;

  image(maskImg, width / 2 - maskW / 2, 575, maskW, maskH);

  // Start button setup
  // Button position and dimensions are stored in an object for easier interaction handling
  startButton = {
    x: width / 2 - 170,
    y: 860,
    w: 340,
    h: 92
  };
  // Draw the button using a reusable function
  //The hover state is determined by isMouseOver
  drawRoundedButton(
    startButton.x,
    startButton.y,
    startButton.w,
    startButton.h,
    "START QUIZ",
    isMouseOver(startButton.x, startButton.y, startButton.w, startButton.h)
  );

  // Footer text
  // Small reassurance text to encourage interaction
  fill("#2F2326");
  textSize(24);
  text("✧ IT ONLY TAKES 2 MINUTES ✧", width / 2, 985);
}

// Quiz screen function
// the quiz interface renders. It displays the current question, answer options, progress indicator, and navigation elements.
function drawQuizScreen() {
  drawCoverImage(startBg);


  drawSoftOverlay();

  // Header visual element
  //sun symbol
  drawSunSymbol(width / 2, 90, 35);

  // Title
  fill("#2F2326");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(48);

  text("FESTIVAL", width / 2, 130);
  text("ALTER EGO", width / 2, 185);

  // Subtitle
  fill("#7F8460");
  textStyle(NORMAL);
  textSize(20);
  text("G E N E R A T O R", width / 2, 230);

  // Progress indicator
  // Visual representation of how far the user has progressed in quiz
  drawProgressBar();

  // Text progress indicator
  fill("#7F8460");
  textSize(22);
  text(`QUESTION ${currentQuestion + 1} OF ${questions.length}`, width / 2, 320);

  // Question text
  fill("#2F2326");
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textWrap(WORD); 

  let questionBoxW = 760; 
  let questionBoxH = 140; 
  let questionX = width / 2;
  let questionY = 420;

  //adjust font size to prevent overflow or layout breaking
  textSize(getQuestionFontSize(questions[currentQuestion].question));
  text(
    questions[currentQuestion].question,
    questionX - questionBoxW / 2,
    questionY - questionBoxH / 2,
    questionBoxW,
    questionBoxH
  );

  // Answer options
  // Each option is displayed as a selectable box.
  let boxW = 700;
  let boxH = 72;
  let gap = 20;

  let boxX = width / 2 - boxW / 2;
  let boxY = 480;

  for (let i = 0; i < questions[currentQuestion].options.length; i++) {
    let y = boxY + i * (boxH + gap);

    // a reusable component that visually represents each answer option. It also reflects selection state.
    drawOptionBox(
      boxX,
      y,
      boxW,
      boxH,
      questions[currentQuestion].options[i],
      i === selectedOption // highlights the selected option
    );
  }

  // Next button setup
  // Stores position and size of the "Next" button
  // Used for navigation between questions

  nextButton = {
    x: width / 2 - 140,
    y: 860,
    w: 280,
    h: 82
  };
  
  // Next button state
  // The user can only continue if they have selected an option for the current question, or if they already answered this question before and came back to it.
  let canGoNext = selectedOption !== -1 || answers[currentQuestion] !== null;
  drawRoundedButton(
    nextButton.x,
    nextButton.y,
    nextButton.w,
    nextButton.h,
    
    // The final question changes the button label from next to see result to show the end of the quiz.
    currentQuestion === questions.length - 1 ? "SEE RESULT" : "NEXT",
    // Adds hover feedback when the mouse is over the button
    isMouseOver(nextButton.x, nextButton.y, nextButton.w, nextButton.h),
    // Disables the button visually and functionally if no answer is selected
    !canGoNext
  );

  // Back button
  // Stores the clickable area for the back button. 
  backButton = {
    x: width / 2 - 80,
    y: 960,
    w: 160,
    h: 32
  };

  // The back button appears faded on the first question
  fill(currentQuestion === 0 ? "rgba(59,47,47,0.35)" : "#7F8460");
  textSize(24);
  textStyle(NORMAL);
  text("← BACK", width / 2, 972);
}

// Result screen
// This function draws the final result screen after the quiz is completed.
function drawResultScreen() {
  drawCoverImage(startBg);
 
  drawCoverImage(startBg);

drawSoftOverlay();
  
  // Header
  // The result screen keeps the same header structure as the quiz screen,
  drawSunSymbol(width / 2, 90, 35);

  fill("#2F2326");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(48);
  text("FESTIVAL", width / 2, 130);
  text("ALTER EGO", width / 2, 185);

  fill("#7F8460");
  textStyle(NORMAL);
  textSize(20);
  text("G E N E R A T O R", width / 2, 230);

  // Result title
  fill("#2F2326");
  textStyle(BOLD);
  textSize(60);
  text("Here is your alter ego!", width / 2, 370);

  // Persona mask display
  // This frame defines where the persona-specific mask will be drawn.
  let frameX = 150;
  let frameY = 430;
  let frameW = 560;
  let frameH = 440;
  drawPersonaMask(frameX, frameY, frameW, frameH);

  // Persona information section
  let infoX = 790;
  let infoY = 450;
  textAlign(LEFT, TOP);
  // Small section label
  fill("#7F8460");
  textStyle(BOLD);
  textSize(25);
  text("YOUR PERSONA", infoX, infoY);
  // Persona name
  fill("#2F2326");
  textStyle(BOLD);
  textSize(58);
  text(resultData.persona, infoX, infoY + 42);
  // divider line
  stroke("#C9AE96");
  strokeWeight(1.5);
  line(infoX, infoY + 130, infoX + 180, infoY + 130);
  noStroke();
  // Persona description text
  fill("#3B2F2F");
  textStyle(NORMAL);
  textSize(28);
  textLeading(40);
  text(resultData.description, infoX, infoY + 165, 420, 170);

  // Vibe tags
  // These tags show keywords that summarize the user's persona.
  fill("#7F8460");
  textSize(25);
  text("YOUR VIBE", infoX, infoY + 340);

  drawVibeTag(infoX, infoY + 385, 110, 42, resultData.vibes[0] || "");
  drawVibeTag(infoX + 125, infoY + 385, 90, 42, resultData.vibes[1] || "");
  drawVibeTag(infoX + 230, infoY + 385, 120, 42, resultData.vibes[2] || "");

  // Color palette display
  // These dots visually translate the personality result into a design system.
  // Default colors are provided as fallbacks in case the result data is empty.
  fill("#7F8460");
  textSize(25);
  text("COLOR PALETTE", infoX + 100, infoY + 455);

  drawPaletteDot(infoX + 20, infoY + 505, resultData.palette[0] || "#D8C1A5");
  drawPaletteDot(infoX + 85, infoY + 505, resultData.palette[1] || "#8A8F6A");
  drawPaletteDot(infoX + 150, infoY + 505, resultData.palette[2] || "#D09A72");
  drawPaletteDot(infoX + 215, infoY + 505, resultData.palette[3] || "#B46E73");
  drawPaletteDot(infoX + 280, infoY + 505, resultData.palette[4] || "#5C3E4A");

  // result screen buttons
  // These buttons give the user two final actions: play again, print
  playAgainButton = {
    x: 180,
    y: 880,
    w: 280,
    h: 88
  };
  printButton = {
    x: 480,
    y: 890,
    w: 180,
    h: 72
  };

  // play again button with hover interaction
  drawRoundedButton(
    playAgainButton.x,
    playAgainButton.y,
    playAgainButton.w,
    playAgainButton.h,
    "PLAY AGAIN",
    isMouseOver(playAgainButton.x, playAgainButton.y, playAgainButton.w, playAgainButton.h)
  );

  // print button with hover interaction
  drawRoundedButton(
    printButton.x,
    printButton.y,
    printButton.w,
    printButton.h,
    "PRINT",
    isMouseOver(printButton.x, printButton.y, printButton.w, printButton.h)
  );
}

// Mouse pressed function
//Runs every time the user clicks the mouse. Works as the main interaction controller and sends the click action to the correct handler depending on the current scene.

function mousePressed() {
  if (scene === "start") {
    // If the user is on the start screen and clicks the start button, the scene changes to the quiz screen
    if (isMouseOver(startButton.x, startButton.y, startButton.w, startButton.h)) {
      scene = "quiz";
    }

  } else if (scene === "quiz") {
    // If the user is on the quiz screen, all quiz-related clicks are handled inside handlequizclick
    handleQuizClick();

  } else if (scene === "result") {
    // If the user is on the result screen, final action buttons such as play again and print are handled here
    handleResultClick();
  }
}

// Quiz click handler
//Controls all mouse interactions inside the quiz scene.It checks whether the user clicked an answer option, the next button, or the back button.
function handleQuizClick() {
  
  // Option box layout
  // These values match the option box layout used in drawquizscreen. Keeping the same measurements ensures that the clickable areas align correctly with the visible answer boxes.
  let boxW = 700;
  let boxH = 72;
  let gap = 20;
  let boxX = width / 2 - boxW / 2;
  let boxY = 480;

  // Check answer option 
  // This loop checks each answer option to see if the user clicked on it. If an option is clicked, its index is stored in selectedoption, and the answer text is saved in the answers array.
  for (let i = 0; i < questions[currentQuestion].options.length; i++) {
    let y = boxY + i * (boxH + gap);

    if (isMouseOver(boxX, y, boxW, boxH)) {
      selectedOption = i;
      answers[currentQuestion] = questions[currentQuestion].options[i];
      return; // Stop checking after an option has been selected
    }
  }
  
  // Next button
  // The user can only move forward if they have selected an answer
  let canGoNext = selectedOption !== -1 || answers[currentQuestion] !== null;

  if (
    canGoNext &&
    isMouseOver(nextButton.x, nextButton.y, nextButton.w, nextButton.h)
  ) {
    if (currentQuestion < questions.length - 1) {
      // Move to the next question
      currentQuestion++;

      // Restore the selected option if the user had previously answered the next question before going back.
      selectedOption = getSavedOptionIndex();

    } else {
      // If the user is on the final question, calculate the result and switch to the result screen.
      calculateResult();
      scene = "result";
    }

    return;
  }

  // Back button
  //It allows the user to revise earlier answers.
  if (
    currentQuestion > 0 &&
    isMouseOver(backButton.x, backButton.y - 18, backButton.w, 40)
  ) {
    currentQuestion--;

    // Restore the previously selected option for that question
    selectedOption = getSavedOptionIndex();
  }
}

// Result screen click handler
// This function controls the buttons on the final result screen.
function handleResultClick() {
  
  // Play again button
  // When clicked, the quiz is fully resets
  if (
    isMouseOver(playAgainButton.x, playAgainButton.y, playAgainButton.w, playAgainButton.h)
  ) {
    currentQuestion = 0;
    selectedOption = -1;
    answers = new Array(questions.length).fill(null);

    resultData = {
      persona: "",
      description: "",
      vibes: [],
      palette: []
    };

    scene = "start";
    return;
  }
  
  // Print button
  // This allows the user to print or save their persona result as a PDF.
  if (
    isMouseOver(printButton.x, printButton.y, printButton.w, printButton.h)
  ) {
    window.print();
  }
}

// Result calcilation function
//Each persona starts with a score of 0. As the function checks each answer, points are added to one or more personas depending on how strongly that answer connects to them.
function calculateResult() {

  // Initial persona scores
  // Each persona begins with 0 points. The final result will be the persona with the highest score.
  let scores = {
    "Desert Oracle": 0,
    "Neon Rebel": 0,
    "Sunset Dreamer": 0,
    "Moon Nomad": 0,
    "Chrome Spirit": 0
  };

  // Answer scoring loop
  // This loop goes through each saved answer and applies a scoring rule.
  // The variable i represents the question number:
  // i = 0 means question 1
  // i = 1 means question 2...

  for (let i = 0; i < answers.length; i++) {
    let answer = answers[i];

    // Question 1 scoring
    // This question focuses on social presence and how the user wants their identity to be seen by others.
    if (i === 0) {
      if (answer === "Mysterious") {
        scores["Moon Nomad"] += 2;
        scores["Desert Oracle"] += 1;
      } else if (answer === "Bold") {
        scores["Neon Rebel"] += 2;
        scores["Chrome Spirit"] += 1;
      } else if (answer === "Calm") {
        scores["Desert Oracle"] += 2;
        scores["Sunset Dreamer"] += 1;
      } else if (answer === "Energetic") {
        scores["Neon Rebel"] += 2;
        scores["Sunset Dreamer"] += 1;
      }
    }
    // Question 2 scoring
    // This question measures the emotional energy and atmosphere the user naturally brings into a social space

    if (i === 1) {
      if (answer === "Soft and dreamy") {
        scores["Sunset Dreamer"] += 2;
        scores["Desert Oracle"] += 1;
      } else if (answer === "Intense and powerful") {
        scores["Neon Rebel"] += 2;
        scores["Chrome Spirit"] += 1;
      } else if (answer === "Playful and chaotic") {
        scores["Neon Rebel"] += 2;
        scores["Sunset Dreamer"] += 1;
      } else if (answer === "Rebellious and wild") {
        scores["Neon Rebel"] += 2;
        scores["Moon Nomad"] += 1;
      }
    }

    // Question 3 scoring
    // Color choice is used as a visual personality indicator. Each palette connects to a specific mood, aesthetic, and persona.

    if (i === 2) {
      if (answer === "Warm sunset tones") {
        scores["Sunset Dreamer"] += 2;
        scores["Desert Oracle"] += 1;
      } else if (answer === "Neon & vibrant") {
        scores["Neon Rebel"] += 2;
        scores["Chrome Spirit"] += 1;
      } else if (answer === "Earthy & natural") {
        scores["Desert Oracle"] += 2;
        scores["Moon Nomad"] += 1;
      } else if (answer === "Monochrome") {
        scores["Chrome Spirit"] += 2;
        scores["Moon Nomad"] += 1;
      }
    }

    // Question 4 scorinf
    // Time of day is treated symbolically. It connects the user's personality to atmosphere, rhythm, and emotional tone.

    if (i === 3) {
      if (answer === "Sunrise") {
        scores["Sunset Dreamer"] += 2;
        scores["Desert Oracle"] += 1;
      } else if (answer === "Sunset") {
        scores["Desert Oracle"] += 2;
        scores["Sunset Dreamer"] += 1;
      } else if (answer === "Midnight") {
        scores["Moon Nomad"] += 2;
        scores["Chrome Spirit"] += 1;
      } else if (answer === "Midday") {
        scores["Neon Rebel"] += 2;
        scores["Chrome Spirit"] += 1;
      }
    }

    // Question 5 scoring
    // This question translates movement and behavior into personality.
    // It reflects whether the user is observant, expressive, leading, or quietly present.

    if (i === 4) {
      if (answer === "I observe quietly") {
        scores["Moon Nomad"] += 2;
        scores["Desert Oracle"] += 1;
      } else if (answer === "I stand out naturally") {
        scores["Neon Rebel"] += 2;
        scores["Chrome Spirit"] += 1;
      } else if (answer === "I lead the energy") {
        scores["Neon Rebel"] += 2;
        scores["Desert Oracle"] += 1;
      } else if (answer === "I blend in but stay present") {
        scores["Desert Oracle"] += 2;
        scores["Moon Nomad"] += 1;
      }
    }

    // Question 6 scoring
    // Texture is used as a sensory metaphor for identity.
    // It connects the user's self-perception to material qualities such as softness, shine, earthiness, or glow.

    if (i === 5) {
      if (answer === "Flowing fabric") {
        scores["Sunset Dreamer"] += 2;
        scores["Desert Oracle"] += 1;
      } else if (answer === "Metallic surface") {
        scores["Chrome Spirit"] += 2;
        scores["Neon Rebel"] += 1;
      } else if (answer === "Dust & sand") {
        scores["Desert Oracle"] += 2;
        scores["Moon Nomad"] += 1;
      } else if (answer === "Liquid / glowing") {
        scores["Chrome Spirit"] += 2;
        scores["Sunset Dreamer"] += 1;
      }
    }
  }

  // Find the highest persona score
  // Objectvalues collects all score values from the scores object. The max function finds the highest number among them. This represents the strongest matching persona score.
  let highestScore = max(...Object.values(scores));

  // tied personas
  // More than one persona may have the same highest score. This array stores all personas that share the top score.
  let tiedPersonas = [];
  for (let persona in scores) {
    if (scores[persona] === highestScore) {
      tiedPersonas.push(persona);
    }
  }

  // Determine winning persona
  // If there is only one highest-scoring persona, it becomes the result.
  // If there is a tie, the final texture-based answer is used as a tie-breaker because it is the most visual and identity-based question.

  let winningPersona;

  if (tiedPersonas.length === 1) {
    winningPersona = tiedPersonas[0];

  } else {
    let lastAnswer = answers[answers.length - 1];

    // Flowing fabric connects most strongly to the soft and romantic visual language of sunset dreamer.
    if (lastAnswer === "Flowing fabric") {
      winningPersona = tiedPersonas.includes("Sunset Dreamer")
        ? "Sunset Dreamer"
        : tiedPersonas[0];

    // Metallic and glowing textures connect to futuristic, reflective and experimental visual identities, so chrome spirit is prioritized.
    } else if (lastAnswer === "Metallic surface" || lastAnswer === "Liquid / glowing") {
      winningPersona = tiedPersonas.includes("Chrome Spirit")
        ? "Chrome Spirit"
        : tiedPersonas[0];

    // Dust and sand connect to earthy, mysterious, and grounded personas. moon nomad is checked first, then desert oracle as a secondary match.
    } else if (lastAnswer === "Dust & sand") {
      winningPersona = tiedPersonas.includes("Moon Nomad")
        ? "Moon Nomad"
        : tiedPersonas.includes("Desert Oracle")
        ? "Desert Oracle"
        : tiedPersonas[0];

    // If no specific tie-breaker applies, a random tied persona is chosen. This keeps the quiz functional even in unexpected tie situations.
    } else {
      winningPersona = tiedPersonas[int(random(tiedPersonas.length))];
    }
  }

  // Store final result data
  // Once the winning persona is selected, the matching profile information
  // is copied from personaprofiles into resultdata. resultData is then used by drawresultscreen to display the final persona name, description, vibe tags, and color palette.

  resultData = {
    persona: winningPersona,
    description: personaProfiles[winningPersona].description,
    vibes: personaProfiles[winningPersona].vibes,
    palette: personaProfiles[winningPersona].palette
  };

  // Debugging output
  // These console logs help test the quiz logic while developing. They show the user's answers, the calculated scores, and the final selected persona in the browser console.

  console.log("Answers:", answers);
  console.log("Scores:", scores);
  console.log("Result:", winningPersona);
}


// Get saved option index function
// This function checks whether the current question already has a saved answer. It is mainly used when the user goes back and forth between questions, so the previously selected option can stay highlighted.
function getSavedOptionIndex() {
  let savedAnswer = answers[currentQuestion];

  // If the question has not been answered yet, no option is selected.
  if (savedAnswer === null) return -1;

  let opts = questions[currentQuestion].options;

  // Compare the saved answer with each option.
  // When a match is found, return its index.
  for (let i = 0; i < opts.length; i++) {
    if (opts[i] === savedAnswer) return i;
  }

  // If no match is found, return -1 as a safe fallback.
  return -1;
}

// Question font size
// This function adjusts the question font size based on text length.

function getQuestionFontSize(q) {
  if (q.length > 55) return 28;
  if (q.length > 40) return 32;
  return 36;
}

// Option box
// This function draws one answer option box. It is reusable, so the quiz screen can draw all answer choices with consistent styling and hover/selection feedback.

function drawOptionBox(x, y, w, h, label, selected) {
  let hover = isMouseOver(x, y, w, h);

  // The stroke becomes stronger when the option is selected.
  stroke(selected ? "#E6B8A2" : "#C9AE96");
  strokeWeight(selected ? 2.5 : 1.4);

  // The fill color changes depending on the interaction state
  if (selected) {
    fill(250, 248, 245, 235);
  } else if (hover) {
    fill(250, 248, 245, 210);
  } else {
    fill(250, 248, 245, 185);
  }

  rect(x, y, w, h, 18);

  // Draw option label inside the box.
  fill("#3B2F2F");
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(28);
  textStyle(NORMAL);
  text(label, x + 28, y + h / 2);
}

// Rounded button 
// This reusable function draws the main buttons used in the project
// It supports hover styling and disabled states

function drawRoundedButton(x, y, w, h, label, hover, disabled = false) {
  noStroke();

  // Button color changes according to its state
  // Disabled buttons appear more transparent and less clickable
  if (disabled) {
    fill(127, 132, 96, 140);
  } else if (hover) {
    fill("#94986E");
  } else {
    fill("#8A8F6A");
  }

  rect(x, y, w, h, 45);

  // Decorative outline gives the button a more polished visual style
  noFill();
  stroke(disabled ? "rgba(230,184,162,0.2)" : "rgba(230,184,162,0.85)");
  strokeWeight(3);
  rect(x - 4, y - 4, w + 8, h + 8, 48);

  // Button text
  noStroke();
  fill("#FAF8F5");
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  textSize(26);
  text(`✦  ${label}  ✦`, x + w / 2, y + h / 2 + 1);
}

// Progress bar
// This function draws the progress indicator shown during the quiz. It uses a horizontal line and circular markers to show which question the user is currently answering.

function drawProgressBar() {
  let total = questions.length;
  let startX = width / 2 - 220;
  let y = 280;
  let gap = 88;

  // Draw the base line connecting all progress dots.
  stroke("#CDB59F");
  strokeWeight(3);
  line(startX, y, startX + gap * (total - 1), y);

  // Draw one circle for each question.
  for (let i = 0; i < total; i++) {
    let x = startX + i * gap;

    noStroke();

    if (i < currentQuestion) {
      // Completed questions are filled with a warm accent color.
      fill("#E6B8A2");
      circle(x, y, 22);

    } else if (i === currentQuestion) {
      // The current question is larger and has an inner highlight.
      fill("#E6B8A2");
      circle(x, y, 28);
      fill(255, 220);
      circle(x, y, 18);

    } else {
      // Upcoming questions are shown in a softer neutral color.
      fill("#D7C2AF");
      circle(x, y, 22);
    }
  }
}
// Sun symbol function
// This function draws a decorative sun symbol used in the header.
function drawSunSymbol(x, y, size) {
  push();

  // Move the drawing origin to the center of the sun symbol.
  translate(x, y);

  stroke("#C9AE96");
  strokeWeight(2);
  noFill();

  // Central circle of the sun.
  circle(0, 0, size);

  // Draw 16 rays around the circle.
  for (let i = 0; i < 16; i++) {
    let angle = TWO_PI / 16 * i;

    let x1 = cos(angle) * (size / 2 + 8);
    let y1 = sin(angle) * (size / 2 + 8);

    let x2 = cos(angle) * (size / 2 + 28);
    let y2 = sin(angle) * (size / 2 + 28);

    line(x1, y1, x2, y2);
  }

  pop();
}

// Mask placeholder function
// This function draws a placeholder frame for the mask area. It is used as a fallback if no persona mask image is available. This helps prevent the result screen from looking empty or broken.
function drawMaskPlaceholder(x, y, w, h) {
  push();

  // Outer rounded frame for the mask display area
  noFill();
  stroke("#C9AE96");
  strokeWeight(2.2);
  rect(x, y, w, h, 220);

  // Inner soft background panel
  noStroke();
  fill(250, 248, 245, 170);
  rect(x + 25, y + 25, w - 50, h - 50, 180);

  // Placeholder label
  fill("#C9AE96");
  textAlign(CENTER, CENTER);
  textSize(24);
  textStyle(NORMAL);
  text("MASK AREA", x + w / 2, y + h / 2);

  pop();
}

// Vibe tag function
// draws a small rounded label used to display personality keywords on the result screen. Each tag represents one of the selected persona's core vibes.
function drawVibeTag(x, y, w, h, label) {
  stroke("#C9AE96");
  strokeWeight(1.2);

  // the main persona title or mask image.
  fill(250, 248, 245, 180);
  rect(x, y, w, h, 22);

  // Centered text label inside the tag
  noStroke();
  fill("#3B2F2F");
  textAlign(CENTER, CENTER);
  textSize(18);
  text(label, x + w / 2, y + h / 2);
}


// Color palette dot function
function drawPaletteDot(x, y, c) {
  stroke("#FAF8F5");
  strokeWeight(2);

  // The color value is passed as a parameter, allowing each persona to display its own unique palette.
  fill(c);
  circle(x, y, 34);
}

// Get persona mask function
// It connects the calculated quiz result with the matching visual asset
// If no matching persona is found, it returns null as a safe fallback
function getPersonaMask() {
  if (resultData.persona === "Chrome Spirit") return chromeSpiritMask;
  if (resultData.persona === "Moon Nomad") return moonNomadMask;
  if (resultData.persona === "Sunset Dreamer") return sunsetDreamerMask;
  if (resultData.persona === "Neon Rebel") return neonRebelMask;
  if (resultData.persona === "Desert Oracle") return desertOracleMask;

  return null;
}

// Draw persona mask function
// This function draws the correct persona mask on the result screen.
// It first receives the mask image from getpersonamask.
function drawPersonaMask(x, y, w, h) {
  let currentMask = getPersonaMask();

  // If there is no valid mask image, draw the placeholder instead.
  if (!currentMask) {
    drawMaskPlaceholder(x, y, w, h);
    return;
  }

  // Original dimensions of the selected mask image
  let imgW = currentMask.width;
  let imgH = currentMask.height;

  // Aspect ratios are used to compare the image shape with the frame shape.
  let imgRatio = imgW / imgH;
  let boxRatio = w / h;

  let drawW, drawH, drawX, drawY;

  // Responsive image fitting logic
  // If the image is wider than the frame, fit it by width
  // If the image is taller than the frame, fit it by height
  // This keeps the mask proportional and centered
  if (imgRatio > boxRatio) {
    drawW = w;
    drawH = w / imgRatio;
    drawX = x;
    drawY = y + (h - drawH) / 2;
  } else {
    drawH = h;
    drawW = h * imgRatio;
    drawX = x + (w - drawW) / 2;
    drawY = y;
  }

  // Draw the final mask image inside the result frame.
  image(currentMask, drawX, drawY, drawW, drawH);
}

// Mouse over function
// This utility function checks whether the mouse cursor is inside a rectangular area. It is used throughout the project for buttons, answer boxes, hover effects, and click detection.
function isMouseOver(x, y, w, h) {

  let adjustedMouseX =
    (mouseX - (windowWidth - baseW * scaleFactor) / 2) / scaleFactor;

  let adjustedMouseY =
    (mouseY - (windowHeight - baseH * scaleFactor) / 2) / scaleFactor;

  return (
    adjustedMouseX > x &&
    adjustedMouseX < x + w &&
    adjustedMouseY > y &&
    adjustedMouseY < y + h
  );
}