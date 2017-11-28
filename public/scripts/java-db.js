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
        p_start: document.getElementById('input-p_start').value,
        p_end: document.getElementById('input-p_end').value,
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
        c_lat: document.getElementById('input-c_lat').value,
        c_lng: document.getElementById('input-c_lng').value,
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
}


function addItem(item) {
    
        var row = document.createElement('tr');
        row.className = "tableRows";
        var id = item && item.id;
        if (id) {
            row.setAttribute('data-id', id);
        }

        
        row.innerHTML = "<td>"+item.p_name+"</td>";
    
        var table = document.getElementById('projects');
        table.lastChild.appendChild(row);

    }
    
function loadItems() {
    xhrGet(REST_DATA, function(data) {

        //stop showing loading message
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
        for (i = 0; i < items.length; ++i) {
            addItem(items[i]);
        }

    }, function(err) {
        console.error(err);
    });
}


//updateServiceInfo();
loadItems();