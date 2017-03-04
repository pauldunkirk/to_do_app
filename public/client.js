console.log('sourced!');
$(document).ready(function() {
    console.log('jquery was correctly sourced!');
    getToDoData();
    function getToDoData() {
        $.ajax({
            type: 'GET',
            url: '/toDoTable',
            success: function(response) {
                console.log('response', response); //response is an array of task objects (defined by SQL on client side)
                $('#taskTableBody').empty(); // clears the tasks currently in the table
                for (var i = 0; i < response.length; i++) { //Loops through the task array (the response array)
                    var currentTaskInfo = response[i]; //More legible for code below
                    var $newTaskInfo = $('<tr>'); //create a new row for each task info
                    $newTaskInfo.data('id', currentTaskInfo.id); //adds data ID to the task object so can call it later
                    console.log(currentTaskInfo.id);
                    console.log($newTaskInfo);
                    $newTaskInfo.append('<td>' + currentTaskInfo.description + '</td>'); //show user the author
                    if (currentTaskInfo.complete === true) {
                        $newTaskInfo.append('<td>Yes! Got \'er Done!</td>');
                    } else {
                        $newTaskInfo.append('<td>I\'ll get around to it</td>');
                    }
                    $newTaskInfo.append('<td><input id="checkComplete" type="checkbox" name="checkComplete" value="">Complete task</td>');
                    $newTaskInfo.append('<td><input id="checkDelete" type="checkbox" name="checkDelete" value="">Delete task</td>');
                    $('#taskTableBody').append($newTaskInfo);
                    console.log($newTaskInfo);
                } // end for loop
            } // end success
        }); //end ajax
    } //end getToDoTable

    $('#newTaskButton').on('click', function() {
        var newTaskObject = {};
        var description;
        newTaskObject.description = $('#newTaskInput').val();
        // console.log('newTaskDescription', description);
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
    //
    // $('#bookShelf').on('click', '.deleteButton', function(){
    //   var idOfBookToDelete = $(this).parent().parent().data().id;
    //   console.log('The id to delete is: ', idOfBookToDelete);
    //   // for waldo, number 48 -> /books/delete/48
    //   $.ajax({
    //     type: 'DELETE',
    //     url: '/books/delete/' + idOfBookToDelete,
    //     success: function(response) {
    //       console.log(response);
    //       getBookData();
    //     } // end success
    //   });//end ajax
    // }); //end on click
    //
    // $('#bookShelf').on('click', '.saveButton', function(){
    //   var idOfBookToSave = $(this).parent().parent().data().id;
    //   var titleOfBookToSave = $(this).parent().parent().find('.bookTitle').val();
    //   var authorOfBookToSave = $(this).parent().parent().find('.bookAuthor').val();
    //   var editionOfBookToSave = $(this).parent().parent().find('.bookEdition').val();
    //   var publisherOfBookToSave = $(this).parent().parent().find('.bookPublisher').val();
    //   var bookObjectToSave = {
    //     title: titleOfBookToSave,
    //     author: authorOfBookToSave,
    //     edition: editionOfBookToSave,
    //     publisher: publisherOfBookToSave
    //   };
    //   // for waldo, number 48 -> /books/save/48
    //   $.ajax({
    //     type: 'PUT',
    //     url: '/books/save/' + idOfBookToSave,
    //     data: bookObjectToSave,
    //     success: function(response) {
    //       console.log(response);
    //       getBookData();
    //     }, //end success
    //     error: function(response){
    //       console.log(response);
    //       $('#errorMessage').append('<p>'+ response.statusText + '</p>');
    //     } // end error
    //   }); //end of AJAX
    // }); // end of click



}); //end of doc ready
