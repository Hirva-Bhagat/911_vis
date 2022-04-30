/* * * * * * * * * * * * * *
*     JQuery Functions     *
* * * * * * * * * * * * * */

$(document).ready(function() {

    // $('#homepage911').delay(3300).fadeIn(1200);
    // $('#hook-comparingGuess').hide();
    // $('#userNum').keyUp(function(){
    //     if ($('#userNum').val() < 0){
    //         alert("You can't have negative 911!");
    //         $('#userNum').val('0');
    //     }
    // });

    //$(".bubble").
    // After the user submits, hide the guessing and cue the information!
    $('#numForm').submit((event) => {
        event.preventDefault();
        var userInput = $('#userNum').val();
        var totalcalls = 91523
        var userOff = Math.abs(userInput - totalcalls).toLocaleString();

        $('#userGuess').fadeOut('slow');
        $('#comparingcallNum').html("You were off by <span style=\"color: indianred\">" + userOff + "</span> calls. <br>There were actually <span style=\"color: indianred\"><strong><br>91,523</strong></span><br>unique calls in Pennsylvania in 2016!");
        // $('#hook-comparingGuess').delay(1000).fadeIn(1600, () => {
        //
        // });


    });

});



