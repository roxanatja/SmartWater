export type User = {
  _id: string;
  username: string;
  phoneNumber: string;
  password: string;
  role: string;
  fullName: string;
  email: string;
  updated: string;
  zones?: string[];
  permissions?: string[];
  tokenFCM: string;
  identification: string;
  schedules: {
    _id: string;
    startTime: string;
    endTime: string;
    days: string[];
  }[]
};

export type Permission = {
  _id: string;
  name: string;
  action: string;
  description: string;
  created: string;
  updated: string;
}
