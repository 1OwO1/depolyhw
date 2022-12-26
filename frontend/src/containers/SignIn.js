import { useChat } from "./hooks/useChat";
import AppTitle from "../components/Title";
import LogIn from "../components/LogIn";
const SignIn = () => {
  const { me, setMe, setSignedIn, displayStatus } = useChat();
  const handleLogin = (name) => {
    if (!name) {
      displayStatus({
        type: "error",
        msg: "Missing user name",
      });
    } else setSignedIn(true);
  };
  return (
    <>
      <AppTitle name={me} />
      <LogIn me={me} setName={setMe} onLogin={handleLogin} />
    </>
  );
};
export default SignIn;
