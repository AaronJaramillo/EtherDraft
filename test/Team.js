import ether from './helpers/ether'
import EVMThrow from './helpers/EVMThrow'
import {advanceBlock} from './helpers/advanceToBlock'
import {increaseTimeTo, duration} from './helpers/increaseTime'
import latestTime from './helpers/latestTime'
import EVMExcept from './helpers/EVMexcept'

const league = artifacts.require("League.sol");
const team = artifacts.require("Team.sol");
const players = artifacts.require("PlayerUniverse.sol");
const Commissioner = artifacts.require("Commissioner.sol");

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
	beforeEach(async function() {
		this.playersContract = await players.new();
		this.draftTime = latestTime() + duration.weeks(1);
		this.commissionerContract = await Commissioner.new("TestTeam", "TestLeague", 10, ether(1), "winner-take-all", this.draftTime, "serpentine", this.playersContract.address, {from: accounts[0], value: ether(1)}).should.be.fulfilled;
		this.leagueContract = await league.at(await this.commissionerContract.leagueAddress());
		// this.leagueContract = await league.new("TestLeague", 10, ether(1), "winner-take-all", this.draftTime, "serpentine", this.playersContract.address, {from: accounts[0]});
		this.teamContract = await team.new("testTeam", {from: accounts[1]});
	})
	it('Joins a league', async function() {
		await this.teamContract.joinLeague(this.leagueContract.address, {from: accounts[1], value: ether(1)}).should.be.fulfilled;
		(await this.leagueContract.teamCount()).should.be.bignumber.equal(2);
		(await this.teamContract.leagueAddress()).should.be.bignumber.equal(this.leagueContract.address);
		(await this.leagueContract.allPlayers()).should.be.bignumber.equal(this.playersContract.address);
	})
})
contract("Team Draft", function(accounts) {
	beforeEach(async function() {
		this.playersContract = await players.new();
		this.draftTime = latestTime() + duration.weeks(1);
		this.commissionerContract = await Commissioner.new("TestTeam", "TestLeague", 10, ether(1), "winner-take-all", this.draftTime, "serpentine", this.playersContract.address, {from: accounts[0], value: ether(1)}).should.be.fulfilled;
		this.leagueContract = await league.at(await this.commissionerContract.leagueAddress());
		// this.leagueContract = await league.new("TestLeague", 10, ether(1), "winner-take-all", this.draftTime, "serpentine", this.playersContract.address, {from: accounts[0]});
		this.teamContract = await team.new("testTeam", {from: accounts[1]});
		await this.teamContract.joinLeague(this.leagueContract.address, {from: accounts[1], value: ether(1)}).should.be.fulfilled;
		await increaseTimeTo(this.draftTime);
	})
	it('Drafts a Quarterback', async function() {
		await this.teamContract.draftPlayer(1, {from: accounts[1]}).should.be.fulfilled;
		(await this.teamContract.getPlayer.call("QB")).should.be.bignumber.equal(1);
		(await this.leagueContract.draftedPlayers.call(1)).should.be.equal(true);
	})
	it("Returns accurate checks for undrafted players", async function() {
		(await this.teamContract.getPlayer.call("QB")).should.be.bignumber.equal(0);
		(await this.leagueContract.draftedPlayers.call(1)).should.be.equal(false);
	})
	it("Rejects drafting a 5th Quarterback", async function() {
		await this.teamContract.draftPlayer(1, {from: accounts[1]}).should.be.fulfilled;
		(await this.teamContract.getPlayer.call("QB")).should.be.bignumber.equal(1);
		await this.teamContract.draftPlayer(2, {from: accounts[1]}).should.be.fulfilled;
		await this.teamContract.draftPlayer(3, {from: accounts[1]}).should.be.fulfilled;
		await this.teamContract.draftPlayer(4, {from: accounts[1]}).should.be.fulfilled;
		(await this.teamContract.getPlayer.call("QB")).should.be.bignumber.equal(1);
		(await this.leagueContract.draftedPlayers.call(1)).should.be.equal(true);
		await this.teamContract.draftPlayer(5, {from: accounts[1]}).should.be.rejectedWith(EVMExcept);

	})
})



