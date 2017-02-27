var global_light_direction_array = null;
var global_pathway = null;
// var my_node_id = null;

// Create the agent.
create_agent = function() {
    console.log("before create_agent")
    // console.log("my_node_id")
    // console.log(my_node_id)
    
    reqwest({
        url: "/node/" + participant_id,
        method: 'post',
        type: 'json',
        success: function (resp) {
            my_node_id = resp.node.id;
            console.log("after create_agent")
            console.log("my_node_id")
            console.log(my_node_id)
            get_info(my_node_id);
        },
        error: function (err) {
            console.log(err);
            errorResponse = JSON.parse(err.response);
            if (errorResponse.hasOwnProperty('html')) {
                $('body').html(errorResponse.html);
            } else {
                allow_exit();
                go_to_page('questionnaire');
            }
        }
    });
    console.log("sent request for create_agent")
    
};

set_mapping = function(mapping) {
    console.log("ran set_mapping")
    global_light_direction_array = mapping;
};

get_mapping = function() {
    console.log("ran get_mapping")
    if (!(global_light_direction_array === null)) {
        return global_light_direction_array.slice(0);
    }
    return null;
};

set_pathway = function(pathway) {
    console.log("ran set_pathway")
    global_pathway = pathway;
};

get_pathway = function() {
    console.log("ran get_pathway")
    if (!(global_pathway === null)) {
        return global_pathway.slice(0);
    }
    return null;
};

get_info = function() {
    if (my_node_id == null) {
        create_agent();
    }
    console.log("Before get_info")
    console.log("global_light_direction_array: ")
    console.log(global_light_direction_array)
    reqwest({
        url: "/node/" + my_node_id + "/received_infos",
        method: 'get',
        type: 'json',
        success: function (resp) {
            contents = resp.infos[0].contents;
            global_light_direction_array = contents.get("mapping");
            global_pathway = contents.get("pathway");
            // storyHTML = markdown.toHTML(story);
            // $("#story").html(storyHTML);
            // $("#stimulus").show();
            // $("#response-form").hide();
            // $("#finish-reading").show();
        },
        error: function (err) {
            console.log(err);
            // errorResponse = JSON.parse(err.response);
            // $('body').html(errorResponse.html);
        }
    });
    console.log("sent request for get_info")
    console.log("after get_info")
    console.log("global_light_direction_array: ")
    console.log(global_light_direction_array)
};

finish_reading = function() {
    console.log("ran finish_reading")
    $("#stimulus").hide();
    $("#response-form").show();
    $("#submit-response").removeClass('disabled');
    $("#submit-response").html('Submit');
};

submit_response = function(mapping, position_log) {
    console.log("ran submit_response")
    // $("#submit-response").addClass('disabled');
    // $("#submit-response").html('Sending...');

    // response = $("#reproduction").val();
    // response = position_log;

    // $("#reproduction").val("");

    if (my_node_id === null) {
        create_agent()
    }

    reqwest({
        url: "/info/" + my_node_id,
        method: 'post',
        data: {
            contents: {
                "mapping": mapping,
                "pathway": position_log
            },
            info_type: "Info"
        },
        success: function (resp) {
            // create_agent();
        }
    });
};


