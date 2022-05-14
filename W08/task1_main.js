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

        // const scatter_plot = new ScatterPlot(config, data);
        // scatter_plot.update();

        const bar_chart = new BarChart2(config, data);
        bar_chart.update();
    })
    .catch(error => {
        console.log(error);
    });

///////////////////////////////////bar chart/////////////////////////////////////////////
class BarChart {
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
            .attr("height", self.yscale.bandwidth());

        self.svg.select('#chart_title')
            .append('text')
            .attr('font-size', '30px')
            .attr('font-weight', 'bold')
            .text(title)
            .attr('transform', `translate(${(self.inner_width / 2 - title.length) / 2}, ${self.config.margin.top})`);

    }
}

///////////////////////////////////bar chart(change bar orientation)/////////////////////////////////////////////
class BarChart2 {
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
            .attr("stroke-width", 1);


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
        self.chart.selectAll("rect").data(self.data).enter()
            .append("rect")
            .attr("x", d => self.xscale(d.label))
            .attr("y", d => self.yscale(d.value))
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
}

///////////////////////////////////scatter plot/////////////////////////////////////////////
class ScatterPlot {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left }, ${self.config.margin.top })`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([self.config.margin.left, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([0, self.inner_height]);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(8)
            .tickSize(4)
            .tickPadding(8);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(8)
            .tickSize(4)
            .tickPadding(8);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(${self.config.margin.left}, 0)`);
    }

    update() {
        let self = this;

        const xmin = d3.min(self.data, d => d.x);
        const xmax = d3.max(self.data, d => d.x);

        const ymin = d3.min(self.data, d => d.y);
        const ymax = d3.max(self.data, d => d.y);

        self.xscale.domain([xmin - self.config.margin.left, xmax + self.config.margin.right]);
        self.yscale.domain([ymin - self.config.margin.top, ymax + self.config.margin.bottom]);

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale(d.x))
            .attr("cy", d => self.yscale(d.y))
            .attr("r", d => d.r)
            .attr("fill", d => d.c)
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        self.xaxis_group.call(self.xaxis);
        self.yaxis_group.call(self.yaxis);
    }
}