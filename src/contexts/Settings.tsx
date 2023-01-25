import { NetworkType } from "@airgap/beacon-sdk";
import constate from "constate";
import { useState } from 'react';

export const [
  SettingsProvider,
  useAppName,
  useEndpoint,
  useNetwork,
  useContractAddress
] = constate(
  () => {
    const [settingState] = useState({
      app_name        : 'My DApp',
      endpoint        : 'https://ghostnet.ecadinfra.com',
      network         :  NetworkType.GHOSTNET,
      contract        : 'KT1...',
    });
    return settingState;
  },
  v => v.app_name,
  v => v.endpoint,
  v => v.network,
  v => v.contract
);