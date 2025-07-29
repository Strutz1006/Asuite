import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Bell, Calendar, Plus, UserPlus } from 'lucide-react';
import { GoalDiscussions } from '../components/GoalDiscussions';
import { TeamActivity } from '../components/TeamActivity';
import { ReviewWorkflows } from '../components/ReviewWorkflows';
import { CollaborationSettings } from '../components/CollaborationSettings';

export function CollaborationPage() {
  const [selectedView, setSelectedView] = useState('discussions');
  const [filterTeam, setFilterTeam] = useState('all');
  const [filterActivity, setFilterActivity] = useState('all');

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Team Collaboration</h1>
          <p className="text-slate-400 mt-2">
            Foster teamwork and communication around your organization's goals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Members
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Start Discussion
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Active Discussions</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">24</div>
            <p className="text-xs text-slate-400">+3 today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Team Members</CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">48</div>
            <p className="text-xs text-slate-400">Across 8 teams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Pending Reviews</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">7</div>
            <p className="text-xs text-slate-400">Due this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">12</div>
            <p className="text-xs text-slate-400">Unread</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Select value={filterTeam} onValueChange={setFilterTeam}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
            <SelectItem value="hr">Human Resources</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterActivity} onValueChange={setFilterActivity}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Activity type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activity</SelectItem>
            <SelectItem value="comments">Comments</SelectItem>
            <SelectItem value="reviews">Reviews</SelectItem>
            <SelectItem value="mentions">Mentions</SelectItem>
            <SelectItem value="updates">Updates</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="activity">Team Activity</TabsTrigger>
          <TabsTrigger value="reviews">Review Workflows</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" currentValue={selectedView} className="space-y-4">
          <GoalDiscussions 
            filterTeam={filterTeam}
            filterActivity={filterActivity}
          />
        </TabsContent>

        <TabsContent value="activity" currentValue={selectedView} className="space-y-4">
          <TeamActivity 
            filterTeam={filterTeam}
            filterActivity={filterActivity}
          />
        </TabsContent>

        <TabsContent value="reviews" currentValue={selectedView} className="space-y-4">
          <ReviewWorkflows 
            filterTeam={filterTeam}
          />
        </TabsContent>

        <TabsContent value="settings" currentValue={selectedView} className="space-y-4">
          <CollaborationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}