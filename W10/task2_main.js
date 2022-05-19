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

        const scatter_plot = new ScatterPlot(config, data);
        scatter_plot.update();

    })
    .catch(error => {
        console.log(error);
    });

///////////////////////////////////bar chart/////////////////////////////////////////////
class BarChart_nomal {
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

        //Initialize axis scales
        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleBand()
            .range([self.config.margin.top_title, self.inner_height]);

        //Initialize axes
        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(5)
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
        const xmax = d3.max(self.data, d => d.value);

        self.xscale
            .domain([0, xmax])
        self.yscale
            .domain(self.data.map(d => d.label))
            .paddingInner(0.1);

        self.render();
    }

    render() {
        let self = this;
        let title = "Prices of Foods";

        //Draw the axis
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)
            .call(self.xaxis);

        self.yaxis_group = self.chart.append('g')
            //.attr('transform', `translate(${self.config.margin.left}, 0)`)
            .call(self.yaxis);

        self.chart_title = self.chart.append('g')
            .attr('id', 'chart_title')

        // Draw bars
        self.chart.selectAll("rect").data(self.data).enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", d => self.yscale(d.label))
            .attr("fill", d => d.c)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth())

        self.svg.select('#chart_title')
            .append('text')
            .attr('font-size', '30px')
            .attr('font-weight', 'bold')
            .text(title)
            .attr('transform', `translate(${(self.inner_width / 2 - title.length) / 2}, ${self.config.margin.top})`);
    }
    hide() {
        let self = this;
        // self.chart_title.remove();
        self.xaxis_group.remove();
        self.yaxis_group.remove();
        self.chart.selectAll("rect").remove();
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
            .ticks(5)
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
        const xmax = d3.max(self.data, d => d.value);

        self.xscale
            .domain(self.data.map(d => d.label))
            .paddingInner(0.1);

        self.yscale
            .domain([0, xmax]);

        self.render();
    }

    render() {
        let self = this;
        let title = "Prices of Foods";
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
            .join("rect")
            .transition().duration(duration)
            .attr("x", d => self.xscale(d.label))
            .attr("y", d => self.yscale(d.value))
            .attr("fill", d => d.c)
            .transition().duration(duration)
            .attr("fill", d => d.c)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("width", self.xscale.bandwidth())
            .attr("height", d => self.inner_height - self.config.margin.bottom - self.yscale(d.value));

        self.chart.select('#chart_title')
            .append('text')
            .attr('font-size', '30px')
            .attr('font-weight', 'bold')
            .text(title)
            .attr('transform', `translate(${(self.inner_width / 2 - title.length) / 2}, ${self.config.margin.top})`);

        // Draw labels
        const px_label = 20
        self.chart.selectAll('#chart_group').data(self.data).enter()
            .append("text")
            .transition().duration(duration)
            //.text(function(d) { return d.label; })
            .text(d => d.value)
            .attr("x", d => self.xscale(d.label) + px_label)
            .attr("y", d => self.yscale(d.value) + px_label)
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
        self.data.sort((a, b) => asc * (a.value - b.value));
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
        self.chart.selectAll("text").remove();
        self.update();
    }
}

///////////////////////////////////scatter plot/////////////////////////////////////////////
class ScatterPlot {
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

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height - self.config.margin.bottom, self.config.margin.top_title]);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(8)
            .tickSize(4)
            .tickPadding(8)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(8)
            .tickSize(4)
            .tickPadding(8)
            .tickSizeOuter(0);

        self.chart_title = self.chart.append('g')
            .attr('id', 'chart_title');
        self.yaxis_group = self.chart.append('g');
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height - self.config.margin.bottom})`);
    }

    update() {
        let self = this;

        const xmax = d3.max(self.data, d => d.x);
        const ymax = d3.max(self.data, d => d.y);

        self.xscale.domain([0, xmax]);

        self.yscale.domain([0, ymax]);

        self.render();
    }

    render() {
        let self = this;
        let duration = 500;
        let title = "scatter plot";

        self.xaxis_group
            .attr('transform', `translate(0, ${self.inner_height - self.config.margin.bottom})`)
            .call(self.xaxis)
            .append('text')
            .attr('fill', 'black')
            .attr('x', self.inner_width / 2)
            .attr('y', self.config.margin.bottom)
            .attr('font-size', '16px')
            .text('X Axis')
            .attr('stroke', 'black')
            .attr('stroke-width', 0.8);


        self.yaxis_group
            //.attr('transform', `translate(${self.config.margin.left}, 0)`)
            .call(self.yaxis)
            .append('text')
            .attr('x', -self.inner_height / 2)
            .attr('y', -self.config.margin.left / 2)
            .attr('font-size', '16px')
            .text('Y Axis')
            .attr('fill', 'black')
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .attr('stroke', 'black')
            .attr('stroke-width', 0.8);

        self.chart.select('#chart_title')
            .append('text')
            .attr('font-size', '30px')
            .attr('font-weight', 'bold')
            .text(title)
            .attr('transform', `translate(${(self.inner_width / 1.5 - title.length) / 2}, ${self.config.margin.top})`);


        self.xaxis_group.call(self.xaxis);
        self.yaxis_group.call(self.yaxis);

        let circles = self.chart.selectAll("circle").data(self.data).enter().append('circle');

        circles
            .transition().duration(duration)
            .attr("cx", d => self.xscale(d.x))
            .attr("cy", d => self.yscale(d.y))
            .attr("r", d => d.r)
            .attr("fill", d => d.c)
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        circles
            .on('mouseover', (e, d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Position</div>(${d.x}, ${d.y})`);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');

            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0); //不透明度(完全に透過)
            });
    }
}