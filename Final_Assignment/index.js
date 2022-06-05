d3.csv("https://10matcho27.github.io/InfoVis2022/Final_Assignment/assets/pref_data_dense.csv", data => {
    data.forEach(d => {
        d.dense = +d.dense;
        d.pref = d.pref
    })
    var config = {
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
        this.init();
    }


    init() {
        var width = 600,
            height = 600;
        var scale = 1500;
        d3.json("https://10matcho27.github.io/InfoVis2022/Final_Assignment/assets/japan.geojson", createMap);

        function createMap(japan) {
            var aProjection = d3.geoMercator()
                .center([136.0, 35.6])
                .translate([width / 2, height / 2])
                .scale(scale);
            var geoPath = d3.geoPath().projection(aProjection);
            var svg = d3.select("svg").attr("width", width).attr("height", height);

            //マップ描画
            var map = svg.selectAll("path").data(japan.features)
                .enter()
                .append("path")
                .attr("d", geoPath)
                .style("stroke", "#ffffff")
                .style("stroke-width", 0.1)
                .style("fill", "#5EAFC6")

            //ズームイベント設定    
            var zoom = d3.zoom().on('zoom', function() {
                aProjection.scale(scale * d3.event.transform.k);
                map.attr('d', geoPath);
            });
            svg.call(zoom);

            //ドラッグイベント設定
            var drag = d3.drag().on('drag', function() {
                var tl = aProjection.translate();
                aProjection.translate([tl[0] + d3.event.dx, tl[1] + d3.event.dy]);
                map.attr('d', geoPath);
            });
            map.call(drag);
        }
    }
}