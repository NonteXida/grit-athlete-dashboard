import React, { useState } from 'react';
import { Upload, Video, Image as ImageIcon, Eye, Share2, Trash2, Play } from 'lucide-react';
import { Button } from './Button';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function MediaCenter() {
  const [activeTab, setActiveTab] = useState('videos');

  const videos = [
    {
      id: 1,
      title: 'Championship Game Highlights',
      thumbnail: 'https://images.unsplash.com/photo-1657957746418-6a38df9e1ea7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHBsYXllciUyMGFjdGlvbnxlbnwxfHx8fDE3NjIzODkzNzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      views: 2543,
      date: '2024-11-05',
      duration: '3:45'
    },
    {
      id: 2,
      title: 'Game Winning TD vs Lincoln High',
      thumbnail: 'https://images.unsplash.com/photo-1577416412292-747c6607f055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnR8ZW58MXx8fHwxNzYyNDI1NDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      views: 1876,
      date: '2024-10-28',
      duration: '2:15'
    },
    {
      id: 3,
      title: 'Speed & Agility Training',
      thumbnail: 'https://images.unsplash.com/photo-1759787851041-0d45d2b2db84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMHRyYWluaW5nJTIwZ3ltfGVufDF8fHx8MTc2MjQzNDAyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      views: 934,
      date: '2024-10-15',
      duration: '5:20'
    },
  ];

  const photos = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1657957746418-6a38df9e1ea7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHBsYXllciUyMGFjdGlvbnxlbnwxfHx8fDE3NjIzODkzNzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      caption: 'Game action',
      date: '2024-11-05'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1747336406309-79970f9066b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwc2Nob29sJTIwYXRobGV0ZXxlbnwxfHx8fDE3NjI0ODAwODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      caption: 'Training session',
      date: '2024-11-01'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1759787851041-0d45d2b2db84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMHRyYWluaW5nJTIwZ3ltfGVufDF8fHx8MTc2MjQzNDAyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      caption: 'Weight room work',
      date: '2024-10-28'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1577416412292-747c6607f055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnR8ZW58MXx8fHwxNzYyNDI1NDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      caption: 'Team practice',
      date: '2024-10-20'
    },
  ];

  const analytics = {
    totalViews: 5353,
    totalVideos: 12,
    totalPhotos: 38,
    avgEngagement: '4.2%',
    topVideo: 'Championship Game Highlights'
  };

  return (
    <div className="space-y-6 animate-slide-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-white mb-2">Media Center</h2>
          <p className="text-gray-400">Manage your highlights and showcase your journey</p>
        </div>
        <Button variant="primary">
          <Upload className="w-5 h-5" />
          Upload Media
        </Button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#141414] border border-[#252525] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-[#03fd1c]" />
            <p className="text-gray-400">Total Views</p>
          </div>
          <p className="text-white text-2xl">{analytics.totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-[#141414] border border-[#252525] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-5 h-5 text-[#03fd1c]" />
            <p className="text-gray-400">Videos</p>
          </div>
          <p className="text-white text-2xl">{analytics.totalVideos}</p>
        </div>
        <div className="bg-[#141414] border border-[#252525] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-5 h-5 text-[#03fd1c]" />
            <p className="text-gray-400">Photos</p>
          </div>
          <p className="text-white text-2xl">{analytics.totalPhotos}</p>
        </div>
        <div className="bg-[#141414] border border-[#252525] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Share2 className="w-5 h-5 text-[#03fd1c]" />
            <p className="text-gray-400">Engagement</p>
          </div>
          <p className="text-white text-2xl">{analytics.avgEngagement}</p>
        </div>
        <div className="bg-[#141414] border border-[#252525] rounded-xl p-4">
          <p className="text-gray-400 mb-2">Top Video</p>
          <p className="text-white text-sm">{analytics.topVideo}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
        <div className="flex gap-4 mb-6 border-b border-[#252525]">
          <button
            onClick={() => setActiveTab('videos')}
            className={`
              pb-4 px-2 transition-all border-b-2
              ${activeTab === 'videos' 
                ? 'border-[#03fd1c] text-white' 
                : 'border-transparent text-gray-400 hover:text-white'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              <span>Videos</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`
              pb-4 px-2 transition-all border-b-2
              ${activeTab === 'photos' 
                ? 'border-[#03fd1c] text-white' 
                : 'border-transparent text-gray-400 hover:text-white'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              <span>Photos</span>
            </div>
          </button>
        </div>

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div 
                key={video.id}
                className="group bg-[#0a0a0a] border border-[#252525] rounded-xl overflow-hidden hover:border-[#03fd1c] transition-all cursor-pointer"
              >
                <div className="relative">
                  <ImageWithFallback
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#03fd1c] rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-black ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-white text-xs">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-white mb-2">{video.title}</p>
                  <div className="flex items-center justify-between text-gray-400 text-xs mb-3">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{video.views.toLocaleString()} views</span>
                    </div>
                    <span>{new Date(video.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <button className="p-2 border border-[#252525] rounded-lg hover:border-red-500 hover:text-red-500 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div 
                key={photo.id}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
              >
                <ImageWithFallback
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm">{photo.caption}</p>
                    <p className="text-gray-400 text-xs">{new Date(photo.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button className="p-2 bg-black/80 rounded-lg hover:bg-[#03fd1c] hover:text-black transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-black/80 rounded-lg hover:bg-red-500 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="bg-gradient-to-r from-[#03fd1c]/10 to-transparent border border-[#03fd1c]/30 rounded-2xl p-6">
        <h4 className="text-white mb-2">Tips for Great Highlights</h4>
        <ul className="text-gray-300 space-y-2">
          <li>• Keep videos under 5 minutes for better engagement</li>
          <li>• Use landscape orientation for game footage</li>
          <li>• Add captions to describe key moments</li>
          <li>• Tag teammates and coaches for better visibility</li>
          <li>• Share your content on social media to increase profile views</li>
        </ul>
      </div>
    </div>
  );
}
