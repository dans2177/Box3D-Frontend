import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import ApiCall from "./compoments/apiCall";

function App() {
  const { login, register, getUser } = useKindeAuth();
  //use gettoken onload
  //use getuser onload
  //use gettoken on click



  return (
    <>
      <div className="bg-red-500 text-white p-5 text-center">
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <button onClick={register} type="button">
          Sign up
        </button>
        <button onClick={login} type="button">
          Sign In
        </button>

        <button type="button">Fetch data</button>
        <ApiCall />

        <button onClick={getUser} type="button">
          Get user
        </button>
      

        <p> User Info</p>
        <p> Token Info</p>
        
      </div>
    </>
  );
}

export default App;
