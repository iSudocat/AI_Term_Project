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

var Gene = function (src) {     //构建染色体
    if (src) this.src = src;
    this.cost;
};
Gene.prototype.src = '';
Gene.prototype.random = function (length) {
    while (length--) {
        this.src += String.fromCharCode(Math.floor(Math.random() * 255));
    }
};
Gene.prototype.mutate = function (chance) {     //变异操作
    if (Math.random() > chance) return;

    var index = Math.floor(Math.random() * this.src.length);
    var upOrDown = Math.random() <= 0.5 ? -1 : 1;
    var newChar = String.fromCharCode(this.src.charCodeAt(index) + upOrDown);
    var newString = '';
    for (i = 0; i < this.src.length; i++) {
        if (i == index) newString += newChar;
        else newString += this.src[i];
    }

    this.src = newString;

};
Gene.prototype.mate = function (gene) {     //交配（使用均匀交叉算法）
    var len = this.src.length;
    var randarray = [];
    for (var i = 0; i < len; i++) {
        randarray[i] = (Math.round() > 0.5 ? 1 : 0);
        if (randarray[i] == 1) {
            t = this.src[i];
            this.src[i] = gene.src[i];
            gene.src[i] = t;
        }
    }
    /*  （亦可用单点交叉算法）
        var pivot = Math.round(this.src.length / 2) - 1;
        var child1 = this.src.substr(0, pivot) + gene.src.substr(pivot);
        var child2 = gene.src.substr(0, pivot) + this.src.substr(pivot);
    */
    return [new Gene(this.src), new Gene(gene.src)];
};
Gene.prototype.calcCost = function (compareTo) {    //计算损失值
    var total = 0;
    for (i = 0; i < this.src.length; i++) {
        total += (this.src.charCodeAt(i) - compareTo.charCodeAt(i)) * (this.src.charCodeAt(i) - compareTo.charCodeAt(i));
    }
    this.cost = total;
};
var Population = function (goal, size) {    //构建种群
    this.members = [];
    this.goal = goal;
    this.generationNumber = 0;
    while (size--) {
        var gene = new Gene();
        gene.random(this.goal.length);
        this.members.push(gene);
    }
};
Population.prototype.display = function () {    //刷新列表 显示当前代
    var rows = []
    for (var i = 0; i < this.members.length; i++) {
        rows.push({
            generation: this.generationNumber,
            id: i,
            src: this.members[i].src,
            cost: this.members[i].cost
        })


    }
    $table.bootstrapTable('load', rows)
};
Population.prototype.sort = function () {   //排序
    this.members.sort(function (a, b) {
        return a.cost - b.cost;
    });
}

Population.prototype.choose = function (probabilitiylist, prosum) {     //轮盘赌选择
    var sum = 0;
    var rand = Math.random();
    for (var i = 0; i < probabilitiylist.length; i++) {
        sum += probabilitiylist[i] / prosum;
        if (sum >= rand) {
            return i;
        }
    }
}

Population.prototype.generation = function () {
    for (var i = 0; i < this.members.length; i++) {
        this.members[i].calcCost(this.goal);
    }
    this.sort();
    this.display();
    this.members.reverse();     //逆序数组，cost最小的（最好的）个体在最后面
    var probabilitiylist = [];
    var pmin = 0.1, pmax = 0.9;
    var a = 1.1, b = 0.2;
    var prosum = 0;
    for (var i = 1; i <= this.members.length; i++) {
        var p = (a - b * i / (this.members.length + 1)) / this.members.length;
        probabilitiylist.push(p);
        prosum = prosum + p;
    }

    for (var i = 1; i <= this.members.length / 4; i++) {    //根据轮盘赌选择的结果繁殖子代，替换掉最差的一半父代，和另一半父代一起作为子代
        var mother = this.members[this.choose(probabilitiylist, prosum)];
        var father = this.members[this.choose(probabilitiylist, prosum)];
        var children = mother.mate(father);
        this.members.splice(2 * i, 2, children[0], children[1]);
    }

    for (var i = 0; i < this.members.length; i++) {
        this.members[i].mutate(mutate_probability);
        this.members[i].calcCost(this.goal);
        if (this.members[i].src == this.goal) {
            this.sort();
            this.display();
            document.getElementById("runing").style.display = 'none';
            document.getElementById("run").style.display = 'block';
            return true;
        }
    }
    this.generationNumber++;
    var scope = this;
    setTimeout(function () {    //循环直到成功
        scope.generation();
    }, 0);
};
