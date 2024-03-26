setTimeout(function () {
    $('#load').hide();
    $('#mycanvas').show();
},5000); //4500

const canvas = document.querySelector("canvas");

resize()
window.addEventListener('resize', resize)

var current_state;
var game_data;

$.getJSON("map.json", function (data) {
    game_data = data;
    current_state = data['start_state'];
    setBackgroundImage();
    load_imgs();
    $('#game_text').html( game_data['states'][ data['start_state'] ]['text'] ); 
});

function resize() {
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 80;

    try{
    draw(game_data['states'][current_state]['bk_img_loaded'])
    }catch{}
}

function setBackgroundImage() {
    if (game_data && game_data['states'][current_state] && game_data['states'][current_state]['bg_img']) {
        var backgroundImage = game_data['states'][current_state]['bg_img'];
        document.body.style.backgroundImage = `url(${backgroundImage})`;
    }
}

//changed 0,0 to start
function all_loaded() {
    draw(game_data['states']['start']['bk_img_loaded']);
    console.log(current_state);
}

function load_imgs() {
    for (var key in game_data['states']) {
        if (game_data['states'][key]['bk_img'] != null) {
            console.log(key, game_data['states'][key]['bk_img']);
            game_data['states'][key]['bk_img_loaded'] = new Image();
            game_data['states'][key]['bk_img_loaded'].onload = function () { //gets the first image
                all_loaded(); //calls after the image is loaded
            };
            game_data['states'][key]['bk_img_loaded'].src = game_data['states'][key]['bk_img'];
        }
    }
}

const up_arrow = 38;
const down_arrow = 40;
const left_arrow = 37;
const right_arrow = 39;

var cur_pos_x = 0;
var cur_pos_y = 0;


document.body.onkeydown = function (e) {
    if (e.keyCode == up_arrow) {
        cur_pos_x = cur_pos_x + 1;
    }
    //alert(String.fromCharCode(e.keyCode)+" --> "+e.keyCode);
    key_input(e.keyCode)

};

function key_input(what_key) {
    for (i = 0; i < game_data['states'][current_state]['next_state'].length; i++) {
        if (what_key == game_data['states'][current_state]['next_state'][i]['key_input']) {
            if (typeof game_data['states'][current_state]['next_state'][i]['state_name'] == "string") {
                next_state(game_data['states'][current_state]['next_state'][i]['state_name'])
            }
            break
        }
    }

    console.log(what_key);
}

function next_state(state) {
    console.log("Current State = " + current_state + " --> New State= " + state)
    current_state = state

    draw(game_data['states'][current_state]['bk_img_loaded'])

    // Game text
    if (game_data['states'][ current_state ]['text'] != null){
        $('#game_text').show();
        $('#game_text').html( game_data['states'][ current_state ]['text'] );
    }

    // Sound effect
    if (game_data['states'][current_state]['sound_effect'] != null) {
        var soundEffect = new Audio(game_data['states'][current_state]['sound_effect']);
        soundEffect.play();
    }

    // Video
    var video = document.getElementById('show_video');
    
    if (game_data['states'][current_state]['show_video'] != null) { 
        $('#mycanvas').hide();
        video.src = game_data['states'][current_state]['show_video'];
        $('#show_video').show();
        video.play();
        document.getElementById("bg_music").muted = true;
        $('#game_text').hide();
    } else {
        $('#mycanvas').show();
        $('#show_video').hide();
        $('#game_text').show();
        video.pause();
        document.getElementById("bg_music").muted = false;
    }
}

// Music
var audio = document.getElementById("bg_music");

function playAudio() {
  if (audio.paused) {
    audio.play()
      .then(function() {
        console.log("Audio playback started successfully");
      })
      .catch(function(error) {
        console.error("Audio playback was prevented:", error);
      });
  }
}

document.addEventListener("click", function() {
  playAudio();
});

window.onload = playAudio;


function draw(img) {
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function draw_src(src, x, y, w, h) {
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.onload = function () {
        ctx.drawImage(img, x, y, w, h);
    };
    img.src = src;
}

