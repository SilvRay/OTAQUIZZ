// class Enemy {
//   constructor(x, y, imageSrc, width, height) {
//     this.x = x;
//     this.y = y;
//     this.img = document.createElement("img");
//     this.img.src = imageSrc;
//     this.width = width;
//     this.height = height;

//     const sensArr = [-3, 3];
//     this.sens = {};
//     this.sens.x = sensArr[Math.floor(Math.random() * sensArr.length)];
//     this.sens.y = sensArr[Math.floor(Math.random() * sensArr.length)];
//   }
//   draw() {
//     ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
//   }

// move() {
//   this.x += this.sens.x;
//   // limite la position du player d'aller trop a droite
//   if (this.x > myGameArea.canvas.width - this.width) {
//     this.sens.x -= 3;
//   }
//   // limite la position du player d'aller trop a gauche
//   if (this.x < 0) {
//     this.sens.x += 3;
//   }

//   this.y += this.sens.y;
//   // limite la position du player d'aller trop en bas
//   if (this.y > myGameArea.canvas.height - this.height) {
//     this.sens.y -= 3;
//   }
//   // limite la position du player d'aller trop en haut
//   if (this.y < 0) {
//     this.sens.y += 3;
//   }
// }
// }
