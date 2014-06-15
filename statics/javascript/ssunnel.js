/**
 * Created by XadillaX on 2014/6/14.
 */
var bgPos = {
    x   : 0,
    y   : 0
};

function moveBackground() {
    bgPos.x--;
    bgPos.y--;
    if(bgPos.x === -399) bgPos.x = 0;
    if(bgPos.y === -319) bgPos.y = 0;

    $("body").css({ "background-position-x": bgPos.x + "px", "background-position-y": bgPos.y });
}

$(function() {
    alert = function(content) {
        if(typeof content === "object") {
            content = JSON.stringify();
        }

        vex.dialog.alert(content);
    };

    setInterval(moveBackground, 100);
});
