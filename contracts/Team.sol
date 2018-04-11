pragma solidity ^0.4.18;
import '../installed_contracts/zeppelin/contracts/ownership/Ownable.sol';
import './League.sol';
import './PlayerUniverse.sol';


contract Team is Ownable {

	string public name;
	address public leagueAddress;
	League public myLeague;
	PlayerUniverse allPlayers;

	struct Roster {
		uint QB;
		uint RB;
		uint RB2;
		uint WR;
		uint WR2;
		uint TE;
		uint Flex;
		uint K;
		uint D_ST;
		uint Bench;
		uint Bench2;
		uint Bench3;
	}


	function Team(string _name) {
		name = _name;
	}

	function joinLeague(address _leagueAddress) onlyOwner payable {
		if (League(_leagueAddress).joinLeague.value(msg.value)(name)) { 
			leagueAddress = _leagueAddress;
			myLeague = League(leagueAddress);
			allPlayers = PlayerUniverse(myLeague.allPlayers());
			
		}
	}

	// function depthChartAvailablility(uint _playerId) {

	// }

	// function updateRoster(uint _playerId) {
	// 	uint position = allPlayers.pla
	// }
	
	// function draftPlayer(uint _playerId) public onlyOwner {
	// 	require(myLeague.draftPlayer(_playerId));
	// 	Roster.QB = _playerId;
	// 	// updateRoster(_playerId);

	// }
}