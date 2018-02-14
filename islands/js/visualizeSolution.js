(function (root) {
    var WATER = root.SHRI_ISLANDS.WATER;
    var ISLAND = root.SHRI_ISLANDS.ISLAND;
    
    var speed=1; // счетчик найденных островов
    var c=0; // счетчик найденных островов
    var rows = 0; // всего строк
    var columns = 0; // всего колонок
    var steps = 0; // всего ячеек для проверки
    var active_step = 0; // проверено ячеек
    var row = 0; // активная строка
    var column = 0; // активная колонка
    var step = 0; // шаг цикла
    var delay = 5; //Задержка при начали визуализации
    var status = 0; // Статус при проверки ячейки
    var status_el; // Элементов с текстом статуса
    /**
     * Бонусное задание.
     * Необходимо взять реализацию функции solution и доработать,
     * добавив функционал, который позволит пошагово визуализировать работу данного алгоритма.
     * Сигнатуру функции можно выбрать наиболее удобную для вашей визуализации
     */
    function clearClass() {
        for (y = 0; y < rows; y++) {
            for (x = 0; x < columns; x++) {
                var clear_el = el.children[ch+y].children[x];
                clear_el.classList.remove('active__cell');
                clear_el.classList.remove('check__island__cell');
                clear_el.classList.remove('active__island__cell');
            }
        }
    }

    function visualizeSolution(map) {
        if(step==0){
            rows = map.length;
            columns = map[0].length;
            steps = rows*columns;
            el = document.querySelector('.map');
            for(i=0;i<el.children.length;i++){
                if(el.children[i].classList.contains('map__row')){
                    ch = i;
                    break;
                }
            }
            
            document.querySelector('.outer').appendChild(document.createElement('div')).className = "aClass";
            status_el = document.querySelector('.aClass');
            status_el.textContent='Через '+(delay*speed)+' секунд начнется визуализация';
            
        }
        if(step>delay){
            if(status == 0){
                if(active_step%columns==0 && active_step!=0){
                    row++;
                    column=0;
                }
                clearClass();
                el.children[ch+row].children[column].classList.add('active__cell');
                status_el.textContent='Проверяем строку '+(row+1)+", столбец "+(column+1);
            }else if(status == 1){
                if(map[row][column]==ISLAND){
                    status_el.textContent='Остров!!!!!';
                    tmp_el = el.children[ch+row].children[column];
                    tmp_el.classList.remove('active__cell');
                    tmp_el.classList.add('active__island__cell');
                }else{
                    status=5;
                    status_el.textContent='Остров не найден';
                }
            }else if(status == 2){
                status_el.textContent='Проверим является ли остров продолжением уже ранее найденного:)';
            }else if(status == 3){
                if(row == 0 && column == 0){
                    status_el.textContent='Это новый остров!!! Добавим в счетчик значение.';
                    c++;
                    status=5;
                }else{
                    if(column!=0) el.children[ch+row].children[column-1].classList.add('check__island__cell');
                    if(row!=0) el.children[ch+row-1].children[column].classList.add('check__island__cell');
                }
            }else if(status == 4){
                active = 0;
                if(column!=0 && map[row][column-1] == ISLAND){
                    tmp_el = el.children[ch+row].children[column-1];
                    tmp_el.classList.remove('check__island__cell');
                    tmp_el.classList.add('active__island__cell');
                    active = 1;
                }
                if(row!=0 && map[row-1][column] == ISLAND){
                    tmp_el = el.children[ch+row-1].children[column];
                    tmp_el.classList.remove('check__island__cell');
                    tmp_el.classList.add('active__island__cell');
                    active = 1;
                }
                if(active == 1) status_el.textContent='Остров является продолжением';
                else{
                    status_el.textContent='Это новый остров!!! Добавим в счетчик значение.';
                    c++;
                }
            }else if(status == 5){
                column++;
                active_step++;
                status=-1;
            }
            if(status!=5) status++;
            document.querySelector('.map__res').textContent='Count: '+c;
        }
        
        
        if(active_step<steps || status!=0){
            setTimeout(visualizeSolution, (speed*1000),map);
        }else{
            clearClass();
            status_el.textContent='Расчет закончен. Спасибо за выдержку.';
        }
        step++;
    }

    root.SHRI_ISLANDS.visualizeSolution = visualizeSolution;
})(this);
