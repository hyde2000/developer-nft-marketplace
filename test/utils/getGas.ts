export const getGas = async (result: any) => {
  const tx = await web3.eth.getTransaction(result.tx);
  const gasUsed = web3.utils.toBN(result.receipt.gasUsed);
  const gasPrice = web3.utils.toBN(tx.gasPrice);
  const gas = gasUsed.mul(gasPrice);
  return gas;
};
