import type { Client } from "./client";
import type { XmppClient } from "./socketTypes";

export interface MUCInfo {
  members: MUCMember[];
}

interface MUCMember {
  accountId: string;
}

export interface PartyInfo {
  id: string;
  created_at: string;
  updated_at: string;
  config: any;
  members: PartyMember[];
  applicants: any[];
  meta: any;
  invites: any[];
  revision: number;
}


export interface PartyMember {
  account_id: string;
  role: string;
  meta: Record<string, any>;
  connections: Connection[];
  revision: number;
  captain?: string;
  updated_at: string;
  joined_at: string;
  jid?: string;
}

interface Connection {
  id: string;
  connected_at: string;
  updated_at: string;
  yield_leadership: boolean;
  meta: Record<string, any>;
}

export type StatusInfo = {
  Properties: Record<string, StatusData>;
};

interface StatusData {
  partyId: string;
}

export namespace XmppService {
  export const clients: XmppClient[] = [];
  export let isUserLoggedIn: boolean = false;
}