/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables, switches, helper functions
let myCrimeClock,
    myDayNightScatter,
    myBarChartTop,
    myBarChartBottom,
    myStack,
    myTimeLine,
    bar_button_top,
    bar_button_bottom
;
let parseDate = d3.timeParse("%d/%m/%Y");
let parseTime = d3.timeParse("%H:%M:%S");

var mygroups = ["Vehicle_Accident", "Disable_Vehicle","Fire_Alarm","Respiratory_Emergency","Cardiac_Emergency",
    "Fall_Victim"," VEHICLE ACCIDENT","Subject_in_Pain","Road_Obstruction", "Head_Injury"]
let colorScale = d3.scaleOrdinal()
    .domain(mygroups)
    .range(['#377eb8','#e41a1c','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999', '#800000'])

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
    })
    .catch(function(error){
        // handle error
        console.log(error)
    })


// initMainPage
function initMainPage(allDataArray) {

    // activity 1, pie chart
    //myCrimeClock = new CrimeClock('div_name')

    // activity 2, force layout
    myDayNightScatter = new DayNightVis('DayNightVis', allDataArray)

    myBarChartTop = new barChart('barVisTop', allDataArray, true);
    myBarChartBottom = new barChart('barVisBottom', allDataArray, false);
    myCrimeClock=new crimeClockVis('crimeClock',allDataArray)

    myStack = new stackArea('mapVis', allDataArray);
    myTimeLine = new timeLine('timeLine', allDataArray);

    bar_button_top = d3.select("#change-top");
    bar_button_bottom = d3.select("#change-bottom");

    bar_button_top
        .on("click", function() {
            myBarChartTop.updateVisualization();
        })

    bar_button_bottom
        .on("click", function() {
            myBarChartBottom.updateVisualization();
        })

}
