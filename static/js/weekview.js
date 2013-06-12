

var weekview_app = {};


function build_form (projects) {
    
    var s = '<form>';
    s += '<select>';
    for (i = 0; i < projects.length; i++) {
        s += '<option value="'+projects[i].id+'">';
        s += projects[i].name;
        s += '</option>';
    }
    s += '</select>';

    var sd = '<div class="input-append date form_datetime">';
    sd += '<input size="16" type="text" value="2012-06-15 14:45" readonly>';
    sd += '<span class="add-on"><i class="icon-th"></i></span>';
    sd += '</div>';

    s += sd;
    s += sd;

    s += '</form>';

    console.log(s);
    $('#weekview_form').html(s);
    $('.form_datetime').datetimepicker({
        autoclose: 1,
        todayHighlight: 1,
        todayBtn: true,
        pickerPosition: 'bottom-left'
    });
}



weekview_app.run = function () {
    var div = $('#weekview');

    $(div).html('<div id="weekview_form" class="container"></div>');
    $.get('/projects', function(data) {
        build_form(eval(data));
    });

};
