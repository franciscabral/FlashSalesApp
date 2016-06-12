function hiddenField(value) {
    return '<input id="internalId" type="hidden" value="' + value + '">';
}

function getIndexById(id, arr) {
    for (var index = 0; index < arr.length; index++) {
        if (arr[index].id == id)
            return index;
    }
    return -1;
}

function toBold(param) {
    return "<b>" + param + "</b>";
}

function toCurrency(param) {
    return 'R$ ' + parseFloat(param).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

function toPercent(param, conditionalFormat, red, green) {
    var r = Math.round(parseFloat(param) * 100.0);
    if (conditionalFormat) {
        var colors = ['#800000', '#808000', '#008000'];
        
        if (r <= red){
            colorIdx=0;
        } else if (r >= green){
            colorIdx = 2;
        }else{
            colorIdx = 1;
        }
        
        return '<font color="' + colors[colorIdx] + '">' + r + '%' + '</font>'
    }
    return r + '%'
}

function drawLine(params) {
    var ret = "[";
    ret += isNaN(params[0]) ? "'" + params[0] + "'" : params[0];
    for (var index = 1; index < params.length; index++) {
        ret += ",";
        ret += isNaN(params[index]) || isEmpty(params[index]) ? "'" + params[index] + "'" : params[index]
    }
    ret += "]";

    return ret;
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function businessDays(date) {

    // Copy date
    var t = new Date(date);
    // Remember the month number
    var m = date.getMonth();
    var d = date.getDate();
    var daysPast = 0, daysToGo = 0;
    var day;

    // Count past days
    while (t.getMonth() == m) {
        day = t.getDay();
        daysPast += (day == 0 || day == 6) ? 0 : 1;
        t.setDate(--d);
    }

    // Reset and count days to come
    t = new Date(date);
    t.setDate(t.getDate() + 1);
    d = t.getDate();

    while (t.getMonth() == m) {
        day = t.getDay();
        daysToGo += (day == 0 || day == 6) ? 0 : 1;
        t.setDate(++d);
    }
    return [daysPast, daysToGo, daysPast + daysToGo];
}