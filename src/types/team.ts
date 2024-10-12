export type TTeam =
  | { username: string; social: 'github'; role: string }
  | { username: string; social: 'web'; url: string; role: string }
