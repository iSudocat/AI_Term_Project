var $table = $('#table')
var $button = $('#run')
var size;
var src;
var mutate_probability;
$(function () {
    $table.bootstrapTable({
        columns: [{
            title: '代数',
            field: 'generation',
            align: 'center',
            width: 100
        }, {
            title: '代中个体序号',
            field: 'id',
            align: 'center',
            width: 150
        }, {
            title: '字符串',
            field: 'src',
            align: 'center',
            width: 500
        }, {
            title: '损失值',
            field: 'cost',
            align: 'center',
            width: 200
        }]
    })

    $button.click(function () {
        document.getElementById("runing").style.display = 'block';
        document.getElementById("run").style.display = 'none';
        size = document.getElementById("input_size").value;
        src = document.getElementById("input_src").value;
        mutate_probability = document.getElementById("input_mutate").value;
        var population = new Population(src, size);

        population.generation();
    })
})

