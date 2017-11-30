//********Showing the database on Reference page */

var REST_DATA = 'api/arcs_projects_db';
var KEY_ENTER = 13;
var defaultItems = [

];

var item = 0;

function encodeUriAndQuotes(untrustedStr) {
    return encodeURI(String(untrustedStr)).replace(/'/g, '%27').replace(')', '%29');
}



function addItem_ref(item) {
    
    var row = document.createElement('tr');
    row.className = "listing";
    var id = item && item.id;
    if (id) {
        row.setAttribute('data-id', id);
    }
        
    row.innerHTML = //project information
                    "<td>"+item.p_name+"</td>" +
                    "<td>"+item.p_category+"</td>" +
                    //customer information
                    "<td>"+item.c_name+"</td>" +
                    "<td>"+item.c_industry+"</td>" +
                    "<td>"+item.c_country+"</td>" +
                    //utilities (used programs) information
                    "<td>"+item.u_all+"</td>"
    
    var table = document.getElementById('projects_ref');
    table.lastChild.appendChild(row);
}


function deleteItem_ref(deleteBtnNode) {
    var row = deleteBtnNode.parentNode.parentNode;
    var attribId = row.getAttribute('data-id');
    if (attribId) {
        xhrDelete(REST_DATA + '?id=' + row.getAttribute('data-id'), function() {
            row.parentNode.removeChild(row);
        }, function(err) {
            console.error(err);
        });
    } else if (attribId == null) {
        row.parentNode.removeChild(row);
    }
}
  

function loadItems_ref() {
    xhrGet(REST_DATA, function(data) {
        
        console.log(data);
        
        var receivedItems = data || [];
        var items = [];
        var i;
        // Make sure the received items have correct format
        for (i = 0; i < receivedItems.length; ++i) {
            var item = receivedItems[i];
            if (item && 'id' in item) {
                items.push(item);
            }
        }
        var hasItems = items.length;
        if (!hasItems) {
            items = defaultItems;
        }

        // add table header
        var tablehead = document.createElement('tr')
        tablehead.className = "header"

        tablehead.innerHTML =   //project information
                                "<th>Project Name</th>" +
                                "<th>Project Category</th>" +
                                //customer information
                                "<th>Customer Name</th>" +
                                "<th>Customer Industry</th>" +
                                "<th>Customer Country</th>" +
                                //utilities (used programs) information
                                "<th>Used Utilities for Project</th>"

        var table = document.getElementById('projects_ref');
        table.lastChild.appendChild(tablehead);
        // end

        for (i = 0; i < items.length; ++i) {
            addItem_ref(items[i]);
        }

    }, function(err) {
        console.error(err);
    });
}


//updateServiceInfo();
loadItems_ref();