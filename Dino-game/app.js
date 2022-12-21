var gameElem = document.querySelector('#game')
var RootElem = document.querySelector(':root')
var DinoElem = gameElem.querySelector('.dino')
var ScoreElem = gameElem.querySelector('.score')
var GroundElem = gameElem.querySelector('.ground')
var CactusElem = GroundElem.querySelector('.cactus')

var gameSpeed = 3000; /* in ms */
var jumpSpeed = (gameSpeed/10)*2; /* in ms */
var maxJump = 250; /* in percent */
var speedScale = 1;

var Score=0
var GameStarted=false
var GameOver=false
var SelfPlayMode= false
var jumping=false

function updateGame(){
    setCustomProperty(RootElem,'--game-speed',gameSpeed)
    setCustomProperty(RootElem,'--jump-speed', jumpSpeed)
    setCustomProperty(RootElem,'--max-jump', maxJump)
    setCustomProperty(RootElem,'--speed-scale', speedScale)
    if (SelfPlayMode === true){
        if (shouldJump() === true){
            handleJump({code:'ArrowUp'})
        }
    }



    updateScore()
    updateCactus()
    if (checkGameOver()===true){
        endGame();
        return
    }
    else{
        window.requestAnimationFrame(updateGame)
    }
    
}

//RootElem, "--game-speed", GameSpeed (main logic)
function setCustomProperty(Elem,prop,value){
   Elem.style.setProperty(prop,value)
}

function isCollision(dinoRect, cactusRect) {  
    return (
            dinoRect.x < cactusRect.x + cactusRect.width &&
            dinoRect.x + dinoRect.width > cactusRect.x &&
            dinoRect.y < cactusRect.y + cactusRect.height &&
             dinoRect.y + dinoRect.height > cactusRect.y
     );
}

function checkGameOver(){
    var dinoRect=DinoElem.getBoundingClientRect();
    var cactusRect=CactusElem.getBoundingClientRect()
    if (GameOver) 
    {
        return true
    }
    
    else if (isCollision(dinoRect,cactusRect)){
        return true;
    }
    else{
        return false
    }
}


function handleJump(e){
    var audio=document.querySelector('.audio-jump') 
    if (e.code!=='ArrowUp'){
        return;
    }
    else{
        audio.play()
        DinoElem.classList.add('jump')
        jumping=true
        DinoElem.addEventListener('animationend',function(){
            jumping=false
            DinoElem.classList.remove('jump')
        })
    }
}

function shouldJump(){
    var minGap=210
    var cactusXPos=CactusElem.getBoundingClientRect().x
    if (cactusXPos<=0|| jumping ){
        return false
    }
    if (cactusXPos<minGap){
        return true
    }
    else{
        return false
    }
}

function startGame(){
    GameStarted=true
    gameElem.classList.add('game-started')
    document.addEventListener("keydown",handleJump)
    window.requestAnimationFrame(updateGame)
}

function endGame(){
    var audio=document.querySelector('.audio-die') 
    audio.play()
    GameOver=true;
    gameElem.classList.add('game-over')
    document.removeEventListener("keydown",handleJump)
}


    var scoreInterval = 10
    var currentScoreInterval = 0
function updateScore(){
    currentScoreInterval += 1
    if (currentScoreInterval % scoreInterval !== 0)
    {
       return
    }
    else{
        Score=Score+1
    }
    if (Score === 0) return
    if (Score%100 === 0){
        var audio=document.querySelector('.audio-point') 
        audio.play()
        gameSpeed=gameSpeed-speedScale
        jumpSpeed = (gameSpeed/10)*2
    }
    var currentScoreElem=ScoreElem.querySelector('.current-score') 
    currentScoreElem.innerText=Score.toString().padStart(5,"0")
}

function updateCactus(){
    var cactusXPos= CactusElem.getBoundingClientRect().x
    var isOffScreen = cactusXPos < window.innerWidth
    if(isOffScreen === true )return
    var cacti= ['cactus-small-1','cactus-small-2', 'cactus-small-3']
    var randomNum = Math.floor(Math.random()*cacti.length)
    var cactus=cacti[randomNum]
    CactusElem.classList.remove(
        'cactus-small-1',
        'cactus-small-2', 
        'cactus-small-3' 
    )
    CactusElem.classList.add(cactus)
    
    
}



function fitScreen(){
    var width=window.innerWidth
    var height=window.innerHeight/2
    gameElem.style.width=width+"px"
    gameElem.style.height=height+"px"
}

window.addEventListener('load',function(){
    fitScreen()
    window.addEventListener('resize',fitScreen)
    var selfplayElem=this.document.querySelector('#selfplay')
    selfplayElem.addEventListener("change",function(){
        SelfPlayMode=selfplayElem.checked 
    })
    document.addEventListener('keydown',startGame,{once:true})
})