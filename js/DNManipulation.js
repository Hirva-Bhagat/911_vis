
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