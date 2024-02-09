const axios = require('axios');
const express = require('express');
const app = express();


async function fetchTrackInfo(trackURL) {
    const options = {
        method: 'GET',
        url: 'https://spotify81.p.rapidapi.com/track',
        params: { id: trackURL },
        headers: {
            'X-RapidAPI-Key': 'b38444b5b7mshc6ce6bcd5c9e446p154fa1jsn7bbcfb025b3b',
            'X-RapidAPI-Host': 'spotify81.p.rapidapi.com'
        }
    };

    const response = await axios.request(options);
    const { title, artist, cover, download_link } = response.data;

    return { title, artist, cover, download_link, track_url: trackURL };
}


app.get('/spotify', async (req, res) => {
    try {
        const { query, id } = req.query;

        if (query) {
          
            const options = {
                method: 'GET',
                url: 'https://spotify81.p.rapidapi.com/search',
                params: {
                    q: query,
                    type: 'tracks',
                    offset: '0',
                    limit: '10',
                    numberOfTopResults: '5'
                },
                headers: {
                    'X-RapidAPI-Key': 'b38444b5b7mshc6ce6bcd5c9e446p154fa1jsn7bbcfb025b3b',
                    'X-RapidAPI-Host': 'spotify81.p.rapidapi.com'
                }
            };

            const response = await axios.request(options);
            
            const trackIDs = response.data.tracks.map(track => track.data.id);
            const trackURLs = trackIDs.map(trackID => `https://open.spotify.com/track/${trackID}`);
            return res.json({ trackURLs });
        } else if (id) {
          
            const trackInfo = await fetchTrackInfo(id);
            return res.json(trackInfo);
        } else {
           
            return res.status(400).json({ error: 'Query parameter "query" or "id" is required' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
