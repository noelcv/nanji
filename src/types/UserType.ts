export type UserType = {
  id: string,
  family_name: string,
  given_name: string,
  preferred_username: string,
  username: string,
  profile_pic?: string,   
  email?: string,
  attributes: {
    family_name: string;
    given_name: string;
    preferred_username: string;
    email: string;
  };
}