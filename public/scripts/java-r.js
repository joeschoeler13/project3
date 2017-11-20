//START: map and locations

var locations = [
    [
        "Concardis GmbH",
        50.138253, 
        8.583813
    ],
    [
    	"Rameder Anhaengerkupplungen und Autoteile GmbH",
        50.583336, 
        11.47229
    ],
    [
        "University of Victoria",
        48.465256, 
        -123.312910
    ]
]

var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: new google.maps.LatLng(15, 0),
    mapTypeId: google.maps.MapTypeId.ROADMAP
});

var infowindow = new google.maps.InfoWindow();

var marker, i;

var cnt = 0

for (i = 0; i < locations.length; i++) {  
    marker = new google.maps.Marker({
    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
    map: map
    });

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
        cnt++
        infowindow.setContent(locations[i][0]);
        infowindow.open(map, marker);
        }
    })(marker, i));
}

//END: map and locations


//START: Filter project table

function projectFilter() {
    
    var input = document.getElementById("searchInput");
    var filter = input.value.toUpperCase();
    var table = document.getElementById("projects");
    var tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (var i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            if (td.textContent.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        } 
    }
}

//END: Filter project table

//********* MODALS **********

//START: Show Mod1
var modal1 = document.getElementById("id01")

window.onclick = function(event) {
    if (event.target == modal1) {
        modal.style.display = "none";
    }
}
//END: Show Mod1

//START: Show Mod2
var modal2 = document.getElementById("id02")

window.onclick = function(event) {
    if (event.target == modal2) {
        modal.style.display = "none";
    }
}
//END: Show Mod2

//START: Show Mod3
var modal3 = document.getElementById("id03")

window.onclick = function(event) {
    if (event.target == modal3) {
        modal.style.display = "none";
    }
}
//END: Show Mod3

//START: Show Mod4
var modal4 = document.getElementById("id04")

window.onclick = function(event) {
    if (event.target == modal4) {
        modal.style.display = "none";
    }
}
//END: Show Mod4

//********* MODALS **********