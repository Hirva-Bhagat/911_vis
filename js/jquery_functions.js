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
        var totalcalls = 395
        var userOff = Math.abs(userInput - totalcalls).toLocaleString();

        $('#userGuess').fadeOut('slow');
        $('#comparingcallNum').html("You were off by " + userOff + " calls. <br>There are actually <span style=\"color: red\"><strong><br>395</strong></span><br>unique calls on average in Pennsylvania!");
        // $('#hook-comparingGuess').delay(1000).fadeIn(1600, () => {
        //
        // });


    });
    $(".timepicker").picktim({
        mode:'h12',
        backgroundColor: "#EEE",
        borderColor: "#DDD",
        textColor: "#333",
        symbolColor: "#333",
        orientation:"bottomLeft",
        defaultValue:'00:00',
        appendTo:'#box-3'


    });
});



