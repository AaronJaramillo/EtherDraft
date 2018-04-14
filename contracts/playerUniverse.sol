pragma solidity ^0.4.18;
import '../installed_contracts/zeppelin/contracts/ownership/Ownable.sol';


contract PlayerUniverse is Ownable {
	
	mapping (uint => uint) players;

	function PlayerUniverse() {
		players[1] = 1;
		players[2] = 1;
		players[3] = 1;
		players[4] = 1;
		players[5] = 1;
		players[6] = 1;
		players[7] = 1;
	}
	function getPlayerPosition(uint _playerId) public returns (uint) {
		return players[_playerId];
	}
}