let $intructions = document.querySelector(".instructions");
let $startBtn = document.querySelector(".start-btn");
let $canvas = document.querySelector("canvas");
// Création d'un objet context comportant de multiple méthodes pour pouvoir dessiner dans la balise canvas
let ctx = $canvas.getContext("2d");
const $question = document.querySelector(".question");
const $choices = document.querySelector(".choices");
const $timer = document.querySelector(".timer");

let enemyRushActive = false;

let discussion = 0;
let level = 0;

let questions = [
  [
    {
      question:
        "Dans One Piece, comment appelle-t-on les fruits légendaires qui donnent des pouvoirs aux personnages ?",
      answers: [
        { text: "1. Les fruits du diable", correct: false },
        { text: "2. Les fruits démoniaque", correct: false },
        { text: "3. Les fruits du démon", correct: true },
      ],
    },
    {
      question: "A quel village ninja appartient Naruto Uzumaki ?",
      answers: [
        { text: "1. Konoha", correct: true },
        { text: "2. Suna", correct: false },
        { text: "3. Kumo", correct: false },
      ],
    },
    {
      question:
        "De quelle île originaire Gon Freecs, le personnage principal de Hunter x Hunter ?",
      answers: [
        { text: "1. L'île de la méduse", correct: false },
        { text: "2. L'île de la baleine", correct: true },
        { text: "3. L'île de de la tortue", correct: false },
      ],
    },
    {
      question: "Dans l'Attaque des titans, quel Titan Eren possède-t-il ?",
      answers: [
        { text: "1. Le titan Assaillant", correct: true },
        { text: "2. Le titan Cuirassé", correct: false },
        { text: "3. Le titan Bestial", correct: false },
      ],
    },
  ],
  [
    {
      question:
        "Dans My Hero Academia, quel est le pourcentage de la population qui possède des super-pouvoirs ?",
      answers: [
        { text: "1. 50%", correct: false },
        { text: "2. 70%", correct: false },
        { text: "3. 80%", correct: true },
      ],
    },
    {
      question: "Comment se nomme le sabre d'un Shinigami dans Bleach ?",
      answers: [
        { text: "1. Zanketo", correct: false },
        { text: "2. Zanpakuto", correct: true },
        { text: "3. Zanquino", correct: false },
      ],
    },
    {
      question:
        "Dans Seven Deadly Sins, quel personnage représente l'Orgueil des Sept Péchés capitaux ?",
      answers: [
        { text: "1. Meliodas", correct: false },
        { text: "2. Escanor", correct: true },
        { text: "3. King", correct: false },
      ],
    },
    {
      question: "Dans Death Note, qui est Ryuk ?",
      answers: [
        { text: "1. Un dieu de la mort", correct: true },
        { text: "2. Un ange déchu", correct: false },
        { text: "3. Un esprit vengeur", correct: false },
      ],
    },
  ],
  [
    {
      question: "Quelle est la quête d'Albator",
      answers: [
        { text: "1. L'honneur", correct: false },
        { text: "2. La liberté", correct: false },
        { text: "3. La paix", correct: true },
      ],
    },
    {
      question:
        "Comment s'appelle le personnage principal de Fullmetal Alchemist qui a sa conscience dans une armure ?",
      answers: [
        { text: "1. Roy", correct: false },
        { text: "2. Elric", correct: false },
        { text: "3. Alphonse", correct: true },
      ],
    },
    {
      question:
        "Dans Assassination Classroom, quel est le pourcentage de la lune qui est détruit ?",
      answers: [
        { text: "1. 70%", correct: true },
        { text: "2. 40%", correct: false },
        { text: "3. 25%", correct: false },
      ],
    },
    {
      question: "Dans Kuroko No Basket, quelle est le point fort de Kagami ?",
      answers: [
        { text: "1. Ses dribbles", correct: false },
        { text: "2. Sa vitesse", correct: false },
        { text: "3. Sa détente", correct: true },
      ],
    },
  ],
];

$startBtn.onclick = () => {
  myGameArea.start();
  myGameArea.clear();
  $question.innerHTML = "";
};

const myGameArea = {
  canvas: $canvas,
  level: 0,
  start: function () {
    $startBtn.style.display = "none";

    const w = 1200;
    const h = 600;
    this.canvas.width = w;
    this.canvas.height = h;
    this.interval = setInterval(updateGameArea, 16);

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    //
    // INSTANCE PLAYER
    //
    const playerW = 60;
    const playerH = 90;
    const playerRandX = Math.floor(Math.random() * (this.canvas.width / 4));
    const playerRandY = Math.floor(
      Math.random() * (this.canvas.height - playerH)
    );
    this.player = new Component(
      playerRandX,
      playerRandY,
      "images/Luffy.png",
      "player",
      playerW,
      playerH,
      true
    );

    //
    // INSTANCE MASTER
    //
    var masterW = 90;
    var masterH = 90;
    var maxRandXForMaster = w - masterW;
    var masterRandX = Math.floor(
      Math.random() * (maxRandXForMaster - w / 2 + 1) + w / 2
    );
    var masterRandY = Math.floor(Math.random() * (h - masterH));
    this.master = new Component(
      masterRandX,
      masterRandY,
      "images/Game Master.png",
      "master",
      masterW,
      masterH
    );
    //
    // INSTANCE ENNEMI
    //
    this.enemies = [];

    const enemyW = 90;
    const enemyH = 80;

    this.enemies.push(
      new Component(
        Math.floor(Math.random() * (1111 - 600) + 600),
        Math.floor(Math.random() * (h - enemyH + 1)),
        "images/monster.png",
        "enemy",
        enemyW,
        enemyH
      )
    );
    this.enemies.push(
      new Component(
        Math.floor(Math.random() * (1111 - 600) + 600),
        Math.floor(Math.random() * (h - enemyH + 1)),
        "images/monster2.png",
        "enemy",
        enemyW,
        enemyH
      )
    );
  },
  //
  // METHODE POUR DESSINER LE PLAYER
  //
  draw: function () {
    this.player.draw();
  },
  //
  // METHODE POUR CLEAR LE CANVAS ET AFFICHER LE NIVEAU
  //
  clear: function () {
    console.log("clear");

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    document.querySelector("span").innerHTML = `Niveau ${level}`;
    document.querySelector("h1").style.display = "none";
    document.querySelector(".level").style.display = "block";
    document.querySelector(".instructions").style.display = "none";
    $canvas.style.display = "block";
    $canvas.style.backgroundColor = "rgba(139, 68, 19, 0.8)";
  },
  gameOver: function () {
    console.log("GAME OVER");
    clearInterval(this.interval);
    $question.innerHTML =
      "Tu as échoué.<br> Voilà ce qui arrive lorsqu'on s'emballe...";
    $choices.innerHTML = "";
    $startBtn.innerHTML = "Restart";
    $startBtn.style.display = "inline-block";
    level = 0;
    discussion = 0;
  },
  winning: function () {
    console.log("I won !");
    clearInterval(this.interval);
    $question.innerHTML =
      "Tu es digne d'être mon successeur. Te voilà désormais maitre à ton tour";
    $choices.innerHTML = "";
    $startBtn.innerHTML = "Play again";
    $startBtn.style.display = "inline-block";
    level = 0;
    discussion = 0;
  },
  //
  // METHODE POUR PASSER AU NIVEAU SUIVANT
  //
  nextLevel: function (num) {
    console.log("Tu as bien répondu !");
    const enemyW = 90;
    const enemyH = 80;
    this.enemies.push(
      new Component(
        Math.floor(Math.random() * (1111 - 600) + 600),
        Math.floor(Math.random() * (600 - enemyH + 1)),
        `images/monster${num}.png`,
        "enemy",
        enemyW,
        enemyH
      )
    );
  },
};

//
// FONCTION POUR METTRE A JOUR LE JEU
//
function updateGameArea() {
  // toutes les 16ms

  myGameArea.clear();
  myGameArea.player.newPos();
  myGameArea.player.draw();
  myGameArea.master.draw();

  myGameArea.enemies.forEach((enemy) => {
    if (myGameArea.player.crashwith(enemy)) {
      // console.log("GAME OVER !!");

      myGameArea.gameOver();
    }
    enemy.move();
    enemy.draw();
  });

  if (myGameArea.player.isMeetingTheMaster(myGameArea.master)) {
    // console.log("enemies=", myGameArea.enemies);
    myGameArea.player.speedX = 0;
    myGameArea.player.speedY = 0;

    for (let enemy of myGameArea.enemies) {
      enemy.speedX = 0;
      enemy.speedY = 0;
    }

    // Supprimer les écouteurs d'événements pour empêcher les mouvements du personnage
    document.removeEventListener("keydown", handleKeyDown);
  }
}

let timer; // Déclarer le timer en une variable globale

// Démarrer le timer quand y'a besoin
function startTimer() {
  let count = 5;
  timer = setInterval(function () {
    document.querySelector(".timer").textContent = count;
    count--;
    if (count < 0) {
      clearInterval(timer);
      $timer.style.display = "none"; // Cacher l'élément timer à 0
      myGameArea.gameOver();
    }
  }, 1000);
}

document.addEventListener("keydown", function (e) {
  if (myGameArea.player.isMeetingTheMaster(myGameArea.master)) {
    //
    $question.innerHTML =
      "Tu as réussit à survivre. Bravo !<br> Voyons voir si tout cela n'a pas été en vain.<br> Appuye sur A si tu es prêt.";
    console.log("welcome");

    if (discussion === 0) {
      discussion = 1;
    } else if (discussion === 1) {
      if (e.key === "a") {
        console.log("q1");
        // $timer.style.display = "block";
        // startTimer();

        let randIndex = Math.floor(Math.random() * questions[level].length);
        $question.innerHTML = questions[level][randIndex].question;

        questions[level][randIndex].answers.forEach((answer) => {
          const button = document.createElement("button");
          button.innerHTML = answer.text;
          button.classList.add("btn-answer");
          $choices.appendChild(button);
          if (answer.correct) {
            button.dataset.correct = answer.correct;
          }
          button.addEventListener("click", (e) => {
            selectedBtn = e.target;
            console.log("selected btn ", selectedBtn);

            if (selectedBtn.dataset.correct) {
              console.log("Bonne réponse");

              $question.innerHTML =
                "Félicitation !<br> Le niveau suivant sera moins aisé.<br> Appuye sur N si tu t'en sens capable.";
              // Clear le timer
              clearInterval(timer);
              $timer.style.display = "none"; // Cacher l'élément timer
              // Vider les réponses
              $choices.innerHTML = "";
            } else {
              console.log("Mauvaise réponse");
              // Clear le timer
              clearInterval(timer);
              $timer.style.display = "none"; // Cacher l'élément timer

              // game over
              myGameArea.gameOver();
            }
          });
        });
      }

      if (e.key === "n") {
        console.log("Next level");
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        level = 1;
        $question.innerHTML = "";
        discussion = 2;

        // redefinir la pos du player
        const playerH = 90;
        const playerRandX = Math.floor(
          Math.random() * (myGameArea.canvas.width / 4)
        );
        const playerRandY = Math.floor(
          Math.random() * (myGameArea.canvas.height - playerH)
        );
        myGameArea.player.x = playerRandX;
        myGameArea.player.y = playerRandY;

        // rajouter un enemi
        myGameArea.nextLevel(3);
        // maj la speed des enemies
        myGameArea.enemies[0].speedX = 4;
        myGameArea.enemies[1].speedX = 4;
        myGameArea.enemies[2].speedX = 4;
        myGameArea.enemies[0].speedY = 4;
        myGameArea.enemies[1].speedY = 4;
        myGameArea.enemies[2].speedY = 4;
      }
      //a
    } else if (discussion === 2) {
      console.log("welcome2");
      $question.innerHTML =
        "Tu as réussit à survivre. Bravo !<br> Voyons voir si tout cela n'a pas été en vain.<br> Appuye sur S si tu es prêt.";
      if (e.key === "s") {
        console.log("q2");
        $timer.style.display = "block";
        startTimer();

        let randIndex = Math.floor(Math.random() * questions[level].length);
        $question.innerHTML = questions[level][randIndex].question;

        questions[level][randIndex].answers.forEach((answer) => {
          const button = document.createElement("button");
          button.innerHTML = answer.text;
          button.classList.add("btn-answer");
          $choices.appendChild(button);
          // Assigner la bonne réponse au bon bouton
          if (answer.correct) {
            button.dataset.correct = answer.correct;
          }
          button.addEventListener("click", (e) => {
            selectedBtn = e.target;
            console.log("selected btn ", selectedBtn);

            // Vérifier si la réponse sélectionnée est la bonne
            if (selectedBtn.dataset.correct) {
              console.log("Bonne réponse");

              $question.innerHTML =
                "Je suis impressioné !<br> Es-tu prêt pour le niveau suivant.<br> Appuye sur O si tu t'en sens capable.";
              // Clear le timer
              clearInterval(timer);
              $timer.style.display = "none"; // Cacher l'élément timer
              // Vider les réponses
              $choices.innerHTML = "";
            } else {
              console.log("Mauvaise réponse");
              // Clear le timer
              clearInterval(timer);
              $timer.style.display = "none"; // Cacher l'élément timer

              // game over
              myGameArea.gameOver();
            }
          });
        });
      }

      if (e.key === "o") {
        console.log("next level2");
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        level = 2;
        $question.innerHTML = "";
        discussion = 3;

        // redefinir la pos du player
        const playerH = 90;
        const playerRandX = Math.floor(
          Math.random() * (myGameArea.canvas.width / 4)
        );
        const playerRandY = Math.floor(
          Math.random() * (myGameArea.canvas.height - playerH)
        );
        myGameArea.player.x = playerRandX;
        myGameArea.player.y = playerRandY;

        // rajouter un enemi
        myGameArea.nextLevel(4);
        // maj la speed des enemies
        myGameArea.enemies[0].speedX = 5;
        myGameArea.enemies[1].speedX = 5;
        myGameArea.enemies[2].speedX = 5;
        myGameArea.enemies[3].speedX = 5;
        myGameArea.enemies[0].speedY = 5;
        myGameArea.enemies[1].speedY = 5;
        myGameArea.enemies[2].speedY = 5;
        myGameArea.enemies[3].speedY = 5;
      }
    } else if (discussion === 3) {
      console.log("welcome3");
      $question.innerHTML =
        "Tu as réussit à survivre. Bravo !<br> Voyons voir si tout cela n'a pas été en vain.<br> Appuye sur D si tu es prêt.";
      if (e.key === "d") {
        console.log("q3");

        $timer.style.display = "block";
        startTimer();

        let randIndex = Math.floor(Math.random() * questions[level].length);
        $question.innerHTML = questions[level][randIndex].question;

        questions[level][randIndex].answers.forEach((answer) => {
          const button = document.createElement("button");
          button.innerHTML = answer.text;
          button.classList.add("btn-answer");
          $choices.appendChild(button);
          // Assigner la bonne réponse au bon bouton
          if (answer.correct) {
            button.dataset.correct = answer.correct;
          }
          button.addEventListener("click", (e) => {
            selectedBtn = e.target;
            console.log("selected btn ", selectedBtn);

            // Vérifier si la réponse sélectionnée est la bonne
            if (selectedBtn.dataset.correct) {
              console.log("Bonne réponse");

              // Clear le timer
              clearInterval(timer);
              $timer.style.display = "none"; // Cacher l'élément timer

              // Winning
              myGameArea.winning();
            } else {
              console.log("Mauvaise réponse");
              // Clear le timer
              clearInterval(timer);
              $timer.style.display = "none"; // Cacher l'élément timer

              // game over
              myGameArea.gameOver();
            }
          });
        });
      }
    }
  }
});

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

function handleKeyDown(event) {
  // console.log("pressing key");

  switch (event.keyCode) {
    case 38: // upArrow
      // console.log("uuup!!!");
      myGameArea.player.speedY = -5;
      break;
    case 40: // downArrow
      // console.log("dooown!");
      myGameArea.player.speedY = 5;
      break;
    case 37: // leftArrow
      // console.log("leeeft!");
      myGameArea.player.speedX = -5;
      break;
    case 39: // rightArrow
      // console.log("riiiight!!");
      myGameArea.player.speedX = 5;
      break;
  }
}

function handleKeyUp(event) {
  myGameArea.player.speedX = 0;
  myGameArea.player.speedY = 0;
}
