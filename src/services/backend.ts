const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
// const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '0xYourContractAddressHere';

export const backendAPI = {
    async sendClientProof(zkProofJson: string) {
        console.log("Sending client proof to backend...", zkProofJson);
        const response = await fetch(`${backendURL}/client-proof`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ proof: zkProofJson }),
        });

        const data = await response.json();
        return data;
    },

    async fetchBackend() {
        const response = await fetch(`${backendURL}/status`);
        const data = await response.json();
        console.log("Backend status:", data);
        return data;
    },

    async getBackendBalance() {
        const response = await fetch(`${backendURL}/balance`);
        const data = await response.json();
        console.log("Backend balance:", data);
        return data;
    },

    async createAnchor({ userPublicKey, contractPublicKey, emailNonceHash, emailNonceASKHash }) {
        const response = await fetch(`${backendURL}/create-anchor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userPublicKey: userPublicKey,
                contractPublicKey: contractPublicKey,
                emailNonceHash, 
                emailNonceASKHash 
            }),
        });

        const data = await response.json();
        console.log("Create anchor response:", data);
        return data;
    },

    async createContract({userPublicKey}) {
        const response = await fetch(`${backendURL}/deploy-contract`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userPublicKey: userPublicKey
            }),
        });

        const data = await response.json();
        console.log("Create contract response:", data);
        return data;
    },
    async createBusinessProfile({userPublicKey, contractPublicKey, jwt}) {
        const response = await fetch(`${backendURL}/create-business-profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userPublicKey,
                contractPublicKey: contractPublicKey,
                jwt: jwt
            }),
        });

        const data = await response.json();
        console.log("Create business profile response:", data);
        return data;
    }
}