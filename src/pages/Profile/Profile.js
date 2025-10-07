import { useAuth } from "../../context/AuthContext";
import "./Profile.scss";

export default function Profile() {
    const {user} = useAuth();

  return (
    <div className="profile_root">
        <h3 className="title"> Your profile</h3>
        <div className="info">
        <p className="subtitle"> <b> Name: </b> {user.name}</p>
        <p className="subtitle"> <b> Email: </b> {user.email}</p>
        <img src={user.picture} alt="profile" width={100} />

        </div>
    </div>
  );
}
