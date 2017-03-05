$(document).ready(function() {
    console.log('jquery was correctly sourced!');
    getToDoData();

    function getToDoData() {
        $.ajax({
            type: 'GET',
            url: '/toDoTable',
            success: function(response) { //get rows then loop through rows
                console.log('response', response); //response is an array of task objects (defined by SQL on client side)
                $('#taskTableBody').empty(); // clears the tasks currently in the table
                for (var i = 0; i < response.length; i++) { //Loops through the task array (the response array)
                    var currentTaskInfo = response[i]; //More legible for code below
                    var $newTaskInfo = $('<tr>'); //create a new row for each task info
                    $newTaskInfo.data('id', currentTaskInfo.id); //adds data ID to the task object so can call it later
                    console.log(currentTaskInfo.id);
                    console.log($newTaskInfo);
                    //innerHTML:"<td>Find a genie in a bottle</td><td>I'll get around to it</td><td><input class="checkComplete" type="checkbox" name="checkComplete" value="">Completed task</td><td><input class="deleteButton" type="checkbox" name="checkDelete" value="">Delete task</td>"
                    //innerText:"Find a genie in a bottle	I'll get around to it	Completed task	Delete task"
                    $newTaskInfo.append('<td>' + currentTaskInfo.description + '</td>'); //show user the author
                    if (currentTaskInfo.complete === true) {
                        $newTaskInfo.append('<td class="gotErDone">Yes! Got \'er Done!</td>');
                        $newTaskInfo.append('<td><input class="completeButtonChecked" type="checkbox" name="checkComplete" value="completed" checked>Completed task</td>');
                    } else {
                        $newTaskInfo.append('<td>I\'ll get around to it</td>');
                        $newTaskInfo.append('<td><input class="completeButton" type="checkbox" name="checkComplete" value="">Completed task</td>');
                    }

                    $newTaskInfo.append('<td><input class="deleteButton" type="checkbox" name="checkDelete" value="">Delete task</td>');
                    $('#taskTableBody').append($newTaskInfo);
                    console.log($newTaskInfo);
                } // end for loop
            } // end success
        }); //end ajax
    } //end getToDoTable

    $('#taskTableBody').on('click', '.deleteButton', function() {
        console.log('DeleteButton Clicked');
        var idOfTaskToDelete = $(this).parent().parent().data().id;
        console.log('The id to delete is: ', idOfTaskToDelete);
        $.ajax({
            type: 'DELETE',
            url: '/delete/' + idOfTaskToDelete,
            success: function(response) {
                console.log(response);
                getToDoData();
            } // end success
        }); //end ajax
    }); //end on click


    $('#taskTableBody').on('click', '.completeButton', function() {
        console.log('CompleteButton Clicked');
        var idOfTaskCompleted = $(this).parent().parent().data().id;
        console.log('The id of task completed is: ', idOfTaskCompleted);
    $.ajax({
        type: 'PUT',
        url: '/update/' + idOfTaskCompleted,
        data: idOfTaskCompleted,
        success: function(response) {
            console.log(response);
            getToDoData();
        } // end success
    }); //end of AJAX
}); // end of click

$('#newTaskButton').on('click', function() {
var newTaskObject = {};
var description;
newTaskObject.description = $('#newTaskInput').val();
console.log('new Task Object', newTaskObject);
$.ajax({
    type: 'POST',
    url: '/newTask',
    data: newTaskObject,
    success: function(response) {
        console.log(response);
        getToDoData();
    } // end success
}); //end ajax
}); //end on click


}); //end of doc ready
