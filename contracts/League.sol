pragma solidity ^0.4.18;
import '../installed_contracts/zeppelin/contracts/ownership/Ownable.sol';
import './PlayerUniverse.sol';
import './Team.sol';

contract League is Ownable{

	string public name;
	uint public leagueSize;
	uint public buyIn;
	string public jackpotStyle;
	uint public draftTime;
	string public draftStyle;
	mapping (address => string) teams;
	mapping (uint => bool) draftedPlayers;
	mapping (uint => address) draftOrder;
	uint public draftRound = 1;
	uint public draftPick = 1;
	uint public teamCount = 1;
	PlayerUniverse public allPlayers;

	function League(string _name, 
		uint _leagueSize, 
		uint _buyIn, 
		string _jackpotStyle, 
		uint _draftTime, 
		string _draftStyle,
		address _playerUniverse){

		name = _name;
		leagueSize = _leagueSize;
		buyIn = _buyIn;
		jackpotStyle = _jackpotStyle;
		draftTime = _draftTime;
		draftStyle = _draftStyle;
		allPlayers = PlayerUniverse(_playerUniverse);

	}

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

		return (now > draftTime);
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
		return true;

	}

	// function depthChartAvailability(uint _playerId, address _team) returns (bool) {
	// 	uint position = allPlayers.getPlayerPosition(_playerId);
	// 	Team team = Team(_team);
	// 	if (position == 1) {
	// 		return (team.Roster.QB() == 0);
	// 	}
	// }

	// function draftPlayer(uint _playerId) public returns (bool) {
	// 	// require(draftStarted());
	// 	require(!draftedPlayers[_playerId]);
	// 	require(depthChartAvailability());
	// 	// require(usersPick(msg.sender));

	// 	draftedPlayers[_playerId] = true;
	// 	if (draftPick >= teamCount) {
	// 		draftRound += 1;
	// 		draftPick = 1;
	// 	} else {
	// 		draftPick += 1; 
	// 	}
	// 	return true;

	// }

	function () payable {
		require (teamCount < leagueSize);
		require(draftNotStarted());
		require(bytes(teams[msg.sender]).length == 0);
		require (msg.value >= buyIn);
		joinLeague('Default');
	}


}