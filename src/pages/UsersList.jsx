import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    listAllProfiles,
    fetchAllPrograms,
    publicFetchTracksForProgram
} from '../components/services/api';
import defaultAvatar from '../assets/images/user-default.webp';
import { Users, GraduationCap, Briefcase, Filter, X } from 'lucide-react';

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Filter states
    const [roleFilter, setRoleFilter] = useState('all');
    const [programFilter, setProgramFilter] = useState('all');
    const [trackFilter, setTrackFilter] = useState('all');

    // Data for filters
    const [programs, setPrograms] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profilesData, programsData] = await Promise.all([
                    listAllProfiles(),
                    fetchAllPrograms()
                ]);
                console.log("From usersList.jsx");
                console.log("Fetched Profiles: ", profilesData);
                console.log("Fetched Programs: ", programsData);

                // Filter out users who are neither students nor supervisors
                const validUsers = profilesData.filter(user =>
                    user.is_student || user.is_supervisor
                );
                console.log(validUsers);
                setUsers(validUsers);
                setFilteredUsers(validUsers);
                setPrograms(programsData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Apply filters whenever any filter changes
        let result = [...users];

        // Role filter
        if (roleFilter !== 'all') {
            result = result.filter(user =>
                roleFilter === 'supervisor' ? user.is_supervisor : user.is_student
            );
        }

        // Program filter (assuming program is in iti_history[0].program_name)
        if (programFilter !== 'all') {
            result = result.filter(user =>
                user.iti_history?.some(history =>
                    String(history.program_id) === String(programFilter)
                )
            );
        }


        // Track filter
        if (trackFilter !== 'all') {
            result = result.filter(user =>
                user.iti_history?.some(history => String(history.track_id) === String(trackFilter))
            );

        }

        setFilteredUsers(result);
    }, [users, roleFilter, programFilter, trackFilter]);

    const handleProgramChange = async (e) => {
        const program = e.target.value;
        setProgramFilter(program);
        setTrackFilter('all'); // Reset track filter when program changes

        if (program !== 'all') {
            try {
                const tracksData = await publicFetchTracksForProgram(program);
                setTracks(tracksData);
            } catch (err) {
                console.error('Failed to fetch tracks:', err);
            }
        } else {
            setTracks([]);
        }
    };

    const resetFilters = () => {
        setRoleFilter('all');
        setProgramFilter('all');
        setTrackFilter('all');
        setTracks([]);
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div></div>;
    if (error) return <div className="text-center py-20 text-red-500">Error loading users: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Users size={28} className="text-red-900" /> <span className="text-gray-800 m-3" > All Users</span>
                </h1>

                <div className="flex items-center gap-4">
                    <div className="text-gray-500">
                        {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="text-gray-800 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                    >
                        <Filter size={18} />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            {showFilters && (
                <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="!text-gray-800 text-lg font-semibold">Filter Users</h2>
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-1 text-sm text-red-700 hover:text-red-900"
                        >
                            <X size={16} />
                            Reset Filters
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Role Filter */}
                        <div>
                            <label className="block font-semibold text-sm font-medium text-gray-800 mb-1">Role</label>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 disabled:opacity-50 text-gray-800"
                            >
                                <option className="block text-sm font-medium text-gray-800" value="all">All Roles</option>
                                <option className="block text-sm font-medium text-gray-800" value="supervisor">Supervisors</option>
                                <option className="block text-sm font-medium text-gray-800" value="student">Students</option>
                            </select>
                        </div>

                        {/* Program Filter */}
                        <div>
                            <label className="block font-semibold text-sm font-medium text-gray-800 mb-1">Program</label>
                            <select
                                value={programFilter}
                                onChange={handleProgramChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 disabled:opacity-50 text-gray-800"
                            >
                                <option value="all">All Programs</option>
                                {programs.map(program => (
                                    <option key={program.id} value={program.id}>
                                        {program.name} - {program.department.name || 'No Department'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Track Filter */}
                        <div>
                            <label className="block text-sm  font-semibold font-medium text-gray-700 mb-1">Track</label>
                            <select
                                value={trackFilter}
                                onChange={(e) => setTrackFilter(e.target.value)}
                                disabled={!programFilter || programFilter === 'all'}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 disabled:opacity-50 text-gray-800"
                            >
                                <option value="all" className='text-gray-800'>All Tracks</option>
                                {tracks.map(track => (
                                    <option key={track.id} value={track.id} className='text-gray-800'>
                                        {track.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        onClick={() => navigate(`/profiles/${user.id}`)}
                    >
                        <div className="p-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <img
                                    src={user.profile_picture || defaultAvatar}
                                    alt={user.username}
                                    className="h-16 w-16 rounded-full object-cover border-2 border-red-100"
                                    onError={(e) => {
                                        if (e.target.src !== defaultAvatar) e.target.src = defaultAvatar;
                                    }}
                                />
                                <div>
                                    <h2 className="text-xl font-semibold !text-gray-700">
                                        {user.first_name || user.last_name
                                            ? `${user.first_name} ${user.last_name}`
                                            : user.username}
                                    </h2>
                                    <p className="text-gray-500">@{user.username}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                {user.is_supervisor ? (
                                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full w-fit">
                                        <Briefcase size={16} />
                                        <span className="text-sm font-medium">Supervisor</span>
                                    </div>
                                ) : user.is_student ? (
                                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full w-fit">
                                        <GraduationCap size={16} />
                                        <span className="text-sm font-medium">Student</span>
                                    </div>
                                ) : null}
                            </div>

                            {user.is_supervisor && user.department && (
                                <div className="mb-3">
                                    <p className="text-sm text-gray-500">Department</p>
                                    <p className="font-medium">{user.department}</p>
                                </div>
                            )}

                            {user.is_student && user.iti_history && user.iti_history.length > 0 && (
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-sm text-gray-500">Program</p>
                                        <p className="font-medium ">{user.iti_history[0].program_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Track</p>
                                        <p className="font-medium">{user.iti_history[0].track_name}</p>
                                    </div>
                                </div>
                            )}

                            {user.headline && (
                                <p className="text-gray-600 mb-4">{user.headline}</p>
                            )}

                            <div className="flex justify-between text-sm text-gray-500 mt-4">
                                <div>
                                    <span className="font-medium text-gray-700">{user.followers_count}</span> followers
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">{user.following_count}</span> following
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No users match your filters. Try adjusting your criteria.
                </div>
            )}
        </div>
    );
}