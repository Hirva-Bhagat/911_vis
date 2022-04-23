/* * * * * * * * * * * * * *
*          CrimeClockVis          *
* * * * * * * * * * * * * */


class crimeClockVis {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.clockData = data;

        // define colors
        this.colors = ['#fddbc7', '#f4a582', '#d6604d', '#b2182b']

        this.initVis()
    }

    initVis() {
        let vis = this;
        vis.radians = 0.0174532925;
        vis.clockRadius = 200;
        vis.margin = 50;
        vis.width = (vis.clockRadius+vis.margin)*2;
        vis.height = (vis.clockRadius+vis.margin)*2;
        vis.hourHandLength = 2*vis.clockRadius/3;
        vis.minuteHandLength = vis.clockRadius;
        vis.secondHandLength = vis.clockRadius-12;
        vis.secondHandBalance = 30;
        vis.secondTickStart = vis.clockRadius;
        vis.secondTickLength = -10;
        vis.hourTickStart = vis.clockRadius;
        vis.hourTickLength = -18;
        vis.secondLabelRadius = vis.clockRadius + 16;
        vis.secondLabelYOffset = 5;
        vis.hourLabelRadius = vis.clockRadius - 40;
        vis.hourLabelYOffset = 7;

        vis.hourScale = d3.scaleLinear()
            .range([0,330])
            .domain([0,11]);

        vis.minuteScale  = d3.scaleLinear()
            .range([0,354])
            .domain([0,59]);

        vis.secondScale =d3.scaleLinear()
            .range([0,354])
            .domain([0,59]);

        vis.handData = [
            {
                type:'hour',
                value:0,
                length:-vis.hourHandLength,
                scale:vis.hourScale
            },
            {
                type:'minute',
                value:0,
                length:-vis.minuteHandLength,
                scale:vis.minuteScale
            },
            {
                type:'second',
                value:0,
                length:-vis.secondHandLength,
                scale:vis.secondScale,
                balance:vis.secondHandBalance
            }
        ];


        vis.updateVis();	//draw them in the correct starting position

        vis.svg = d3.select("#"+vis.parentElement).append("svg")
            .attr('class','clock')
            .attr("width", "90%")
            .attr("height", "90%")
            .style("display", "block")
            .style("margin","auto");




        myDateSlider = new myDateSlider('box-3', vis.clockData);
        myCrimeCharts=new myCrimeCharts(vis.clockData);


        vis.face = vis.svg.append('g')
            .attr('id','clock-face')
            .attr('transform','translate(' + (vis.clockRadius + vis.margin) + ',' + (vis.clockRadius + vis.margin) + ')');

        vis.tooltip = d3.select("#clockSlide").append('div')
            .attr('class', "tooltip")
            .attr('id', 'tickTooltip')

        //add marks for seconds
        vis.face.selectAll('.second-tick')
            .data(d3.range(0,60)).enter()
            .append('line')
            .attr('class', 'second-tick')
            .attr('x1',0)
            .attr('x2',0)
            .attr('y1',vis.secondTickStart)
            .attr('y2',vis.secondTickStart + vis.secondTickLength)
            .attr('transform',function(d){
                return 'rotate(' + vis.secondScale(d) + ')';
            }).on('mouseover', function(event, d){
            console.log("here")
            d3.select(this)
                .attr('y1',vis.clockRadius)
                .style('stroke-width', '6px')
                .style("opacity","0.8")
                .style('color', 'rgba(173,222,255,0.65)')





        })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .style('stroke-width', '1px')
                    .style('color',"black")


                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });
        //and labels

        vis.face.selectAll('.second-label')
            .data(d3.range(5,61,5))
            .enter()
            .append('text')
            .attr('class', 'second-label')
            .attr('text-anchor','middle')
            .attr('x',function(d){
                return vis.secondLabelRadius*Math.sin(vis.secondScale(d)*vis.radians);
            })
            .attr('y',function(d){
                return -vis.secondLabelRadius*Math.cos(vis.secondScale(d)*vis.radians) + vis.secondLabelYOffset;
            })
            .text(function(d){
                return d;
            });

        //... and hours
        vis.face.selectAll('.hour-tick')
            .data(d3.range(0,12)).enter()
            .append('line')
            .attr('class', 'hour-tick')
            .attr('x1',0)
            .attr('x2',0)
            .attr('y1',vis.hourTickStart)
            .attr('y2',vis.hourTickStart + vis.hourTickLength)
            .attr('transform',function(d){
                return 'rotate(' + vis.hourScale(d) + ')';
            });

        vis.face.selectAll('.hour-label')
            .data(d3.range(3,13,3))
            .enter()
            .append('text')
            .attr('class', 'hour-label')
            .attr('text-anchor','middle')
            .attr('x',function(d){
                return vis.hourLabelRadius*Math.sin(vis.hourScale(d)*vis.radians);
            })
            .attr('y',function(d){
                return -vis.hourLabelRadius*Math.cos(vis.hourScale(d)*vis.radians) + vis.hourLabelYOffset;
            })
            .text(function(d){
                return d;
            });


        vis.hands = vis.face.append('g').attr('id','clock-hands');

        vis.face.append('g').attr('id','face-overlay')
            .append('circle').attr('class','hands-cover')
            .attr('x',0)
            .attr('y',0)
            .attr('r',vis.clockRadius/20);

        vis.hands.selectAll('line')
            .data(vis.handData)
            .enter()
            .append('line')
            .attr('class', function(d){
                return d.type + '-hand';
            })
            .attr('x1',0)
            .attr('y1',function(d){
                return d.balance ? d.balance : 0;
            })
            .attr('x2',0)
            .attr('y2',function(d){
                return d.length;
            })
            .attr('transform',function(d){
                return 'rotate('+ d.scale(d.value) +')';
            });
        d3.select(self.frameElement).style("height", vis.height + "px");


        vis.wrangleData()


    }

    wrangleData() {
        let vis=this;
        setInterval(function(){
            vis.updateVis();
            vis.moveHands();
        }, 1000);




    }

    updateVis() {
        let vis=this;

        console.log("here")
        vis.t = new Date();
        vis.handData[0].value = (vis.t.getHours() % 12) + vis.t.getMinutes()/60 ;
        vis.handData[1].value = vis.t.getMinutes();
        vis.handData[2].value = vis.t.getSeconds();

    }
    moveHands(){
        let vis=this;
        d3.select('#clock-hands').selectAll('line')
            .data(vis.handData)
            .transition()
            .attr('transform',function(d){
                return 'rotate('+ d.scale(d.value) +')';
            });
    }



}

