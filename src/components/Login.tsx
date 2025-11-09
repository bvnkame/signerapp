
import React, { useEffect } from 'react';
import { signInWithGoogle, signInWithMicrosoft, signInWithApple } from '../services/firebase';
import Button from './Button';
import GoogleLogo from './icons/GoogleLogo';
import MicrosoftLogo from './icons/MicrosoftLogo';
import AppleLogo from './icons/AppleLogo';
import { useAuth0 } from "@auth0/auth0-react";
import { GoogleLogin } from '@react-oauth/google';
// import { gapi } from 'gapi-script';
import auth0Icon from './icons/auth0.svg';

const Login: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { loginWithPopup, loginWithRedirect } = useAuth0();
  // useEffect(() => {
  //   function start() {
  //     gapi.client.init({
  //       clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  //       scope: 'email',
  //     });
  //   }

  //   gapi.load('client:auth2', start);
  // }, []);

  const onSuccess = response => {
    console.log('SUCCESS', response);
  };
  const onFailure = response => {
    console.log('FAILED', response);
  };
  const onLogoutSuccess = () => {
    console.log('SUCESS LOG OUT');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500 mb-4">
          Butter Platform
        </h1>
        <p className="text-slate-400 mb-8">
          Securely manage your keys and permissions.
        </p>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-8 space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">Sign in to continue</h2>
            {/* <Button
                onClick={() => {
                  signInWithGoogle();
                }}
                variant="secondary"
                size="lg"
                className="w-full"
                icon={<GoogleLogo />}
            >
                Firebase: Sign in with Google
            </Button> */}
            <Button
                onClick={() => {
                  loginWithPopup();
                }}
                variant="secondary"
                size="lg"
                className="w-full"
                icon={<img src={auth0Icon} alt="Auth0" className="w-5 h-5" />}
            >
                Sign in with Auth0
            </Button>

{/*             
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            /> */}

            {/* <p>{isAuthenticated ? "Logged in" : "Not logged in"} </p> */}
            {/* <Button
                onClick={signInWithMicrosoft}
                variant="secondary"
                size="lg"
                className="w-full"
                icon={<MicrosoftLogo />}
            >
                Sign in with Microsoft
            </Button>
            <Button
                onClick={signInWithApple}
                variant="secondary"
                size="lg"
                className="w-full"
                icon={<AppleLogo />}
            >
                Sign in with Apple
            </Button> */}
        </div>
      </div>
    </div>
  );
};

export default Login;