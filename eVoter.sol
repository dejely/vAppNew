// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

contract eVoting{

    address public COMELEC;

    struct PhilSys{

        bool fingerprint_registered;
        bool data_valid;
        bool eligible;
        bool has_voted;
    }

    address public Government;

    mapping(string => PhilSys) public voter; //Key-value pairs 
    mapping(string => uint256) public count;
    
    string[] public master_list;
    event VoteCasted(string philsys_id, string candidate);

    constructor(string[] memory candNames){
        COMELEC = msg.sender;
        master_list = candNames;

    }

    

    //Set modifier such that we are able to set certain functions where only the COMELEC can access
    modifier onlyCOMELEC(){
        require (msg.sender == COMELEC, "You are not authorized");
        _;
    }

    //Register Function
    function registerVoter(string memory _id, bool fingerprint, bool _valid, bool _eligible
    ) public onlyCOMELEC{
        PhilSys memory newVoter = PhilSys({
            fingerprint_registered: fingerprint,
            data_valid: _valid,
            eligible: _eligible,
            has_voted: false
        });

        voter[_id] = newVoter;
    }
    //Voting function (count++ included)
    function Vote(string memory _id, string memory candNames) public{
        PhilSys storage voters = voter[_id];
        require(bytes(candNames).length > 0, "Candidate cannot be empty"); //Implement a catch(err) if candName not valid(?)

        require (voters.fingerprint_registered, "You must register a valid fingerprint");
        require (voters.data_valid, "Data is invalid;");
        require (voters.eligible, "You are not eligible to vote");
        require (!voters.has_voted, "You have already voted");

        bool validCanD = false;
        for (uint i = 0; i <master_list.length; i++){

            // data hashing, need to find Solution to ensure security and performance
            
            if (keccak256(bytes(master_list[i])) == keccak256(bytes(candNames))){//Note: openAI suggests keccack256 and SHA-256 for hashing
                validCanD = true;
                break;
                
            } 
        }

        require(validCanD, "Invalid Candidate name;");

        count[candNames]++;
        voters.has_voted = true;
       
       emit VoteCasted(_id, candNames);
    }

    function allVotes(string memory candNames) public view onlyCOMELEC returns (uint256){
        return count[candNames];
    }

}