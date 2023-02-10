import React from "react";
import { TezosToolkit } from "@taquito/taquito";
import { useEndpoint } from "../contexts/Settings";
import { useConnect, useIsConnected, useDisconnect, useWalletAddress, useWalletName, useDeployContract } from '../contexts/Beacon'
import { Wallet } from "@taquito/taquito";
import { useTezosToolkit } from "../contexts/Taquito";
import { useState } from "react";
import { useContract } from "../contexts/Contract";
import { Address, Bytes, Tez, Nat,} from "@completium/archetype-ts-types";
import { part } from "../bindings/fa2_nft"

interface fa2_params {
  owner : undefined | string,
  permits: undefined | string
}


  
const ConnectedTag = () => {
  const [isConnected, walletAddress, walletName] = [useIsConnected(), useWalletAddress(), useWalletName()]
  return (
    <>
    <p>
    {isConnected() ? `Logged in with ${walletName} at address ${walletAddress} ` : 'Not Connected'}
    </p>
    </>
  )
}

const LoginButton = () => {
  const connect = useConnect()
  const disconnect = useDisconnect()
  const isConnected = useIsConnected()
  return <button onClick={() => {
    if (isConnected()) {
      disconnect()
    } else {
      connect()
    }
  }}> {!isConnected() ? 'Login' : 'Disconnect'} </button>
}



const DeployContractButton = () => {
  const deployContract = useDeployContract()
  const walletAddress = useWalletAddress()
    return (
      <button onClick={() => {
        console.log('click!')
        const parameters : fa2_params = {
          owner : walletAddress?.toString(),
          permits: walletAddress?.toString()
          }
        deployContract(parameters)
    }}>Deploy</button>
  )
}

const MintButton = () => {

  const handleMint = () => {
    console.log('click!')
    const byteInput : Bytes = Bytes.hex_encode("ipfs://bafybeigzpfsrvvb3ifrfe4tmahmenuf3flbyhi5y4v6g4fn6pqpiqd4wwy")
    contract.mint(new Address('tz1S7FjNG1mZ6YkejPaAJMckW95ZyzkzjKSr'), new Nat(2), [["My Token!!", byteInput]], [new part(new Address("tz1S7FjNG1mZ6YkejPaAJMckW95ZyzkzjKSr"), new Nat(1))], {})
  }

  const contract = useContract();
  return (
    <button onClick={handleMint}
    >Mint</button>
  )
}
export const MintPage = () => {
  

  return (
    <div>
      <h1>Mint</h1>
      <ConnectedTag />
      <LoginButton />
      <DeployContractButton />
      <MintButton />
    </div>
  );
}