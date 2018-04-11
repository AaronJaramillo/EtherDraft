import ether from './helpers/ether'
import EVMThrow from './helpers/EVMThrow'
import {advanceBlock} from './helpers/advanceToBlock'
import {increaseTimeTo, duration} from './helpers/increaseTime'
import latestTime from './helpers/latestTime'
import EVMExcept from './helpers/EVMexcept'

const league = artifacts.require("League.sol");
const team = artifacts.require("Team.sol");
const players = artifacts.require("PlayerUniverse.sol");

const BigNumber = web3.BigNumber;
const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('League Parameter Checks', function(accounts) {
	it('Should reflect proper arguments', async function() {
		this.teamContract = await team.new("testTeam");

		(await this.teamContract.name()).should.be.equal("testTeam");

	})
})
contract('Team', function(accounts) {
	const commissioner = accounts[0];
	beforeEach(async function() {
		this.playersContract = await players.new();
		this.draftTime = latestTime() + duration.weeks(1);
		this.leagueContract = await league.new("TestLeague", 10, ether(1), "winner-take-all", this.draftTime, "serpentine", this.playersContract.address, {from: accounts[0]});
		this.teamContract = await team.new("testTeam", {from: accounts[1]});
	})
	it('Joins a league', async function() {
		await this.teamContract.joinLeague(this.leagueContract.address, {from: accounts[1], value: ether(1)}).should.be.fulfilled;
		(await this.leagueContract.teamCount()).should.be.bignumber.equal(2);
		(await this.teamContract.leagueAddress()).should.be.bignumber.equal(this.leagueContract.address);
		(await this.leagueContract.allPlayers()).should.be.bignumber.equal(this.playersContract.address);
	})
})
// contract("Team Draft", function(accounts) {
// 	const commissioner = accounts[0];
// 	beforeEach(async function() {
// 		this.playersContract = await players.new();
// 		this.draftTime = latestTime() + duration.weeks(1);
// 		this.leagueContract = await league.new("TestLeague", 10, ether(1), "winner-take-all", this.draftTime, "serpentine", this.playersContract.address, {from: accounts[0]});
// 		this.teamContract = await team.new("testTeam", {from: accounts[1]});
// 		await this.teamContract.joinLeague(this.leagueContract.address, {from: accounts[1], value: ether(1)}).should.be.fulfilled;
// 	})
// 	it('Drafts a Quarterback', async function() {
// 		await this.teamContract.draftPlayer(1, {from: accounts[1]}).should.be.fulfilled;
		
// 	})
// })