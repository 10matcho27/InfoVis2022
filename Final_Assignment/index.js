d3.csv("https://10matcho27.github.io/InfoVis2022/W08/w08_task1.csv")
    .then(data => {
        data.forEach(d => {
            //label,value,i,x,y,r,c
            d.label = d.label;
            d.value = +d.value;
            d.i = d.i
            d.x = +d.x;
            d.y = +d.y;
            d.r = +d.r;
            d.c = d.c;
        })
        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: { top: 20, right: 20, bottom: 40, left: 80, top_title: 30 },
        };

        //var orient = 1;

        // const scatter_plot = new ScatterPlot(config, data);
        // scatter_plot.update();

        let bar_chart = new BarChart_diff_orient(config, data);
        bar_chart.update();
        // let bar_chart_nomal = new BarChart_nomal(config, data);

        // document.getElementById('btn').onclick = function() {
        //     orient = orient * -1;
        //     if (orient == 1) {
        //         bar_chart.hide();
        //         bar_chart_nomal.update();
        //     } else {
        //         bar_chart_nomal.hide();
        //         bar_chart.update();
        //     }
        // }
        d3.select('#reverse').on('click', function(data) {
            bar_chart.reverse();
            // bar_chart.update();
        })
        d3.select('#sort_asc').on('click', function() {
            bar_chart.sort(1);
        })
        d3.select('#sort_dsc').on('click', function() {
            bar_chart.sort(-1);
        })
        d3.select('#origin').on('click', function() {
            bar_chart.origin();
        })
    })
    .catch(error => {
        console.log(error);
    });