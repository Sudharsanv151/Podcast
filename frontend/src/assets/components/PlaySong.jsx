import React, { useEffect, useState, useRef } from 'react';

const Box = ({ songId }) => {
    const audioRef = useRef(null);
    return (
      <div className="w-72 max-w-sm border border-gray-300 rounded-lg shadow-lg bg-slate-700 dark:border-gray-600 hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <a href="#">
          <img
            className="p-4 rounded-t-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
            src="/img/p1.jpg"
            alt="product image"
          />
        </a>
        <div className="p-6 text-center">
          <audio ref={audioRef} controls className="w-full rounded-lg mb-4">
            <source
              src={`http://localhost:5000/songs/${songId}`}
              type="audio/mpeg"
            />
          </audio>
        </div>
      </div>
    );
  };
  
const PlaySong = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [songs, setSongs] = useState([]);
    const [currentSongId, setCurrentSongId] = useState(null);
    const [songFile, setSongFile] = useState(null);
    const [Genre,setGenre]=useState();
    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

  
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch('http://localhost:5000/songs');
                const data = await response.json();
                setSongs(data);
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        };

        fetchSongs();
    }, []);

    
    const handleUpload = async (event) => {
        event.preventDefault();

        if (!songFile) return;

        const formData = new FormData();
        formData.append('song', songFile);
        formData.append('title', songFile.name);
        formData.append('genre',Genre);  
        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
             
                const newSong = await response.json();
                setSongs((prevSongs) => [...prevSongs, newSong]);
                setSongFile(null);
            } else {
                console.error('Error uploading song:', response.statusText);
            }
        } catch (error) {
            console.error('Error uploading song:', error);
        }
    };

    return (
        <div>
        
            <form onSubmit={handleUpload}>
                <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setSongFile(e.target.files[0])}
                />
                <input 
                    type='text' 
                    placeholder='genre' 
                    className='bg-gray-600 text-white'
                    onChange={(e)=>setGenre(e.target.value)}
                    />
                <button type="submit">Upload Song</button>
            </form>    
            <div>
                    <div className='mt-6 pb-2 pl-9 '>
                        <h2 className='text-md font-3 text-left '>Trending podcasts in all genres</h2>
                        <p className='text-sm text-left'>Explore the latest trends and get excited!</p>
                    </div>
                    {songs.map((song,index)=>(
                        <div key={song._id} className='px-10 font-5 border-b pb-9 border-slate-700'>
                            <div className='flex flex-row justify-between gap-7 '>
                                <Box songId={song._id} />
                            </div>
                        </div>
                    ))}
                </div>
        </div>
    );
};

export default PlaySong;
