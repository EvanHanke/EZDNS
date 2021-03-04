/*Code I copied from saved_resource.html body*/
//simply populates the given form with the given argument
/*
function rdns_fm(country,pi,freq) {
    document.getElementById('country').value=country;
    document.getElementById('pi').value=pi;
    document.getElementById('freq').value=freq;
    }
    
    function rdns_dab(ecc,eid,sid,scids) {
    document.getElementById('ecc').value=ecc;
    document.getElementById('eid').value=eid;
    document.getElementById('sid').value=sid;
    document.getElementById('scids').value=scids;
    }

//
*/

/*My code
* E. Hanke 2021
*/

//'wait' macro to split up requests 4-8 seconds
function randomWait(){
    return ((Math.random()*4000.0)+1000.0);
}

//station class
class FMStation{
    constructor(country, pi, freq){
        this.country = country;
        this.pi = pi;
        this.freq = freq;
    }
}

//default request url
//via my CORS ANYWHERE server
var reqURL = "https://limitless-wildwood-84731.herokuapp.com/https://radiodns.org/nwp/tools/?action=rdns&bearer=fm&country=${a}&pi=${b}&freq=${c}&x-size=640&y-size=480";
const http = new XMLHttpRequest();

//test stations
var station_example = new FMStation("ce1", "c479", "95.8");
var stations = [];

var counter = 5;

function beginParse(){
    var inputJson = document.getElementById("inputField").value;
    var grid = JSON.parse(inputJson);
    var total_stations = Object.keys(grid["PI Code"]).length;
    var country = "ce1";
    document.getElementById("response").innerText = "total stations: " + total_stations;
    console.log(grid);
    
    for(var i = 0; i < total_stations; i++){
        var key = Object.keys(grid["PI Code"])[i];
        var newstation = new FMStation(country, grid["PI Code"][key].toLowerCase(), grid.Frequency[key]);
        stations.push(newstation);
        //console.log(newstation);
    }

    autoFill();
}

//populate and submit the form
function autoFill(){
    var station = stations[counter];

    let a = station.country;
    let b = station.pi;
    let c = station.freq;
    
    //rdns_fm(a, b, c);
    //document.getElementById("fmForm").submit();
    //console.log(document.body.innerText);
    thisURL = reqURL.replace("${a}", a).replace("${b}", b).replace("${c}", c);
    console.log(thisURL);
    http.open("GET", thisURL);
    try{    http.send();}
    catch{
        counter++;
        autoFill();
    }

}

//process url request
http.onreadystatechange = (e) => {
    if(http.readyState === XMLHttpRequest.DONE) {
        var status = http.status;
        if (status === 0 || (status >= 200 && status < 400)) {

            //on successful request            
            var response = new DOMParser().parseFromString(http.responseText, 'text/html');
            //remove raw image data from html output
            var slide = response.getElementById("slide");
            if(slide != null){
                response.getElementById("slide").remove();
            }
            //append data to output
            document.getElementById("response").innerHTML += ("\n" + response.body.innerHTML); //retrieve data
            counter++;
            if (counter < stations.length){ //iterate
                autoFill();
                //setTimeout(autoFill, randomWait());
            }
            //

        }
    } else {
          // Oh no! There has been an error with the request!
    }
}