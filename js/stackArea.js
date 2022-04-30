
/*
 * StackedAreaChart - ES6 Class
 * @param  parentElement 	-- the HTML element in which to draw the visualization
 * @param  data             -- the data the that's provided initially
 * @param  displayData      -- the data that will be used finally (which might vary based on the selection)
 *
 * @param  focus            -- a switch that indicates the current mode (focus or stacked overview)
 * @param  selectedIndex    -- a global 'variable' inside the class that keeps track of the index of the selected area
 */

stackArea = function(parentElement, data){
    this.parentElement = parentElement;
    this.data = data;
    this.displayData = []; // see data wrangling

    // DEBUG RAW DATA
    console.log(this.data);

    this.initVis();
}

/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

stackArea.prototype.initVis = function(){
    let vis = this;

    vis.margin = {top: 50, right: 50, bottom: 40, left: 50};
    vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
    vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Overlay with path clipping
    vis.svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", vis.width)
        .attr("height", vis.height);

    vis.svg.append('g')
        .attr('class', 'title')
        .append('text')
        .text('Number of Top 10 911 Calls by Time')
        .attr('transform', `translate(350, -20)`)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white');

    // Scales and axes
    vis.x = d3.scaleTime()
        .range([0, vis.width])
    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);
    vis.yAxis = d3.axisLeft()
        .scale(vis.y);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(20," + vis.height + ")")
        .attr("stroke","white");

    vis.svg.append("g")
        .attr("class", "y-axis axis")
        .attr("transform", "translate(20," + 0 + ")")
        .attr("stroke","white");

    let dataCategories = colorScale.domain();
    vis.stack = d3.stack().keys(dataCategories);

    console.log(vis.stack);

    // Rearrange data
    vis.stackedData = vis.stack(vis.data);

    console.log(vis.stackedData);
    // Stacked area layout
    vis.area = d3.area()
        .x(function(d) {
            return vis.x(d.data.date);
        })
        .y0(function(d) {
            return vis.y(d[0]);
        })
        .y1(function(d) {
            return vis.y(d[1]);
        });

    // TO-DO: Tooltip placeholder
    vis.tooltip = vis.svg.append("text")
        .attr("class", "tooltip_stack")
        .attr("x",30)
        .attr("y",0);
    vis.tooltip1 = vis.svg.append("text")
        .attr("class", "tooltip_stack")
        .attr("x",30)
        .attr("y",0);
    vis.tooltip2 = vis.svg.append("text")
        .attr("class", "tooltip_stack")
        .attr("x",30)
        .attr("y",12);
    vis.tooltip3 = vis.svg.append("text")
        .attr("class", "tooltip_stack")
        .attr("x",30)
        .attr("y",24);
    vis.tooltip4 = vis.svg.append("text")
        .attr("class", "tooltip_stack")
        .attr("x",30)
        .attr("y",36);
    vis.tooltip5 = vis.svg.append("text")
        .attr("class", "tooltip_stack")
        .attr("x",30)
        .attr("y",48);
    vis.tooltip6 = vis.svg.append("text")
        .attr("class", "tooltip_stack")
        .attr("x",30)
        .attr("y",60);
    vis.tooltip7 = vis.svg.append("text")
        .attr("class", "tooltip_stack")
        .attr("x",30)
        .attr("y",72);
    vis.tooltip8 = vis.svg.append("text")
        .attr("class", "tooltip_stack")
        .attr("x",30)
        .attr("y",84);
    vis.tooltip9 = vis.svg.append("text")
        .attr("class", "tooltip_stack")
        .attr("x",30)
        .attr("y",96);
    vis.tooltip10 = vis.svg.append("text")
        .attr("class", "tooltip_stack")
        .attr("x",30)
        .attr("y",108);

    vis.svg.append("text")
        .attr("x", -50)
        .attr("y", -15)
        .attr('fill', 'white')
        .text("Number of Calls");
    vis.svg.append("text")
        .attr("x", vis.width - 5)
        .attr("y", vis.height + 25)
        .attr('fill', 'white')
        .text("Time");


    // (Filter, aggregate, modify data)
    vis.wrangleData();
}

stackArea.prototype.wrangleData = function(){
    let vis = this;

    vis.preProcessedData = [];
    let dataByDate = Array.from(d3.group(vis.data, d => d.Date_of_call), ([key, value]) => ({key, value}))
    // iterate over each year
    dataByDate.forEach(day => {
        let vehicle = 0;
        let head = 0;
        let fire_alarm = 0;
        let dis_car = 0;
        let victim = 0;
        let CARDIAC = 0;
        let RESPIRATORY = 0;
        let ROAD = 0;
        let pain = 0;
        let unknown = 0;
        day.value.forEach(entry => {
            if (entry.Reason.includes(top_ten_key[0])) {
                vehicle = vehicle + 1;
            }
            else if (entry.Reason == top_ten_key[1]) {
                dis_car = dis_car + 1;
            }
            else if (entry.Reason.includes(top_ten_key[2])) {
                fire_alarm = fire_alarm + 1;
            }
            else if (entry.Reason == top_ten_key[3]) {
                RESPIRATORY = RESPIRATORY + 1;
            }
            else if (entry.Reason ==  top_ten_key[4]) {
                CARDIAC = CARDIAC + 1;
            }
            else if (entry.Reason == top_ten_key[5]) {
                victim = victim + 1;
            }
            else if (entry.Reason == top_ten_key[6]) {
                pain = pain + 1;
            }
            else if (entry.Reason == top_ten_key[7]) {
                ROAD = ROAD + 1;
            }
            else if (entry.Reason == top_ten_key[8]) {
                head = head + 1;
            }
            else if (entry.Reason == top_ten_key[9]) {
                unknown = unknown + 1;
            }
        });

        vis.preProcessedData.push(
            {date: day.key, Vehicle_Accident: vehicle, Disable_Vehicle: dis_car, Fire_Alarm: fire_alarm,
                Respiratory_Emergency: RESPIRATORY, Cardiac_Emergency: CARDIAC, Fall_Victim: victim, Subject_in_Pain: pain,
                Road_Obstruction: ROAD, Head_Injury: head, Unknown_Medical_Emergency: unknown}
        )
    });


    vis.preProcessedData.sort((a, b) => {
        return a.date - b.date;
    })

    vis.stackedData = vis.stack(vis.preProcessedData);

    vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

stackArea.prototype.updateVis = function(){
    let vis = this;

    console.log(vis.stackedData);
    console.log(vis.preProcessedData);

    vis.x.domain(d3.extent(vis.preProcessedData, function(d) {return d.date; }))
    vis.y.domain([0, 600])

    let dataCategories = colorScale.domain();

// Draw the layers
    let categories = vis.svg.selectAll(".area")
        .data(vis.stackedData);
    categories.enter().append("path")
        .attr("class", "area")
        .attr("transform", "translate(20," + 0 + ")")
        .merge(categories)
        .style("fill", function(d,i) {
            return colorScale(dataCategories[i]);
        })
        .attr("d", function(d) {
            return vis.area(d);
        })
        .on("mouseover",function(d,i){
            vis.tooltip.text(i.key);
        })
        .on("mouseout",function(d){
            vis.tooltip.text(null);
        })
    categories.exit().remove();

    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);
}

stackArea.prototype.updateNum = function(hoverDate, hoverMouse, idx_date){
    let vis = this;

    console.log(hoverDate);

    console.log(hoverMouse);

    console.log();

    var hover_line_group = vis.svg.append("g")
        .attr("class", "hover-line");

    var hover_line = hover_line_group
        .append("line")
        .attr("stroke", "red")
        .attr("x1", 10).attr("x2", 10)
        .attr("y1", 0).attr("y2", vis.height);

    hover_line.attr("x1", hoverMouse).attr("x2", hoverMouse)
    hover_line_group.style("opacity", 100);

    for (var i = 0; i < 10; ++i) {
        if (i == 0) {
            vis.tooltip1.text(mygroups[i] + ":  "+ vis.preProcessedData[idx_date].Vehicle_Accident);
        }
        else if (i == 1) {
            vis.tooltip2.text(mygroups[i] + ":  "+ vis.preProcessedData[idx_date].Disable_Vehicle);
        }
        else if (i == 2) {
            vis.tooltip3.text(mygroups[i] + ":  "+ vis.preProcessedData[idx_date].Fire_Alarm);
        }
        else if (i == 3) {
            vis.tooltip4.text(mygroups[i] + ":  "+ vis.preProcessedData[idx_date].Respiratory_Emergency);
        }
        else if (i == 4) {
            vis.tooltip5.text(mygroups[i] + ":  "+ vis.preProcessedData[idx_date].Cardiac_Emergency);
        }
        else if (i == 5) {
            vis.tooltip6.text(mygroups[i] + ":  "+ vis.preProcessedData[idx_date].Fall_Victim);
        }
        else if (i == 6) {
            vis.tooltip7.text(mygroups[i] + ":  "+ vis.preProcessedData[idx_date].Subject_in_Pain);
        }
        else if (i == 7) {
            vis.tooltip8.text(mygroups[i] + ":  "+ vis.preProcessedData[idx_date].Road_Obstruction);
        }
        else if (i == 8) {
            vis.tooltip9.text(mygroups[i] + ":  "+ vis.preProcessedData[idx_date].Head_Injury);
        }
        else if (i == 9) {
            vis.tooltip10.text(mygroups[i] + ":  "+ vis.preProcessedData[idx_date].Unknown_Medical_Emergency);
        }
    }
}

stackArea.prototype.updateNone = function() {
    let vis = this;

    var hover_line_group = vis.svg.selectAll(".hover-line")
    hover_line_group.style("opacity", 0);
    vis.tooltip1.text(null);
    vis.tooltip2.text(null);
    vis.tooltip3.text(null);
    vis.tooltip4.text(null);
    vis.tooltip5.text(null);
    vis.tooltip6.text(null);
    vis.tooltip7.text(null);
    vis.tooltip8.text(null);
    vis.tooltip9.text(null);
    vis.tooltip10.text(null);
}

