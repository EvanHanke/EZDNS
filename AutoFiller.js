/*Code I copied from saved_resource.html body*/
//simply populates the given form with the given argument
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

/*My code
*
*/

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
var station_1 = new FMStation("ce1", "c479", "95.8");
var station_2 = new FMStation("USA", "202", "9090");
var station_3 = new FMStation("RUS", "210", "998.1");
var stations = [station_1, station_2, station_3];

var counter = 0;

//populate and submit the form
function autoFill(){
    var station = stations[counter];

    let a = station.country;
    let b = station.pi;
    let c = station.freq;
    
    rdns_fm(a, b, c);
    //document.getElementById("fmForm").submit();
    //console.log(document.body.innerText);
    thisURL = reqURL.replace("${a}", a).replace("${b}", b).replace("${c}", c);
    console.log(thisURL);
    http.open("GET", thisURL);
    http.send();
}

//process url request
http.onreadystatechange = (e) => {
    if(http.readyState === XMLHttpRequest.DONE) {
        var status = http.status;
        if (status === 0 || (status >= 200 && status < 400)) {

            //on successful request            
            var response = new DOMParser().parseFromString(http.responseText, 'text/html');
            document.getElementById("response").innerHTML += ("<br>" + response.body.innerText); //retrieve data
            counter++;
            if (counter < stations.length){ //iterate
                autoFill();
            }
            //

        }
    } else {
          // Oh no! There has been an error with the request!
    }
}