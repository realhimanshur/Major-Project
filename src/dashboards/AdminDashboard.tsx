import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Building2, 
  TrendingUp,
  Shield,
  CheckCircle,
  XCircle,
  MoreVertical,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { mockEvents, mockOrganizers, mockUsers, mockVenues } from '@/data/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Stats
  const stats = {
    totalUsers: mockUsers.length,
    totalEvents: mockEvents.length,
    totalOrganizers: mockOrganizers.length,
    totalVenues: mockVenues.length,
    pendingVerifications: mockOrganizers.filter(o => !o.isVerified).length,
    upcomingEvents: mockEvents.filter(e => new Date(e.startDate) > new Date()).length,
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-[#ff2d53]/20 text-[#ff2d53]',
      organizer: 'bg-[#00c853]/20 text-[#00c853]',
      attendee: 'bg-[#1da1f2]/20 text-[#1da1f2]',
    };
    return colors[role] || 'bg-white/10 text-white/60';
  };

  return (
    <div className="min-h-screen bg-[#161616] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/60">Platform Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/60">Welcome,</span>
            <span className="text-white font-medium">{user?.name}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#633dc0]/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#c385ff]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                <p className="text-white/50 text-sm">Users</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00c853]/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#00c853]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
                <p className="text-white/50 text-sm">Events</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1da1f2]/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#1da1f2]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalOrganizers}</p>
                <p className="text-white/50 text-sm">Organizers</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#ff6f00]/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#ff6f00]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalVenues}</p>
                <p className="text-white/50 text-sm">Venues</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#ffea00]/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#ffea00]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.pendingVerifications}</p>
                <p className="text-white/50 text-sm">Pending</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#ff2d53]/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#ff2d53]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.upcomingEvents}</p>
                <p className="text-white/50 text-sm">Upcoming</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white/5 border-b border-white/10 w-full justify-start rounded-none p-0 h-auto mb-6">
            <TabsTrigger 
              value="overview" 
              className="px-6 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#633dc0] data-[state=active]:text-white text-white/60"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="px-6 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#633dc0] data-[state=active]:text-white text-white/60"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="px-6 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#633dc0] data-[state=active]:text-white text-white/60"
            >
              Events
            </TabsTrigger>
            <TabsTrigger 
              value="organizers" 
              className="px-6 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#633dc0] data-[state=active]:text-white text-white/60"
            >
              Organizers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Events */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Events</h3>
                <div className="space-y-4">
                  {mockEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{event.title}</p>
                        <p className="text-white/50 text-xs">{event.organizerName}</p>
                      </div>
                      <Badge className={event.type === 'free' ? 'bg-[#00c853]/20 text-[#00c853]' : 'bg-[#633dc0]/20 text-[#c385ff]'}>
                        {event.type === 'free' ? 'Free' : `₹${event.price}`}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Organizers */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Organizers</h3>
                <div className="space-y-4">
                  {mockOrganizers.slice(0, 5).map((organizer) => (
                    <div key={organizer.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                      <img
                        src={organizer.avatar}
                        alt={organizer.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{organizer.name}</p>
                        <p className="text-white/50 text-xs">{organizer.eventsHosted} events</p>
                      </div>
                      <div className="flex items-center gap-1 text-[#ffea00]">
                        <span className="text-white text-sm">{organizer.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-0">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 py-3 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left p-4 text-white/60 font-medium">User</th>
                      <th className="text-left p-4 text-white/60 font-medium">Role</th>
                      <th className="text-left p-4 text-white/60 font-medium">Joined</th>
                      <th className="text-left p-4 text-white/60 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers
                      .filter(u => 
                        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((user) => (
                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                                  <span className="text-white font-bold">{user.name.charAt(0)}</span>
                                </div>
                              )}
                              <div>
                                <p className="text-white font-medium">{user.name}</p>
                                <p className="text-white/50 text-sm">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={`${getRoleColor(user.role)} border-0 capitalize`}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-4 text-white/60">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-white/60">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-[#1e1e1e] border-white/10">
                                <DropdownMenuItem className="text-white hover:bg-white/10">
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-white hover:bg-white/10">
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-[#ff2d53] hover:bg-[#ff2d53]/10">
                                  Suspend
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-0">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left p-4 text-white/60 font-medium">Event</th>
                      <th className="text-left p-4 text-white/60 font-medium">Organizer</th>
                      <th className="text-left p-4 text-white/60 font-medium">Date</th>
                      <th className="text-left p-4 text-white/60 font-medium">Status</th>
                      <th className="text-left p-4 text-white/60 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockEvents.map((event) => (
                      <tr key={event.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-white font-medium">{event.title}</p>
                              <p className="text-white/50 text-sm capitalize">{event.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-white/60">{event.organizerName}</td>
                        <td className="p-4 text-white/60">{formatDate(event.startDate)}</td>
                        <td className="p-4">
                          <Badge className={`${
                            event.status === 'upcoming' ? 'bg-[#00c853]/20 text-[#00c853]' :
                            event.status === 'ongoing' ? 'bg-[#1da1f2]/20 text-[#1da1f2]' :
                            'bg-white/10 text-white/60'
                          } border-0 capitalize`}>
                            {event.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-white/20 text-white hover:bg-white/10"
                              onClick={() => navigate(`/events/${event.id}`)}
                            >
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-[#ff2d53] hover:bg-[#ff2d53]/10"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="organizers" className="mt-0">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left p-4 text-white/60 font-medium">Organizer</th>
                      <th className="text-left p-4 text-white/60 font-medium">Location</th>
                      <th className="text-left p-4 text-white/60 font-medium">Events</th>
                      <th className="text-left p-4 text-white/60 font-medium">Rating</th>
                      <th className="text-left p-4 text-white/60 font-medium">Verified</th>
                      <th className="text-left p-4 text-white/60 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrganizers.map((organizer) => (
                      <tr key={organizer.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={organizer.avatar}
                              alt={organizer.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-white font-medium">{organizer.name}</p>
                              <p className="text-white/50 text-sm">{organizer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-white/60">{organizer.location}</td>
                        <td className="p-4 text-white/60">{organizer.eventsHosted}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-[#ffea00]">
                            <span className="text-white">{organizer.rating}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {organizer.isVerified ? (
                            <Badge className="bg-[#00c853]/20 text-[#00c853] border-0">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-[#ff6f00]/20 text-[#ff6f00] border-0">
                              Pending
                            </Badge>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {!organizer.isVerified && (
                              <Button 
                                size="sm"
                                className="bg-[#00c853] hover:bg-[#00c853]/80"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Verify
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
