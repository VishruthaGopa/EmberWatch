require('dcp-client').initSync();
const compute = require('dcp/compute');

join_key = 'anu-edge'
join_secret = "idMMZpFPu6"

async function getFiresInRadius(latitude, longitude, radiuskm){
    var data = getData();
    var input = [];
    var row;
    var indx;
    var batch = [];
    for (let i = 0; i < data.length; i++){
        // batch = [];
        // for (let j = 0; j < 1000; j++){
        //     indx++;
        //     row = data[i];
        //     batch.push([row[4], row[5], latitude, longitude, radiuskm]);
        // }
        // input.push(batch);
        row = data[i];
        input.push([row[4], row[5], latitude, longitude, radiuskm])
    }
    console.log(input)
    console.log(deployGetProximity(input));
}

function getProximity(input){
    progress();
    // key - FID,SRC_AGENCY,FIRE_ID,FIRENAME,LATITUDE,LONGITUDE,YEAR,MONTH,DAY,REP_DATE,ATTK_DATE,OUT_DATE,DECADE,SIZE_HA,CAUSE,PROTZONE,FIRE_TYPE,MORE_INFO,CFS_REF_ID,CFS_NOTE1,CFS_NOTE2,ACQ_DATE,ECODISTRIC,ECOREGION,ECOZONE,CFS_ECOZ,SRC_AGY2
    lat1 = input[0]
    lon1 = input[1]
    lat2 = input[2]
    lon2 = input[3]

    var R = 6371; // Radius of the earth in km
    var dLat = (lat2-lat1) * (Math.PI/180);  // deg2rad below
    var dLon = (lon2-lon1) * (Math.PI/180); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    
    if (d < input[4]){
        return [input[0], input[1]]
    }
}

function getProximity2(input){
    progress();
    // key - FID,SRC_AGENCY,FIRE_ID,FIRENAME,LATITUDE,LONGITUDE,YEAR,MONTH,DAY,REP_DATE,ATTK_DATE,OUT_DATE,DECADE,SIZE_HA,CAUSE,PROTZONE,FIRE_TYPE,MORE_INFO,CFS_REF_ID,CFS_NOTE1,CFS_NOTE2,ACQ_DATE,ECODISTRIC,ECOREGION,ECOZONE,CFS_ECOZ,SRC_AGY2
    let result = [];

    for (let i = 0; i < input.length; i++){
        lat1 = input[0]
        lon1 = input[1]
        lat2 = input[2]
        lon2 = input[3]

        var R = 6371; // Radius of the earth in km
        var dLat = (lat2-lat1) * (Math.PI/180);  // deg2rad below
        var dLon = (lon2-lon1) * (Math.PI/180); 
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
            ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        
        if (d < input[4]){
            result.push([input[0], input[1]])
        }
    }

    return result;
}

async function deployGetProximity(input){
    let job = compute.for(input, getProximity);
    job.public.name = 'DCP - Ember Watch';

    if (join_key) job.computeGroups = [{ joinKey: join_key, joinSecret: join_secret }];


    job.on('accepted', () => {
        console.log(` - Job accepted by scheduler, waiting for results`);
        console.log(` - Job has id ${job.id}`);
    });

    job.on('result', (ev) => {
        //console.log(ev.result);
    });

    let results = await job.exec();
    console.log("Compute complete");
    return resultSet = Array.from(results);
}

function getData(){
    var fs = require('fs');

    var data = fs.readFileSync('data/fires_short.csv')
        .toString() // convert Buffer to string
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array
    
    // console.log(data);
    return data;
}

function getDistance(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
  
  getFiresInRadius(45.4215, 75.6972, 100);