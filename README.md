# 911_vis

###### this is our project website please refer [Project Website](https://docs.google.com/document/d/1zIKXMTH1NQoCNYAJ_7DbDc6q55UoAPUG-M6HuZEYsNE/edit).

## barChart.js
###### barChart.js is about bar chart that shows top 10 and bottom 10 for number of 911 calls. 
###### X-axis is representing number of 911 calls, and Y-axis is representing the reason for 911 calls.
###### It also has a sort button for each bar chart. Once the button is clicked, it will sort either ascending or descending
###### and show proper order of bar chart.

## timeLine.js
###### timeLine.jst is for creating area chart of total 911 calls by entire time. 
###### X-axis is representing the date, and Y-axis is representing the number of 911 calls.
###### We can hover mouse over the chart, then it will show total number of 911 calls at specific date. 
###### The date corresponded to mouse position will send to stackArea.js to indicate various type of visualization.

###### There are many codes like this:
```
function hoverMouseOn(event) {
...
}
```
##### hoverMouseOn(event) will be called once audience hover over the time-line chart.
##### It will draw the red line over the specific date and show the number of total 911 calls and date. 

```
function hoverMouseOn(event) {
...
}
```
##### hoverMouseOn(event) will be called once audience hover out the time-line chart.
##### It will clear all the thing we draw and empty the text box.

## stackArea.js
###### stackArea.js is for creating stacked area chart of top 10 reason 911 calls by entire time.
###### Similar to timeLine.js X-axis is representing the date, and Y-axis is representing the number of 911 calls.
###### Once mouse has been hovered over time-line chart, stacked area chart will also show several visualizations.
###### First of all, the number of calls for each reason in top 10 with given date from timeLine.js will be shown in top left corner.
###### Also, it will draw red line that where the number of calls in indicating in stacked area chart.
###### In last, it will also show the reason of 911 calls, when we hover over the stacked area chart. 

###### There are many codes like this:
```
vis.tooltip = vis.svg.append("text")
 .attr("class", "tooltip_stack")
 .attr("x",30)
 .attr("y",0)
```
###### stackArea.prototype.updateNum will be called once audience hover over the time-line chart
###### It updates the number of calls for 10 different reason and draw the red line on specific date. 
```
stackArea.prototype.updateNum
```
###### stackArea.prototype.updateNone will be called once audience hover out the time-line chart.
###### It will clear all the section we have. 
```
stackArea.prototype.updateNone
```

# crimeCharts.js
###### crimeCharts.js
###### In this file we do most of the drawing of charts present in the crimeClockVis.
###### The initvis method initilises chart parameters like width and height and some important varibales and set ranges for axes
###### UpdaData() function is used in order to generate data dictionaries for the charts. We do nesting operations to seperate data in the way that is needed for specific charts.It is called from crimeClockVis to initlaise default date and from date slider whenever date is changed. Below shown code is for places (cities) and addresses in those places (cities).
```
vis.places=d3.nest()
            .key(function (d){ return d.addr})
            .entries(vis.data)
            
vis.addbyplaces=d3.nest()
            .key(function(d){ return d.twp })
            .key(function (d){return d.addr})
            .entries(vis.data);
```
###### drawCharts() function is called from crimeClockVis whenever a change in time occurs. It changes the data by sorting w.r.t time for the line chart.
###### updateVis() function is called from drawCharts() to update visualisations as the data is changed

# crimeClockVis.js

###### The main function of this visualisation is to utilise time functionality to show change in the number of calls throughtout the day. This is a live functionality, therefore, if data was fed for current date it can fetch current time and show the changes live. However since our data is not that big and has gaps for specific time in seconds and minutes. we use hour was a metric. Hovering over the hour circles will show the changes in the line chart. ALternatively time selcter can be used to select a specific time. 

###### We also use a date slider that changes line, bubble and bar chart according to the selected date. This uses the dataSlider and crimeCharts functionalities. Here 100 is the default index for date. 
``` 
vis.myDateSlider = new myDateSlider(vis,'box-3', vis.clockData);
vis.currentDate=vis.myDateSlider.grouped[100].key
vis.myCrimeCharts=new myCrimeCharts(vis,vis.myDateSlider.grouped[100].values);
        
```

###### Time events and date events could be changed and then reset using the rest button. In order to implement the click events we use a listener inside our code. once triggered the data is updated in updateVis() by using drawCharts() of crimeCharts.js

```
vis.myCrimeCharts.drawCharts(vis)
```
##### The main purpose of this vis is to show which places are reciving a high call volume and check the call volume during the day as well. It could be used to inform the audiance or send out alerts when a certain count is exceeded as a reuslt of a threatening event or just public saftey in general.

###### crimeClockVis uses initVis() for the placement of hands and initilizing other variables in the vis. wrangleData() makes sure to keep the clock running in real time by calling updateVis() and moveHands() in 1 second interval. updateVis() makes sure to check if time is selected. In case of hover events clock stops and shows the data for the selected time. when hover event is done, clock hands move to current time on local device.
```
d3.select('#clock-hands').selectAll('line')
        .data(vis.handData)
        .transition()
        .attr('transform',function(d){
            return 'rotate('+ d.scale(d.value) +')';
        });
if(vis.reset){
    console.log("stopping")
    vis.reset=false
    clearInterval(vis.refreshId)
        }

```

###### we summarise the information in a small block in the middle of the page for visibilty and ease of understanding. We use disp.html to display the code.
```
vis.disp.html(`
         <div style=" align-content: center; border: thin solid rgba(146,236,255,0.47); margin-left: 5px; margin-top: 5px; width:90%; height:90%; border-radius: 5px; background: rgba(3,117,164,0.47); padding: 10px">
             <h3>${"On Date: " + vis.clockvis.currentDate}<h3>
             <h4> ${"At Time: " + vis.t}</h4>   
             <h5>Total Number Of Calls: ${vis.sum}</h5>
             <h5>High Activity Places: ${vis.xlist.map((s) => s.key)}</h5>   
         
         </div>`)
``` 






