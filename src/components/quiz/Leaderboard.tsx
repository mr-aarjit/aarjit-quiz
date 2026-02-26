import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  team_name: string;
  score: number;
  topic: string;
  created_at: string;
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from("leaderboard")
        .select("*")
        .order("score", { ascending: false })
        .limit(10);
      if (data) setEntries(data);
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <p className="text-sm text-muted-foreground text-center">Loading leaderboard...</p>;
  if (entries.length === 0) return <p className="text-sm text-muted-foreground text-center">No scores yet. Be the first!</p>;

  return (
    <div className="bg-card/80 backdrop-blur rounded-xl border border-border/50 overflow-hidden">
      <div className="p-3 border-b border-border/30">
        <h3 className="font-display text-sm font-bold text-foreground text-center">🏆 Top 10 Leaderboard</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 text-center text-xs">#</TableHead>
            <TableHead className="text-xs">Team</TableHead>
            <TableHead className="text-xs">Topic</TableHead>
            <TableHead className="text-right text-xs">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, i) => (
            <TableRow key={entry.id}>
              <TableCell className="text-center font-display font-bold text-xs">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
              </TableCell>
              <TableCell className={cn("font-display font-bold text-xs", i < 3 && "text-primary")}>
                {entry.team_name}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{entry.topic}</TableCell>
              <TableCell className="text-right font-display font-black text-xs">{entry.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
