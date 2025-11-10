import React, { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import Card from '../Card';
import Button from '../Button';
import BusinessIcon from '../icons/BusinessIcon';
import { JsonEditor } from 'json-edit-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthenticatedUser } from '@/src/hooks/useAuthenticatedUser';

const BusinessView: React.FC = () => {
    const { keyPair, handleGenerateKeys } = useDashboard();
    const [isGenerating, setIsGenerating] = useState(false);
    const { user, getIdTokenClaims } = useAuth0();
    const { accessToken, idToken } = useAuthenticatedUser();

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

            <Card title="Business Management" icon={<BusinessIcon />}>
                <Button 
                    onClick={() => {
                        handleCreateBusinessProfile();
                    }}
                    disabled={isGenerating}
                >
                    Create Profile
                </Button>
            </Card>
            </div>
        </>
    );
};

export default BusinessView;
