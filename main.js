let $intructions = document.querySelector(".instructions");
let $startBtn = document.querySelector(".start-btn");
let $canvas = document.querySelector("canvas");
let ctx = $canvas.getContext("2d");
const $question = document.querySelector(".question");
const $choices = document.querySelector(".choices");
let enemies = [
  "images/monster.png",
  "images/monster2.png",
  "images/monster3.png",
  "images/monster4.png",
];

let discussion = 0;
let level = 0;

let riddle = [
  {
    question1: "A quel village ninja appartient Naruto Uzumaki ?",
    choices1: "1. Konoha 2. Suna 3. Kumo",
    question2:
      "Dans One Piece, comment appelle-t-on les fruits légendaires qui donnent des pouvoirs aux personnages ?",
    choices2:
      "1. Les fruits du diable 2. Les fruits démoniaque 3. Les fruits du démon",
    question3:
      "De quelle île originaire Gon Freecs, le personnage principal de Hunter x Hunter",
    choices3:
      "1. L'île de la méduse 2. L'île de la baleine 3. L'île de de la tortue",
    question4: "Dans l'Attaque des titans, quel Titan Eren possède-t-il ?",
    choices4: "1. Le titan Assaillant 2. Le titan Cuirassé 3. Le titan Bestial",
  },
  {
    question1:
      "Dans My Hero Academia, quel est le pourcentage de la population qui possède des super-pouvoirs ?",
    choices1: "1. 50% 2. 70% 3. 80%",
    question2: "Comment se nomme le sabre d'un Shinigami dans Bleach ?",
    choices2: "1. Zanketo 2. Zanpakuto 3. Zanquino",
    question3:
      "Dans Seven Deadly Sins, quel personnage représente l'Orgueil des Sept Péchés capitaux ?",
    choices3: "1. Meliodas 2. Escanor 3. King",
    question4: "Dans Death Note, qui est Ryuk ?",
    choices4: "1. Un dieu de la mort 2. un ange déchu 3. un esprit vengeur",
  },
  {
    question1: "Quelle est la quête d'Albator",
    choices1: "1. L'honneur 2. La liberté 3. la paix",
    question2:
      "Comment s'appelle le personnage principal de Fullmetal Alchemist qui a sa conscience dans une armure ?",
    choices2: "1. Roy 2. Elric 3. Alphonse",
    question3:
      "Dans Assassination Classroom, quel est le pourcentage de la lune qui est détruit ?",
    choices3: "1. 70% 2. 40% 3. 25%",
    question4: "Dans Kuroko No Basket, quelle est le point fort de Kagami ?",
    choices4: "1. Ses dribbles 2. Sa vitesse 3. Sa détente",
  },
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
      playerW,
      playerH,
      true
    );
    //
    // INSTANCE MASTER
    //
    const masterW = 90;
    const masterH = 90;
    const maxRandXForMaster = w - masterW;
    const masterRandX = Math.floor(
      Math.random() * (maxRandXForMaster - w / 2 + 1) + w / 2
    );
    const masterRandY = Math.floor(Math.random() * (h - masterH));
    this.master = new Component(
      masterRandX,
      masterRandY,
      "images/Game Master.png",
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
      return Math.floor(Math.random() * (w - enemyW + 1) - enemyW);
    }
    function randY() {
      return Math.floor(Math.random() * (h - enemyH + 1) - enemyH);
    }

    this.enemies.push(
      new Component(randX(), randY(), "images/monster.png", enemyW, enemyH)
    );
    this.enemies.push(
      new Component(randX(), randY(), "images/monster2.png", enemyW, enemyH)
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
    imgGameOver.src = "images/GameOver.webp";
    ctx.drawImage(imgGameOver, 400, 100, 400, 400);
    document.body.setAttribute("class", "re-started");
    document.querySelector("h1").innerHTML = "RESTART";
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
  }

  myGameArea.enemies.forEach((enemy) => {
    if (myGameArea.player.crashwith(enemy)) {
      myGameArea.stop();
      console.log("GAME OVER !!");
    }
  });
}

document.addEventListener("keydown", function (e) {
  if (myGameArea.meetTheMaster()) {
    //
    $question.innerHTML =
      "Tu as réussit à survivre. Bravo !<br> Voyons voir si tout cela n'a pas été en vain.<br> Appuye sur A si tu es prêt.";
    console.log("welcome");

    if (discussion === 0) {
      discussion = 1;
    } else if (discussion === 1) {
      if (e.key === "a") {
        myGameArea.timer();
        $question.innerHTML = riddle[`${level}`].question1;
        $choices.innerHTML = riddle[`${level}`].choices1;
        console.log("q1");
      }

      if (e.key === "1") {
        $question.innerHTML =
          "Félicitation !<br> Le niveau suivant sera moins aisé.<br> Appuye sur N si tu t'en sens capable.";
        $choices.innerHTML = "";
        console.log("q1 gagne");
      } else if (e.key === "2" || e.key === "3") {
        // game over
        myGameArea.stop();
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
          return Math.floor(Math.random() * (1200 - enemyW + 1) - enemyW);
        }
        function randY() {
          return Math.floor(Math.random() * (600 - enemyH + 1) - enemyH);
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
        $question.innerHTML = riddle[`${level}`].question1;
        $choices.innerHTML = riddle[`${level}`].choices1;
      }
      if (e.key === "3") {
        $question.innerHTML =
          "Je suis impressioné !<br> Es-tu prêt pour le niveau suivant.<br> Appuye sur O si tu t'en sens capable.";
        $choices.innerHTML = "";
        console.log("q2 gagne");
      } else if (e.key === "1" || e.key === "2") {
        // game over
        myGameArea.stop();
        $question.innerHTML =
          "Je t'avais prévenu.<br> Voilà ce qui arrive lorsqu'on s'emballe...";
        $choices.innerHTML = "";
        level = 0;
        console.log("nope");

        discussion = -99;
      }
      if (e.key === "o") {
        console.log("next level2");
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
          return Math.floor(Math.random() * (1200 - enemyW + 1) - enemyW);
        }
        function randY() {
          return Math.floor(Math.random() * (600 - enemyH + 1) - enemyH);
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
        $question.innerHTML = riddle[`${level}`].question3;
        $choices.innerHTML = riddle[`${level}`].choices3;
      }
      if (e.key === "1") {
        $question.innerHTML =
          "Tu es digne d'être mon successeur. Te voilà désormais maitre à ton tour";
        $choices.innerHTML = "";
        console.log("q3 gagne");
      } else if (e.key === "2" || e.key === "3") {
        // game over
        myGameArea.stop();
        $question.innerHTML = "Tu n'es pas encore prêt.";
        $choices.innerHTML = "";
        level = 0;
        console.log("nope");

        discussion = -99;
      }
    }
  }
});

document.addEventListener("keydown", (event) => {
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
});

document.addEventListener("keyup", (event) => {
  myGameArea.player.speedX = 0;
  myGameArea.player.speedY = 0;
});
