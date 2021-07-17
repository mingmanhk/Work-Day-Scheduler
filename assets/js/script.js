// set the date at the top of the page
var today = moment();
$("#currentDay").text(today.format("dddd, MMMM Do"));

var tasklist = {
    "9": [],
    "10": [],
    "11": [],
    "12": [],
    "13": [],
    "14": [],
    "15": [],
    "16": [],
    "17": []
};

// change row color for different status
var changetaskcolorbyhour = function () {
    var currenttime = moment().hour();
    $(".row").each(function () {
        var selectedRow = parseInt($(this).attr("id"));
        //For future time set green background
        if (currenttime < selectedRow) {
             $(this).find('.taskDetail').removeClass(["present", "past"]).addClass("future");    
        }
        //For past time set green grey
        else if (currenttime > selectedRow) {
             $(this).find('.taskDetail').removeClass(["present", "future"]).addClass("past");
        }
        //For present time set red grey
        else {
            $(this).find('.taskDetail').removeClass(["future", "past"]).addClass("present");
      }
    })
}

//add the task to the row
var addTask = function(taskdetail, taskrow) {
    var taskEl = taskrow.find(".taskDetail");
    var taskP = $("<p>").addClass("description").text(taskdetail)
    taskEl.html(taskP);
}

//show the task to the row
var showTask = function() {
    var teamptasklist = JSON.parse(localStorage.getItem("tasklist"));
    if (teamptasklist != null) {
        $.each(teamptasklist, function (row, tasklist) {
            var taskrow = $("#" + row).attr("id");
            if (teamptasklist[taskrow][0] != null && teamptasklist[taskrow][0].length !=0) {
            addTask(teamptasklist[taskrow], $("#" + row));
            }
        })
    }
    else
    {
        localStorage.setItem("tasklist", JSON.stringify(tasklist));
    }
    changetaskcolorbyhour()
}

// save task detail
var savetaskdetail = function (taskdetailEl) {
    // Save the task to localstroage
    var taskrow = taskdetailEl.closest(".row");
    var tasktextbox = taskrow.find("textarea");
    var taskid = taskrow.attr("id");
    var taskdetail = tasktextbox.val();
    if (taskdetail != null && taskdetail.length != 0) {
        tasklist[taskid] = [taskdetail];
        localStorage.setItem("tasklist", JSON.stringify(tasklist));
        // Refresh task and remove text box 
        addTask(taskdetail, taskrow);
    }
}

//Add event when click task detail
$(".taskDetail").click(function() {
    // reset all the taskdetail to readonly
    $("textarea").each(function() {
        savetaskdetail($(this));
    })
    // only future and present may change task detail
    var taskstatus = $(this).closest(".taskDetail").attr('class');
    if (taskstatus.includes("future") ||taskstatus.includes("present"))
 {
         // add textbox 
        var text = $(this).text();
        var textInput = $("<textarea>").addClass("textarea").css("color", "black").width( "100%").val(text);
        $(this).html(textInput);
        textInput.trigger("focus");
    }
})

// click save btn then add to row
$(".saveBtn").click(function () {
    savetaskdetail($(this));
})

// auto refresh time status every mins
setTimeout(function() {
    setInterval(changetaskcolorbyhour(), 60000)
    console.log("Refresh status check")
}, 60000);

//run once when page open
showTask()