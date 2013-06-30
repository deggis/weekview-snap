

var weekview_app = {};


// builds tree object from project object list
// where objects have id and possible parent_id fields.
function build_project_tree (projects) {
    var root = { id: 0, name: 'root' };
   
    // create reverse index
    var childrenOfParents = {};

    projects.forEach( function (e,i,a) {
        var parent;
        if (e.parent) {
            parent = e.parent;
        } else {
            parent = 0;
        }

        if ( !childrenOfParents[parent] ) {
            childrenOfParents[parent] = [];
        }

        childrenOfParents[parent].push(e);
    });

    // recursively find & add children
    var insertChildren = function (parent) {
        if ( childrenOfParents[parent.id] ) {
            parent.children = childrenOfParents[parent.id].slice(0); // clone
            parent.children.forEach( function (child,i,a) {
                insertChildren(child);
            });
            // TODO: sort
        }
        
    };

    insertChildren(root);   
    
    return root;
}

// build dict of objects containing `id` attribute
function build_id_index (dataset) {
    var index = {};

    dataset.forEach ( function (e,i,a) {
        index[e.id] = e;
    });
    
    return index;
}


var p;

function build_form (root) {

    // appends project and its children to given string
    var project_options = function (project, s, margin) {
        var s = '';
        
        // TODO: ugly padding; nested options not coming to Bootstrap,
        // should use different selector
        
        var padding = Array(margin*4).join('&nbsp;');
        var project_option = '<option value="'+project.id+'">' + padding + project.name + '</option>';
        
        if (project.name != 'root') {
            s += project_option;
        }
        if (project.children) {
            project.children.forEach( function(project) {
                s += project_options(project, s, margin+1);
            });
        }
        return s;
    };
    
    var s = '<form> \
      <fieldset> \
      <legend>Session details</legend>';
    
    
    s += ' \
        <label for="project_id">Project</label> \
        <select id="project_id"> \
          ' + project_options(root, s, 0) + ' \
        </select>';
    
    s += '<label for="time_start">Begin</label> \
         <input id="time_start" type="text" placeholder="Time before">';

    s += '<label for="time_end">End</label> \
          <input id="time_end" type="text" placeholder="E.g. now">';

    s += '<label for="description">Description</label> \
          <input id="description" type="text" placeholder="Something">';
    
    s += ' \
        <br /><button class="btn btn-primary" type="button" id="send_session">Send</button> \
      ';
   
    s += '</fieldset></form>';

    $('#weekview_form').html(s);
    $('#send_session').click(send_session);
    
    
}

function send_session () {
    alert('jeah');
    var session_data = {};
    session_data.project_id    = parseInt($('#project_id').val(), 10);
    session_data.start         = $('#time_start').val();
    session_data.end           = $('#time_end').val();
    session_data.description   = $('#description').val();

    $.post('/session/save', {'session' : JSON.stringify([session_data])}, function (data) {
        console.log(data);
    });
}

function show_latest_sessions (projects, sessions, container) {
    $(container).html('<p>Loading ...</p>');
    var project_index = build_id_index(projects);

    s = '<table class="table">';
    s += '<tr> \
      <th>Project</th> \
      <th>Session start</th> \
      <th>Session end</th> \
      <th>Description</th> \
    </tr>';
    
    sessions.forEach( function (session,i,a) {
        var _project = project_index[session.projectId].name;
        var _start   = session.start;
        var _end     = session.end;
        var _desc    = session.description;
        s += '<tr> \
          <td>' + _project + '</td> \
          <td>' + _start   + '</td> \
          <td>' + _end     + '</td> \
          <td><span class="small-description">' + _desc    + '</span></td> \
        </tr>';
    });
    
    s += '</table>';

    $(container).html(s);
}


weekview_app.run = function () {
    var div = $('#weekview');

    $(div).html('<div class=""> \
       <div id="weekview_main" class="span6"> \
         <h2>Latest sessions</h2> \
         <div id="weekview_latest"> \
         </div> \
         <h2>Add a new session</h2> \
         <div id="weekview_form" class=""> \
         </div> \
       </div> \
    </div>');
    $.get('/project/all', function(data) {
        var projects = eval(data);
        build_form(build_project_tree(projects));
        $.get('/session/all', function(data) {
            var sessions = eval(data).slice(-6); // get only latest
            show_latest_sessions(projects, sessions, '#weekview_latest');
        });
    });

};

$(document).ready(function() {
    weekview_app.run();
});
