$(function () {
    //$('canvas').width($(window).width());
    //$('canvas').height($(window).height());
    init();
});

function cunt() {
    console.log("halo");
}

var stage, ship, w, h, loader,
    KEYCODE_W = 87,
    KEYCODE_A = 65,
    KEYCODE_D = 68,
    KEYCODE_SPACE = 32,
    movespeed = 50,
    wdown = false,
    adown = false,
    ddown = false,
    spacedown = false,
    difficulty = 100,
    counter = 0,
    rocksContainer = new createjs.Container(),
    singleRock = new createjs.Shape(),
    bullets = new createjs.Container(),
    singleBullet = new createjs.Shape(),
    timer = null,
    score = new createjs.Text('0', '14px Arial', '#000000'),
    gameoverText = new createjs.Text('Game Over', '30px Arial', '#000000');


$(document).keydown(function (e) {
    keydowncontroller(e);
    spaceFire();
});

$(document).keyup(function (e) {
    keyupcontroller(e);
});

function init() {
    var canvas = document.getElementById('grid');
    stage = new createjs.Stage(canvas);
    w = stage.canvas.width;
    h = stage.canvas.height;

    bullets.name = "bullet container";
    rocksContainer.name = "rock container";

    $(window).ready(function () {
        handleComplete();
    });
}

function handleComplete() {
    var spriteSheet = new createjs.SpriteSheet({
        framerate: 30,
        "images": ["img/sprite_ship.png"],
        "frames": {width: 30, height: 30, count: 2, regX: 10, regY: 10, spacing: 0, margin: 0},
        "animations": {
            "move": [0]
        }
    });

    ship = new createjs.Sprite(spriteSheet, "move");
    var shipHeight = ship.spriteSheet._frameHeight;
    var shipWidth = ship.spriteSheet._frameWidth;
    ship.y = w - shipHeight;
    ship.x = h / 2 - shipWidth / 2;

    score.maxWidth = 1000;
    score.x = 10;
    score.x = w / 2;

    stage.addChild(ship, bullets, rocksContainer, score);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
    var deltaS = event.delta / 1000;
    if (!createjs.Ticker.getPaused()) {
        //var position = ship.x + 150 * deltaS;
        //var shipW = ship.getBounds().width * ship.scaleX;

        //ship.x = (position >= w + shipW) ? -shipW : position;
        if (adown) {
            if(ship.x >= 30) {
                ship.x -= movespeed;
            }
            adown = false;
        }

        if (ddown) {
            if(ship.x <= 470) {
                ship.x += movespeed;
            }
            ddown = false;
        }

        if (spacedown) {
            firebullet();
            spacedown = false;
        }

        if (counter >= difficulty) {
            genrocks();
            counter = 0;
        }
        counter++;

        for (var j = 0; j < bullets.children.length; j++) {
            bullets.children[j].y -= 10;

            if (bullets.children[j].y < -20) {
                bullets.removeChildAt(j);
            }
        }

        for (var i = 0; i < rocksContainer.children.length; i++) {
            rocksContainer.children[i].y += 1;
            if (rocksContainer.children[i].y > h) {
                rocksContainer.removeChildAt(i);
                score.text = parseFloat(score.text - 10);
            }

            for (var k = 0; k < bullets.children.length; k++) {
                if ((bullets.children[k].x < rocksContainer.children[i].x + 20) && (bullets.children[k].x + 15 > rocksContainer.children[i].x) && (bullets.children[k].y < rocksContainer.children[i].y + 20) && (15 + bullets.children[k].y > rocksContainer.children[i].y)) {
                    bullets.removeChildAt(k);
                    rocksContainer.removeChildAt(i);
                    score.text = parseFloat(score.text + 10);

                    if (score.text % 50 == 0) {
                        if (difficulty == 10) {
                            difficulty = 10;
                        } else {
                            difficulty -= 10;
                        }
                    }

                    stage.update();
                }
            }

            if ((rocksContainer.children[i].x < ship.x + 30) && (rocksContainer.children[i].x + 20 > ship.x) && (rocksContainer.children[i].y < ship.y + 30) && (20 + rocksContainer.children[i].y > ship.y)) {
                gameoverText.x = 0;
                gameoverText.y = 400;
                stage.addChild(gameoverText);
                togglePause();
            }
        }

        stage.update(event);
    }
}

function togglePause() {
    createjs.Ticker.setPaused(true);
}

function firebullet() {
    singleBullet = new createjs.Shape();
    singleBullet.graphics.beginFill("#cc0000").drawRect(0, 0, 15, 15);
    singleBullet.x = ship.x;
    singleBullet.y = ship.y;
    singleBullet.name = "bullet";
    bullets.addChild(singleBullet);
    stage.update();
}


function genrocks() {
    var randX = Math.floor((Math.random() * 500) + 1);
    var randY = Math.floor((Math.random() * 300) + 1);
    singleRock = new createjs.Shape();
    singleRock.graphics.beginFill("#000000").drawRect(0, 0, 20, 20);
    singleRock.x = randX;
    singleRock.y = randY;
    singleRock.name = "rock";
    rocksContainer.addChild(singleRock);
    stage.update();
}


function keydowncontroller(e) {
    switch (e.keyCode) {
        case KEYCODE_W:
            wdown = true;
            break;
        case KEYCODE_A:
            adown = true;
            break;
        case KEYCODE_D:
            ddown = true;
            break;
    }
}

function spaceFire() {
    spacedown = true;
}

function left() {
    adown = true;
}

function right() {
    ddown = true;
}

function keyupcontroller(e) {
    switch (e.keyCode) {
        case KEYCODE_W:
            wdown = false;
            break;
        case KEYCODE_A:
            adown = false;
            break;
        case KEYCODE_D:
            ddown = false;
            break;
    }
}
