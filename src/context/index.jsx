import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';


const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0xb04a64cA398ae0F3342C40CDeBA58b3460Eec39d');

    //to write in our contract
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

    const address = useAddress();
    const connect = useMetamask();

    //PUBLISH CAMPAIGN 
    const publishCampaign = async (form) => {
        try {
          const data = await createCampaign([
            //below thinhs have to be in same order as the smart contract createCampaign function
            address, // owner
            form.title, // title
            form.description, // description
            form.target,
            new Date(form.deadline).getTime(), // deadline,
            form.image
          ])
    
          console.log("contract call success", data)
        } catch (error) {
          console.log("contract call failure", error)
        }
    }

    const getCampaigns = async () => {
      const campaigns = await contract.call('getCampaigns'); //making a  call to the contract
      
      //WE GET A CAMPAIGN AND WE RETURN A OBJECT WITH THE NEEDED DATA
      const parsedCampaings = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
        image: campaign.image,
        pId: i
      }));
      // console.log(parsedCampaings);
      return parsedCampaings;
    }

    // To get the campaigns of particular user
    const getUserCampaigns = async () => {
      const allCampaigns = await getCampaigns();
  
      const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);
  
      return filteredCampaigns;
    }

    //TO DONATE TO A CAMPAIGN
    
    const donate = async (pId, amount) => {
      const data = await contract.call('donateToCampaign', pId, { value: ethers.utils.parseEther(amount)});
  
      return data;
    }


    const getDonations = async (pId) => {
      const donations = await contract.call('getDonators', pId);
      const numberOfDonations = donations[0].length;
  
      const parsedDonations = [];
  
      for(let i = 0; i < numberOfDonations; i++) {
        parsedDonations.push({   //we are pushing the object which contains the donator and amt he donated
          donator: donations[0][i],
          donation: ethers.utils.formatEther(donations[1][i].toString())
        })
      }
  
      return parsedDonations;
    }
  


    return (
        <StateContext.Provider
          value={{ 
            address,
            contract,
            connect,
            createCampaign: publishCampaign,
            getCampaigns,
            getUserCampaigns,
            donate,
            getDonations,
          }}
        >
          {children}
        </StateContext.Provider>
      )
}

export const useStateContext = () => useContext(StateContext);