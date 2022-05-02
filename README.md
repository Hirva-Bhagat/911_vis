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

# crimeClockVis.js

