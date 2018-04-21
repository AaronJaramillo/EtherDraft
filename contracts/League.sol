pragma solidity ^0.4.18;
import '../installed_contracts/zeppelin/contracts/ownership/Ownable.sol';
import './PlayerUniverse.sol';
import './Team.sol';
import './Auction.sol';

contract League is Ownable, Auction{

	string public name;
	uint public leagueSize;
	uint public buyIn;
	string public jackpotStyle;
	uint public draftTime;
	string public draftStyle;
	// mapping (uint => address) public teamList;
	mapping (address => string) public teams;
	mapping (uint => bool) public draftedPlayers;
	mapping (uint => address) public draftOrder;
	mapping (address => uint) public salaryCap;
	uint public draftRound = 1;
	uint public draftPick = 1;
	uint public teamCount = 0;
	PlayerUniverse public allPlayers;

	function League(string _name, 
		uint _leagueSize, 
		uint _buyIn, 
		string _jackpotStyle, 
		uint _draftTime, 
		string _draftStyle,
		address _playerUniverse) Auction(10){

		name = _name;
		leagueSize = _leagueSize;
		buyIn = _buyIn;
		jackpotStyle = _jackpotStyle;
		draftTime = _draftTime;
		draftStyle = _draftStyle;
		allPlayers = PlayerUniverse(_playerUniverse);

	}

	// function randomize(bytes32 nonce) returns (uint) {
	// 	return uint(keccak256(nonce))%(1+index.length)-1;
	// }
	// function setDraftOrder() public onlyOwner {
	// 	for (uint x = 0; x < index.length; x++) {
	// 		bool pickAssigned = false;
	// 		uint nonce = 0;
	// 		while(!pickAssigned) {
	// 			uint pickNumber = randomize(keccak256(msg.sender, nonce));
	// 			if(draftOrder[pickNumber] == 0) {
	// 				draftOrder[pickNumber] = msg.sender;
	// 				pickAssigned = true;
	// 			} else {
	// 				nonce++;
	// 			}
	// 		}
	// 	}
	// }
	//returns is the draft is within 1 hour or not
	function draftNotStarted() 
	private 
	returns (bool) 
	{

		return (draftTime > (now + 1 hours));
	}

	function draftStarted() 
	private 
	returns (bool) 
	{

		return (now >= draftTime);
	}

	function usersPick(address _team) public returns (bool) {
		return (draftOrder[draftPick] == _team);
	}

	//Takes a unix timestamp, sets draftTime 
	function changeDraftTime(uint _unixTimestamp)
	public
	onlyOwner
	{
		require(draftNotStarted());
		draftTime = _unixTimestamp;

	} 

	function joinLeague(string _teamName) public payable returns (bool) {
		require (teamCount < leagueSize);
		require(draftNotStarted());
		require(bytes(teams[msg.sender]).length == 0);
		require(bytes(_teamName).length != 0);
		require (msg.value >= buyIn);
		teams[msg.sender] = _teamName;
		teamCount += 1;
		draftOrder[teamCount] = msg.sender;
		salaryCap[msg.sender] = 200;


		
		return true;

	}

	// function depthChartAvailability(uint _playerId, address _team) returns (bool) {
	// 	uint position = allPlayers.getPlayerPosition(_playerId);
	// 	Team team = Team(_team);
	// 	if (position == 1) {
	// 		return (team.getPlayer("QB") == 0);
	// 	} else if (position == 2) {
	// 		return (team.getPlayer("RB") == 0 || team.getPlayer("RB2") == 0 || team.getPlayer("FLEX") == 0);
	// 	}
	// }

	function draftPlayer(uint _playerId, uint _bid) public {
		require(draftStarted());
		require(!draftedPlayers[_playerId]);
		// require(depthChartAvailability(_playerId, msg.sender));
		require(usersPick(msg.sender));
		if(block.number >= auctionEnd && (auctionEnd != 0))
		{
			endAuction();
			draftedPlayers[_playerId] = true;
			Team(highestBidder).draftedPlayer(playerOnBlock);
			salaryCap[highestBidder] = salaryCap[highestBidder] - highestBid;
		}
		openAuctionBlock(_bid, _playerId);
		if (draftPick >= teamCount) {
			draftRound += 1;
			draftPick = 1;
		} else {
			draftPick += 1; 
		}



	}

	function () payable {
		require (teamCount < leagueSize);
		require(draftNotStarted());
		require(bytes(teams[msg.sender]).length == 0);
		require (msg.value >= buyIn);
		joinLeague('Default');
	}


}