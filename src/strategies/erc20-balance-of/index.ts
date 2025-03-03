import { BigNumberish } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { Contract, Provider } from '../../utils/deployless-multicall';
import erc20Abi from './erc20.json';

export const author = 'bonustrack';
export const version = '0.1.1';

export async function strategy(
  space,
  network,
  provider,
  addresses,
  options,
  snapshot
): Promise<Record<string, number>> {
  const blockTag = typeof snapshot === 'number' ? snapshot : 'latest';

  const ethcallProvider = new Provider(network, provider);
  const tokenContract = new Contract(options.address, erc20Abi);
  const calls = addresses.map((address) => tokenContract.balanceOf(address));

  const result = await ethcallProvider.all(calls, { blockTag }, true);

  console.log(result);

  return Object.fromEntries(addresses.map((address, i) => {
    const balance = parseFloat(formatUnits(result[i] as BigNumberish, options.decimals));
    return [address, balance];
  }));
}
