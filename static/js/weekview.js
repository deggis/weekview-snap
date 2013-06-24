

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
        <select> \
          ' + project_options(root, s, 0) + ' \
        </select>';
    
    s += '<label for="time_start">Begin</label> \
         <input id="time_start" type="text" placeholder="Time before">';

    s += '<label for="time_end">End</label> \
          <input id="time_end" type="text" placeholder="E.g. now">';

    s += '<label for="description">Description</label> \
          <input id="description" type="text" placeholder="Something">';
    
    s += ' \
        <br /><button class="btn btn-primary" type="button">Send</button> \
      ';
   
    s += '</fieldset></form>';

    $('#weekview_form').html(s);
}



weekview_app.run = function () {
    var div = $('#weekview');

    $(div).html('<div class=""> \
       <div id="weekview_main" class="span6"> \
         <h2>Add a new session</h2> \
         <div id="weekview_form" class=""> \
         </div> \
       </div> \
    </div>');
    $.get('/projects', function(data) {
        build_form(build_project_tree(eval(data)));
    });

};

$(document).ready(function() {
    weekview_app.run();
});
