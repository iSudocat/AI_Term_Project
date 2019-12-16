function searchRoad(map, bgx, bgy, endx, endy) {
    var openList = [],    //OPEN表
        closeList = [],   //CLOSE表
        result = [],      //result数组
        result_index;   //result数组在OPEN表中的序号

    openList.push({ x: bgx, y: bgy, G: 0 });    //将开始点加入到OPEN表中

    do {
        var currentPoint = openList.pop();
        closeList.push(currentPoint);
        var surroundPoint = SurroundPoint(currentPoint);    //获得周围的4个点
        for (var i in surroundPoint) {      //逐个检查周围的4个点
            var item = surroundPoint[i];
            if (
                item.x >= 0 && item.x <= 24 &&                  //是否在地图上
                item.y >= 0 && item.y <= 24 &&
                map[item.x][item.y] != 2 &&         //是否障碍物
                !existList(item, closeList) &&           //是否在CLOSE表中
                map[item.x][currentPoint.y] != 2 &&   //与当前点之间是否有障碍物
                map[currentPoint.x][item.y] != 2
            ) {
                var g = currentPoint.G + 1;
                if (!existList(item, openList)) {
                    item.H = Math.abs(endx - item.x) + Math.abs(endy - item.y); //用曼哈顿距离对到达终点的耗费进行估值
                    item.G = g;
                    item.F = item.H + item.G;
                    item.parent = currentPoint;
                    openList.push(item);
                }
                else {
                    var index = existList(item, openList);

                    if (g < openList[index].G) {
                        openList[index].parent = currentPoint;
                        openList[index].G = g;
                        openList[index].F = g + openList[index].H;
                    }

                }
            }
        }

        if (openList.length == 0) {     //OPEN表空却没有通路，查找失败
            break;
        }
        openList.sort(sortF);   //对OPEN表进行排序，便于下次循环开头直接取出F值最小的点
    } while (!(result_index = existList({ x: endx, y: endy }, openList)));

    if (!result_index) {
        result = [];
    }
    else {
        var currentObj = openList[result_index];
        do {
            result.unshift({
                x: currentObj.x,
                y: currentObj.y
            });
            currentObj = currentObj.parent;
        } while (currentObj.x != bgx || currentObj.y != bgy);
        result.unshift({
            x: bgx,
            y: bgy
        });
    }
    return result;

}

function sortF(a, b) {     //以F进行排序
    return b.F - a.F;
}

function SurroundPoint(curPoint) {      //取周围四点的值
    var x = curPoint.x, y = curPoint.y;
    return [
        { x: x, y: y - 1 },
        { x: x, y: y + 1 },
        { x: x - 1, y: y },
        { x: x + 1, y: y }
    ]
}

function existList(point, list) {
    for (var i in list) {
        if (point.x == list[i].x && point.y == list[i].y) {
            return i;
        }
    }
    return false;
}