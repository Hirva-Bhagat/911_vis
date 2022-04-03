/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables, switches, helper functions
let myCrimeClock,
    myDayNightScatter;

function updateAllVisualizations(){
    myCrimeClock.wrangleData()
    myDayNightScatter.wrangleData()
}

// load data
d3.csv("data/911_clean.csv",function(data){
    console.log(data);
},function(error, rows){
    console.log(rows);
});

d3.csv('data/911_clean.csv')
    .then(function(data) {
        initMainPage(data)
        console.log(data)
    })
    .catch(function(error){
        // handle error
        console.log(err)
    })


// initMainPage
function initMainPage(allDataArray) {

    // log data
    console.log(allDataArray);

    // activity 1, pie chart
    myCrimeClock = new CrimeClock('div_name')

    // activity 2, force layout
    myDayNightScatter = new DayNightVis('div_name', allDataArray[0], allDataArray[1])

    console.log("Check here");

    console.log(allDataArray[0]);
    console.log(allDataArray[1]);
}
