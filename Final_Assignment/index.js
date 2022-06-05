import geoJson from "https://10matcho27.github.io/InfoVis2022/Final_Assignment/assets/japan.geo.json";
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
            width: 400,
            height: 400,
            centerPos: [137.0, 38.2],
            scale: 1000,
            margin: { top: 20, right: 20, bottom: 20, left: 20, top_title: 30 },
        };

        let japan = new Japan(config, data);
        japan.update();

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

        const projection = d3.geoMercator()
            .center(self.config.centerPos)
            .scale(self.config.scale)
            .translate(self.inner_width / 2, self.inner_height / 2);

        const path = d3.geoPath().projection(projection);

        self.svg = d3.select(self.config.parent)
            .append('svg')
            .attr('viewBox', `0 0 ${self.config.width} ${self.config.height}`)
            .attr('width', self.config.width)
            .attr('height', self.config.height);
    }

    update() {
        let self = this;
        self.render();
    }

    render() {
        let self = this;

        self.svg.selectAll('path')
            .data(geoJson.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr(`stroke`, `#666`)
            .attr(`stroke-width`, 0.25)
            .attr(`fill`, `#2566CC`)
            .attr(`fill-opacity`, (item) => {
                // メモ
                // item.properties.name_ja に都道府県名が入っている

                // 透明度をランダムに指定する (0.0 - 1.0)
                return Math.random();
            })
    }
}