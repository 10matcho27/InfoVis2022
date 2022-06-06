d3.csv("https://10matcho27.github.io/InfoVis2022/Final_Assignment/assets/pref_data.csv", data => {
    data.forEach(d => {
        d.first = +d.first;
        d.second = +d.second;
        d.third = +d.third;
        d.pref = d.pref;
        d.dense = +d.dense;
    })
    let config_JPmap = {
        parent: '#drawing_region_JPmap',
        width: 500,
        height: 500,
        scale: 1200,
        range_max: 1200,
        range_min: 70,
        margin: { top: 20, right: 20, bottom: 20, left: 20, top_title: 30 },
    };
    let config_BarChart = {
        parent: '#drawing_region_BarChart',
        width: 1125,
        height: 500,
        margin: { top: 20, right: 20, bottom: 40, left: 80, top_title: 30 },
    };

    const inputSliderBarElement = document.getElementById('inputSlideBar');

    let japan_map = new Japan(config_JPmap, data);
    let bar_chart = new BarChart_diff_orient(config_BarChart, data);
    bar_chart.update();


    inputSliderBarElement.addEventListener('change', function() {
        japan_map.config_JPmap.range_max = inputSliderBarElement.value;
        d3.selectAll("path").remove();
        japan_map.init();
    });
})

class Japan {
    constructor(config_JPmap, data) {
        this.config_JPmap = {
            parent: config_JPmap.parent,
            width: config_JPmap.width || 256,
            height: config_JPmap.height || 256,
            margin: config_JPmap.margin || { top: 20, right: 20, bottom: 20, left: 20 },
            range_max: config_JPmap.range_max || 6189,
            range_min: config_JPmap.range_min || 0,
            scale: config_JPmap.scale || 1500,
        }
        this.data = data;
        this.init_flag = true;
        this.map_render();
    }

    map_render() {
        let self = this;

        d3.json("https://10matcho27.github.io/InfoVis2022/Final_Assignment/assets/japan.geojson", createMap);

        function createMap(japan) {
            let aProjection = d3.geoMercator()
                .center([136.0, 38.6])
                .translate([self.config_JPmap.width / 2, self.config_JPmap.height / 2])
                .scale(self.config_JPmap.scale);
            let geoPath = d3.geoPath().projection(aProjection);
            let svg = d3.select(self.config_JPmap.parent).attr("width", self.config_JPmap.width).attr("height", self.config_JPmap.height);

            // 色の範囲を指定
            var color = d3.scaleLinear()
                .interpolate(d3.interpolateHcl)
                .domain([self.config_JPmap.range_min, self.config_JPmap.range_max])
                .range(["white", "black"])

            //マップ描画
            let map = svg.selectAll("path").data(japan.features)
                .enter()
                .append("path")
                .attr("d", geoPath)
                .attr(`stroke`, `#666`)
                .attr(`stroke-width`, 0.25)
                // .attr(`fill`, `#2566CC`)
                .attr(`fill-opacity`, 1)
                .on('mouseover', function(d) {
                    d3.select('#tooltip')
                        .style('opacity', 1)
                        .html(`<div class="tooltip-label">人口密度</div>(${d.properties.name_local} : ${d.properties.density} 人/km2")`)
                })
                .on("mousemove", function(e) {
                    d3.select('#tooltip')
                        .style("top", (e.pageY - 200) + "px")
                        .style("left", (e.pageX + 100) + "px");
                })
                .on('mouseleave', () => {
                    d3.select('#tooltip')
                        .style('opacity', 0); //不透明度(完全に透過)
                });

            self.init_flag = false;


            map.transition()
                .duration(400)
                .style("fill", function(d) {
                    var value = d.properties.density;
                    return color(value);
                });

            //ズームイベント設定    
            let zoom = d3.zoom().on('zoom', function() {
                aProjection.scale(self.config_JPmap.scale * d3.event.transform.k);
                map.attr('d', geoPath);
            });
            svg.call(zoom);

            //ドラッグイベント設定
            let drag = d3.drag().on('drag', function() {
                let tl = aProjection.translate();
                aProjection.translate([tl[0] + d3.event.dx, tl[1] + d3.event.dy]);
                map.attr('d', geoPath);
            });
            map.call(drag);

        }
    }
}

///////////////////////////////////bar chart(change bar orientation)/////////////////////////////////////////////
class BarChart_diff_orient {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 20, right: 20, bottom: 20, left: 20 },
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`)
            .attr('id', 'chart_group');

        //Initialize axis scales
        self.xscale = d3.scaleBand()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height - self.config.margin.bottom, self.config.margin.top_title]);

        //Initialize axes
        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(47)
            .tickSize(4)
            .tickPadding(8)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(5)
            .tickSize(4)
            .tickPadding(8)
            .tickSizeOuter(0);
    }

    update() {
        let self = this;
        const ymax = d3.max(self.data, d => d.dense);
        const ymin = d3.min(self.data, d => d.dense);

        self.xscale
            .domain(self.data.map(d => d.pref))
            .paddingInner(0.1);

        self.yscale
            .domain([ymin, ymax]);

        self.render();
    }

    render() {
        let self = this;
        let title = "TEST_CHART_TITLE";
        let duration = 500;

        //Draw the axis
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height - self.config.margin.bottom})`)
            .call(self.xaxis)
            .append('text')
            .text('food name')
            .attr('x', self.inner_width / 2)
            .attr('y', self.config.margin.bottom)
            .attr("font-size", "18px")
            .attr("fill", "black")
            .attr('text-anchor', 'middle')
            .attr("stroke-width", 1)


        self.yaxis_group = self.chart.append('g')
            //.attr('transform', `translate(${self.config.margin.left}, 0)`)
            .call(self.yaxis)
            .append('text')
            .text('price')
            .attr('x', -self.inner_height / 2)
            .attr('y', -self.config.margin.left / 2)
            .attr("font-size", "18px")
            .attr("fill", "black")
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .attr("stroke-width", 1);

        self.chart_title = self.chart.append('g')
            .attr('id', 'chart_title');

        self.chart_label = self.chart.append('g')
            .attr('id', 'chart_label');

        // Draw bars
        self.chart.selectAll("rect").data(self.data)
            //.append("rect")
            .enter()
            .append("rect")
            .transition().duration(duration)
            .attr("x", d => self.xscale(d.pref))
            .attr("y", d => self.yscale(d.dense))
            .attr("fill", d => d.c)
            .transition().duration(duration)
            .attr("fill", d => d.c)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("width", self.xscale.bandwidth())
            .attr("height", d => self.inner_height - self.config.margin.bottom - self.yscale(d.dense));

        self.chart.select('#chart_title')
            .append('text')
            .attr('font-size', '30px')
            .attr('font-weight', 'bold')
            .text(title)
            .attr('transform', `translate(${(self.inner_width - title.length) / 3}, ${self.config.margin.top})`);

        // Draw labels
        const px_label = 20
        self.chart.selectAll('#chart_group').data(self.data)
            // .join('text')
            .enter().append("text")
            .transition().duration(duration)
            //.text(function(d) { return d.label; })
            .text(d => d.dense)
            .attr("x", d => self.xscale(d.pref) + px_label)
            .attr("y", d => self.yscale(d.dense) + px_label)
            .attr("fill", "white")
            .attr('font-size', px_label)
            .attr('font-weight', 'bold')
            .attr("stroke", "black")
            .attr("stroke-width", 0.3)
    }
    hide() {
        let self = this;
        self.xaxis_group.remove();
        self.yaxis_group.remove();
        self.chart_label.remove();
        self.chart.selectAll("rect").remove();
    }
    reverse() {
        let self = this;
        self.data.reverse();
        self.chart_label.remove();
        //self.chart.selectAll("rect").remove();
        self.chart.selectAll("text").remove();
        self.update();
    }
    sort(asc) {
        let self = this;
        self.data.sort((a, b) => asc * (a.dense - b.dense));
        self.chart_label.remove();
        //self.chart.selectAll("rect").remove();
        self.chart.selectAll("text").remove();
        self.update();
    }
    origin() {
        let self = this;
        self.data = self.data_origin;
        self.chart_label.remove();
        //self.chart.selectAll("rect").remove();
        //self.chart.selectAll("text").remove();
        self.update();
    }
}