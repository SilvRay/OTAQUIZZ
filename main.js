let $intructions = document.querySelector(".instructions");
let $startBtn = document.querySelector(".start-btn");
let $canvas = document.querySelector("canvas");
// Création d'un objet context comportant de multiple méthodes pour pouvoir dessiner dans la balise canvas
let ctx = $canvas.getContext("2d");
const $question = document.querySelector(".question");
const $choices = document.querySelector(".choices");
const $timer = document.querySelector(".timer");
let count = 5;
let enemies = [
  "images/monster.png",
  "images/monster2.png",
  "images/monster3.png",
  "images/monster4.png",
];
let enemyRushActive = false;

let discussion = 0;
let level = 0;

let riddle = [
  [
    "A quel village ninja appartient Naruto Uzumaki ?",

    "Dans One Piece, comment appelle-t-on les fruits légendaires qui donnent des pouvoirs aux personnages ?",

    "De quelle île originaire Gon Freecs, le personnage principal de Hunter x Hunter ?",
    "Dans l'Attaque des titans, quel Titan Eren possède-t-il ?",
  ],
  [
    "Dans My Hero Academia, quel est le pourcentage de la population qui possède des super-pouvoirs ?",
    "Comment se nomme le sabre d'un Shinigami dans Bleach ?",

    "Dans Seven Deadly Sins, quel personnage représente l'Orgueil des Sept Péchés capitaux ?",
    "Dans Death Note, qui est Ryuk ?",
  ],
  [
    "Quelle est la quête d'Albator",
    "Comment s'appelle le personnage principal de Fullmetal Alchemist qui a sa conscience dans une armure ?",
    "Dans Assassination Classroom, quel est le pourcentage de la lune qui est détruit ?",
    "Dans Kuroko No Basket, quelle est le point fort de Kagami ?",
  ],
];
let answers = [
  [
    "1. Konoha 2. Suna 3. Kumo",

    "1. Les fruits du diable 2. Les fruits démoniaque 3. Les fruits du démon",

    "1. L'île de la méduse 2. L'île de la baleine 3. L'île de de la tortue",
    "1. Le titan Assaillant 2. Le titan Cuirassé 3. Le titan Bestial",
  ],
  [
    "1. 50% 2. 70% 3. 80%",
    "1. Zanketo 2. Zanpakuto 3. Zanquino",
    "1. Meliodas 2. Escanor 3. King",
    "1. Un dieu de la mort 2. un ange déchu 3. un esprit vengeur",
  ],
  [
    "1. L'honneur 2. La liberté 3. la paix",
    "1. Roy 2. Elric 3. Alphonse",
    "1. 70% 2. 40% 3. 25%",
    "1. Ses dribbles 2. Sa vitesse 3. Sa détente",
  ],
];

document.querySelector("h1").onclick = () => {
  console.log("Let's go !");
  myGameArea.start();
  myGameArea.clear();
  $question.innerHTML = "";
};

const myGameArea = {
  canvas: $canvas,
  level: 0,
  start: function () {
    const w = 1200;
    const h = 600;
    this.canvas.width = w;
    this.canvas.height = h;
    this.interval = setInterval(updateGameArea, 16);

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
    // Ajouter les écouteurs d'événements pour les touches de déplacement
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

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

    function randX() {
      return Math.floor(Math.random() * (1111 - 600) + 600);
    }
    function randY() {
      return Math.floor(Math.random() * (h - enemyH + 1));
    }

    this.enemies.push(
      new Component(
        randX(),
        randY(),
        "images/monster.png",
        "enemy",
        enemyW,
        enemyH
      )
    );
    this.enemies.push(
      new Component(
        randX(),
        randY(),
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
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    document.body.setAttribute("class", "started level");
    document.querySelector("span").innerHTML = `Niveau ${level}`;
  },
  stop: function () {
    clearInterval(myGameArea.interval);
    const imgGameOver = new Image();
    imgGameOver.src = "./images/GameOver.webp";
    ctx.drawImage(imgGameOver, 400, 100, 400, 400);
    document.body.setAttribute("class", "re-started");
    document.querySelector("h1").innerHTML = "RESTART";
    level = 0;
    discussion = 0;
  },
  //
  // METHODE POUR DETECTER LA RENCONTRE EN LE PLAYER ET LE MAITRE
  //
  meetTheMaster: function () {
    return !(
      this.player.left() > this.master.right() ||
      this.player.right() < this.master.left() ||
      this.player.top() > this.master.bottom() ||
      this.player.bottom() < this.master.top()
    );
  },
  //
  // METHODE POUR PASSER AU NIVEAU SUIVANT
  //
  nextLevel: function () {
    console.log("Tu as bien répondu !");
    this.enemies.push(
      new Component(randX(), randY(), "images/monster3.png", enemyW, enemyH)
    );
    myGameArea.clear();
  },
  //
  // METHODE POUR LE TIMER
  //
};

//
// FONCTION POUR LA DISPARITION DU MAÎTRE
//
const masterDisparition = () => {
  console.log("DISPARITION DU MAITRE !");

  gsap.fromTo(".master", { opacity: 1 }, { opacity: 0, duration: 1, delay: 1 });
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
    // Empeche l'ennemi de toucher le maitre par la droite
    if (
      enemy.x + enemy.width > myGameArea.master.x &&
      enemy.x < myGameArea.master.x + myGameArea.master.width &&
      enemy.y + enemy.height > myGameArea.master.y &&
      enemy.y < myGameArea.master.y + myGameArea.master.height
    ) {
      // console.log("DO NOT TOUCH THE MASTER !", myGameArea.master);

      enemy.speedX = -enemy.speedX;
      enemy.speedY = -enemy.speedY;
    }
  });

  myGameArea.enemies.forEach((enemy) => {
    if (myGameArea.player.crashwith(enemy)) {
      myGameArea.stop();
      enemyRushActive = false;
      // console.log("GAME OVER !!");
    }
    enemy.move();
    enemy.draw();
  });

  if (myGameArea.meetTheMaster()) {
    // console.log("enemies=", myGameArea.enemies);
    myGameArea.player.speedX = 0;
    myGameArea.player.speedY = 0;

    for (let enemy of myGameArea.enemies) {
      enemy.speedX = 0;
      enemy.speedY = 0;
    }

    // Supprimer les écouteurs d'événements pour empêcher les mouvements du personnage
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
  } else {
    // Mouvement normal du perso quand le joueur n'a pas encore rencontré le maître du jeu
    myGameArea.player.newPos();
  }

  if (enemyRushActive) {
    startEnemyRush();
  }
}

//
// Fonction pour mettre en place la vitesse des ennemis afin qu'il se ruent sur le joueur
//
function startEnemyRush() {
  enemyRushActive = true;

  myGameArea.player.speedX = 0;
  myGameArea.player.speedY = 0;

  myGameArea.enemies.forEach((enemy) => {
    enemy.speedX = enemy.x > myGameArea.player.x ? -2 : 2; // Se ruer vers le joueur
    enemy.speedY = enemy.y > myGameArea.player.y ? -2 : 2;
    enemy.move();
  });
}

let timer; // Déclarer le timer en une variable globale

// Démarrer le timer quand y'a besoin
function startTimer() {
  count = 5;
  timer = setInterval(function () {
    document.querySelector(".timer").textContent = count;
    count--;
    if (count === 0) {
      clearInterval(timer);
      startEnemyRush();
      $timer.style.display = "none"; // Cacher l'élément timer à 0
    }
  }, 1000);
}

document.addEventListener("keydown", function (e) {
  if (myGameArea.meetTheMaster()) {
    //
    $question.innerHTML =
      "Tu as réussit à survivre. Bravo !<br> Voyons voir si tout cela n'a pas été en vain.<br> Appuye sur A si tu es prêt.";
    console.log("welcome");

    // variable qui permet de choisir une question et ses réponses au hasard
    let randRiddle = Math.floor(Math.random() * riddle[`${level}`].length);

    if (discussion === 0) {
      discussion = 1;
    } else if (discussion === 1) {
      if (e.key === "a") {
        $question.innerHTML = riddle[`${level}`][1];
        $choices.innerHTML = answers[`${level}`][1];

        $timer.style.display = "block";
        startTimer();
        console.log("q1");
      }

      if (e.key === "3") {
        $question.innerHTML =
          "Félicitation !<br> Le niveau suivant sera moins aisé.<br> Appuye sur N si tu t'en sens capable.";
        // Clear le timer
        clearInterval(timer);
        $timer.style.display = "none"; // Cacher l'élément timer

        $choices.innerHTML = "";
        console.log("q1 gagne");
      } else if (e.key === "1" || e.key === "2") {
        // Clear le timer
        clearInterval(timer);
        $timer.style.display = "none"; // Cacher l'élément timer

        // game over
        masterDisparition();
        startEnemyRush();
        $question.innerHTML =
          "Tu as échoué.<br> Voilà ce qui arrive lorsqu'on s'emballe...";
        $choices.innerHTML = "";
        console.log("nope");

        discussion = -99;

        // afficher un msg de fail
        // add class restarted
      }

      if (e.key === "n") {
        console.log("next level");
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        level = 1;
        $question.innerHTML = "";
        discussion = 2;

        // redefinir la pos du player
        const playerW = 60;
        const playerH = 90;
        const playerRandX = Math.floor(
          Math.random() * (myGameArea.canvas.width / 4)
        );
        const playerRandY = Math.floor(
          Math.random() * (myGameArea.canvas.height - playerH)
        );
        myGameArea.player.x = playerRandX;
        myGameArea.player.y = playerRandY;

        // maj la speed des enemies
        myGameArea.enemies[0].speedX = 4;
        myGameArea.enemies[1].speedX = 4;
        myGameArea.enemies[0].speedY = 4;
        myGameArea.enemies[1].speedY = 4;
        // maj la pos des enemies
        const enemyW = 90;
        const enemyH = 80;

        function randX() {
          return Math.floor(Math.random() * (1111 - 600) + 600);
        }
        function randY() {
          return Math.floor(Math.random() * (600 - enemyH + 1));
        }
        myGameArea.enemies[0].x = randX();
        myGameArea.enemies[1].x = randX();
        myGameArea.enemies[0].y = randY();
        myGameArea.enemies[1].y = randY();

        // rajouter un enemi
        myGameArea.enemies.push(
          new Component(randX(), randY(), "images/monster3.png", enemyW, enemyH)
        );
        myGameArea.enemies[2].x = randX();
        myGameArea.enemies[2].y = randY();

        myGameArea.enemies[2].speedX = 4;
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
        $question.innerHTML = riddle[`${level}`][0];
        $choices.innerHTML = answers[`${level}`][0];
      }
      if (e.key === "3") {
        // Clear le timer
        clearInterval(timer);
        $timer.style.display = "none"; // Cacher l'élément timer

        $question.innerHTML =
          "Je suis impressioné !<br> Es-tu prêt pour le niveau suivant.<br> Appuye sur O si tu t'en sens capable.";
        $choices.innerHTML = "";
        console.log("q2 gagne");
      } else if (e.key === "1" || e.key === "2") {
        // game over
        masterDisparition();
        startEnemyRush();

        $question.innerHTML =
          "Je t'avais prévenu.<br> Voilà ce qui arrive lorsqu'on s'emballe...";
        $choices.innerHTML = "";
        level = 0;
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        console.log("nope");

        discussion = -99;
      }
      if (e.key === "o") {
        console.log("next level2");
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        level = 2;
        $question.innerHTML = "";
        discussion = 3;

        // redefinir la pos du player
        const playerW = 60;
        const playerH = 90;
        const playerRandX = Math.floor(
          Math.random() * (myGameArea.canvas.width / 4)
        );
        const playerRandY = Math.floor(
          Math.random() * (myGameArea.canvas.height - playerH)
        );
        myGameArea.player.x = playerRandX;
        myGameArea.player.y = playerRandY;

        // maj la speed des enemies
        myGameArea.enemies[0].speedX = 5;
        myGameArea.enemies[1].speedX = 5;
        myGameArea.enemies[2].speedX = 5;
        myGameArea.enemies[0].speedY = 5;
        myGameArea.enemies[1].speedY = 5;
        myGameArea.enemies[2].speedY = 5;

        // maj la pos des enemies
        const enemyW = 90;
        const enemyH = 80;

        function randX() {
          return Math.floor(Math.random() * (1111 - 600) + 600);
        }
        function randY() {
          return Math.floor(Math.random() * (600 - enemyH + 1));
        }
        myGameArea.enemies[0].x = randX();
        myGameArea.enemies[1].x = randX();
        myGameArea.enemies[2].x = randX();
        myGameArea.enemies[0].y = randY();
        myGameArea.enemies[1].y = randY();
        myGameArea.enemies[2].y = randY();

        // rajouter un enemi
        myGameArea.enemies.push(
          new Component(randX(), randY(), "images/monster4.png", enemyW, enemyH)
        );
        myGameArea.enemies[3].x = randX();
        myGameArea.enemies[3].y = randY();

        myGameArea.enemies[3].speedX = 5;
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

        $question.innerHTML = riddle[`${level}`][2];
        $choices.innerHTML = answers[`${level}`][2];
      }
      if (e.key === "1") {
        // Clear le timer
        clearInterval(timer);
        $timer.style.display = "none"; // Cacher l'élément timer

        $question.innerHTML =
          "Tu es digne d'être mon successeur. Te voilà désormais maitre à ton tour";
        $choices.innerHTML = "";
        console.log("q3 gagne");
      } else if (e.key === "2" || e.key === "3") {
        // Clear le timer
        clearInterval(timer);
        $timer.style.display = "none"; // Cacher l'élément timer

        // game over
        startEnemyRush();

        $question.innerHTML = "Tu n'es pas encore prêt.";
        $choices.innerHTML = "";
        level = 0;
        console.log("nope");

        discussion = -99;
      }
    }
  }
});

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

function handleKeyDown(event) {
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
