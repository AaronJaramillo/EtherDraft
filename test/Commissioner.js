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

contract('Commissioner', function(accounts) {
	beforeEach(async function() {
		this.playersContract = await players.new();
		this.draftTime = latestTime() + duration.weeks(1);

	})
	it('Creates a League', async function() {
		this.commissionerContract = await Commissioner.new("TestTeam", "TestLeague", 10, ether(1), "winner-take-all", this.draftTime, "serpentine", this.playersContract.address, {from: accounts[0], value: ether(1)}).should.be.fulfilled;
		(await this.commissionerContract.name()).should.be.equal("TestTeam");
	})
})