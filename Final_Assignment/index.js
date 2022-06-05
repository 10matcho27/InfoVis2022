d3.csv("https://10matcho27.github.io/InfoVis2022/Final_Assignment/assets/pref_data_dense.csv", data => {
    data.forEach(d => {
        d.dense = +d.dense;
        d.pref = d.pref
    })
    let config = {
        parent: '#drawing_region',
        width: 1000,
        height: 1000,
        scale: 1500,
        margin: { top: 20, right: 20, bottom: 20, left: 20, top_title: 30 },
    };

    let japan_map = new Japan(config, data);

})

class Japan {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 20, right: 20, bottom: 20, left: 20 },
        }
        this.data = data;
        this.init_flag = true;
        this.init();
    }


    init() {
        let self = this;
        let width = 600,
            height = 600;
        let scale = 1500;

        let dense_max = d3.max(self.data, d => d.dense);
        let dense_min = d3.min(self.data, d => d.dense);

        d3.json("https://10matcho27.github.io/InfoVis2022/Final_Assignment/assets/japan.geojson", createMap);

        function createMap(japan) {
            let aProjection = d3.geoMercator()
                .center([136.0, 35.6])
                .translate([width / 2, height / 2])
                .scale(scale);
            let geoPath = d3.geoPath().projection(aProjection);
            let svg = d3.select("svg").attr("width", width).attr("height", height);
            // 色の範囲を指定
            let color = d3.scaleQuantize()
                .range([
                    "rgb(191,223,255)",
                    "rgb(153,204,255)",
                    "rgb(115,185,253)",
                    "rgb(77,166,255)",
                    "rgb(38,147,255)",
                    "rgb(0,128,255)",
                    "rgb(0,109,217)",
                    "rgb(0,89,178)",
                    "rgb(0,70,140)",
                    "rgb(0,51,102)"
                ]);

            color.domain([dense_min, dense_max]);

            // for (let i = 0; i < self.data.length; i++) {
            //     let dataState = self.data[i].pref;
            //     let dataValue = parseFloat(self.data[i].dense);
            //     for (let j = 0; j < japan.features.length; j++) {
            //         let jsonState = japan.features[j].properties.name_local;
            //         if (dataState == jsonState) {
            //             japan.features[j].properties.value = dataValue;
            //             break;
            //         }
            //     }
            // }

            //マップ描画
            let map = svg.selectAll("path").data(japan.features)
                //if (self.init_flag) {
                .enter()
                .append("path")
                .attr("d", geoPath)
                .attr(`stroke`, `#666`)
                .attr(`stroke-width`, 0.25)
                .attr(`fill`, `#2566CC`)
                .attr(`fill-opacity`, 1)
                .on('mouseover', function(d) {
                    d3.select('#tooltip')
                        .style('opacity', 1)
                        .html(`<div class="tooltip-label">人口密度</div>(${d.properties.name_local} : ${d.properties.density} 人/km2")`)
                })
                .on("mousemove", function(e) {
                    d3.select('#tooltip')
                        .style("top", (e.pageY - 20) + "px")
                        .style("left", (e.pageX + 10) + "px");
                })
                .on('mouseleave', () => {
                    d3.select('#tooltip')
                        .style('opacity', 0); //不透明度(完全に透過)
                });

            self.init_flag = false;
            //}


            map.transition()
                .duration(400)
                .style("fill", function(d) {
                    //$loading.style('display', 'none');
                    var value = d.properties.density;
                    return color(value);
                });

            //ズームイベント設定    
            let zoom = d3.zoom().on('zoom', function() {
                aProjection.scale(scale * d3.event.transform.k);
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

            //svg.selectAll("path").data(self.data).enter().attr('fill-opacity', d => { return d.dense / dense_max })
        }
    }
}