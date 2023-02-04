import React from "react";
import { TezosToolkit } from "@taquito/taquito";
import { useEndpoint } from "../contexts/Settings";
import { useConnect, useIsConnected, useDisconnect, useWalletAddress, useWalletName, useDeployContract } from '../contexts/Beacon'
import { Wallet } from "@taquito/taquito";
import { useTezosToolkit } from "../contexts/Taquito";
import { useState } from "react";

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
export const MintPage = () => {
  


  

  return (
    <div>
      <h1>Mint</h1>
      <ConnectedTag />
      <LoginButton />
      <DeployContractButton />
    </div>
  );
}