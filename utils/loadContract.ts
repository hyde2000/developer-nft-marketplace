import Web3 from "web3";

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (name: string, web3: Web3) => {
  const res = await fetch(`/contracts/${name}.json`);
  const Artifact = await res.json();

  let contract = null;
  try {
    if (NETWORK_ID) {
      contract = new web3.eth.Contract(
        Artifact.abi,
        Artifact.networks[NETWORK_ID].address
      );
    } else {
      console.log("NETWORK_ID is not set");
    }
  } catch {
    console.error(`Contract ${name} cannot be loaded`);
  }

  return contract;
};
