pragma solidity ^0.4.18;
import '../installed_contracts/zeppelin/contracts/ownership/Ownable.sol';
import './League.sol';
import './PlayerUniverse.sol';


contract Team is Ownable {

	// struct Roster {
	// 	uint QB;
	// 	uint RB;
	// 	uint RB2;
	// 	uint WR;
	// 	uint WR2;
	// 	uint TE;
	// 	uint Flex;
	// 	uint K;
	// 	uint D_ST;
	// 	uint Bench;
	// 	uint Bench2;
	// 	uint Bench3;
	// }
	mapping (string => uint) Roster;
	string public name;
	address public leagueAddress;
	League public myLeague;
	// Roster public lineUp;
	PlayerUniverse allPlayers;

	function Team(string _name) {
		name = _name;
	}
	function getPlayer(string _position)
	public 
	returns (uint) 
	{
		return Roster[_position];
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
	function addPlayer(uint _playerId, string _position)
	{

		require(myLeague.draftPlayer(_playerId));
		Roster[_position] = _playerId;
	}
	function draftPlayer(uint _playerId) public onlyOwner {

		uint position = allPlayers.getPlayerPosition(_playerId);
		if (position == 1) {
			if (getPlayer("QB") == 0) {
				addPlayer(_playerId, "QB");
			} else if (getPlayer("Bench") == 0) {
				addPlayer(_playerId, "Bench");
			} else if (getPlayer("Bench2") == 0) {
				addPlayer(_playerId, "Bench2");
			} else if (getPlayer("Bench3") == 0) {
				addPlayer(_playerId, "Bench3");
			} else {
				throw;
			}
		} else if (position == 2) {
			if (getPlayer("RB") == 0) {
				addPlayer(_playerId, "RB");
			} else if (getPlayer("RB2") == 0) {
				addPlayer(_playerId, "RB2");
			} else if (getPlayer("FLEX") == 0) {
				addPlayer(_playerId, "FLEX");
			} else if (getPlayer("Bench") == 0) {
				addPlayer(_playerId, "Bench");
			} else if (getPlayer("Bench2") == 0) {
				addPlayer(_playerId, "Bench2");
			} else if (getPlayer("Bench3") == 0) {
				addPlayer(_playerId, "Bench3");
			}else {
				throw;
			}
		} else if (position == 3) {
			if (getPlayer("WR") == 0) {
				addPlayer(_playerId, "WR");
			} else if (getPlayer("WR2") == 0) {
				addPlayer(_playerId, "WR2");
			} else if (getPlayer("FLEX") == 0) {
				addPlayer(_playerId, "FLEX");
			} else if (getPlayer("Bench") == 0) {
				addPlayer(_playerId, "Bench");
			} else if (getPlayer("Bench2") == 0) {
				addPlayer(_playerId, "Bench2");
			} else if (getPlayer("Bench3") == 0) {
				addPlayer(_playerId, "Bench3");
			} else {
				throw;
			}
		} else if (position == 4) {
			if (getPlayer("TE") == 0) {
				addPlayer(_playerId, "TE");
			} else if (getPlayer("FLEX") == 0) {
				addPlayer(_playerId, "FLEX");
			} else if (getPlayer("Bench") == 0) {
				addPlayer(_playerId, "Bench");
			} else if (getPlayer("Bench2") == 0) {
				addPlayer(_playerId, "Bench2");
			} else if (getPlayer("Bench3") == 0) {
				addPlayer(_playerId, "Bench3");
			} else {
				throw;
			}
		} else if (position == 5) {
			if (getPlayer("K") == 0) {
				addPlayer(_playerId, "K");
			} else if (getPlayer("Bench") == 0) {
				addPlayer(_playerId, "Bench");
			} else if (getPlayer("Bench2") == 0) {
				addPlayer(_playerId, "Bench2");
			} else if (getPlayer("Bench3") == 0) {
				addPlayer(_playerId, "Bench3");
			} else {
				throw;
			}
		} else if (position == 6) {
			if (getPlayer("D/ST") == 0) {
				addPlayer(_playerId, "D/ST");
			} else if (getPlayer("Bench") == 0) {
				addPlayer(_playerId, "Bench");
			} else if (getPlayer("Bench2") == 0) {
				addPlayer(_playerId, "Bench2");
			} else if (getPlayer("Bench3") == 0) {
				addPlayer(_playerId, "Bench3");
			} else {
				throw;
			}
		} else {
				throw;
		}
		// updateRoster(_playerId);

	}
}