import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function shows(req, res) {
    try {
        const apiOrigin = process.env.NETLIFY ? `${process.env.URL}/.netlify/functions/api-server` : `http://localhost:3001`
        const { accessToken } = await getAccessToken(req, res);
        const response = await fetch(`${apiOrigin}/api/shows`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        let shows

        try {
            shows = await response.json();
            res.status(200).json(shows);
        } catch (e) {
            res.status(403).json({ error: 'Forbidden' })
        }


    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});
