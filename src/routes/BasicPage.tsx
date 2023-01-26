import { useContract } from "../contexts/Contract";
        
function TheButton() {
  return(
    <button> It's a button</button>
  )
  
}

export const Basic = () => {
  const contract = useContract();
  const owner = contract.get_owner();
  console.log(owner)
  
  return (<>
          Welcome to the basic basic page
          <TheButton />
          </>
  )
}