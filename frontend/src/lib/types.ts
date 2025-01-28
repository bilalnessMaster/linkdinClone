export type authProps = {
  _id?:string
  username?: string;
  bannerImg?: string;
  profilePicture?: string;
  name?: string;
  headline?: string;
  connections?: string[];
} | undefined;

export declare interface SignInProps {
  username: string;
  password: string;
}

export declare interface postActionProps{
  icon?:React.ReactNode,
  text?: string,
  onClick?: (value : any)=> void
}
