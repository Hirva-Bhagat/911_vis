/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables, switches, helper functions
let myCrimeClock,
    myDayNightScatter;
let parseDate = d3.timeParse("%d/%m/%Y");
let parseTime = d3.timeParse("%H:%M:%S");

function updateAllVisualizations(){
    myCrimeClock.wrangleData()
    //myDayNightScatter.wrangleData()
}

d3.csv('data/911_clean.csv').then(function(d) {
    data = d.filter(function(d){
        if(isNaN(parseFloat(d.zip))){
            return false;
        }
        else{
            d.lat=d.lat,
                d.lng=d.lng,
                d.zip=parseInt(d.zip),
                d.twp=d.twp,
                d.addr=d.addr,
                d.Time_of_call=parseTime(d.Time_of_call),
                d.Date_of_call=parseDate(d.Date_of_call),
                d.Type_of_call=d.Type_of_call,
                d.Reason=d.Reason,
                d.Time_of_day=d.Time_of_day,
                d.Day_or_night=d.Day_or_night
            return true;
        }

    });

        initMainPage(data)
        console.log(data)
    })
    .catch(function(error){
        // handle error
        console.log(error)
    })


// initMainPage
function initMainPage(allDataArray) {

    console.log("check here");
    // log data
    console.log(allDataArray);

    // activity 1, pie chart
    //myCrimeClock = new CrimeClock('div_name')

    // activity 2, force layout
    myDayNightScatter = new DayNightVis('DayNightVis', allDataArray)


}
