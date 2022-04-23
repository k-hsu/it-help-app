function getTicketInfo(ticket){
  let allTickets = "alltickets";
  let token = getCookie("csrftoken");
  console.log("test");

  $.ajax(
    {
        headers: { "X-CSRFToken": token },
        type:"POST",
        url: "/getticket/",
        data:{
                 "ticketNum": ticket,
        },
        success: function( response ) 
        {
          let ticketTable = document.getElementById("ticketDiv");
          let jsonReturn = JSON.parse(response);
          ticketTable.innerHTML = "";
          var commentCount = 0;
          var techAssigned = false;

          /*
          Since we are only passing 1 ticket with the possibily of multiple users and comments,
          we know the first object in jsonReturn will be the ticket
          */
          var obj = jsonReturn[0];
          ticketTable.innerHTML += "<p id='title'><strong>" + obj.title + "</strong></p>";
          ticketTable.innerHTML += "<p id='ticketInfo'><strong>Ticket Number:</strong> " + obj.ticketNum + "</p>";
          ticketTable.innerHTML += "<p id='ticketInfo'><strong>Assigned:</strong> " + obj.is_assigned +"</p>";
          ticketTable.innerHTML += "<p id='ticketInfo'><strong>Priority</strong>: " + obj.priority +"</p>";
          ticketTable.innerHTML += "<p id='ticketInfo'><strong>Date Created:</strong> " + obj.date_created + "</p>";
          ticketTable.innerHTML += "<p id='ticketInfo'><strong>Due Date:</strong> " + obj.due_date + "</p>";
          ticketTable.innerHTML += "<p id='ticketInfo'><strong>Last Checked:</strong> " + obj.last_checked + "</p>";
          ticketTable.innerHTML += "<p id='ticketInfo'><strong>Date Closed:</strong> " + obj.date_closed + "</p>";
          ticketTable.innerHTML += "<p id='ticketInfo'><strong>Description:</strong> " + obj.description + "</p>";
          techAssigned = obj.is_assigned;
          
          /*
          We know the second object will be the user who submitted the ticket
          */
          var obj = jsonReturn[1];
          ticketTable.innerHTML += "<p id='ticketInfo'><strong>Submitted by:</strong> " + obj.username_id__username +  " (" + obj.user_group + ")</p>";

          /*
          Loop through any remaining jsonReturn objects.  We know the third querty set contains
          1 or more techs assigned to the ticket.  We will pull these out first then comments
          */
          for(var i = 2; i < jsonReturn.length; i++) {
            var obj = jsonReturn[i];
            // Grabs the techs from the json
            if(!obj.message) {
              ticketTable.innerHTML += "<p id='ticketInfo'><strong>Assigned Tech:</strong> " + obj.username_id__username +  " (" + obj.user_group + ")</p>";
            }
            // Grabs the comments from the json
            else {
              commentCount++
              ticketTable.innerHTML += "<p id='ticketInfo'><strong>Comment:</strong> "+ commentCount + "</p>";
              ticketTable.innerHTML += "<p id='ticketInfo'><strong>Message:</strong> " + obj.message + "</p>";
              ticketTable.innerHTML += "<p id='ticketInfo'><strong>From:</strong> " + obj.user__username +  " (" + obj.user__profile__user_group + ")</p>";
              ticketTable.innerHTML += "<p id='ticketInfo'><strong>Date Entered:</strong> " + obj.date_entered + "</p>";
            }
          }

          //Lets user know if no tech is assigned to ticket
          if (!techAssigned){
            ticketTable.innerHTML += "<p id='ticketInfo'><strong><i>There is no tech assigned to this ticket</i></strong></p>";
          }

          //Lets user know there are no comments
          if (commentCount ==0){
            ticketTable.innerHTML += "<p id='ticketInfo'><strong><i>There are no comments! Would you like to add one?</i></strong></p>";
          }
        }
      }
  )
}

function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
}

function AllTickets(){
  let allTickets = "alltickets";
  let token = getCookie("csrftoken");
  console.log("test");

  $.ajax(
    {
        headers: { "X-CSRFToken": token },
        type:"POST",
        url: "/searchticket/",
        data:{
                 "alltickets": allTickets,
        },
        success: function( response ) 
        {
          BuildTable(response)
          let searchTicket = document.getElementById("ticketSearch");
          let status = document.getElementsByName("status")[0];
          let priority = document.getElementsByName("priority")[0];
          let assigned = document.getElementsByName("assigned")[0];

          status.value = "A";
          priority.value = "A";
          assigned.value = "A";
          searchTicket.value = "";

          console.log(status)
        }
      }
  )
  
}
function MyTickets(){
  let myTickets = "mytickets";
  let token = getCookie("csrftoken");

  $.ajax(
    {
        headers: { "X-CSRFToken": token },
        type:"POST",
        url: "/searchticket/",
        data:{
                 "mytickets": myTickets,
        },
        success: function( response ) 
        {
          BuildTable(response)
          let searchTicket = document.getElementById("ticketSearch");
          let status = document.getElementsByName("status")[0];
          let priority = document.getElementsByName("priority")[0];
          let assigned = document.getElementsByName("assigned")[0];

          status.value = "A";
          priority.value = "A";
          assigned.value = "A";
          searchTicket.value = "";

          console.log(status)
        }
      }
  )


}

function  TicketSearch(){

  let searchTicket = document.getElementById("ticketSearch");
  let status = document.getElementsByName("status")[0];
  let priority = document.getElementsByName("priority")[0];
  let assigned = document.getElementsByName("assigned")[0];
  console.log(status.value, priority.value, assigned.value)
  let token = getCookie("csrftoken");
  $.ajax(
    {
        headers: { "X-CSRFToken": token },
        type:"POST",
        url: "/searchticket/",
        data:{
                 post_id: searchTicket.value,
                 "status": status.value,
                 "priority": priority.value,
                 "assigned": assigned.value,
        },
        success: function( response ) 
        {
          BuildTable(response)
        }
      }
  )
}
function BuildTable(response){
          let jsonReturn = JSON.parse(response);
          let ticketTable = document.getElementById("ticketDiv");
          let status;
          let assigned;
          let priority;
          let mark;
          let innerHtml = '';
          if (jsonReturn.length == 0){
            innerHtml = "<h1><a href='#'> No Tickets Found</h1>"
          }
          for (var i = 0; i < jsonReturn.length; i++) 
          { 
            let ticketDiv = '<div onclick="getTicketInfo(' + jsonReturn[i]["ticketNum"] + ')" class="ticketInfo"><h3 class="subTicketHeaders">' + jsonReturn[i]["ticketNum"] + ' - ' + jsonReturn[i]["title"] + '</h3>';
            if (jsonReturn[i]["status"] == "O"){
              status = "Open";
            }else{''
              status = "Closed";
            }
            ticketDiv += '<p class="subTicketHeaders">Status: ' + status + '</p>'
            if (jsonReturn[i]["priority"] == "R"){
              priority = "Routine";
            }else if(jsonReturn[i]["priority"] == "U"){
              priority = "Urgent"
            }else{
              priority = "Emergency"
            }
             ticketDiv += '<p class="' + jsonReturn[i]["priority"] + '">Priority: ' + priority + '</p>'
             if (jsonReturn[i]["is_assigned"] == true){
              assigned = "True";
              mark = "&#x2713;"
            }else{
              assigned = "False"
              mark = "&#x2715;"
            }
/*  Assigned:<p class="assigned'+assigned+'">' + mark +'</p></h4>     */
            ticketDiv += '<p class="subTicketHeaders">Assigned:<b class="assigned'+assigned+'">' + mark +'</b><p class="ticketP">Creation Date: ' + jsonReturn[i]["date_created"] +'</p><p class="ticketP">Due Date:' + jsonReturn[i]["due_date"] + '</p><p class="ticketP">Last Checked:' + jsonReturn[i]["last_checked"] + '</p></div>'
            innerHtml += ticketDiv;
          }
          ticketTable.innerHTML = innerHtml;

}
