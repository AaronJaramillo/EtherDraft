pragma solidity ^0.4.18;

import '../installed_contracts/zeppelin/contracts/ownership/Ownable.sol';
import './League.sol';
import './Team.sol';

contract Commissioner is Team {

	function Commissioner(string _teamName,
		string _leagueName,
		uint _leagueSize,
		uint _buyIn,
		string _jackpoStyle,
		uint _draftTime,
		string _draftStyle,
		address _playerUnivers) Team(_teamName) payable{

		address league = new League(_leagueName, _leagueSize, _buyIn, _jackpoStyle, _draftTime, _draftStyle, _playerUnivers);

		joinLeague(league);

	}

	function changeDraftTime(uint _unixTimestamp) public onlyOwner
	{
		myLeague.changeDraftTime(_unixTimestamp);

	}
}