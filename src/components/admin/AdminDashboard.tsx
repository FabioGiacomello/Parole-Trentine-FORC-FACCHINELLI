import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExcelUploader } from './ExcelUploader';
import { DictionaryManager } from './DictionaryManager';
import { SuggestionsManager } from './SuggestionsManager';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Book, 
  FileSpreadsheet, 
  MessageSquare, 
  LogOut,
  LayoutDashboard,
  Clock,
  TrendingUp,
  Users
} from 'lucide-react';

export function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('suggestions');
  const [stats, setStats] = useState({
    pendingSuggestions: 0,
    totalEntries: 0,
    recentActivity: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch pending suggestions count
      const { count: pendingCount } = await supabase
        .from('suggestions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      // Fetch total dictionary entries
      const { count: entriesCount } = await supabase
        .from('dictionary_entries')
        .select('*', { count: 'exact', head: true });
      
      // Fetch recent activity (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { count: recentCount } = await supabase
        .from('suggestions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());
      
      setStats({
        pendingSuggestions: pendingCount || 0,
        totalEntries: entriesCount || 0,
        recentActivity: recentCount || 0
      });
    };
    
    fetchStats();
  }, [activeTab]);

  return (
    <section className="container py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div className="animate-fade-in">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
              <LayoutDashboard className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">
                Pannello Amministratore
              </h1>
              <p className="text-sm text-muted-foreground">
                Gestisci il dizionario e i suggerimenti degli utenti
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{user?.email}</span>
          </div>
          <Button variant="outline" onClick={signOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Esci
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-slide-up">
        <div className="card-elevated p-5 rounded-2xl border border-border">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In attesa</p>
              <p className="text-2xl font-bold">{stats.pendingSuggestions}</p>
            </div>
          </div>
        </div>
        
        <div className="card-elevated p-5 rounded-2xl border border-border">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Book className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Voci totali</p>
              <p className="text-2xl font-bold">{stats.totalEntries}</p>
            </div>
          </div>
        </div>
        
        <div className="card-elevated p-5 rounded-2xl border border-border">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Questa settimana</p>
              <p className="text-2xl font-bold">{stats.recentActivity}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="h-auto p-1.5 bg-muted/50 rounded-xl grid grid-cols-3 gap-1">
          <TabsTrigger 
            value="suggestions" 
            className="gap-2 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Suggerimenti</span>
            {stats.pendingSuggestions > 0 && (
              <Badge variant="secondary" className="ml-1 bg-amber-500/20 text-amber-700 text-xs">
                {stats.pendingSuggestions}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="dictionary" 
            className="gap-2 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Book className="h-4 w-4" />
            <span className="hidden sm:inline">Dizionario</span>
          </TabsTrigger>
          <TabsTrigger 
            value="import" 
            className="gap-2 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">Importa Excel</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="animate-fade-in mt-6">
          <SuggestionsManager />
        </TabsContent>

        <TabsContent value="dictionary" className="animate-fade-in mt-6">
          <DictionaryManager />
        </TabsContent>

        <TabsContent value="import" className="animate-fade-in mt-6">
          <ExcelUploader />
        </TabsContent>
      </Tabs>
    </section>
  );
}