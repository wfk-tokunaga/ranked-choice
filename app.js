//The names of all the candidates. At most, there can be 10 candidates.
const candidates = new Array("A","B","C","D","E","F","G","H","I","J");
//The names of all the possible ranks a candidate can receive.
const ranks = new Array("1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th");
let ballotsSection;
let totalsSection;
let graphSection;
let nextRoundButton;
let previousRoundSection;
let canvas;
let textToChange;

//Add template strings
//Don't use innerHTML, use .textContent instead

// document.onload = function() {
//         const textToChange = document.getElementById("textToChange");
//         document.querySelector('#simulatebutton').addEventListener('click', () => {
//         })
// 
// function handler() {}
// document.onload = handler;
// document.onload = () => {
// }

window.onload = () => {
    console.log("Hello, this should be printing to console now.");
    ballotsSection = document.getElementById("ballotsSection");
    totalsSection = document.getElementById("totalsSection");
    graphSection = document.getElementById("graphSection");
    canvas = document.getElementById("graph");
    textToChange = document.getElementById("textToChange");

    document.getElementById("simulateButton").addEventListener("click", simulateElection);
    document.getElementById("nextRoundButton").addEventListener("click", nextRoundVisuals);
    document.getElementById("previousRoundButton").addEventListener("click", previousRoundVisuals);


    //Runs whole thing
    function simulateElection() {
        //to make it easier to rerun elections, let's make this section start by clearing all previous results.

        ballotsSection.style.display = "block";
        totalsSection.style.display = "block";
        graphSection.style.display = "block";

        let numCandidates = parseInt(document.getElementById("numCandidates").value);
        let numSpots = parseInt(document.getElementById("numSpots").value);
        let numBallots = parseInt(document.getElementById("numBallots").value);
        let roundNumber = 1;
        let qualVotesHistory = new Array();

        let winThreshold = (numBallots/(numSpots+1)) + 1;
        //console.log("Number of first place votes needed to secure victory: " + winThreshold);
        
        //Replace with template strings
        textToChange.textContent = 
        `Simulating an election with ${numCandidates} candidates, competing for ${numSpots} positions, with ${numBallots} votes submitted.`;

        let allBallots = createBallots(numBallots, numCandidates);
        makeBallotsTable(allBallots, numCandidates, numSpots, roundNumber);
        let totals = calcTotals(allBallots, numCandidates, numSpots);
        makeTotalsTable(totals, numCandidates, numSpots, roundNumber);

        let qualVotesList = totalQualifyingVotes(totals, numCandidates, numSpots);
        qualVotesHistory.push(qualVotesList);
        let sortedQualList = createSortedList(qualVotesList);
        makeQualifyingTable(sortedQualList, numCandidates, numSpots, roundNumber, totals);


        //drawGraph(qualVotesList, numBallots);

        runNextRound(allBallots, sortedQualList, numCandidates, numSpots, numCandidates, roundNumber + 1, qualVotesHistory);

    }

    function runNextRound(allBallots, sortedQualList, numCandidates, numSpots, numRemainingCands, roundNumber, qualVotesHistory) {
        //console.log("\n\n===========STARTING ROUND: " + (roundNumber) + "==============\n");
        //first gotta get index of cand to remove.
        //cand with the smallest qualifyingNumbVotes get's booted.

        if (numRemainingCands - 1 > numSpots) {

            let removeCandidateIndex = candidates.indexOf(sortedQualList[sortedQualList.length - (roundNumber-1)][1]);
            //console.log("Removing candidate " + candidates[removeCandidateIndex]);
            let updatedBallots = updateAllBallots(allBallots, removeCandidateIndex);
            makeBallotsTable(updatedBallots, numCandidates, numSpots, roundNumber);

            let updatedTotals = calcTotals(updatedBallots, numCandidates, numSpots)
            makeTotalsTable(updatedTotals, numCandidates, numSpots, roundNumber);

            let qualVotesList = totalQualifyingVotes(updatedTotals, numCandidates, numSpots);
            let newQualVotesHistory = qualVotesHistory;
            newQualVotesHistory.push(qualVotesList);
            let updatedSortedList = createSortedList(qualVotesList);
            makeQualifyingTable(updatedSortedList, numCandidates, numSpots, roundNumber, updatedTotals);

            console.log("\n QUAL VOTES HHISTORY: \n");
            console.log(newQualVotesHistory);

            runNextRound(updatedBallots, updatedSortedList, numCandidates, numSpots, numRemainingCands - 1, roundNumber + 1, newQualVotesHistory);
        } else {
            drawGraph(qualVotesHistory, allBallots.length);
        }
    }





    //Generates numBallots of ballots, each ballot ranking up to numCandidates. Makes a 2D array.
    function createBallots(numBallots, numCandidates) {
        let allBallots = new Array();

        //Making the individual ballots and adding to table.
        for(i = 0; i < numBallots; i++) {
            //An array representing a ballot for a single voter.
            var singleBallot =  new Array();
            var candsToRank = randInt(numCandidates + 1);
            var candList = new Array();
            for (var k = 0; k < numCandidates; k++) {
                candList.push(candidates[k]);
            }
            while (singleBallot.length < (candsToRank)) {
                let checkCandIndex = randInt(numCandidates + 1) - 1;
                var addCandidate = candidates[checkCandIndex]; //generate a random candidate
                //Keep generating a new candidate until we find one that is not on the ballot yet.
                while (singleBallot.includes(addCandidate)){
                    var addCandidate = candidates[randInt(numCandidates + 1) - 1];
                }
                singleBallot.push(addCandidate);
            }
            allBallots.push(singleBallot);
        }
        return allBallots;
    }

    // const compare = (a, b) => b[0] - a[0];
    // function compare(a, b) {
    //     return b[0] - a[0];
    // }
    // const compare = function(a, b) {
    //     return b[0] - a[0];
    // }

    // const data = { a: 5 };
    // data.a = 3;

    // data = { a: 3 };

    // compare([10], [5]);
    const createBallots2 = (numBallots, numCandidates) => {
        let allBallots = new Array();
        for (var i = 0; i < numBallots; i++) {
            let singleBallot = new Array();
            //wanna get x number of candidates from a list of the candidates numCandidates long
            singleBallot = shuffle(candidates.slice(numCandidates-1)).slice(randInt(numCandidates));
            allBallots.push(singleBallot);
        }
        return allBallots;
    }

    function makeBallotsTable(allBallots, numCandidates, numSpots, roundNumber) {
        let ballotsTable = document.createElement("table");
        let infoRow = document.createElement("tr");
        let keyCell = document.createElement("th");
        keyCell.textContent = `Ballot/ Rank`;
        infoRow.appendChild(keyCell);
        
        //Create header row
        for(var i = 0; i < numCandidates; i++) {
            var addElem = document.createElement("th");
            addElem.textContent = ranks[i];
            if (i < numSpots) {
                addElem.setAttribute("style", "background-color: green");
            }
            infoRow.appendChild(addElem);
        }
        ballotsTable.appendChild(infoRow);

        //Alternative Method: Make the entire table and then fill it.
        for (i = 0; i < allBallots.length; i++) {
            let ballotRow = document.createElement("tr");
            let ballotNum = document.createElement("td");
            ballotNum.textContent = `Voter No. ${(i+1).toString()}`;
            ballotRow.appendChild(ballotNum);

            for (var j = 0; j < numCandidates; j++) {
                let addCell = document.createElement("td");
                addCell.setAttribute("style", "background-color: lightgray");
                if (j < allBallots[i].length) {
                    addCell.textContent = allBallots[i][j];
                    addCell.setAttribute("style", "background-color: white");
                    if (j < numSpots) {
                        addCell.setAttribute("style", "background-color: lightgreen");
                    }
                }
                
                ballotRow.appendChild(addCell);
            }
            ballotsTable.appendChild(ballotRow);
        }
        //fill it in with the ballots info
        let roundNumberElem = document.createElement("p");
        roundNumberElem.textContent = `Round ${roundNumber}`;
        roundNumberElem.setAttribute("style", "text-align: center; text-weight: bold; font-size: large");
        ballotsSection.appendChild(roundNumberElem);
        ballotsSection.appendChild(ballotsTable);
    }

    //removes a specific candidate from every ballot, and bumps up everyone else if they need to get bumped.
    function updateAllBallots(allBallots, removeCandidateIndex){
        //console.log("\nUpdating Ballots to remove candidate " + candidates[removeCandidateIndex]);
        let updatedBallots = new Array();
        let remCandName = candidates[removeCandidateIndex];
        //loop through each ballot
        for (var i = 0; i < allBallots.length; i++) {
            let addBallot = new Array();
            for (var j = 0; j < allBallots[i].length; j++) {
                //console.log("j is: " + j);
                if (allBallots[i][j] != remCandName) {
                    addBallot.push(allBallots[i][j]);
                }
            }
            //in each ballot, splice out the candidate getting whacked.
            updatedBallots.push(addBallot);
        }
        return updatedBallots;
    }





    // Look at the ballots and then calculate how many votes each candidate got for each rank
    function calcTotals(allBallots, numCandidates, numSpots) {
        let totals = new Array();

        // initialize each row with 0s
        for (var i = 0; i < numCandidates; i++) {
            let candRow = new Array();
            
            //initializing the total values in candRow to be 0 for each possible rank.
            for (var j = 0; j < numCandidates; j++) {
                candRow[j] = 0;
            }
            /*making a 2D array, with each row being a candidate 
            and each col being how many votes they recieved for each possible rank*/
            totals.push(candRow); 
        }

        //Loop through each ballot to FILL the 2D array of results.
        for (i = 0; i < allBallots.length; i++) {
            //loop through each ranking in the ballot, making sure not to go over how many candidates each person ranked.
            //if (allBallots[i] && allBallots[i].length) {
            for (var rankToAdd = 0; rankToAdd < allBallots[i].length; rankToAdd ++) {
                let candIndex = allBallots[i][rankToAdd].charCodeAt(0) - 65;
                totals[candIndex][rankToAdd] += 1;
            }
        }

        return totals;
    }
    function makeTotalsTable (totals, numCandidates, numSpots, roundNumber) {
        let roundNumberElem = document.createElement("p");
        roundNumberElem.textContent = `Round ${roundNumber} Totals`;
        roundNumberElem.setAttribute("style", "text-align: center; font-size: large");

        let totalsTable = document.createElement("table");
        let infoRow = document.createElement("tr");
        let keyCell = document.createElement("th");
        infoRow.appendChild(keyCell);
        keyCell.textContent = `Candidate/ Totals`;

        //Create the header row
        for (var i = 0; i < numCandidates; i++) {
            let ranking = document.createElement("th");
            ranking.textContent = ranks[i];
            if (i < numSpots) {
                ranking.setAttribute("style", "background-color: green;");
            }
            infoRow.appendChild(ranking);
        }
        totalsTable.appendChild(infoRow);

        //Loop through each row in totals and add it to the elem for each candidate.
        for (i = 0; i < numCandidates; i++) {
            let candElem = document.createElement("tr");
            let candNameElem = document.createElement("td");
            candNameElem.textContent = candidates[i];
            candElem.appendChild(candNameElem);
            
            for (j = 0; j < numCandidates; j++) {
                let candRankElem = document.createElement("td");
                candRankElem.textContent = totals[i][j].toString();
                if (j < numSpots) {
                    candRankElem.setAttribute("style", "background-color: lightgreen;");
                }
                candElem.appendChild(candRankElem);
            }
            totalsTable.appendChild(candElem);
        }
        totalsSection.appendChild(roundNumberElem);
        totalsSection.appendChild(totalsTable);
    }


    // const array = [1, 2, 3, 4, 5];

    // for (var i = 0; i < array.length; i++) {
    //     console.log(array[i])
    // }

    // array.forEach((item) => {
    //     console.log(item)
    // });

    // for (const item of array) {
    //     console.log(item);
    // }

    // for (const [index, item] of array.entries()) {
    //     console.log(`item ${item} at index ${index}`);
    // }

    // const nestedArray = [[3, 4, 5], [2, 3, 2], [1, 2, 7]];

    // for (const [a, b] of nestedArray) {
    //     console.log(`a: ${a}\nb: ${b}`);
    // }

    // for (const item of nestedArray) {
    //     console.log(`a: ${item[0]}\nb: ${item[1]}`);
    // }

    // const [a, b] = [1, 2];

    // array.slice(-n)[k]
    // taking n elements from the end, and getting index k (in the normal order) from it.
    function totalQualifyingVotes(totals, numCandidates, numSpots) {
        qualVotesList = new Array();
        for (const [cand, index] in candidates.slice(numCandidates).entries()) { 
            let candTotalVotes = 0;
            for (var j = 0; j < numSpots; j++){
                candTotalVotes += totals[index][j];
            }
            qualVotesList.push([candTotalVotes, candidates[i]]);
        }
        return qualVotesList; 
    }

    function totalQualifyingVotes(totals, numCandidates, numSpots) {
        qualVotesList = new Array();
        for (var i = 0; i < numCandidates; i++) { 
            let candTotalVotes = 0;
            for (var j = 0; j < numSpots; j++){
                candTotalVotes += totals[i][j];
            }
            qualVotesList.push([candTotalVotes, candidates[i]]);
        }
        return qualVotesList; 
    }
    function makeQualifyingTable(sortedQualList, numCandidates, numSpots, roundNumber, totals) {
        let qualifyingVotes = document.createElement("ul");
        qualifyingVotes.setAttribute("style", "width: 100%");

        for (var i = 0; i < numCandidates; i++) { 
            let candTerm = document.createElement("li");
            let currCandIndex = candidates.indexOf(sortedQualList[i][1]);
            var topVotesNumbers = ` (${totals[currCandIndex][0]}`;
            for (var k = 1; k < numSpots; k++) {
                topVotesNumbers += `+ ${totals[currCandIndex][k]}`;
            }
            topVotesNumbers += `)`;
            

            //Change this text to also include their totals.
            candTerm.textContent = `${sortedQualList[i][1]}: ${sortedQualList[i][0].toString()} ${topVotesNumbers}`;
            if (i < numSpots) {
                candTerm.setAttribute("style", "background-color: lightgreen; font-weight: bold");
            }
            if (i == (numCandidates - roundNumber)) {
                candTerm.setAttribute("style", "background-color: lightcoral; font-style: italic");
            }
            if (i > (numCandidates - roundNumber)) {
                candTerm.setAttribute("style", "background-color: lightgray");
            }
            qualifyingVotes.appendChild(candTerm);
        }
        totalsSection.appendChild(qualifyingVotes);
    }
    //this function takes the list of all the qualifying votes and returns a sorted version.
    function createSortedList(qualVotesList, numSpots) {
        let sortedArray = qualVotesList.sort((a, b) => b[0] - a[0]);
        return sortedArray;
    }



    //This is wack looool let's fix it l8r
    //Let's make it show when something is guarenteed. If a candidate has exceeded the 

    function nextRoundVisuals() {
        //Wanna see if the round is already hidden.
        var roundIndex = 0;
        while (ballotsSection.children[3 + 2*roundIndex].style.display == "none") {
            roundIndex += 1;
        }
        let roundText = ballotsSection.children[3 + 2*roundIndex].textContent;
        console.log("Round Text: " + roundText);
        let roundNum = parseInt(roundText[roundText.length-1]);
        console.log("ROUND NUM: " + roundNum);
        ballotsSection.children[3 + 2*roundIndex].setAttribute("style", "display: none");
        ballotsSection.children[4 + 2*roundIndex].setAttribute("style", "display: none");
        // ballotsSection.children[3 + 2*roundIndex].style.display = "none";
        // ballotsSection.children[4 + 2*roundIndex].style.display = "none";
    }
    function previousRoundVisuals() {
        console.log("\nBringing Back Previous Round");
        //Wanna see if the round is already hidden.

        //Need to find the first visable round.
        var roundIndex = 0;
        while (ballotsSection.children[3 + 2*roundIndex].style.display == "none") {
            console.log("Round #" + roundIndex + " is still hidden.");
            roundIndex += 1;
        }
        console.log("Round #" + roundIndex + " was not hidden.");
        let roundText = ballotsSection.children[3 + 2*roundIndex].textContent;
        console.log("Round Text: " + roundText);
        let roundNum = parseInt(roundText[roundText.length-1]);
        console.log("ROUND NUM: " + roundNum);
        
        ballotsSection.children[4 + 2*roundIndex - 1].setAttribute("style", "display: block");
        ballotsSection.children[3 + 2*roundIndex - 1].setAttribute("style", "display: block");

        // ballotsSection.children[4 + 2*roundIndex - 1].style.display = "block";
        // ballotsSection.children[3 + 2*roundIndex - 1].style.display = "block";
    }


    //Issue is that I need to get the votes from the last round to know where to move the pen to.
    function drawGraph (qualVotesHistory, numBallots) {
        // var canvas = document.createElement("canvas");
        // canvas.setAttribute("width", "80%");
        // canvas.setAttribute("height", "80%");

        // canvas.width = document.getElementById("graphSection").width;

        if (canvas.getContext) {
            let cdx = canvas.getContext('2d');
            let colors = ['orange', 'blue', 'red', 'green', 'brown', 'purple', 'yellow', 'pink', 'teal','blueviolet'];

            cdx.beginPath();
            let width = canvas.width;
            let height = canvas.height;
            let originX = 0.1*width;
            let originY = 0.9*height;

            // I want to get the height of the biggest total qual votes. 
            // Go the the last round of qual votes, find the largest one.
            // Set that to be the height instead of numBallots.
            let votesMaxList = new Array();
            for (var cand = 0; cand < qualVotesHistory[qualVotesHistory.length-1].length; cand++) {
                votesMaxList.push(qualVotesHistory[qualVotesHistory.length-1][cand][0]);
            }
            let votesMax = Math.max(...votesMaxList);

            //COULD ALSO DO THIS BY MAKING EACH INDIVIDUAL PATH FOR EACH CANDIDATE.
            //SAVING THEM IN A 2D object thingy
            //That way we could only display the ones we want to. 

            //Setting up the graph axis.
            cdx.strokeColor = 'black';
            cdx.moveTo(0.1*width, 0.1*height);
            cdx.lineTo(0.1*width, 0.9*height);
            cdx.lineTo(0.9*width, 0.9*height);
            cdx.moveTo(originX, originY);
            //set up the hashes for the margins.
            let hashWidth = (0.8*width)/(qualVotesHistory.length);
            for (var k = 0; k < qualVotesHistory.length + 1; k++) {
                cdx.moveTo((originX + k*hashWidth), originY - 0.03*(0.8*height));
                cdx.lineTo((originX + k*hashWidth), originY + 0.03*(0.8*height));
            }
            cdx.stroke();

            //let's set up the first lines to make it easier.
            for (var i = 0; i < qualVotesHistory[0].length; i++) {
                cdx.beginPath();
                cdx.lineWidth = 3;
                cdx.moveTo(originX, originY);
                cdx.strokeStyle = colors[i];
                let candidateX = originX + (hashWidth);
                let candidateY = originY - (qualVotesHistory[0][i][0]/votesMax)*(0.8*height);
                cdx.lineTo(candidateX, candidateY);
                cdx.stroke();
            }

            //Now we want to loop through each stage of the history and draw the whole thing.
            for (var j = 1; j < qualVotesHistory.length; j++) {
                //loop through each candidate now
                for (var i = 0; i < qualVotesHistory[0].length; i++) {
                    cdx.beginPath();
                    //need to get the old position of each candidate.
                    let oldX = originX + (hashWidth * (j));
                    let oldY = originY - (qualVotesHistory[j - 1][i][0]/votesMax)*(0.8*height);
                    cdx.moveTo(oldX, oldY);
                    cdx.strokeStyle = colors[i];
                    //find the new x and y
                    let newX = originX + (hashWidth * (j+1));
                    let newY = originY - (qualVotesHistory[j][i][0]/votesMax)*(0.8*height);
                    if (qualVotesHistory[j][i][0] == 0) {
                        newX = oldX;
                    }
                    cdx.lineTo(newX, newY);
                    cdx.stroke();
                }
            }

            //update graphic to represent the last round.


            //Loop through each candidate and draw the line. Set a new color for each candidate.
            

        } else {
            console.log("I'm sorry I can't display this drawing :( Sorry, you need a browser with HTML5 Canvas Support to display this graphic.");
        }
    }



    //Provides random integers from 1 to max
    function randInt(max) {
        return Math.floor(Math.random() * (max - 1)) + 1;
    }

    const randInt2 = (min, max) => {return Math.random() * (max - 1) + 1}
}