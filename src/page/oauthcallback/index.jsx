import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../service/UserContext'; // Import UserContext
import api from '../../config/axios';

export const OAuthCallback = () => {
    const navigate = useNavigate();
    const { saveUser } = useContext(UserContext);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const jwt = queryParams.get('jwt');

        if (jwt) {
            // Save JWT in localStorage
            localStorage.setItem('jwt', jwt);

            // Fetch user profile using the JWT
            api.get('/user/profile')
                .then((response) => {
                    const user = { jwt, ...response.data };
                    saveUser(user);  // Save user in context
                    navigate('/');   // Redirect to the home page
                })
                .catch(() => {
                    console.error("Failed to fetch user profile");
                });
        } else {
            console.error("No JWT found in URL");
            navigate('/login');  // Redirect to login page if there's no JWT
        }
    }, [navigate, saveUser]);

    return (
        <div>
            <p>Logging in with Google...</p>
        </div>
    );
};

export default OAuthCallback;
