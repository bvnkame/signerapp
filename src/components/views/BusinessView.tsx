import React, { use, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDashboard } from '../../contexts/DashboardContext';
import Card from '../Card';
import Button from '../Button';
import BusinessIcon from '../icons/BusinessIcon';
import { JsonEditor } from 'json-edit-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthenticatedUser } from '@/src/hooks/useAuthenticatedUser';
import { nostrService } from '@/src/services/nostrService';
import { stringToFields } from '@/src/utils/utils';
import { backendAPI } from '@/src/services/backend';
import { Poseidon } from 'o1js';
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useNostrEvent } from '@/src/contexts/NostrEventContext';
import { SubCloser } from 'nostr-tools/abstract-pool';
import { FourSquare } from 'react-loading-indicators';

const saveZkAppPublicKey = (key: string) => {
    localStorage.setItem('zkAppPublicKey', key);
};

const loadZkAppPublicKey = (): string | null => {
    return localStorage.getItem('zkAppPublicKey');
};


// const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const savedZkAppPublicKey = loadZkAppPublicKey();

const CONTRACT_QUERY = gql`
    query Accounts($publicKey: String!) {
        accounts(publicKey: $publicKey) {
            zkappState
        }
    }
`;

const CONTRACT_EVENTS_ACTIONS_QUERY = gql`
    query Events($address: String!) {
        events(
            input: { address: $address }
        ) {
            eventData {
                transactionInfo {
                    status
                    hash
                    memo
                    authorizationKind
                    sequenceNumber
                    zkappAccountUpdateIds
                }
            }
        }
        actions(
            input: { address: $address }
        ) {
            actionData {
                accountUpdateId
                transactionInfo {
                    status
                    hash
                    memo
                    authorizationKind
                    sequenceNumber
                    zkappAccountUpdateIds
                }
            }
        }
    }
`;

const BusinessView: React.FC = () => {
    const { keyPair, handleGenerateKeys } = useDashboard();
    const [isGenerating, setIsGenerating] = useState(false);
    const [sentAnchor, setSentAnchor] = useState(false);
    const { user, getIdTokenClaims } = useAuth0();

    const [nostrKeys, setNostrKeys] = useState<{ pub: string; priv: string } | null>(null);
    const [contractAddressState, setContractAddressState] = useState(savedZkAppPublicKey);


    const { accessToken, idToken } = useAuthenticatedUser();
    const { data, loading, error, refetch } = useQuery(CONTRACT_QUERY, {
        variables: { publicKey: contractAddressState },
        skip: !contractAddressState,
    });
    const { data: eventsData, loading: eventsLoading, error: eventsError, refetch: eventsRefetch } = useQuery(CONTRACT_EVENTS_ACTIONS_QUERY, {
        variables: { address: contractAddressState },
        skip: !contractAddressState,
    });
    const { events, addEvent } = useNostrEvent();

    useEffect(() => {
        // Refresh app state
        refetch();
    }, [events]);

    const [statusEvents, setStatusEvents] = useState<any[]>([]);

    useEffect(() => {
        // load nostr keys
        const storedKeys = localStorage.getItem('nostrKeys');
        if (storedKeys) {
            setNostrKeys(JSON.parse(storedKeys));
        }
    }, []);

    useEffect(() => {  
        let subListener : SubCloser = nostrService.listenForEvents(
            { 
                kinds: [8000, 8001, 8002],
            },
            (event) => {
                // Chỉ show toast nếu event trong vòng 10s trở lại
                const now = Math.floor(Date.now() / 1000); // giây
                if (event.created_at && now - event.created_at <= 10) {
                    addEvent(event);
                    toast.info(`Received Nostr event: ${event.content || event.kind}`);
                }
            }
        );

        return () => {
            subListener.close();
        }
    }, [contractAddressState]);
    
    const handleCreateBusinessProfile = async () => {
        setIsGenerating(true);
        try {
            // Simulate async business profile creation
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert('Business profile created successfully!');
        } catch (error) {
            alert('Failed to create business profile.');
        } finally {
            setIsGenerating(false);
        }
    }

    const handleGenerateNostrKeys = async () => {
        setIsGenerating(true);
        try {
            // generate nostr key pairs
            let keys = nostrService.generateKeys();
            setNostrKeys(keys);
            // save to storage
            localStorage.setItem('nostrKeys', JSON.stringify(keys));
        } catch (error) {
            alert('Failed to generate Nostr keys.');
        } finally {
            setIsGenerating(false);
        }
    }

    const handleCreateContract = async () => {
        setIsGenerating(true);
        try {
            const response = await backendAPI.createContract({
                userPublicKey: nostrKeys?.pub || ''
            });

            if(response.zkAppPublicKey) {
                saveZkAppPublicKey(response.zkAppPublicKey);
                setContractAddressState(response.zkAppPublicKey);
            }
            // alert('Contract created successfully!');
        } catch (error) {
            alert('Failed to create contract.');
        } finally {
            setIsGenerating(false);
        }
    }

    const handleCreateAnchor = async () => {
        setIsGenerating(true);
        setSentAnchor(false);
        try {
            let claims = await getIdTokenClaims();
            // generate nostr key pairs
            let emailNonce = user.email;
            let emailNonceASK = user.email + claims.nonce + nostrKeys?.pub;

            let emailNonceHash = Poseidon.hash(stringToFields(emailNonce));
            let emailNonceASKHash = Poseidon.hash(stringToFields(emailNonceASK));

            backendAPI.createAnchor({
                userPublicKey: nostrKeys?.pub || '',
                contractPublicKey: contractAddressState || '',
                emailNonceHash,
                emailNonceASKHash,
            })

            setSentAnchor(true);
        } catch (error) {
            alert('Failed to create anchor. ' + error);
        } finally {
            setIsGenerating(false);
        }
    }

    const base64UrlDecode = (str) => {
        // Replace Base64URL chars
        str = str.replace(/-/g, "+").replace(/_/g, "/");

        // Pad if needed
        while (str.length % 4) {
            str += "=";
        }

        // Decode
        const decoded = atob(str);
        return decodeURIComponent(
            decoded
            .split("")
            .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
    }

    return (
        <>
         <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 15
         }}>

            <Card title="Business Setup" icon={<BusinessIcon />}>
                { contractAddressState && <a style={{color: 'green'}} className='hover:underline' href={`https://zekoscan.io/testnet/account/${contractAddressState}`} target="_blank" rel="noopener noreferrer">Contract Address: {contractAddressState}</a> }
                
                { !contractAddressState && <p style={{color: 'red'}}>Please deploy a contract first!</p> }

                { isGenerating && <FourSquare color="#32cd32" size="medium" text="" textColor="" /> }

                <div className="flex space-x-4">
                    <Button 
                        onClick={() => {
                            handleGenerateNostrKeys();
                        }}
                        disabled={isGenerating || nostrKeys}
                    >
                        Generate Nostr Keys
                    </Button>

                    <Button 
                        onClick={() => {
                            handleCreateContract();
                        }}
                        disabled={isGenerating || contractAddressState || !nostrKeys}
                    >
                        Create Contract
                    </Button>

                    <Button 
                        onClick={() => {
                            handleCreateAnchor();
                        }}
                        disabled={isGenerating || !contractAddressState}
                    >
                        Create Anchor
                    </Button>
                </div>

                {sentAnchor && <p className="mt-4 text-green-400">Anchor creation request sent to backend & waiting verification!</p>}
                
                <p>My ACKs (Nostr Keys)</p>
                {nostrKeys && (
                    <JsonEditor
                        data={nostrKeys || {}}
                        rootName=''
                        maxWidth={"100%"}
                        collapse
                    />
                )}

                <p>Server Events (Nostr Relay kind [8000, 8001, 8002])</p>
                {events && (
                    <JsonEditor
                        data={events.reverse().map(v => ({content: v.content})) || {}}
                        rootName=''
                        maxWidth={"100%"}
                        collapse={1}
                    />
                )}
            </Card>

            <Card title="JWT Management" icon={<BusinessIcon />}>
                <Button 
                    onClick={() => {
                        handleCreateBusinessProfile();
                    }}
                    disabled={isGenerating || !contractAddressState}
                >
                    Create Business Profile
                </Button>
            </Card>

            <Card title="Contract State Management" icon={<BusinessIcon />}>
                {/* Create refresh button */}
                <Button 
                    onClick={() => {
                        // refresh call graphql
                        refetch();
                    }}
                >
                    Refresh
                </Button>

                <p>Contract: {contractAddressState}</p>
                <p>Contract State Data </p>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error.message}</p>}
                {data && (
                    <JsonEditor
                        data={data || {}}
                        rootName=''
                        maxWidth={"100%"}
                    />
                )}
            </Card>

            <Card title="Contract Events" icon={<BusinessIcon />}>
                {/* Create refresh button */}
                <Button 
                    onClick={() => {
                        // refresh call graphql
                        eventsRefetch();
                    }}
                >
                    Refresh
                </Button>

                <p>Contract Events & Actions Data </p>
                {eventsLoading && <p>Loading...</p>}
                {eventsError && <p>Error: {eventsError.message}</p>}
                {eventsData && (
                    <JsonEditor
                        data={eventsData || {}}
                        rootName=''
                        maxWidth={"100%"}
                    />
                )}
            </Card>

            <Card title="Identities" icon={<BusinessIcon />}>
                <p>ID Token Claims</p>
                <JsonEditor
                    data={ idToken|| {}}
                    rootName=''
                    maxWidth={"100%"}
                />

                <p>Id Token Header</p>
                <JsonEditor
                    data={idToken ? JSON.parse(base64UrlDecode(idToken.__raw.split('.')[0])) : {}}
                    rootName=''
                    maxWidth={"100%"}
                />

                <p>User Information</p>
                <JsonEditor
                    data={user || {}}
                    rootName=''
                    maxWidth={"100%"}
                />

                <p>Access Token</p>
                <JsonEditor
                    data={ accessToken || {}}
                    rootName=''
                    maxWidth={"100%"}
                />
            </Card>
            </div>
        </>
    );
};

export default BusinessView;
