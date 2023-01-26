import { Nat } from "@completium/archetype-ts-types";
import constate from "constate";
import { useEffect, useState } from "react";

import { useContract } from "./Contract";
import { useIPFSBrowser } from "./Settings";

// //I am trying to get any value out of a tidemark
// export const [
//   PollDataProvider,
//   usePolls,
//   useLoadData,
//   useLoadResponses,
//   //useSurveyUtils
// ] = constate(
//   () => {
//     const [polls, setPolls] = useState<Array<Poll>>([]);
//     const ipfs = useIPFSBrowser();
//     const contract = useContract();

//     const loadData = async () => {
//       const poll_data = await contract.get_poll();
//       const polls = await Promise.all(
//         poll_data.map(async ([poll_id, poll_value]) => {
//           const hash = poll_value.ipfs_hash.hex_decode();
//           const url = ipfs + poll_value.ipfs_hash.hex_decode();
//           const res = await fetch(url);
//           const ui: UIPoll = await res.json();
//           return {
//             id: poll_id.to_big_number().toNumber(),
//             hash: hash,
//             utterance: ui.utterance,
//             img: ui.img,
//             choices: ui.choices,
//             responses: nats_to_numbers(poll_value.responses),
//             creation: poll_value.creation,
//           };
//         })
//       );
//       setPolls(
//         polls.sort((p1, p2) => p1.creation.getTime() - p2.creation.getTime())
//       );
//     };

//     const loadResponses = async (poll_id: number) => {
//       const responses = await contract.view_get_responses(new Nat(poll_id), {});
//       if (responses) {
//         setPolls((ps) => {
//           for (let i = 0; i < ps.length; i++) {
//             if (ps[i].id === poll_id) {
//               ps[i].responses = nats_to_numbers(responses);
//             }
//           }
//           return ps;
//         });
//       }
//     };

//     useEffect(() => {
//       // load polls' ui data
//       loadData();
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     return { polls, utils: { loadResponses, loadData } };
//   },
//   (v) => v.polls,
//   (v) => v.utils.loadData,
//   (v) => v.utils.loadResponses
// );