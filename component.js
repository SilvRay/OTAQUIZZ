class Component {
  constructor(x, y, imageSrc, className, width, height, isplayer = false) {
    this.isplayer = isplayer;

    this.x = x;
    this.y = y;
    this.img = document.createElement("img");
    this.img.src = imageSrc;
    this.img.className = className;
    this.width = width;
    this.height = height;
    this.speedX = isplayer === true ? 0 : 3;
    this.speedY = isplayer === true ? 0 : 3;
  }
  newPos() {
    this.x += this.speedX;

    // limite la position du player d'aller trop a droite
    if (this.x > myGameArea.canvas.width - this.width) {
      console.log("stooooop à droite !!");
      this.x = myGameArea.canvas.width - 5 - this.width;
    }
    // limite la position du player d'aller trop a gauche
    if (this.x < 0) {
      this.x = 5;
    }

    this.y += this.speedY;

    // limite la position du player d'aller trop en bas
    if (this.y > myGameArea.canvas.height - this.height) {
      this.y = myGameArea.canvas.height - 5 - this.height;
    }
    // limite la position du player d'aller trop en haut
    if (this.y < 0) {
      this.y = 5;
    }
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    // console.log("Player");
  }
  move() {
    this.x += this.speedX;
    // limite la position de l'ennemi d'aller trop a droite
    if (this.x > myGameArea.canvas.width - this.width) {
      this.speedX = -this.speedX;
    }
    // limite la position de l'ennemi d'aller trop a gauche
    if (this.x < 0) {
      this.speedX = -this.speedX;
    }

    this.y += this.speedY;
    // limite la position de l'ennemi d'aller trop en bas
    if (this.y > myGameArea.canvas.height - this.height) {
      this.speedY = -this.speedY;
    }
    // limite la position de l'ennemi d'aller trop en haut
    if (this.y < 0) {
      this.speedY = -this.speedY;
    }
  }
  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.width;
  }
  //
  // METHODE POUR DETECTER SI LES ENNEMIS ONT ATTEINT LE PLAYER
  //
  crashwith(enemy) {
    return !(
      this.left() > enemy.right() ||
      this.right() < enemy.left() ||
      this.top() > enemy.bottom() ||
      this.bottom() < enemy.top()
    );
  }
  avoidTheMaster(master) {
    // enemy.x += enemy.speedX;
    // Empeche l'ennemi de toucher le maitre par la droite
    if (this.x < master.x + master.width) {
      this.speedX = -this.speedX;
    }
    // Empeche l'ennemi de toucher le maitre par la gauche
    if (this.x + this.width > master.x) {
      this.speedX = -this.speedX;
    }

    // enemy.y += enemy.speedY;
    // Empeche l'ennemi de toucher le maitre par le haut
    if (this.y + this.height > master.x) {
      this.speedY = -this.speedY;
    }
    // Empeche l'ennemi de toucher le maitre par le bas
    if (this.y < master.y + master.height) {
      this.speedY = -this.speedY;
    }
  }
}
