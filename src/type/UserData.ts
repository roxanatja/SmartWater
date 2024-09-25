export type UserData = {
  _id: string;
  phoneNumber: string;
  role: string;
  fullName: string;
  email: string;
  permissions: [];
  organization: string;
  city: {
    id: string;
    name: string;
  };
};
