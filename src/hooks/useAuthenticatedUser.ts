import { useAuth0 } from '@auth0/auth0-react';
import { get } from 'http';
import { useEffect, useState } from 'react';

export function useAuthenticatedUser() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, getIdTokenClaims } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);
  const [idToken, setIdToken] = useState(null);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      getAccessTokenSilently({
        authorizationParams: {
          scope: "email"
        }
      })
        .then(token => setAccessToken(token))
        .catch(console.error);

      getIdTokenClaims()
        .then(idToken => {
          setIdToken(idToken);
        })
        .catch(console.error);
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    idToken
  };
}