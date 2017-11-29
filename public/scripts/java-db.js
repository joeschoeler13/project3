// js file for database page

var REST_DATA = 'api/arcs_projects_db';
var KEY_ENTER = 13;
var defaultItems = [

];

var item = 0;

function encodeUriAndQuotes(untrustedStr) {
    return encodeURI(String(untrustedStr)).replace(/'/g, '%27').replace(')', '%29');
}

function newproject() {
    var data = {
        name: "project",
        //project information
        p_name: document.getElementById('input-p_name').value,
        p_category: document.getElementById('input-p_category').value,
        p_startm: document.getElementById('input-p_startm').value,
        p_starty: document.getElementById('input-p_starty').value,
        p_endm: document.getElementById('input-p_endm').value,
        p_endy: document.getElementById('input-p_endy').value,
        p_desc: document.getElementById('input-p_desc').value,
        //customer information
        c_name: document.getElementById('input-c_name').value,
        c_industry: document.getElementById('input-c_industry').value,
        c_adr1: document.getElementById('input-c_adr1').value,
        c_adr2: document.getElementById('input-c_adr2').value,
        c_city: document.getElementById('input-c_city').value,
        c_zip: document.getElementById('input-c_zip').value,
        c_state: document.getElementById('input-c_state').value,
        c_country: document.getElementById('input-c_country').value,
        //utilities (used programs) information
        u_all: document.getElementById('input-u_all').value,
        //(customer) satisfaction information and additional comments
        s_stars: document.getElementById('input-s_stars').value,
        s_comments: document.getElementById('input-s_comments').value
    };
    item++;
    alert("The project was added to the database.");
    
    xhrPost(REST_DATA, data, function(item) {
        
    }, function(err) {
        console.error(err);
    });
    
    //automatic page refresh after adding the item to directly show it in the db
    location.reload(true);
}


function addItem(item) {
    
    var row = document.createElement('tr');
    row.className = "listing";
    var id = item && item.id;
    if (id) {
        row.setAttribute('data-id', id);
    }
        
    row.innerHTML = //project information
                    "<td>"+item.p_name+"</td>" +
                    "<td>"+item.p_category+"</td>" +
                    "<td>"+item.p_startm+"</td>" +
                    "<td>"+item.p_starty+"</td>" +
                    "<td>"+item.p_endm+"</td>" +
                    "<td>"+item.p_endy+"</td>" +
                    "<td>"+item.p_desc+"</td>" +
                    //customer information
                    "<td>"+item.c_name+"</td>" +
                    "<td>"+item.c_industry+"</td>" +
                    "<td>"+item.c_adr1+"</td>" +
                    "<td>"+item.c_adr2+"</td>" +
                    "<td>"+item.c_city+"</td>" +
                    "<td>"+item.c_zip+"</td>" +
                    "<td>"+item.c_state+"</td>" +
                    "<td>"+item.c_country+"</td>" +
                    //utilities (used programs) information
                    "<td>"+item.u_all+"</td>" +
                    //(customer) satisfaction information and additional comments
                    "<td>"+item.s_stars+"</td>" +
                    "<td>"+item.s_comments+"</td>" +
                    "<td><button class='deleteBtn' onclick='deleteItem(this)' title='delete me'>Delete Item!</button></td>";
    
    var table = document.getElementById('projects');
    table.lastChild.appendChild(row);
}
    

function deleteItem(deleteBtnNode) {
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
  

function loadItems() {
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
                                "<th>Project Start Month</th>" +
                                "<th>Project Start Year</th>" +
                                "<th>Project End Month</th>" +
                                "<th>Project End Year</th>" +
                                "<th>Project Description</th>" +
                                //customer information
                                "<th>Customer Name</th>" +
                                "<th>Customer Industry</th>" +
                                "<th>Customer Adress 1</th>" +
                                "<th>Customer Adress 2</th>" +
                                "<th>Customer City</th>" +
                                "<th>Customer ZIP Code</th>" +
                                "<th>Customer State</th>" +
                                "<th>Customer Country</th>" +
                                //utilities (used programs) information
                                "<th>Used Utilities for Project</th>" +
                                //(customer) satisfaction information and additional comments
                                "<th>Customer Satisfaction</th>" +
                                "<th>Customer Comments</th>" +
                                //Interactions
                                "<th>Interactions</th>";

        var table = document.getElementById('projects');
        table.lastChild.appendChild(tablehead);
        // end

        for (i = 0; i < items.length; ++i) {
            addItem(items[i]);
        }

    }, function(err) {
        console.error(err);
    });
}


//updateServiceInfo();
loadItems();