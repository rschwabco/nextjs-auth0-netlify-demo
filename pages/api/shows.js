import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';



//http://localhost:${apiPort}
export default withApiAuthRequired(async function shows(req, res) {
    try {

        const apiOrigin = `https://objective-mclean-c4ee52.netlify.app/.netlify/functions/api-server`
        const { accessToken } = await getAccessToken(req, res);
        const apiPort = process.env.API_PORT || 3001;
        const response = await fetch(`${apiOrigin}/api/shows`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const shows = await response.json();

        res.status(200).json(shows);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});
