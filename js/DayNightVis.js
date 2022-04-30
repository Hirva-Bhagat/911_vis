/* * * * * * * * * * * * * *
*         BarChart         *
* * * * * * * * * * * * * */

// CHART AREA

//let margin = {top: 50, right: 20, bottom: 20, left: 90},
 //   width = 500,
 //   height = 180;

//width = width > 600 ? 600 : width;



// AXIS

function renderBarChart(data) {

    // Check array length (top 5 attractions)
    if (data.length > 3) {
        errorMessage("Max 3 rows");
        return;
    }


    dayx.domain(data.map(d => d.Category));
    //y.domain(data.map(d => d.Count));
    dayy.domain([0, d3.max(data, d => d.Count)]);

    // ---- DRAW BARS ----
    let bars = daysvg.selectAll(".bar_Ayda")
        .remove()
        .exit()
        .data(data)



    bars.enter()
        .append("rect")
        .attr("class", "bar_Ayda")
        .attr("fill", "indianred")
        //.transition(t)
        .attr("x", d => dayx(d.Category))
        .attr("y", d => dayy(d.Count))
        .attr("height", d => (dayheight - dayy(d.Count)))
        .attr("width", dayx.bandwidth());




    // ---- DRAW AXIS	----
    dayxAxisGroup = daysvg.select(".x-axis")
        //.attr('transform', 'translate(0,' + (height - margin.bottom - margin.top) + ')')
        .attr("class", "x-axis axis")
        .attr("color","white")
        .attr("transform", "translate(0," + dayheight + ")")
        .call(d3.axisBottom(dayx));




    dayyAxisGroup = daysvg.select(".y-axis")
        .attr("color","white")
        .call(dayyAxis);


    let texts = daysvg.selectAll(".texts")
        .remove()
        .exit()
        .data(data)

    texts.enter()
        //.data(data)
        //.enter()
        .append('text')
        //.attr("class", "axisText")
        .attr("class", "texts")
        //  .classed('text.bars', true)
        .attr("fill","white")
        .transition()
        .duration(500)
        .style("text-anchor", "middle")
        .style("font-size", "11px")
        .attr('x', d => dayx(d.Category) + dayx.bandwidth()/2)
        .attr('dx', 0)
        .attr('y', d => dayy(d.Count))
        .attr('dy', -6)
        .text(d => d.Count);


    //daysvg.selectAll('.text.bar').remove();

    daysvg.append("text")
        .attr("class", "axis-title")
        .attr("fill","white")
        .attr("x", -5)
        .attr("y", -15)
        .attr("dy", ".1em")
        .style("text-anchor", "end")
        .text("Number of Calls");


}


function errorMessage(message) {
    console.log(message);
}

function shortenString(content, maxLength){
    // Trim the string to the maximum length
    let trimmedString = content.substr(0, maxLength);

    // Re-trim if we are in the middle of a word
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))

    return trimmedString;
}

;