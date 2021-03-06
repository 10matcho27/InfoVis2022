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
            width: 256 * 2,
            height: 256 * 2,
            margin: { top: 20, right: 20, bottom: 20, left: 20 },
            margin_text: { top: 40, right: 10, bottom: 40, left: 30 },
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
            margin_text: config.margin_text || { top: 10, right: 10, bottom: 10, left: 10 }
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
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([self.config.margin.left + self.config.margin_text.left, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([self.config.margin_text.left, self.inner_height - self.config.margin_text.top]);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(8)
            .tickSize(4)
            .tickPadding(8);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(8)
            .tickSize(4)
            .tickPadding(8);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height - self.config.margin_text.bottom})`);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(${self.config.margin.left + self.config.margin_text.left}, 0)`);

        self.text_chartName = self.chart.append('g')
            .attr('id', 'text_chartName')
            .attr('transform', `translate(${(self.config.width - self.config.margin_text.left * 4) / 2}, ${self.config.margin.top})`);

        self.text_xaxis = self.chart.append('g')
            .attr('id', 'text_xaxis')
            .attr('transform', `translate(${(self.config.width - self.config.margin_text.left) / 2}, ${self.inner_height + self.config.margin.bottom})`);

        self.text_yaxis = self.chart.append('g')
            .attr('id', 'text_yaxis')
            .attr('transform', `translate(0, ${(self.config.height - self.config.margin.top) / 2})`);

    }

    update() {
        let self = this;

        const xmin = d3.min(self.data, d => d.x);
        const xmax = d3.max(self.data, d => d.x);

        const ymin = d3.min(self.data, d => d.y);
        const ymax = d3.max(self.data, d => d.y);

        self.xscale.domain([xmin - self.config.margin.left, xmax + self.config.margin.right]);
        self.yscale.domain([ymax + self.config.margin.bottom, ymin - self.config.margin.top]);

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

        self.svg.select('#text_chartName')
            .append('text')
            .attr('font-size', '30px')
            .attr('font-weight', 'bold')
            .text('Scatter Plot');

        self.svg.select('#text_xaxis')
            .append('text')
            .attr('font-size', '20px')
            .attr('font-weight', 'bold')
            .attr('dx', '-0.5em')
            .text('X Axis');

        self.svg.select('#text_yaxis')
            .append('text')
            .attr('font-size', '20px')
            .attr('font-weight', 'bold')
            .attr('transform', 'rotate(-90)')
            //.attr('dy', '1em')
            .text('Y Axis');


        self.xaxis_group.call(self.xaxis);
        self.yaxis_group.call(self.yaxis);
    }
}