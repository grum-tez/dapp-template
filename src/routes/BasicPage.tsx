import React from "react";
// import { useContract } from "../contexts/Contract";

// import { useState } from 'react';
// import { useEffect } from 'react';
// import { Address, Tez } from "@completium/archetype-ts-types";

// import { useConnect, useIsConnected, useDisconnect, useWalletAddress, useWalletName } from '../contexts/Beacon'
// import { Wallet } from "@taquito/taquito";

// const marketplaceTwo = new Address("tz1Kvz9VWND2W393XHcutUtvAUcQHt4ZTU3u")

// const ConnectedTag = () => {
//   const [isConnected, walletAddress, walletName] = [useIsConnected(), useWalletAddress(), useWalletName()]
//   return (
//     <>
//     <p>
//     {isConnected() ? `Logged in with ${walletName} at address ${walletAddress} ` : 'Not Connected'}
//     </p>
//     </>
//   )
// }

// const LoginButton = () => {
//   const connect = useConnect()
//   const disconnect = useDisconnect()
//   const isConnected = useIsConnected()
//   return <button onClick={() => {
//     if (isConnected()) {
//       disconnect()
//     } else {
//       connect()
//     }
//   }}> {!isConnected() ? 'Login' : 'Disconnect'} </button>
// }

// const MakeOfferForm = () => {
//   const [offerAmount, setOfferAmount] = useState<Tez>();
//   const contract = useContract();

//   const handleSubmitBid = (e: React.FormEvent<HTMLInputElement>) => {
//       e.preventDefault()
//       console.log('submitting offer', offerAmount)
//       console.log(marketplaceTwo)
//       contract.makeOffer(new Address("tz1Kvz9VWND2W393XHcutUtvAUcQHt4ZTU3u"), {amount : new Tez(5)})
//   }

//   return (
//     <>
//     <p>Make Offer</p>
//     <form>
//     <input type="number" min="0" step="0.1" onChange={(e) => {
//       const value = parseInt(e.target.value)
//       setOfferAmount(new Tez(value))
//       }}/>
  
//     <input type="submit" value="submit bid" onClick={handleSubmitBid}/>
//     </form>
//     </>
//   )
// }

// // const 


// export const BasicInfo = () => {
//   const contract = useContract();
//   const [owner, setOwner] = useState<Address>();
//   const [creator, setCreator] = useState<Address>();
//   const [tidemark, setTidemark] = useState<Tez>();
//   const [contractAddress, setContractAddress] = useState<Address>();
//   const [isOwner, setIsOwner] = useState<Boolean>(false)
//   const [isCreator, setIsCreator] = useState<Boolean>(false)
//   const [bidderAddress, setBidderAddress] = useState<Address>();
//   const [isBidder, setIsBidder] = useState<Boolean>(false);
//   const [isInitalised, setIsInitalised] = useState<Boolean>(false);
//   const walletAddress = useWalletAddress()
  
//   useEffect(() => {
//     async function getOwner() {
//       const owner = await contract.get_owner();
//       console.log('owner', owner)
//       setOwner(owner);
//     }
//     async function getTidemarkLevel() {
//       const tidemarkLevel = await contract.get_tidemark();
//       console.log('tidemarkLevel', tidemarkLevel)
//       setTidemark(tidemarkLevel);
//     }
//     async function getContractAddress() {
//       const contractAddress = await contract.get_address();
//       console.log('contractAddress', contractAddress)
//       setContractAddress(contractAddress);
//     }
//     async function getCreatorAddress() {
//       const creatorAdress = await contract.get_creator();
//       console.log('creatorAdress', creatorAdress)
//       setCreator(creatorAdress);
//     }
//     async function getBidderAddress() {
//       const bidderAdress = await contract.get_bidder();
//       console.log('bidderAdress', bidderAdress)
//       if (bidderAddress) setBidderAddress(bidderAdress.get());
//     }
//     async function getIsInitalised() {
//       const isInitalised = await contract.get_initiated();
//       console.log('isInitalised', isInitalised)
//       setIsInitalised(isInitalised);
//     }
//     getOwner();
//     getTidemarkLevel();
//     getContractAddress();
//     getCreatorAddress();
//     getBidderAddress();
//     getIsInitalised()
//   }, [contract]
//   ) 

//   useEffect(() => {
//     // console.log('owner', owner), 'contrac')
    
//     setIsOwner(walletAddress === owner?.toString())
//     setIsCreator(walletAddress === creator?.toString())
//     setIsBidder(walletAddress === bidderAddress)
//   }, [walletAddress, owner])

// return (<>
           
//           <h1>Welcome to basic page</h1>

//           <ConnectedTag/>

//           <LoginButton/>

          
// <h2> Contract details: </h2>

// <p>{`You ${isOwner?"" : "do not"} own this mark`}</p>

// {isCreator && 
// (<p>You created this token</p>)}
// {!isInitalised && isCreator && (<><p>You haven't initiated this token yet </p>
// <button onClick={() => contract.initiate({amount: new Tez(0)})}>Initiate</button></>)

// }

// {isBidder &&
// <p>You are the current top bidder</p>}

// <p>{`The current top bidder is: ${bidderAddress}`}</p>

//           <p>
//           {'The contract owner is: ' + owner}
//           </p>
//           <p>
//           {'The current tidemark level is: ' + tidemark}
//           </p>

//         <h3> Actions you can take:</h3>

//         <MakeOfferForm/>
          
//           </>
//   )
// }
