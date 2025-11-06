import React, { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import Card from '../Card';
import Button from '../Button';
import BusinessIcon from '../icons/BusinessIcon';

const BusinessView: React.FC = () => {
    const { keyPair, handleGenerateKeys } = useDashboard();
    const [isGenerating, setIsGenerating] = useState(false);
    
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

    return (
        <>
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
        </>
    );
};

export default BusinessView;
