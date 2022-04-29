d3.csv("https://10matcho27.github.io/InfoVis2022/W04/w04_task1.csv")
    .then(data => {
        data.forEach(d => {
            d.x = +d.x;
            d.y = +d.y;
            d.c = d.c;
            d.r = +d.r;
        })

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: { top: 20, right: 20, bottom: 20, left: 20 },
        };

        const scatter_plot = new ScatterPlot(config, data);
        scatter_plot.update();
    })
    .catch(error => {
        console.log(error);
    });

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