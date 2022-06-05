d3.csv("https://10matcho27.github.io/InfoVis2022/Final_Assignment/js/mikan.csv")
    .then(data => {
        data.forEach(d => {
            //label,value,i,x,y,r,c
            // d.label = d.label;
            d.value = +d.value;
            // d.i = d.i
            // d.x = +d.x;
            // d.y = +d.y;
            // d.r = +d.r;
            // d.c = d.c;
        })
        var config = {
            parent: '#drawing_region',
            width: 600,
            height: 600,
            scale: 1500,
            margin: { top: 20, right: 20, bottom: 20, left: 20, top_title: 30 },
        };

        let japan_map = new Japan(config, data);
        japan_map.update();

    })
    .catch(error => {
        console.log(error);
    });

class Japan {
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

        self.projection = d3.geoMercator()
            .center([136.0, 35.6])
            .scale(self.config.scale)
            .translate(self.inner_width / 2, self.inner_height / 2);

        self.geoPath = d3.geoPath(self.projection);

        self.svg = d3.select(self.config.parent)
            .append('svg')
            .attr('width', self.config.width)
            .attr('height', self.config.height);
        self.chart = self.svg.append('g')
    }

    update() {
        let self = this;
        d3.json("https://10matcho27.github.io/InfoVis2022/Final_Assignment/assets/japan.geo.json")
            .then(function(jpn) {
                //マップ描画
                self.chart.selectAll("path").data(jpn.features)
                    .enter()
                    .append("path")
                    .attr("d", self.geoPath)
                    .style("stroke", "#ffffff")
                    .style("stroke-width", 0.1)
                    .style("fill", "#5EAFC6");

                //ズームイベント設定    
                var zoom = d3.zoom().on('zoom', function() {
                    self.projection.scale(scale * d3.event.transform.k);
                    map.attr('d', self.geoPath);
                });
                self.chart.call(zoom);
            })
            .catch(error => {
                console.log(error);
            });
    }
}