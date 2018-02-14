(function (root) {
    var WATER = root.SHRI_ISLANDS.WATER;
    var ISLAND = root.SHRI_ISLANDS.ISLAND;

    /**
     * Функция находит кол-во островов на карте
     * ВАЖНО! Сигнатуру функции изменять нельзя!
     *
     * @param {number[][]} map карта островов представленная двумерной матрицей чисел
     * @returns {number} кол-во островов
     */
    function solution(map) {
        var c = 0;
        for (y = 0; y < map.length; y++) {
            row = map[y];
            for (x = 0; x < row.length; x++) {
                cell = row[x];
                
                if(cell==ISLAND && ((y==0 && x==0) || (y==0 && map[y][x-1]!=ISLAND) || (x==0 && map[y-1][x]!=ISLAND) || (map[y][x-1]!=ISLAND && map[y-1][x]!=ISLAND) )){
                    c++;
                }
            }

        }
       
        // todo: подсчитать кол-во островов на карте
        return c;
    }

    root.SHRI_ISLANDS.solution = solution;
})(this);
