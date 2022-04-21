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

let daymargin = {top: 50, right: 20, bottom: 20, left: 90},
    daywidth = 500,
    dayheight = 180;

//width = width > 600 ? 600 : width;

let dayx = d3.scaleBand()
    .range([0, daywidth])
    .paddingInner(0.1);

let dayy = d3.scaleLinear()
    .range([dayheight, 0]);

let dayxAxis = d3.axisBottom()
    .scale(dayx)
    .tickFormat(function(d) { return shortenString(d, 20); });

let dayyAxis = d3.axisLeft()
    .scale(dayy);

let daysvg = d3.select("#DayNightVis").append("svg")
    .attr("width", daywidth + daymargin.left + daymargin.right)
    .attr("height", dayheight + daymargin.top + daymargin.bottom)
    .append("g")
    .attr("transform", "translate(" + daymargin.left + "," + daymargin.top + ")");

let dayxAxisGroup = daysvg.append("g")
    .attr("class", "x-axis axis");

let dayyAxisGroup = daysvg.append("g")
    .attr("class", "y-axis axis");


dataManipulation();
function dataManipulation() {


    let selectBox = document.getElementById("All Categories");
    let selectedValue = selectBox.options[selectBox.selectedIndex].value;
    let newresult = [];
    for (let i = 0; i < dataDN.length; i++) {
        if(dataDN[i].Time == selectedValue)
        {newresult.push(dataDN[i]);}
    }




    dataFiltering();

    function dataFiltering() {
        let attractions = newresult;
        console.log('hello')

        sortedEntries = attractions.sort( (a, b)=> {
            return b.Count- a.Count;
        });
        result = sortedEntries.slice(0, 3);


        console.log(result);
//	var myJsonString = JSON.stringify(result);
//	console.log(myJsonString);

        renderBarchart();
        function renderBarchart(){
            let result = sortedEntries.slice(0, 3);
            renderBarChart(result)
        }



//	console.log('Sorted Array', attractions);




        /* **************************************************
         *
         * ADD YOUR CODE HERE FILTERING THE ARRAY HERE
         *
         * CALL THE FOLLOWING FUNCTION TO RENDER THE BAR-CHART:
         *
         * renderBarChart(data)
         *
         * - 'data' must be an array of JSON objects
         * - the max. length of 'data' is 5
         *
         * **************************************************/

    }
}


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
    //myDayNightScatter = new DayNightVis('DayNightVis', allDataArray)

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
