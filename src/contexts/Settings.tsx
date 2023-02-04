import { NetworkType } from "@airgap/beacon-sdk";
import useMediaQuery from '@mui/material/useMediaQuery';
import constate from "constate";
import { useState } from 'react';

export enum Theme {
  Default,
  Light,
  Dark
}

const switch_theme = (t : Theme, defaultDark : boolean) : Theme => {
  switch (t) {
    case Theme.Default : return defaultDark ? Theme.Light : Theme.Dark
    case Theme.Light   : return Theme.Dark
    case Theme.Dark    : return Theme.Light
  }
}

export const [
  SettingsProvider,
  useTheme,
  useAppName,
  useEndpoint,
  useContractAddress,
  useNetwork,
  useIPFSBrowser,
  useSwitchTheme,
] = constate(
  () => {
    const [settingState, setState] = useState({
      app_name        : 'Tidemark',
      endpoint        : 'https://ghostnet.ecadinfra.com',
      contract        : 'KT1U9Yt1MQNUMoWtcAPsJM8h6LPhUu7HtMQB',
      ipfs_browser    : 'https://gateway.pinata.cloud/ipfs/',
      network         :  NetworkType.GHOSTNET,
      theme           :  Theme.Default,
    });
    const defaultDark = useMediaQuery('(prefers-color-scheme: dark)');
    const switchTheme = () => { setState(s => { return { ...s, theme : switch_theme(s.theme, defaultDark) }}) }
    return { settingState, setters : { switchTheme } };
  },
  v => v.settingState.theme,
  v => v.settingState.app_name,
  v => v.settingState.endpoint,
  v => v.settingState.contract,
  v => v.settingState.network,
  v => v.settingState.ipfs_browser,
  v => v.setters.switchTheme
);
