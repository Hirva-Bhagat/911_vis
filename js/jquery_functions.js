/* * * * * * * * * * * * * *
*     JQuery Functions     *
* * * * * * * * * * * * * */

$(document).ready(function(){


    $('#homepage911').delay(3300).fadeIn(1200);
    $('#hook-comparingGuess').hide();
    $('#userNum').keyup(function(){
        if ($('#userNum').val() < 0){
            alert("You can't have negative 911!");
            $('#userNum').val('0');
        }
    });

    // After the user submits, hide the guessing and cue the information!
    $('#numForm').submit(function(){
        var userInput = $('#userNum').val();
        var totalcalls = 2373
        var userOff = Math.abs(userInput - totalcalls).toLocaleString();

        $('#userGuess').fadeOut(800);
        $('#hook-comparingGuess').delay(1000).fadeIn(1600);
        $('#comparingcallNum').html("You were off by " + userOff + " calls. There are actually <strong> 2,373 unique calls </strong> in Philadelphia!");

    });



});
