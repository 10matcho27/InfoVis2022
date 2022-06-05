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
        dense_max: 1200,
        margin: { top: 20, right: 20, bottom: 20, left: 20, top_title: 30 },
    };
    const inputSliderBarElement = document.getElementById('inputSlideBar');
    let japan_map = new Japan(config, data);
    inputSliderBarElement.addEventListener('change', function() {
        japan_map.config.dense_max = inputSliderBarElement.value;
        d3.selectAll("path").remove();
        japan_map.init();
    });

})

class Japan {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 20, right: 20, bottom: 20, left: 20 },
            dense_max: config.dense_max || 6189,
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

        // let dense_max = d3.max(self.data, d => d.dense);
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
            var color = d3.scaleLinear()
                .interpolate(d3.interpolateHcl)
                .domain([dense_min, self.config.dense_max])
                .range(["white", "black"])

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
            //}


            map.transition()
                .duration(400)
                .style("fill", function(d) {
                    //$loading.style('display', 'none');
                    var value = d.properties.density;
                    // value = value / dense_max;
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