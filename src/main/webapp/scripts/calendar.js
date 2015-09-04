CALENDAR = {
    "REQUEST_URL": "test-sources/calendar-data.json",

    getCalendarData: function () {
        var monthsList = [];
        $.ajax({
            url: CALENDAR.REQUEST_URL,
            dataType: 'json',
            async: false,
            success: function (data) {
                $.each(data.months, function (index, month) {
                    var monthElement = {
                        indexInYear: month.index_in_year,
                        name: month.name,
                        days: [],
                        year: month.year
                    };
                    var days = [];
                    $.each(month.days, function (index, day) {
                        var dayElement = {
                            dayIndex: day.day_index,
                            dayOfAWeek: day.day_of_a_week,
                            isCelebrityDay: day.is_celebrity_day,
                            isToday: day.is_today,
                            dayEventsCount: day.events_count
                        };
                        days.push(dayElement);
                    });
                    monthElement.days = days;
                    monthsList.push(monthElement);
                });
            }
        });
        return monthsList;
    },


    initCalendarBlock: function () {
        var calendarBlock = $("#calendar-block");
        var calendar = CALENDAR.getCalendarData();
        if (calendar != undefined && calendar.length > 0) {
            CALENDAR.showCalendar(calendar, calendarBlock);
        }
    },

    showCalendarContainer: function () {
        $("#calendar-container").show();
    },


    showBeforeMonthString: function (calendarBlock) {
        calendarBlock.append('<span class="glyphicon glyphicon-menu-left show-month-before"/>');
    },

    showAfterMonthString: function (calendarBlock) {
        calendarBlock.append('<span class="glyphicon glyphicon-menu-right show-month-after"/>');
    },


    addDaysNames: function (monthTable) {
        monthTable.append(
            '<thead> ' +
            '<tr> ' +
            '<th class="day-name">Пн</th> ' +
            '<th class="day-name">Вт</th> ' +
            '<th class="day-name">Ср</th> ' +
            '<th class="day-name">Чт</th> ' +
            '<th class="day-name">Пт</th> ' +
            '<th class="day-name">Сб</th> ' +
            '<th class="day-name">Вс</th> ' +
            '</tr> ' +
            '</thead>')
    },


    addDaysElements: function (monthTable, month) {
        var rowsElements = '<tr>';
        var elementIndex = 0;
        $.each(month.days, function (index, day) {
            var dayIndexInWeek = day.dayOfAWeek;
            if (elementIndex == 7) {
                elementIndex = 0;
            }
            while (dayIndexInWeek != elementIndex + 1) {
                rowsElements += '<td></td>';
                elementIndex++;
            }
            var dayId = 'year_' + month.year + "_month_" + month.indexInYear + '_day_' + day.dayIndex;
            if (day.isToday) {
                rowsElements += '<td class="day-element today" id="' + dayId + '">' + day.dayIndex + '</td>';
            } else if (day.isCelebrityDay) {
                rowsElements += '<td class="day-element celebrity-day" id="' + dayId + '">' + day.dayIndex + '</td>';
            } else if (dayIndexInWeek == 6 || dayIndexInWeek == 7) {
                rowsElements += '<td class="day-element sunday-saturday" id="' + dayId + '">' + day.dayIndex + '</td>';
            } else {
                rowsElements += '<td class="day-element" id="' + dayId + '">' + day.dayIndex + '</td>';
            }
            if (dayIndexInWeek == 7) {
                rowsElements += '</tr><tr>'
            }
            elementIndex++;
        });
        if (elementIndex < 7) {
            while (elementIndex != 7) {
                rowsElements += '<td></td>';
                elementIndex++;
            }
        }
        monthTable.append('<tbody>' + rowsElements + '</tbody>')
    },


    addMonth: function (month, calendarBlock) {
        var monthTableId = 'year_' + month.year + "_month_" + month.indexInYear;
        var element =
            '<div class="panel panel-default" style="float: left; margin: 5px">' +
            '<div class="panel-heading">' + month.name + '</div>' +
            '<div class="panel-body" >' +
            '<table class="table  table-bordered" style="border-radius: 3px " id="' + monthTableId + '"></table>' +
            '</div>' +
            '</div>';
        calendarBlock.append(element);
        var monthTable = $("#" + monthTableId);
        CALENDAR.addDaysNames(monthTable);
        CALENDAR.addDaysElements(monthTable, month);
    },


    showCalendar: function (calendar, calendarBlock) {
        CALENDAR.showBeforeMonthString(calendarBlock);
        $.each(calendar, function (index, month) {
            CALENDAR.addMonth(month, calendarBlock);
        });
        CALENDAR.showAfterMonthString(calendarBlock);
        CALENDAR.showCalendarContainer();
    }


}
;