export interface Servers {
  sessionId: string;
  status: string;
  identifier: string;
  address: string;
  port: number;
  queue: string[];
  matchStarted: boolean;
  options: {
    region: string;
    userAgent: string;
    matchId: string;
    playlist: string;
  };
  teamAssignments: string[];
  updatedAt: Date;
}
