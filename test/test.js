let assertRevert = async promise => {
    try {
        await promise;
        assert.fail('Expected revert not received');
    } catch (error) {
        const revertFound = error.message.search('revert') >= 0;
        assert(revertFound, `Expected "revert", got ${error} instead`);
    }
};

const LuxeCoin = artifacts.require('./LuxeCoin.sol');
contract('LuxeCoin', function ([owner, recipient, anotherAccount]) {

    let token;

    beforeEach(async function () {
        token = await LuxeCoin.new();
    });

    it('has an owner', async function () {
        assert.equal(await token.owner(), owner)
    })

    describe('total supply', function () {
        it('returns the total amount of tokens', async function () {
            const totalSupply = await token.totalSupply();

            assert.equal(totalSupply, 220000000000000000000000000);
        });
    });


    describe('balanceOf', function () {
        describe('when the requested account has no tokens', function () {
            it('returns zero', async function () {
                const balance = await token.balanceOf(anotherAccount);

                assert.equal(balance, 0);
            });
        });

        describe('when the requested account has some tokens', function () {
            it('returns the total amount of tokens', async function () {
                const balance = await token.balanceOf(owner);
                assert.equal(balance, 220000000000000000000000000);
            });
        });
    });

    describe('transfer', function () {
        const to = recipient;

        describe('when the sender does not have enough balance', function () {
            const amount = 220000000000000000000000001;

            it('reverts', async function () {
                await assertRevert(token.transfer(to, amount));
            });
        });

        describe('when the sender has enough balance', function () {
            const amount = 220000000000000000000000000;

            it('transfers the requested amount', async function () {
                await token.transfer(to, amount, {from: owner});

                const senderBalance = await token.balanceOf(owner);
                assert.equal(senderBalance, 0);

                const recipientBalance = await token.balanceOf(to);
                assert.equal(recipientBalance, amount);
            });

            it('emits a transfer event', async function () {
                const {logs} = await token.transfer(to, amount, {from: owner});

                assert.equal(logs.length, 1);
                assert.equal(logs[0].event, 'Transfer');
                assert.equal(logs[0].args.from, owner);
                assert.equal(logs[0].args.to, to);
                assert(logs[0].args.value.eq(amount));
            });
        });
    });
});