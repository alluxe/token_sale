const LuxeCoin = artifacts.require("./LuxeCoin.sol")

module.exports = function(deployer) {

    /*if (network === 'development') {
        console.log('dep_contract');
        const totalSupply = web3.toWei("888888000", "Ether");

        deployer.deploy(LuxeCoin, totalSupply)
            .then(function () {
            return deployer.deploy(LuxeCoin, totalSupply)
        }).then(function () {
            return deployer.deploy(
                LuxeCoin
            )
        });
    }*/

   deployer.deploy(LuxeCoin)
}
