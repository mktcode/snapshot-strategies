import { BigNumberish } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { Contract, Provider } from '../../utils/deployless-multicall';
import { Multicaller } from '../../utils';
import erc20Abi from './erc20.json';

export const author = 'bonustrack';
export const version = '0.1.1';

const abi = [
  'function balanceOf(address account) external view returns (uint256)'
];

export async function strategy(
  space,
  network,
  provider,
  addresses,
  options,
  snapshot
): Promise<Record<string, number>> {
  const blockTag = typeof snapshot === 'number' ? snapshot : 'latest';

  /**
   * Deployless
   */
  const ethcallProvider = new Provider(1, provider);
  const tokenContract = new Contract(options.address, erc20Abi);
  const calls = addresses.map((address) => tokenContract.balanceOf(address));

  const result = await ethcallProvider.all(calls, { blockTag }, true);

  console.log(result);

  return Object.fromEntries(addresses.map((address, i) => {
    const balance = parseFloat(formatUnits(result[i] as BigNumberish, options.decimals));
    return [address, balance];
  }));
  /** End Deployless */

  /**
   * Old Version
   */
  // const multi = new Multicaller(network, provider, abi, { blockTag });
  // addresses.forEach((address) =>
  //   multi.call(address, options.address, 'balanceOf', [address])
  // );
  // const result: Record<string, BigNumberish> = await multi.execute();

  // return Object.fromEntries(
  //   Object.entries(result).map(([address, balance]) => [
  //     address,
  //     parseFloat(formatUnits(balance, options.decimals))
  //   ])
  // );
  /** End Old Version */
}
