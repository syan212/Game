//Declaring Global Variables    
/*
TO DO LIST
DUCKIN AND PTERYDACTYLS
MORE CACTI
*/
var canvas_height, canvas_width;
var obstacles = [];
var cacti = [];
var cacti_hitbox = {top: 3, bottom: 1, left: 1, right: 1};
var trex_hitbox = {top: 0, bottom: 0, left: 1, right: 2};
var Trex_walk1_img, Trex_walk2_img, Trex_dead_img, Trex_img;
var collision_sound;
//Start Game
function startGame() {
    //Canvas width and height
    canvas_width = 0.95 * screen.availWidth;
    canvas_height = 0.79 * screen.availHeight;
    //Hide menu
    var menu = document.getElementById("menu");
    menu.style.display = "none";
    console.log('Menu has been hidden');
    //Background Music
    bg_music = new sound("bg_music.mp3");
    collision_sound = new sound("collision.mp3")
    bg_music.play();
    console.log('Background music is playing');
    //Sprite creation
    GameArea.start();
    Trex_img = document.getElementById("t-rex");
    Trex_walk1_img = document.getElementById("t-rex-walk1");
    Trex_walk2_img = document.getElementById("t-rex-walk2");
    Trex_dead_img = document.getElementById("t-rex-dead");
    let B_cactus1_img = document.getElementById("big-cactus-1");
    let B_cactus2_img = document.getElementById("big-cactus-2");
    let B_cactus3_img = document.getElementById("big-cactus-3");
    let B_cactus4_img = document.getElementById("big-cactus-4");
    console.log('Images have been loaded')
    cacti = [B_cactus1_img, B_cactus2_img, B_cactus3_img, B_cactus4_img]
    Trex_sprite = new img(100, 100, Trex_img, 50, GameArea.canvas.height - 100, trex_hitbox)
    Score = new text("20px", "Helvetica", "black", c_width(0.85), c_height(0.05))
    console.log('Game has been started')
}
//Canvas
var GameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 0.95 * screen.availWidth;
    this.canvas.height = 0.79 * screen.availHeight;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
    this.frameNo = 0;
    //Event Listeners for movement
    window.addEventListener('keydown', function (e) {
        if (e.code === "Space" || e.code === "ArrowUp") {
            if (Trex_sprite.onGround()) {
                Trex_sprite.speedY = -7; // Jump strength
            }
            e.preventDefault(); // Prevent scrolling
        }
    })
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
    clearInterval(this.interval);
  }
}
//Image Function
function img(width, height, img, x, y, hitbox) {
    this.width = width;
    this.height = height;
    this.image = img;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.gravity = 0.15;
    this.gravitySpeed = 0;
    //Hitbox Padding
    this.left = hitbox.left;
    this.right = hitbox.right;
    this.top = hitbox.top;
    this.bottom = hitbox.bottom;
    this.update = function() {
        let ctx = GameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    this.move = function() {
        this.y += this.speedY + this.gravitySpeed;     
        this.gravitySpeed += this.gravity;   
        this.hitBottom();
    }
    this.onGround = function () {
        return this.y >= GameArea.canvas.height - this.height;
    }
    this.hitBottom = function() {
        var rockbottom = GameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
          this.y = rockbottom;
          this.gravitySpeed = 0;
          this.speedY = 0;
        }
    }
    this.crashWith = function (otherobj) {
        var myleft = this.x + this.left;
        var myright = this.x + this.width - this.right;
        var mytop = this.y + this.top;
        var mybottom = this.y + this.height - this.bottom;
        var otherleft = otherobj.x + (otherobj.left || 0);
        var otherright = otherobj.x + otherobj.width - (otherobj.right || 0);
        var othertop = otherobj.y + (otherobj.top || 0);
        var otherbottom = otherobj.y + otherobj.height - (otherobj.bottom || 0);

        return !(mybottom < othertop || mytop > otherbottom || myright < otherleft || myleft > otherright);
    }
}
//Text Function
function text(size, font, color, x, y) {
    this.size = size;
    this.font = font; 
    this.color = color; 
    this.x = x;
    this.y = y;    
    this.update = function() {
        let ctx = GameArea.context;
        ctx.font = this.size + " " + this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
    }
}
//Sound Function
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}
//Update
function updateGameArea() {
    //Checking Crash
    for (let i = 0; i < obstacles.length; i++){
        if (Trex_sprite.crashWith(obstacles[i])){
            bg_music.stop();
            collision_sound.play();
            Trex_sprite.image = Trex_dead_img;
            Trex_sprite.update();
            console.log('Game has been stopped')
            GameArea.stop();
            return;
        }
    }
    GameArea.frameNo += 1;
    GameArea.clear();
    //Background Music
    if (isinterval(125)){
        bg_music.play();
    }
    Trex_sprite.move();
    //Trex animation
    if (GameArea.frameNo === 1){
        Trex_sprite.image = Trex_walk1_img;
    } else if (GameArea.frameNo % 10 === 0 && Trex_sprite.onGround()) {
        if (Trex_sprite.image === Trex_walk2_img) {
            Trex_sprite.image = Trex_walk1_img;
        } else {
            Trex_sprite.image = Trex_walk2_img;
        }
    } else if (!Trex_sprite.onGround()){
        Trex_sprite.image = Trex_img;
    }
    Trex_sprite.update();
    //Cactus Spawning
    if (GameArea.frameNo == 1 || isinterval(180)){
        obstacles.push(new img(50, 100, cacti[Math.floor(Math.random() * cacti.length)], canvas_width - (Math.floor(Math.random() * 150) + 125), canvas_height - 100, cacti_hitbox))
        console.log('Cacti '+ obstacles.length + ' has been spawned at ' + 
            obstacles[obstacles.length - 1].x + ' with image ' + 
            cacti.indexOf(obstacles[obstacles.length - 1].image)
        )
        //Big cactus 4 has slightly different hitbox
        if (obstacles[obstacles.length - 1].image === cacti[3]){
            obstacles[obstacles.length - 1].bottom = 0;
            obstacles[obstacles.length - 1].top = 1;
        }
    } 
    //Cactus Moving
    for (let i = 0; i < obstacles.length; i++){
        obstacles[i].x -= 5;
        obstacles[i].update();
    }
    //Score Update
    Score.text = "Score: " + GameArea.frameNo;
    Score.update();
}
//Is Interval
function isinterval(n) {
    if ((GameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
//Canvas width and height function
//Calculates the input multipled by the canvas width or height
function c_width(x){
    return canvas_width * x;
}
function c_height(x){
    return canvas_height * x;
}