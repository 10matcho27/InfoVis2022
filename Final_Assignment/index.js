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
        width: 800,
        height: 750,
        scale: 2000,
        range_max: 1200,
        range_min: 70,
        margin: { top: 20, right: 20, bottom: 20, left: 20, top_title: 30 },
    };
    let config_BarChart = {
        parent: '#drawing_region_BarChart',
        width: 4800 / 3,
        height: 750,
        margin: { top: 20, right: 20, bottom: 60, left: 80, top_title: 30 },
    };

    const inputSliderBarElement = document.getElementById('inputSlideBar');

    let japan_map = new Japan(config_JPmap, data);
    let bar_chart = new BarChart_diff_orient(config_BarChart, data);
    bar_chart.update();


    inputSliderBarElement.addEventListener('change', function() {
        japan_map.config_JPmap.range_max = inputSliderBarElement.value;
        d3.selectAll("path").remove();
        japan_map.map_render();
    });
    d3.select('#primary').on('click', function(data) {
        bar_chart.industry = 1;
        bar_chart.update_helper();
    })
    d3.select('#secondary').on('click', function(data) {
        bar_chart.industry = 2;
        bar_chart.update_helper();
    })
    d3.select('#tertiary').on('click', function(data) {
        bar_chart.industry = 3;
        bar_chart.update_helper();
    })

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
        self.industry = 1;

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

        // 色の範囲を指定
        self.first_max = d3.max(self.data.map(d => d.first));
        self.first_min = d3.min(self.data.map(d => d.first));

        self.second_max = d3.max(self.data.map(d => d.second));
        self.second_min = d3.min(self.data.map(d => d.second));

        self.third_max = d3.max(self.data.map(d => d.third));
        self.third_min = d3.min(self.data.map(d => d.third));
    }

    update() {
        let self = this;
        self.data.sort((a, b) => -1 * (a.dense - b.dense));
        const ymax = d3.max(self.data, d => d.dense);
        const ymin = d3.min(self.data, d => d.dense);

        self.xscale
            .domain(self.data.map(d => d.pref))
            .paddingInner(0.1)
            // .selectAll("text")
            // .attr('transform', 'rotate(-90)');

        self.yscale
            .domain([ymin, ymax]);
        if (self.industry == 1) {
            self.color = d3.scaleLinear()
                .interpolate(d3.interpolateHcl)
                .domain([self.first_min, self.first_max])
                .range(["white", "green"])

        } else if (self.industry == 2) {
            self.color = d3.scaleLinear()
                .interpolate(d3.interpolateHcl)
                .domain([self.second_min, self.second_max])
                .range(["white", "red"])

        } else if (self.industry == 3) {
            self.color = d3.scaleLinear()
                .interpolate(d3.interpolateHcl)
                .domain([self.third_min, self.third_max])
                .range(["white", "blue"])
        }

        self.render();
    }

    render() {
        let self = this;
        let title = "Pupulation Density of Japan";
        let duration = 500;
        let main_title = function(d) {
                if (self.industry == 1) {
                    return `${title} / Color Map : white to green by primary industry`;
                } else if (self.industry == 2) {
                    return `${title} / Color Map : white to red by second industry`;
                } else if (self.industry == 3) {
                    return `${title} / Color Map : white to blue by tertiary industry`;
                }
            }
            //Draw the axis
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height - self.config.margin.bottom})`)
            .call(self.xaxis)
            .selectAll('text')
            .attr('font-weight', 'bold')
            .attr('transform', 'rotate(-90)')
            .attr('dy', '-1em')
            .attr('dx', '-2.5em')

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height - self.config.margin.bottom + 10})`)
            // .call(self.xaxis)
            .append('text')
            .text('Prefecture name')
            .attr('font-weight', 'bold')
            .attr('x', self.inner_width / 2)
            .attr('y', self.config.margin.bottom)
            .attr("font-size", "25px")
            .attr("fill", "black")
            .attr('text-anchor', 'middle')
            .attr("stroke-width", 1)

        self.yaxis_group = self.chart.append('g')
            //.attr('transform', `translate(${self.config.margin.left}, 0)`)
            .call(self.yaxis)
            .selectAll('text')
            .attr('font-weight', 'bold')

        self.yaxis_group = self.chart.append('g')
            //.attr('transform', `translate(${self.config.margin.left}, 0)`)
            // .call(self.yaxis)
            .append('text')
            .text('Population density [persons/km2]')
            .attr('font-weight', 'bold')
            .attr('x', -self.inner_height / 2)
            .attr('y', -self.config.margin.left / 2 - 15)
            .attr("font-size", "23px")
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
            // .transition().duration(duration)
            .attr("x", d => self.xscale(d.pref))
            .attr("y", d => self.yscale(d.dense))
            // .transition().duration(duration)
            .attr("fill", d => d.c)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("width", self.xscale.bandwidth())
            .attr("height", d => self.inner_height - self.config.margin.bottom - self.yscale(d.dense))
            .transition().duration(duration)
            .style("fill", function(d) {
                if (self.industry == 1) {
                    return self.color(d.first);
                } else if (self.industry == 2) {
                    return self.color(d.second);
                } else if (self.industry == 3) {
                    return self.color(d.third);
                }
            });

        self.chart.select('#chart_title')
            .append('text')
            .attr('font-size', '30px')
            .attr('font-weight', 'bold')
            .text(main_title)
            .attr('transform', `translate(${(self.inner_width) / 5 - 9 * main_title.length}, ${self.config.margin.top})`);
    }
    update_helper() {
        let self = this;
        self.chart.selectAll("rect").remove();
        self.chart.select('#chart_title').selectAll('text').remove();
        self.update();
    }
}