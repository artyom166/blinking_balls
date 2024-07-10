const button = document.getElementById("click");
const hint = document.getElementById("hint");
const restart = document.getElementById("restart")

const cs = {
    canvas: null,
    ctx: null
};
const game = {
    balls: [],
    blinks: [],
    flag: true,
    countballs: +prompt("Enter Balss number", 5),
    score: 0,
    life: 3,
    showHint: 3,




};

function setupCanvas() {
    cs.canvas = document.createElement("canvas");
    document.body.appendChild(cs.canvas);
    cs.canvas.width = window.innerWidth;
    cs.canvas.height = window.innerHeight;
    cs.ctx = cs.canvas.getContext("2d");
}

function createBalls() {
    // for (let i = 0; i < numBalls; i++) {
    let r = 25
    let x, y;
    do {
        x = getRandInt(r, cs.canvas.width - r);
        y = getRandInt(r, cs.canvas.height - r);
    } while (isOverLapping(x, y))

    let color = getRandomColor();
    let ball = new Ball(x, y, r, color.join(","), game.balls.length + 1);
    game.balls.push(ball);
    // }
}

function draw() {

    if (game.balls.length < game.countballs) {
        createBalls()
    } else if (game.flag) {
        blinkcount()
        game.flag = false
    }
    cs.ctx.clearRect(0, 0, cs.canvas.width, cs.canvas.height);
    game.balls.forEach(function (ball) {
        cs.ctx.beginPath();
        cs.ctx.fillStyle = ball.color
        cs.ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
        cs.ctx.fillStyle = ball.color;
        cs.ctx.fill();
        cs.ctx.textAlign = "center"
        cs.ctx.fillStyle = "black"
        cs.ctx.font = "30px serif"
        cs.ctx.fillText(ball.index, ball.x, ball.y + 6)
        cs.ctx.fillText(`score: ${game.score}`, cs.canvas.width / 2, 20)
        cs.ctx.fillText(`Hint: ${game.showHint}`, cs.canvas.width / 2, 100)
    });
}

function blinkcount() {
    let count = 1
    let id = setInterval(() => {

        if (count >= 3) {
            clearInterval(id)
        }
        count++
        bliking()
    }, 500);

}
function bliking() {
    let count = 1
    for (let i = 0; i < count; i++) {
        let index = getRandInt(0, game.balls.length - 1)
        // console.log(index);
        if (game.blinks.indexOf(game.balls[index]) < 0) {
            game.blinks.push(game.balls[index])
            game.balls[index].blink("white")
        }
        else {
            count++
        }

    }
}


function getRandomColor() {
    let r = getRandInt(0, 255);
    let g = getRandInt(0, 255);
    let b = getRandInt(0, 255);
    return [r, g, b];
}

function getRandInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}


button.addEventListener("click", function () {
    if (game.countballs < 3) {
        game.countballs = 3;
    }
    setupCanvas();
    loop();
    button.disabled = true;
    button.style.display = "none";
});









function isOverLapping(x, y) {
    return game.balls.some(function (ball) {
        const dx = x - ball.x
        const dy = y - ball.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance <= ball.r * 2
    })
}




document.body.addEventListener("click", checkBall)
function checkBall(evt) {

    const rect = cs.canvas.getBoundingClientRect()

    const mouseX = evt.clientX - rect.x
    const mouseY = evt.clientY - rect.y
    game.balls.forEach(function (ball) {
        const dx = mouseX - ball.x
        const dy = mouseY - ball.y
        if (dx * dx + dy * dy <= ball.r * ball.r) {

            if (game.blinks.indexOf(ball) === 0) {
                ball.blink("green")
                game.blinks.shift()

                var audio1 = new Audio('true.mp3');
                audio1.oncanplaythrough = function () {

                    audio1.play();
                };
            } else {
                ball.blink("red")
                game.life--;
                if (game.life <= 0) {
                    gameOver()
                }
            }
            if (game.blinks.length === 0) {
                game.countballs += 2;
                game.score++;
                game.flag = true;

                scorefinal = game.score

            }



        }



    })




}
function gameOver() {
    cs.ctx.clearRect(0, 0, cs.canvas.width, cs.canvas.height);
    game.balls.splice(0, game.balls.length);
    game.blinks.splice(0, game.blinks.length);
    
    game.countballs = 5;
    game.life = 3;
    game.flag = true;
    cancelAnimationFrame(game.loopId);
    cs.ctx.textAlign = "center";
    cs.ctx.fillStyle = "red";
    cs.ctx.font = "100px serif";
    cs.ctx.fillText(`G A M E   O V E R `, cs.canvas.width / 2, cs.canvas.height / 2 + 200);
    cs.ctx.fillText(`Your Score: ${game.score}`, cs.canvas.width / 2, cs.canvas.height / 2);
    var audio = new Audio('gameover.mp3');
    audio.oncanplaythrough = function () {
        audio.play();
    };
    restart.style.display = "block"
    game.score = 0;
    restart.disabled = false;

}
restart.addEventListener("click", function () {
    restartGame();
    restart.disabled = true;

});


function restartGame() {

    game.balls.splice(0, game.balls.length);
    game.blinks.splice(0, game.blinks.length);


    game.score = 0;
    game.countballs = +prompt("Enter Balls number", 5);
    game.life = 3;
    game.flag = true;
    game.showHint = 3;


    cs.ctx.clearRect(0, 0, cs.canvas.width, cs.canvas.height);
    restart.style.display = "none";
    hint.style.display = "block";
    // button.style.display = "block";
    button.disabled = false;

    // setupCanvas();
    loop();
}

hint.addEventListener("click", function () {
    showHint();
    game.showHint--
    if (game.showHint <= 0) {
        gameOver()
        hint.disabled = true;
    }
});

function showHint() {
    game.blinks.forEach(function (ball) {
        ball.blink("yellow");

    });
}
function loop() {
    game.loopId = requestAnimationFrame(loop);
    draw();
}
// loop();
